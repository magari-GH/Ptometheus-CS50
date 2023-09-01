from django import forms

from .models import Auction


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
