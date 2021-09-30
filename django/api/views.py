import rest_framework.exceptions
from django.contrib.auth import authenticate
from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework import viewsets, permissions, generics
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import *


def apply_taxes(subtotal):
    return subtotal * 1.15


def get_user(request):
    user_id = Token.objects.get(key=request.auth.key).user_id
    user = ShopShopUser.objects.get(id=user_id)
    return user


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductModelSerializer
    queryset = Product.objects.all()
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserModelSerializer
    queryset = ShopShopUser.objects.all()
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)


class CreateUserView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    queryset = ShopShopUser.objects.all()
    authentication_classes = (JWTAuthentication,)
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
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)


class CreateCartItemView(generics.CreateAPIView):
    serializer_class = CartItemModelSerializer
    queryset = CartItem.objects.all()
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

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
    authentication_classes = (JWTAuthentication, )
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user)


class ProductDeleteView(generics.DestroyAPIView):
    serializer_class = ProductModelSerializer
    authentication_classes = (JWTAuthentication, )
    permission_classes = (IsAuthenticated, )

    def destroy(self, request, product_pk=None):
        product = Product.objects.filter(id=product_pk)
        product.delete()
        return Response(status=status.HTTP_202_ACCEPTED, data={"deleted": "true"})


class CartItemDeleteView(generics.DestroyAPIView):
    serializer_class = CartItemModelSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def destroy(self, request, cart_item_pk=None):
        client_id = Token.objects.get(key=request.auth.key).user_id
        client = ShopShopUser.objects.get(id=client_id)
        cart_item = CartItem.objects.filter(client=client)
        filter_res_cart_item = get_object_or_404(cart_item, pk=cart_item_pk)
        product = get_object_or_404(Product, id=filter_res_cart_item.product.id)
        product.save()
        filter_res_cart_item.delete()
        return Response(status=status.HTTP_202_ACCEPTED, data={"deleted": 'true'})


@csrf_exempt
@api_view(['POST', ])
@permission_classes([AllowAny])
def signup(request):
    if request.method == 'POST':
        if 'username' not in request.data or 'password' not in request.data:
            raise serializers.ValidationError({'error': 'missing credentials for signup processing'})
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
@api_view(['GET', ])
@permission_classes([AllowAny])
def does_user_exist(request, username):
    if request.method == 'GET':
        if username is None or username == '':
            raise rest_framework.exceptions.APIException('username missing')
        return Response(ShopShopUser.objects.filter(username=username).exists())
    return Response({'error': 'something went wrong with the request'}, status=status.HTTP_400_BAD_REQUEST);


@csrf_exempt
@api_view(['POST', ])
def create_listing(request):
    if request.method == 'POST':
        serializer = ProductModelSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            seller = get_user(request)
            product = serializer.save(seller=seller)
            data['id'] = product.id
        else:
            data = serializer.errorss
        return Response(data)
    else:
        return Response({'error':'something went wrong with the request'})


@csrf_exempt
@api_view(['POST'])
def calculate_cart_totals(request):
    if request.method == 'POST':
        client = get_user(request)
        query_set = CartItem.objects.filter(client=client)
        subtotal = 0
        data = {}
        products = []
        for cart_item in query_set:
            products += {'name': cart_item.product.title, 'price': cart_item.product.price}
            subtotal += cart_item.product.price
        data += {
            'subtotal': subtotal,
            'total': apply_taxes(subtotal)
        }
        return Response(data)
    else:
        return Response({'error': 'something went wrong with the request'})


@csrf_exempt
@api_view(['POST', ])
def logout_user(request):
    data = {'logged_out': 'true'}
    if request.method == 'POST':
        logout(request)
        data['logged_out'] = 'false'
    return Response(data)


@csrf_exempt
@api_view(['POST', ])
def add_to_cart(request, title):
    if request.method == 'POST':
        product = Product.objects.filter(title=title)
        item = CartItem.objects.create(client=get_user(request), product=product)
        return Response({'': ''})