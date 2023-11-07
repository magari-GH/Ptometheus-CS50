from django.shortcuts import render
import json
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from .models import User, Transaction
from django.core.paginator import Paginator

def index(request):
    # function for representing main page
    return render (request, "tracker/index.html")


def register(request):
    # function for user registration 
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]

        # check if the passwords are equal
        if password != confirmation:
            return render (request, "tracker/register.html", {
                "massage": "Password must be the same"
            })
        # try to create a new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        # if username exists redirect to "index"
        except IntegrityError:
            return render (request, "tracker/register.html", {
                "message": "Username is already exists"
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render (request, "tracker/register.html")


def login_view(request):
    # function for user authentication
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]

        # authentication
        user = authenticate(request, username=username, password=password)

        # check if successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        # if false render message
        else:
            return render(request, "tracker/login.html", {
                "message": "Invalid username or password"
            })
    else:
        return render(request, "tracker/login.html")


def logout_view(request):
        logout(request)
    # function for go out
        return HttpResponseRedirect(reverse("index"))
