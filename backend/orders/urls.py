from django.urls import path
from .views import create_order, register_user, login_user, user_orders

urlpatterns = [
    path("orders/", create_order, name="create_order"),      # ✅ Order endpoint (singular)
    path("register/", register_user, name="register_user"), # ✅ Signup endpoint
    path("login/", login_user, name="login_user"),          # ✅ Login endpoint (phone/email)
    path("my-orders/", user_orders, name="user_orders"),    
    
]
