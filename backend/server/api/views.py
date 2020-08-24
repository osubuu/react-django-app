from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters, status
from rest_framework.response import Response

from .serializers import BookSerializer
from .models import Book


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

    # 3. Update reserved quantity via PATCH method through same endpoint as everything else
    def patch(self, request, *args, **kwargs):
        book = get_object_or_404(Book.objects, id=request.data['id'])
        purpose = request.data.get('reserve')

        if purpose is None:
            return Response(data='Invalid body. Please make sure all required fields are present', status=status.HTTP_400_BAD_REQUEST)

        data = {}
        if purpose == True:
            if book.quantity == 0:
                return Response(data=f"No more '{book.title}' books available to reserve", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            data = {
                "quantity": book.quantity - 1,
                "quantity_reserved": book.quantity_reserved + 1
            }
        else:
            if book.quantity_reserved == 0:
                return Response(data=f"No '{book.title}' books are currently reserved", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            data = {
                "quantity": book.quantity + 1,
                "quantity_reserved": book.quantity_reserved - 1
            }

        serializer = BookSerializer(book, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    # 4. Filter for reserved books, if any
    def get_queryset(self):
        queryset = Book.objects.all().order_by('id')
        reserved = self.request.query_params.get('reserved')

        if reserved == 'true':
            queryset = queryset.filter(quantity_reserved__gt=0)

        return queryset
