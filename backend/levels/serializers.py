from rest_framework import serializers
from .models import Level

class LevelSerializer(serializers.ModelSerializer):
    by = serializers.SerializerMethodField()

    class Meta:
        model = Level
        fields = ['id', 'name', 'map', 'by', 'post_date', 'is_official']

    def get_by(self, obj: Level):
        return obj.by.username