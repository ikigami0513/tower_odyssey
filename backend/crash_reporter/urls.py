from django.urls import path
from .views import CrashReportView

urlpatterns = [
    path('', CrashReportView.as_view(), name='crash_report')
]
