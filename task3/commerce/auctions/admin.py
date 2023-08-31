from django.contrib import admin
from .models import User, Auction, Bet, Comment, Watchlist
# Register your models here.


class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'first_name', 'last_name')


class AuctionAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'price', 'is_active', 'owner', 'winner')


class BetAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user', 'price')


class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user', 'comment')


class WatchlistAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user')


admin.site.register(User, UserAdmin)
admin.site.register(Auction, AuctionAdmin)
admin.site.register(Bet, BetAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Watchlist, WatchlistAdmin)
