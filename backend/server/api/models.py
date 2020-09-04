from django.db import models

# Create your models here.


class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=60)
    quantity = models.IntegerField(default=0)

    def __str__(self):
        return self.title


class ReservedBook(models.Model):
    book_id = models.IntegerField(default=0)

    def title(self, title):
        self.title = title

    def author(self, author):
        self.author = author

    def __str__(self):
        return str(self.book_id)
