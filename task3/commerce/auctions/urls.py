from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("<int:auction_id>", views.auction, name="auction"),
    path("new_auction/", views.new_auction, name="new_auction"),
    path("new_comment/", views.new_comment, name="new_comment"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]
