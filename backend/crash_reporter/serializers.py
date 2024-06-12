from rest_framework import serializers
from .models import CrashReport

class CrashReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrashReport
        fields = '__all__'
