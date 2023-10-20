from django.contrib import admin

from .models import Publication, Follow, Like
# Register your models here.


admin.site.register(Publication)
admin.site.register(Follow)
admin.site.register(Like)