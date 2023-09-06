from xml.dom.minidom import Comment

from django import forms

from .models import Auction, Comment, Bet


class AuctionForm(forms.ModelForm):
    class Meta:
        model = Auction
        fields = [
            "title",
            "category",
            "description",
            "image_url",
            "price",
            "owner",
        ]


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = [
            'title',
            'user',
            'comment',
        ]


class BetForm(forms.ModelForm):
    class Meta:
        model = Bet
        fields = [
            'title',
            'user',
            'price',
        ]
