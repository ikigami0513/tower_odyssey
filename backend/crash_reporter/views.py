from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CrashReport
from .serializers import CrashReportSerializer

class CrashReportView(APIView):
    def post(self, request, format=None):
        data = {
            'platform': request.data.get('platform'),
            'version': request.data.get('version'),
            'process_type': request.data.get('process_type'),
            'guid': request.data.get('guid'),
            'minidump': request.FILES.get('minidump'),
            'extra_info': request.data.get('extra', {})  # Données supplémentaires
        }
        serializer = CrashReportSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
