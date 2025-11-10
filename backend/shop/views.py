from rest_framework import viewsets
from .models import Saree
from .serializers import SareeSerializer

class SareeViewSet(viewsets.ModelViewSet):
    queryset = Saree.objects.all().order_by('-created_at')
    serializer_class = SareeSerializer
