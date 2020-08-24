from rest_framework import serializers

from .models import Book


class BookSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Book
        fields = ('id', 'title', 'author', 'quantity', 'quantity_reserved')
