from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("<int:auction_id>", views.auction_view, name="auction"),
    path("new_auction/", views.new_auction_view, name="new_auction"),
    path("watchlist_add/<int:auction_id>", views.watchlist_add, name="watchlist_add"),
    path("watchlist", views.watchlist_view, name="watchlist"),
    path("<int:auction_id>/new_comment/", views.new_comment_view, name="new_comment"),
    path("categories/", views.categories_view, name="categories"),
    path("categories/category/<str:category>/", views.category_view, name="category"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]
