from django.db import models

class Saree(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to="sarees/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class SareeImage(models.Model):
    saree = models.ForeignKey(Saree, related_name="gallery", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="sarees/")

    def __str__(self):
        return f"{self.saree.name} - Image"