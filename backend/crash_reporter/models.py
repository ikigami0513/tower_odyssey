from django.db import models

class CrashReport(models.Model):
    platform = models.CharField(max_length=50)
    version = models.CharField(max_length=50)
    process_type = models.CharField(max_length=50)
    guid = models.UUIDField()
    minidump = models.FileField(upload_to='crash_dumps/')
    extra_info = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Crash Report {self.guid} - {self.created_at}"
