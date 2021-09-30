from django.urls import path
from rest_framework import routers
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)

from api import views
from .views import *

router = routers.DefaultRouter()
router.register('products', ProductViewSet)
router.register('users', UserViewSet)

urlpatterns = [
    path('auth/logout/', logout),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/signup/', signup, name='signup'),
    path('username_exists/<str:username>/', does_user_exist, name="does_user_exist"),
    path('create_listing/', create_listing, name='create_listing'),
    path('cart_items/calculate_cart_totals/', calculate_cart_totals, name="proceed_to_checkout"),
    path('cart_items/<int:cart_item_pk>/delete/', views.CartItemDeleteView.as_view()),
    path('cart_items/<int:product_pk>/create/', views.CreateCartItemView.as_view())
]

urlpatterns += router.urls
