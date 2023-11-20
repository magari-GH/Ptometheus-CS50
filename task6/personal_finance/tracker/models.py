from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    pass


class Transaction(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="transactions")
    type = models.CharField(max_length=64)
    category = models.CharField(max_length=64)
    title = models.CharField(max_length=64)
    amount = models.FloatField(default=0)
    currency = models.CharField(max_length=3)
    account = models.CharField(max_length=64)
    date = models.DateTimeField()

    def serialize(self):
        # function serializing model's fuilds for use by JSON
        return {
            "id": self.id,
            "user": self.user.username,
            "type": self.type,
            "category": self.category,
            "title": self.title,
            "amount": self.amount,
            "currency": self.currency,
            "account": self.account,
            "date": self.date.strftime("%b %d %Y, %I:%M %p"),
        }
    
    def __str__(self):
        return f'Transaction {self.id} of the {self.user} category {self.category} title {self.title} in the {self.amount} {self.currency} account {self.account} on {self.date}'


class Account(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="accounts")
    title = models.CharField(max_length=64)
    amount = models.FloatField(default=0)
    currency = models.CharField(max_length=3)

    def serialize(self):
        # function serializing model's fuilds for use by JSON
        return {
            "id": self.id,
            "user": self.user.username,
            "title": self.title,
            "amount": self.amount,
            "currency": self.currency,
        }
    
    def __str__(self):
        return f'Account number {self.id} of the {self.user} called {self.title} current total is {self.amount} {self.currency}'


class Category(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="categories")
    title = models.CharField(max_length=64)
    type = models.CharField(max_length=64)
    color = models.CharField(max_length=64, default="#000000")

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "title": self.title,
            "type": self.type,
            "color": self.color,
        }
    
    def __str__(self):
        return f'Category number {self.id} of the {self.user} called {self.title} of type {self.title} color {self.color}'


