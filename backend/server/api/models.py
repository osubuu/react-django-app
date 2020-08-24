from django.db import models

# Create your models here.


class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=60)
    quantity = models.IntegerField(default=0)
    quantity_reserved = models.IntegerField(default=0)

    def __str__(self):
        return self.title

    def get_quantity(self):
        return self.quantity

    def get_quantity_reserved(self):
        return self.quantity_reserved
