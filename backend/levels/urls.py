from django.urls import path
from .views import *

urlpatterns = [
    path('', LevelListAPIView.as_view(), name='levels_list_api_view')
]
