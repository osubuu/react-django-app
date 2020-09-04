from django.contrib import admin

# Register your models here.
from .models import Book, ReservedBook
admin.site.register(Book)
admin.site.register(ReservedBook)
