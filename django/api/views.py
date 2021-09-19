from rest_framework import viewsets
from .serializers import *
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductModelSerializer
    queryset = Product.objects.all()


class ShippingCartViewSet(viewsets.ModelViewSet):
    serializer_class = ShippingCartModelSerializer
    queryset = ShippingCart.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)


class SellerViewSet(viewsets.ModelViewSet):
    serializer_class = SellerModelSerializer
    queryset = Seller.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)


class ClientViewSet(viewsets.ModelViewSet):
    serializer_class = ClientModelSerializer
    queryset = Client.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
