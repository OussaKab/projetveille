from django.db import models
from django.contrib.auth.models import User


class Seller(User):
    pass


class Client(User):
    pass


class Product(models.Model):
    description = models.TextField(blank=False, default=None)
    photo = models.ImageField(upload_to='photos/')
    price = models.DecimalField(decimal_places=2, max_digits=6)
    sold = models.BooleanField(default=False)
    created_at = models.DateField(auto_now=True)


class ShippingCart(models.Model):
    client = models.OneToOneField(Client, on_delete=models.CASCADE)
    total = models.DecimalField(decimal_places=2, max_digits=6)
    products = models.ForeignKey(Product, null=True, on_delete=models.SET_NULL)
