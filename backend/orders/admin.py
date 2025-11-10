from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from .models import Profile, Order, OrderItem


# ---------------- PROFILE ADMIN ---------------- #

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "phone")
    search_fields = ("user__username", "user__first_name", "phone")


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = "Additional Details"


class CustomUserAdmin(UserAdmin):
    inlines = (ProfileInline,)


admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)


# ---------------- ORDER ADMIN ---------------- #

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("saree", "quantity", "price")



@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "recipient_name", "recipient_phone", "total_amount", "status", "created_at")
    search_fields = ("recipient_name", "recipient_phone", "id")
    list_filter = ("status", "created_at")  # ✅ Now admin can filter by status
    list_editable = ("status",)  # ✅ Allows inline changing of status from list view
    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("order", "saree", "quantity", "price")

