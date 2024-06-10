from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from knox.auth import TokenAuthentication
from .models import Level
from .serializers import LevelSerializer

class LevelListAPIView(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = LevelSerializer
    queryset = Level.objects.all()