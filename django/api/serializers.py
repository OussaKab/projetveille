from rest_framework import serializers
from .models import *


class ProductModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class ClientModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'


class SellerModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = '__all__'


class ShippingCartModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingCart
        fields = '__all__'
