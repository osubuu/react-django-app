from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters, status
from rest_framework.response import Response

from .serializers import BookSerializer, ReservedBookSerializer
from .models import Book, ReservedBook


class StandardResultsSetPagination(PageNumberPagination):
    page_size_query_param = 'limit'
    max_page_size = 3


# Create your views here.


# === REQUIRED FUNCTIONALITIES ===
# 1. Must list all books in inventory (by default)
# 2. Allow searching of books by title
# 3. Allow reservation of books
# 4. View books currently reserved
# 5. Pagination (3 max)
class BookViewSet(viewsets.ModelViewSet):
    # 1. Get all books (sort by ID for simplicity)
    queryset = Book.objects.all().order_by('id')
    serializer_class = BookSerializer

    # 5. Define pagination for endpoint
    pagination_class = StandardResultsSetPagination

    # 2. Search filtering by book title
    filter_backends = [filters.SearchFilter]
    search_fields = ['title']


class ReservedBookViewSet(viewsets.ModelViewSet):
    # get all reserved books (sort by ID for simplicity)
    queryset = ReservedBook.objects.all().order_by('id')
    serializer_class = ReservedBookSerializer

    def get_queryset(self):
        reserved_books = ReservedBook.objects.all().order_by('id')

        # get the title and author of the reserved book from the its book ID
        for reserved_book in reserved_books:
            book = Book.objects.get(id=reserved_book.book_id)
            reserved_book.title = book.title
            reserved_book.author = book.author

        return reserved_books

    def create(self, request):
        book_id = request.data.get('bookId')
        book = get_object_or_404(Book.objects, id=book_id)

        if book.quantity == 0:
            return Response(data=f"No more '{book.title}' books available to reserve", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # de-increment book quantity
        book.quantity = book.quantity - 1
        book.save()

        # create new reserved book
        reserved_book = ReservedBook.objects.create(book_id=book_id)

        # prepare response
        reserved_book.title = book.title
        reserved_book.author = book.author
        serializer = ReservedBookSerializer(reserved_book)
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        reserved_book = get_object_or_404(ReservedBook.objects, id=pk)
        book = get_object_or_404(Book.objects, id=reserved_book.book_id)

        # delete reserved book
        reserved_book.delete()

        # increment quantity on book
        book.quantity = book.quantity + 1
        book.save()

        return Response({})
