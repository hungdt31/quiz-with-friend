from django.db import models
from django.conf import settings

class Topic(models.Model):
    name = models.CharField(max_length=255)
    def __str__(self): return self.name

class Article(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    topic = models.ForeignKey(Topic, on_delete=models.SET_NULL, null=True, blank=True, related_name='articles')
    is_public = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self): return self.title
