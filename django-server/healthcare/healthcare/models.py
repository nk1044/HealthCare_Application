from django.db import models
from django.utils import timezone

# Create your models here.

class Featured_Services(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=500)
    image_url = models.CharField(max_length=500)

    def __str__(self):
        return 'Featured Services Content'

class Specialist(models.Model):
    name = models.CharField(max_length=100)
    image_url = models.CharField(max_length=500)

    def __str__(self):
        return 'Specialist Content'

class Partner_Clinic(models.Model):
    name = models.CharField(max_length=100)
    image_url = models.CharField(max_length=500)

    def __str__(self):
        return 'Partner Clinic Content'

class AboutPage_Team(models.Model):
    
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    image_url = models.CharField(max_length=500)

    def __str__(self):
        return 'AboutPage Team Content'

class Service(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=500)
    image_url = models.CharField(max_length=500)

    def __str__(self):
        return 'Service Content'