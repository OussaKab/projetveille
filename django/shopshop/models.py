from django.db import models
from django.contrib.auth.models import User


class Seller(User):
    pass


class Client(User):
    pass


class Product(models.Model):
    description = models.TextField(blank=False, default=None)
    photo = models.ImageField(upload_to='photos/')
    price = models.DecimalField(default=0, decimal_places=2, max_digits=100000000000000)
    sold = models.BooleanField(default=False)
    created_at = models.DateField(auto_now=True)


class ShippingCart(models.Model):
    client = models.OneToOneField(Client, on_delete=models.CASCADE)
    total = models.DecimalField(decimal_places=2, null=False, max_digits=100000000000000)
    products = models.ForeignKey(Product, null=True, on_delete=models.SET_NULL)
