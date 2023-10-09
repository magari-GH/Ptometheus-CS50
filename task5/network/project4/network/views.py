import json
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import User, Publication


def index(request):
    return render(request, "network/index.html")

# view for creation new publications
@login_required
@csrf_exempt
def compose(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method should be POST"}, status=404)
    
    try: 
        data = json.loads(request.body)
        body = data.get("body", "")
        user = request.user
        publication = Publication(user=user, body=body)
        publication.save()
    except AttributeError:
        return JsonResponse({"error": "AttributeError catched"}, status=500)
    
    return JsonResponse({"message": "Publication is created"}, status=201)

@csrf_exempt
@login_required
def represent(request, tab):
    if tab == "all":
        publications = Publication.objects.all()
    elif request.method == 'PUT':
        publication = Publication.objects.get(id=tab)
        publication.like = publication.like + 1
        publication.save()
        # return JsonResponse({"message": "Like"}, status=200)
        return JsonResponse(publication.serialize(), safe=False)
    elif tab != "all":
        user = User.objects.get(username=tab)
        user = user.id       
        publications = Publication.objects.filter(user=user)
        return JsonResponse([publication.serialize() for publication in publications], safe=False)

    else:
        return JsonResponse({"error": "Invalis mailbox."}, status=400)
    publications = publications.order_by("-timestamp")
    return JsonResponse([publication.serialize() for publication in publications], safe=False)


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
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


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
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
