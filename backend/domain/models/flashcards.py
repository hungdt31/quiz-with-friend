from django.db import models
from django.conf import settings

class FlashcardSet(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    is_public = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self): return self.title

class Flashcard(models.Model):
    flashcard_set = models.ForeignKey(FlashcardSet, related_name='cards', on_delete=models.CASCADE)
    front_text = models.CharField(max_length=500)
    back_text = models.TextField()
    
    def __str__(self): return self.front_text
