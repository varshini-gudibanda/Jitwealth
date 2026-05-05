from django.db import models

class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    progress = models.IntegerField(default=0)
    status = models.CharField(max_length=50)
    image = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.title