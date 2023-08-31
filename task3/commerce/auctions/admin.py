from django.contrib import admin
from .models import User, Auction, Bet, Comment, Watchlist
# Register your models here.


admin.site.register(User)
admin.site.register(Auction)
admin.site.register(Bet)
admin.site.register(Comment)
admin.site.register(Watchlist)
