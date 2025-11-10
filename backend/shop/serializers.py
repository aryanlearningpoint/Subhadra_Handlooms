from rest_framework import serializers
from .models import Saree, SareeImage

class SareeImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SareeImage
        fields = ['image']

class SareeSerializer(serializers.ModelSerializer):
    gallery = SareeImageSerializer(many=True, read_only=True)

    class Meta:
        model = Saree
        fields = [
            'id',
            'name',
            'description',
            'price',
            'category',
            'image',      # main image
            'gallery',    # additional images
            'created_at'
        ]
