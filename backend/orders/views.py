from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from django.contrib.auth.models import User

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework import status
from .models import Order, OrderItem, Profile
from shop.models import Saree
from rest_framework_simplejwt.authentication import JWTAuthentication

@csrf_exempt
def create_order(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body)

        recipient_name = data.get("recipient_name")
        recipient_phone = data.get("recipient_phone")
        shipping_address = data.get("shipping_address")
        cart = data.get("cart", [])

        if not shipping_address or not cart:
            return JsonResponse({"error": "Address and cart required"}, status=400)

        # ✅ Detect logged-in user (optional)
        user = None
        try:
            auth = JWTAuthentication()
            auth_user = auth.authenticate(request)
            if auth_user:
                user = auth_user[0]
        except:
            pass

        # ✅ Calculate total
        total = sum(float(item["price"]) * int(item.get("quantity", 1)) for item in cart)

        # ✅ Create Order
        order = Order.objects.create(
            user=user,
            recipient_name=recipient_name or (user.first_name if user else ""),
            recipient_phone=recipient_phone or (user.profile.phone if user else ""),
            shipping_address=shipping_address,
            total_amount=total,
        )

        # ✅ Create Order Items
        for item in cart:
            saree = Saree.objects.get(id=item["id"])
            OrderItem.objects.create(
                order=order,
                saree=saree,
                quantity=int(item.get("quantity", 1)),
                price=float(item["price"]),
            )

        return JsonResponse(
            {"message": "Order placed successfully!", "order_id": order.id},
            status=201
        )

    except Exception as e:
        print("Order Error:", e)
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def register_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            name = data.get("name")
            phone = data.get("phone")
            email = data.get("email")
            password = data.get("password")

            if not all([name, phone, email, password]):
                return JsonResponse({"error": "All fields are required"}, status=400)

            # Check if email already exists
            if User.objects.filter(username=email).exists():
                return JsonResponse({"error": "Email already registered"}, status=400)

            from .models import Profile

            # ✅ Create user (username = email)
            user = User.objects.create_user(
                username=email,
                first_name=name,
                email=email,
                password=password
            )

            # ✅ Store phone in Profile
            user.profile.phone = phone
            user.profile.save()

            return JsonResponse({"message": "User created successfully"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

    
@csrf_exempt
def login_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            identifier = data.get("username")   # email or phone
            password = data.get("password")

            if not identifier or not password:
                return JsonResponse({"error": "Phone/Email and password required"}, status=400)

            # Check if input is phone number → convert to real username (email)
            from .models import Profile
            try:
                profile = Profile.objects.get(phone=identifier)
                identifier = profile.user.username  # username is email
            except Profile.DoesNotExist:
                pass  # identifier might already be an email

            from django.contrib.auth import authenticate
            user = authenticate(username=identifier, password=password)

            if user is None:
                return JsonResponse({"error": "Invalid phone/email or password"}, status=400)

            # Generate JWT tokens
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)

            return JsonResponse({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.first_name,   # Display Name on Navbar
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def user_orders(request):
    try:
        auth = JWTAuthentication()
        auth_result = auth.authenticate(request)

        if not auth_result:
            return JsonResponse({"error": "Authentication required"}, status=401)

        user = auth_result[0]
        orders = Order.objects.filter(user=user).order_by("-created_at")

        result = []

        for order in orders:
            items = []
            for item in order.items.all():
                items.append({
                    "name": item.saree.name,
                    "quantity": item.quantity,
                    "price": float(item.price),
                    "subtotal": float(item.price) * item.quantity,
                })

            result.append({
                "id": order.id,
                "recipient_name": order.recipient_name,
                "recipient_phone": order.recipient_phone,
                "shipping_address": order.shipping_address,
                "total": float(order.total_amount),
                "created_at": order.created_at.strftime("%d %b %Y"),
                "status": order.status,    # ✅ ADDED HERE
                "items": items
            })

        return JsonResponse(result, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
