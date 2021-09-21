from django.urls import path
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

from api import views
from .views import *

router = routers.DefaultRouter()
router.register('products', ProductViewSet)
router.register('users', UserViewSet)

urlpatterns = [
    path('auth/', obtain_auth_token, name='login'),
    path('signup/', signup, name='signup'),
    path('create_listing/', create_listing, name='create_listing'),
    path('cart_items/<int:cart_item_pk>/delete/', views.CartItemDeleteView.as_view()),
    path('cart_items/<int:product_pk>/create/', views.CreateCartItemView.as_view())
]

urlpatterns += router.urls
