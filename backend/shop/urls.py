from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SareeViewSet

router = DefaultRouter()
router.register(r'sarees', SareeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
