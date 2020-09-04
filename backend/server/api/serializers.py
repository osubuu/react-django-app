from rest_framework import serializers

from .models import Book, ReservedBook


class BookSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Book
        fields = ('id', 'title', 'author', 'quantity')


class ReservedBookSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ReservedBook
        fields = ('id', 'title', 'author', 'book_id')
