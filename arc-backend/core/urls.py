from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register),
    path('create-wallet/', views.create_wallet),
    path('get-wallet/<int:user_id>/', views.get_wallet),
]
