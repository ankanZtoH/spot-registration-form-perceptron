# from django.db import models

# Create your models here.
from django.db import models

class SpotRegistration(models.Model):
    day = models.CharField(max_length=10)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    event_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}"
