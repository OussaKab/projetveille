from django.urls import path, include
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
router.register('products', ProductViewSet)
router.register('sellers', SellerViewSet)
router.register('clients', ClientViewSet)
router.register('carts', ShippingCartViewSet)

urlpatterns = [
    path('/', include(router.urls))
]