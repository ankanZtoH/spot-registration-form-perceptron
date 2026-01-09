from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.authentication import BasicAuthentication
from rest_framework.response import Response
from rest_framework import status
from .serializers import SpotRegistrationSerializer
from django.http import JsonResponse


@api_view(['POST'])
@authentication_classes([BasicAuthentication])  # 🔥 disables CSRF
@permission_classes([AllowAny])
def spot_register(request):
    serializer = SpotRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Registered successfully"},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def home(request):
    return JsonResponse({
        "status": "ok",
        "service": "Perceptron Spot Registration API"
    })
