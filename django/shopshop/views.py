from rest_framework import viewsets
from .serializers import *
from .models import *


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductModelSerializer
    queryset = Product.objects.all()


class ShippingCartViewSet(viewsets.ModelViewSet):
    serializer_class = ShippingCartModelSerializer
    queryset = ShippingCart.objects.all()


class SellerViewSet(viewsets.ModelViewSet):
    serializer_class = SellerModelSerializer
    queryset = Seller.objects.all()


class ClientViewSet(viewsets.ModelViewSet):
    serializer_class = ClientModelSerializer
    queryset = Client.objects.all()
