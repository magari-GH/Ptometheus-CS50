from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from .forms import AuctionForm, CommentForm, BetForm
from .models import User, Auction, Bet, Comment, Watchlist


@login_required
def close_auction(request, auction_id):
    if request.method == "POST":
        auction = Auction.objects.get(pk=auction_id)
        bet = Bet.objects.latest("title")
        auction.winner = bet.user
        auction.is_active = False
        auction.save()
        return redirect('auction', auction_id)
    return redirect('index')


@login_required
def new_bet_view(request, auction_id):
    auction = Auction.objects.get(pk=auction_id)
    base_price = auction.price
    initial_data = {
        "user": request.user,
        "title": auction_id,
        "price": base_price
    }

    form = BetForm(request.POST or None, initial=initial_data)
    if form.is_valid():
        auction.price = form.cleaned_data["price"]
        if auction.price > base_price:
            form.save()
            auction.save()
        else:
            return render(request, "auctions/new_bet.html", {
                "form": form,
                "message": "The bet must be higher than current price"
            })

        return HttpResponseRedirect(f"/auctions/{auction_id}")
    return render(request, "auctions/new_bet.html", {
        "form": form,
    })


@login_required
def watchlist_add(request, auction_id):
    if request.method == "POST":
        items = Auction.objects.get(pk=auction_id)
        tracking = Watchlist.objects.filter(user=request.user, item=items)
        if tracking.exists():
            tracking.delete()
            return redirect('watchlist')
        else:
            tracking, created = Watchlist.objects.get_or_create(user=request.user, item=items)
            tracking.save()
            return redirect('watchlist')


@login_required
def watchlist_view(request):
    watchlist = Watchlist.objects.filter(user=request.user)
    return render(request, 'auctions/watchlist.html', {
        'watchlist': watchlist
    })


def index(request):
    return render(request, "auctions/index.html", {
        'auctions': Auction.objects.filter(is_active=True),
    })


def categories_view(request):
    return render(request, 'auctions/categories.html', {
        "auctions": Auction.objects.filter(is_active=True)
    })


def category_view(request, category):
    category_title = category
    return render(request, "auctions/category.html", {
        "auctions": Auction.objects.filter(category=category),
        "category_title": category_title,
    })


@login_required
def new_auction_view(request):
    form = AuctionForm(request.POST or None)
    if form.is_valid():
        form.save()
        form = AuctionForm()
        return HttpResponseRedirect(reverse(index))
    return render(request, "auctions/new_auction.html", {
        'form': form
    })


def auction_view(request, auction_id):
    auction = Auction.objects.get(pk=auction_id)
    return render(request, 'auctions/auction.html', {
        "auction": auction,
        "comments": Comment.objects.filter(title=auction_id),
    })


@login_required
def new_comment_view(request, auction_id):
    initial_data = {
        "user": request.user,
        "title": auction_id
    }
    form = CommentForm(request.POST or None, initial=initial_data)
    if form.is_valid():
        form.save()
        form = CommentForm()
        return HttpResponseRedirect(f"/auctions/{auction_id}")
    return render(request, "auctions/new_comment.html", {
        "form": form,
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")
