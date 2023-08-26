from django.urls import path

from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("edit/<title>", views.edit, name="edit"),
    path("create", views.create, name="create"),
    path("<str:title>", views.title, name="title"),
    path("search/", views.search_html, name="search"),
    path("search1/", views.search_form, name="search1"),
]
