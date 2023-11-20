from django.contrib import admin

# Register your models here.
from .models import Transaction, User, Account, Category



class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email')


class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'type', 'category', 'title', 'amount', 'currency', 'account', 'date')


class AccountAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'amount', 'currency')


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'type', 'color')


admin.site.register(Transaction, TransactionAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Account, AccountAdmin)
admin.site.register(Category,CategoryAdmin)