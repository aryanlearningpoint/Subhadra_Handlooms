from django.contrib import admin
from .models import Saree, SareeImage

class SareeImageInline(admin.TabularInline):
    model = SareeImage
    extra = 4   # Number of image upload slots to show

class SareeAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "category", "created_at")
    inlines = [SareeImageInline]

admin.site.register(Saree, SareeAdmin)
admin.site.register(SareeImage)

