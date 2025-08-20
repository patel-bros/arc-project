from django.urls import path
from . import views
from rest_framework.authtoken.views import obtain_auth_token
from .views import logout_view, user_info, wallet_info, crypto_list, initiate_payment, payment_status, face_auth

urlpatterns = [
    path('register/', views.register),
    path('login/', views.login),
    path('wallet/create/', views.create_wallet),
    path('wallet/', views.get_wallet),
    path('get-wallet/<str:user_id>/', views.get_wallet_by_id),
    path('buy/', views.buy_crypto),
    path('sell/', views.sell_crypto),
    path('cryptos/', crypto_list),
    path('payment/initiate/', initiate_payment),
    path('payment/status/', payment_status),
    path('transactions/', views.transaction_history),
    path('face-auth/', face_auth),
    path('register-face/', views.register_face),  # Also add this missing endpoint
    path('transfer/', views.transfer_to_merchant),
    path('merchant/create/', views.create_merchant_wallet),
    path('merchant/<str:merchant_name>/', views.get_merchant_wallet),
    path('trade/order/', views.place_order),
    path('trade/orderbook/', views.get_order_book),
    path('trade/prices/', views.get_prices),
    path('debug-auth/', views.debug_auth),
]
