from django.urls import path
from rest_framework import routers
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token

from api import views
from .views import *

router = routers.DefaultRouter()
router.register('products', ProductViewSet)
router.register('users', UserViewSet)


urlpatterns = [
    path('auth/logout/', logout),
    path('auth/login/', obtain_jwt_token),
    path(r'auth/token-refresh/', refresh_jwt_token),
    path('auth/signup/', signup, name='signup'),

    path('create_listing/', create_listing, name='create_listing'),
    path('cart_items/calculate_cart_totals/', calculate_cart_totals, name="proceed_to_checkout"),
    path('username_exists/<str:username>/', does_user_exist, name="does_user_exist"),
    path('cart_items/<int:cart_item_pk>/delete/', views.CartItemDeleteView.as_view()),
    path('cart_items/<int:product_pk>/create/', views.CreateCartItemView.as_view())
]

urlpatterns += router.urls
