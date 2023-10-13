import json
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import User, Publication, Follow

@login_required
@csrf_exempt
def index(request):
    if request.method == 'PUT':
            data = json.loads(request.body)
            is_followed = data.get("body", "")
            number_follows = 0
            number_following = 0
            number_follows = len(Follow.objects.filter(follower=is_followed))
            number_following = len(Follow.objects.filter(is_followed=is_followed))
            return JsonResponse({"number_follows":number_follows, "number_following":number_following})
    else: 
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

@csrf_exempt
@login_required
def follow(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        is_followed = data.get("body", "")
        follower = request.user.username
        if Follow.objects.filter(follower=follower, is_followed=is_followed).first():
            follow_delete = Follow.objects.filter(follower=follower, is_followed=is_followed)
            follow_delete.delete()
            return JsonResponse({"message": "Follow is deleted"}, status=201)
        else:
            new_follow = Follow.objects.create(follower=follower, is_followed=is_followed)
            new_follow.save()
            return JsonResponse({"message": "Created is succesed"}, status=201)
    

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
    # return HttpResponseRedirect(reverse("index"))
    return render(request, "network/login.html")


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
