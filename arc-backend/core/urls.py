from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('register/', views.register),
    path('login/', views.login),
    
    # Portfolio & Wallet Management
    path('portfolio/', views.get_portfolio),
    path('wallet/', views.get_wallet),  # Legacy support
    
    # Trading & Market Data
    path('market-data/', views.get_market_data),
    path('place-order/', views.place_order),
    path('order-history/', views.get_order_history),
    
    # Curve Cart Integration
    path('curve/cart/create/', views.create_curve_cart),
    path('curve/payment/process/', views.process_curve_payment),
    
    # Transaction History
    path('transactions/', views.get_transaction_history),
    
    # System Management
    path('initialize/', views.initialize_system),
]
