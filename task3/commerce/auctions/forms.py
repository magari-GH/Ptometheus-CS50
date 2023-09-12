from xml.dom.minidom import Comment

from django import forms

from .models import Auction, Comment, Bet


INPUT_CLASSES = 'w-full py-2 px-6 rounded-xl border'


class AuctionForm(forms.ModelForm):
    class Meta:
        model = Auction
        fields = [
            "title",
            "category",
            "description",
            "image_url",
            "price",
        ]
        widgets = {
            "title": forms.TextInput(attrs={
                "class": INPUT_CLASSES
            }),
            "category": forms.TextInput(attrs={
                "class": INPUT_CLASSES
            }),
            "description": forms.Textarea(attrs={
                "class": INPUT_CLASSES
            }),
            "image_url": forms.TextInput(attrs={
                "class": INPUT_CLASSES
            }),
            "price": forms.TextInput(attrs={
                "class": INPUT_CLASSES
            }),
        }


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = [
            'comment',
        ]
        widgets = {
            "comment": forms.TextInput(attrs={
                "class": INPUT_CLASSES
            }),
        }


class BetForm(forms.ModelForm):
    class Meta:
        model = Bet
        fields = [
            'price',
        ]
        widgets = {
            "price": forms.TextInput(attrs={
                "class": INPUT_CLASSES
            }),
        }
