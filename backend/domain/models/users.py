from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    avatar = models.URLField(max_length=500, blank=True, null=True)
    is_premium = models.BooleanField(default=False)
    
    def __str__(self):
        return self.username
