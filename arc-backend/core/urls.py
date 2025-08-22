from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('register/', views.register),
    path('login/', views.login),
    path('face-auth/', views.face_auth),

    # User Profile & Face Photo
    path('user/profile/', views.user_profile),
    path('user/face-photo/', views.user_face_photo),

    # Portfolio & Wallet Management
    path('portfolio/', views.get_portfolio),
    path('wallet/', views.get_wallet),  # Legacy support

    # Trading & Market Data
    path('market-data/', views.get_market_data),
    path('place-order/', views.place_order),
    path('order-history/', views.get_order_history),
    path('price-history/', views.price_history),

    # Curve Cart Integration
    path('curve/cart/create/', views.create_curve_cart),
    path('curve/payment/process/', views.process_curve_payment),

    # Merchant Payment System
    path('merchant/info/', views.get_merchant_info),
    path('merchant/payment/', views.process_merchant_payment),

    # Transaction History
    path('transactions/', views.get_transaction_history),
    path('transactions/cancel/', views.cancel_transaction),

    # System Management
    path('initialize/', views.initialize_system),
]
