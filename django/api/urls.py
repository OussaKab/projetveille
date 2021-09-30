from django.urls import path
from rest_framework import routers
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)

from api import views
from .views import *

router = routers.DefaultRouter()
router.register('products', ProductViewSet)
router.register('users', UserViewSet)

urlpatterns = [
    path('auth/logout/', LogoutView.as_view()),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/signup/', signup, name='signup'),
    path('username_exists/<str:username>/', does_user_exist, name="does_user_exist"),
    path(r'cart_items/calculate_cart_totals/', calculate_cart_totals, name="proceed_to_checkout"),
    path('cart_items/<int:cart_item_pk>/delete/', views.CartItemDeleteView.as_view(), name="delete_cart_item"),
    path('cart_items/<str:product_title>/create/', views.CreateCartItemView.as_view(), name="create_cart_item")
]

urlpatterns += router.urls
