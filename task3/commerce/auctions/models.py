from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Auction(models.Model):
    title = models.CharField(
        unique=True, error_messages={'unique': "The auction with that title already exists."},
        max_length=64, verbose_name='title of auction')
    category = models.CharField(max_length=64)
    description = models.CharField(blank=True, max_length=124)
    image_url = models.CharField(blank=True, max_length=124)
    price = models.FloatField(default=0.0)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="seller")  # user
    # owner = models.CharField(max_length=64)  # user
    winner = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE, related_name="buyer")  # user
    # winner = models.CharField(blank=True, max_length=64)  # user
    is_active = models.BooleanField(default=True, verbose_name='active status')  # active or non_active

    def __str__(self):
        return (f'Auction {self.id} with title {self.title} in category {self.category} price is ${self.price} '
                f'from seller {self.owner}')


class Bet(models.Model):
    title = models.ForeignKey(Auction, on_delete=models.CASCADE)  # auction
    # title = models.CharField(max_length=64)  # auction
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # user
    # user = models.CharField(max_length=64)  # user
    #price = models.ForeignKey(Auction, on_delete=models.CASCADE, related_name="bet_price")
    price = models.FloatField(default=0.0)
    # price = models.FloatField()

    def __str__(self):
        return f'Bet {self.id} on auction {self.title} from {self.user}'


class Comment(models.Model):
    title = models.ForeignKey(Auction, on_delete=models.CASCADE)  # auction
    # title = models.CharField(max_length=64)  # auction
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # user
    # user = models.CharField(max_length=64)  # user
    comment = models.CharField(max_length=128)

    def __str__(self):
        return f'{self.id} comment for {self.title} from {self.user}'


class Watchlist(models.Model):
    id = models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')
    item = models.ForeignKey(Auction, on_delete=models.CASCADE)  # auction
    # title = models.CharField(max_length=64)  # auction
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # user
    # user = models.CharField(max_length=64)  # user

    def __str__(self):
        return f'Watch list of  {self.user}'
