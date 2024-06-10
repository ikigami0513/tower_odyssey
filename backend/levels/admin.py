from django.contrib import admin
from .models import Level

@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'by', 'post_date', 'is_official']