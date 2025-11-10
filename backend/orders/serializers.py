from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="saree.name", read_only=True)  # ✅ Matches your JSON format

    class Meta:
        model = OrderItem
        fields = ["name", "quantity", "price", "subtotal"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status = serializers.CharField()  # ✅ Include status field

    class Meta:
        model = Order
        fields = [
            "id",
            "recipient_name",
            "recipient_phone",
            "shipping_address",
            "total",
            "created_at",
            "status",     # ✅ Add this line
            "items",
        ]
