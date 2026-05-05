from django.db import models

class Calculator(models.Model):
    input_value = models.FloatField()
    result = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Calculator Entry: {self.input_value} -> {self.result}"