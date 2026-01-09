from rest_framework import serializers
from .models import SpotRegistration

class SpotRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpotRegistration
        fields = '__all__'
