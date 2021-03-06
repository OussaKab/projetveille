from rest_framework import serializers

from .models import *


class ProductModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

    def save(self):
        product = Product(
            title=self.validated_data['title'],
            description=self.validated_data['description'],
            price=float(self.validated_data['price']),
            photo=self.validated_data['photo'],
            seller=self.validated_data['seller']
        )
        product.save()
        return product


class UserModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopShopUser
        fields = '__all__'


class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input-type': 'password'}, write_only=True)

    class Meta:
        model = ShopShopUser
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self):
        user = ShopShopUser(
            email=self.validated_data['email'],
            username=self.validated_data['username'],
            last_name=self.validated_data['last_name'],
            first_name=self.validated_data['first_name']
        )
        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        if password != password2:
            raise serializers.ValidationError({'password': 'password must match'})

        user.set_password(password)
        user.save()
        return user


class CartItemModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = '__all__'

    def save(self):
        cart_item = CartItem.objects.create(
            client=self.validated_data['client'],
            product=self.validated_data['product']
        )
        cart_item.save()
        return cart_item
