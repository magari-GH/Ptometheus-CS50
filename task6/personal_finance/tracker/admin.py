from django.contrib import admin

# Register your models here.
from .models import Transaction, User, Account



class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email')


class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'category', 'title', 'amount', 'currency', 'account', 'date')


class AccountAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'amount', 'currency')


admin.site.register(Transaction, TransactionAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Account, AccountAdmin)