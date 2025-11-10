from django.db import models
from shop.models import Saree
from django.contrib.auth.models import User

STATUS_CHOICES = [
    ("PENDING", "Pending"),
    ("PACKED", "Packed"),
    ("SHIPPED", "Shipped"),
    ("DELIVERED", "Delivered"),
]

class Order(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)  # who placed the order
    recipient_name = models.CharField(max_length=200)
    recipient_phone = models.CharField(max_length=20)
    shipping_address = models.TextField()
    
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    def __str__(self):
        return f"Order #{self.id} to {self.recipient_name}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    saree = models.ForeignKey(Saree, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.saree.name} x {self.quantity}"

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, unique=True)

    def __str__(self):
        return self.user.first_name or self.user.username
    
    def email(self):
        return self.user.email
