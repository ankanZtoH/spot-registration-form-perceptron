from django.urls import path
from .views import spot_register

urlpatterns = [
    path('spot-register', spot_register),
]
