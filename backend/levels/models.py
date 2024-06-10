import uuid
import os
from django.db import models
from .validators import validate_tmj_file_extension
from authentication.models import User
from django.utils.timezone import now

def level_upload_path(instance, filename):
    extension = os.path.splitext(filename)[1]
    return os.path.join('levels', f"{instance.id}{extension}")

class Level(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    map = models.FileField(upload_to=level_upload_path, validators=[validate_tmj_file_extension])
    by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    post_date = models.DateTimeField(auto_now_add=True, editable=False)
    is_official = models.BooleanField(default=False)