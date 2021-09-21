from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, permissions, status, generics
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from .serializers import *


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductModelSerializer
    queryset = Product.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserModelSerializer
    queryset = ShopShopUser.objects.all()
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated,)


class CreateUserView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    queryset = ShopShopUser.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def create(self, request):
        user = ShopShopUser.objects.create_user(
            username=self.request.data['username'],
            email=self.request.data['email'],
            password=self.request.data['password'],
            last_name=self.request.data['last_name']
        )
        user.save()
        return user


class CreateProductView(generics.CreateAPIView):
    serializer_class = ProductModelSerializer
    queryset = Product.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)


class CreateCartItemView(generics.CreateAPIView):
    serializer_class = CartItemModelSerializer
    queryset = CartItem.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, )

    def create(self, request, product_pk=None):
        product = Product.objects.filter(seller=request.user)
        cart_item = CartItem.objects.create(
            product=get_object_or_404(product, pk=product_pk),
            client=request.user
        )
        cart_item.save()
        return cart_item


class ProductView(generics.ListAPIView):
    serializer_class = ProductModelSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user)


class CartItemDeleteView(generics.DestroyAPIView):
    serializer_class = CartItemModelSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (permissions.IsAuthenticated, )

    def destroy(self, request, cart_item_pk=None):
        client_id = Token.objects.get(key=request.auth.key).user_id
        client = ShopShopUser.objects.get(id=client_id)
        cart_item = CartItem.objects.filter(client=client)
        filter_res_cart_item = get_object_or_404(cart_item, pk=cart_item_pk)
        product = get_object_or_404(Product, id=filter_res_cart_item.product.id)
        product.save()
        filter_res_cart_item.delete()
        return Response(status=status.HTTP_302_FOUND, data={"deleted": 'true'})


def apply_taxes(subtotal):
    return subtotal * 1.15


@csrf_exempt
@api_view(['POST', ])
@permission_classes([AllowAny])
def signup(request):
    print(request.user)
    if request.method == 'POST':
        if 'username' not in request.data or 'password' not in request.data:
            raise serializers.ValidationError({'credentials': 'missing credentials for signup processing'})
        user = authenticate(username=request.data['username'], password=request.data['password'])
        data = {'request': request.data}
        if user is None:
            serializer = UserRegistrationSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                data['token'] = Token.objects.create(user=user).key
            else:
                data = serializer.errors
            return Response(data)
        else:
            return Response({'token': Token.objects.get(user=user).key})


@csrf_exempt
@api_view(['POST', ])
def create_listing(request):
    if request.method == 'POST':
        serializer = ProductModelSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            seller_id = Token.objects.get(key=request.auth.key).user_id
            seller = ShopShopUser.objects.get(id=seller_id)
            product = serializer.save(seller=seller)
            data['id'] = product.id
        else:
            data = serializer.errorss
        return Response(data)


@csrf_exempt
@api_view(['POST'])
def checkout_cart(request):
    if request.method == 'POST':
        client_id = Token.objects.get(key=request.auth.key).user_id
        client = ShopShopUser.objects.get(id=client_id)
        query_set = CartItem.objects.filter(client=client)
        subtotal = 0
        for cart_item in query_set:
            subtotal += cart_item.product.price
        data = {
            'subtotal': subtotal,
            'total': apply_taxes(subtotal)
        }
        return Response(data)
