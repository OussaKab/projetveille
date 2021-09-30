import datetime

from django.contrib.auth.models import AbstractUser
from django.db import models

from ecommerce import settings

"""
    Recommended by https://django.readthedocs.io/en/stable/topics/auth/customizing.html
    to create a user even though it's not necessary...
"""


class ShopShopUser(AbstractUser):
    pass


class Product(models.Model):
    title = models.CharField(blank=False,
                             null=False,
                             default=datetime.datetime.now().strftime("%H:%M:%S"),
                             unique=True,
                             max_length=80)
    description = models.TextField(blank=False, default=None)
    photo = models.ImageField(upload_to='thumbnails/')
    price = models.DecimalField(decimal_places=2, max_digits=30)
    sold = models.BooleanField(default=False)
    created_at = models.DateField(auto_now=True)
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.CASCADE)


class CartItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    class Meta:
        unique_together = ['product', 'client']
