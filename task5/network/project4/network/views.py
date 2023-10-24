import json
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from .models import User, Publication, Follow, Like
from django.core.paginator import Paginator


def index(request):
    # function for presenting main page
    return render(request, "network/index.html")


@csrf_exempt
@login_required
def like(request):
    # function for adding/removing like and counting them by publication
    if request.method == 'POST':
        data = json.loads(request.body)
        publication_like = data.get("body", "")
        username_like = request.user.username
        if Like.objects.filter(username_like=username_like, publication_like=publication_like).first():
            like_delete = Like.objects.filter(username_like=username_like, publication_like=publication_like)
            like_delete.delete()
            number_likes = 0
            number_likes = len(Like.objects.filter(publication_like=publication_like))
            return JsonResponse({"message": "Like is deleted", "number_likes":number_likes}, status=201)
        else:
            new_like = Like.objects.create(username_like=username_like, publication_like=publication_like)
            new_like.save()
            number_likes = 0
            number_likes = len(Like.objects.filter(publication_like=publication_like))
            return JsonResponse({"message": "Like is created succesfully", "number_likes":number_likes}, status=201)
    if request.method == "PUT":
        username_like = request.user
        data = json.loads(request.body)
        publication_like = data.get("body", "")
        number_likes = 0
        number_likes = len(Like.objects.filter(publication_like=publication_like))
        like_exists = len(Like.objects.filter(username_like=username_like, publication_like=publication_like))
        return JsonResponse({"number_likes":number_likes, "like_exists":like_exists})


@login_required
def following(request):
    # function for presenting publications of followed users
    page_number = int(request.GET.get('page'))
    publication_per_page = int(request.GET.get('per_page', 3))
    # publication_per_page = 10
    is_followed_users = []
    follower = request.user
    follows = Follow.objects.filter(follower=follower)
    for follow in follows:
        is_followed_user = follow.is_followed
        is_followed_users.append(is_followed_user)
    publications = Publication.objects.filter(user__username__in=is_followed_users)
    paginator = Paginator(publications, publication_per_page)
    page_obj = paginator.get_page(page_number)    
    serialized_publications = [publication.serialize() for publication in page_obj]
    return JsonResponse({
                'publications': serialized_publications,
                'meta': {
                    'returned_page' : page_obj.number,
                    'per_page': publication_per_page,
                    'total_pages': paginator.num_pages,
                    'total_publications': paginator.count,
                },
            })


@login_required
@csrf_exempt
def compose(request):
    # function for creating and changing publication
    if request.method == "GET":
        return JsonResponse({"error": "Method should be POST"}, status=404)
    elif request.method == "PUT":
        try:
            data = json.loads(request.body)
            body = data.get("body", "")
            publication_id = data.get("publication_id", "")
            publication = Publication.objects.get(id=publication_id)
            publication.body = body
            publication.save()
        except AttributeError:
            return JsonResponse({"error": "AttributeError catched whive seving"}, status=500)
        return JsonResponse({"message": "Publication is saved"}, status=201)
   
    elif request.method == "POST":
        try: 
            data = json.loads(request.body)
            body = data.get("body", "")
            user = request.user
            publication = Publication(user=user, body=body)
            publication.save()
        except AttributeError:
            return JsonResponse({"error": "AttributeError catched"}, status=500)
        return JsonResponse({"message": "Publication is created"}, status=201)
    else: 
        return JsonResponse({"error": "Method should be POST"}, status=404)

@csrf_exempt
def represent(request, tab):
    # function for presenting all publications and certain user's publication, and counting follows/following
    if request.method == 'PUT':
            data = json.loads(request.body)
            is_followed = data.get("body", "")
            number_follows = 0
            number_following = 0
            number_follows = len(Follow.objects.filter(follower=is_followed))
            number_following = len(Follow.objects.filter(is_followed=is_followed))
            return JsonResponse({"number_follows":number_follows, "number_following":number_following})
    if request.method == 'GET':
        page_number = int(request.GET.get('page'))
        publication_per_page = int(request.GET.get('per_page', 3))
        # publication_per_page = 10
        if tab == "all":
            publications = Publication.objects.all().order_by("-timestamp")
            paginator = Paginator(publications, publication_per_page)
            page_obj = paginator.get_page(page_number)    
            serialized_publications = [publication.serialize() for publication in page_obj]
            return JsonResponse({
                'publications': serialized_publications,
                'meta': {
                    'returned_page' : page_obj.number,
                    'per_page': publication_per_page,
                    'total_pages': paginator.num_pages,
                    'total_publications': paginator.count,
                },
            })
        elif tab != "all":
            publication_per_page = int(request.GET.get('per_page', 3))
            user = User.objects.get(username=tab)
            user = user.id       
            publications = Publication.objects.filter(user=user)
            paginator = Paginator(publications, publication_per_page)
            page_obj = paginator.get_page(page_number)    
            serialized_publications = [publication.serialize() for publication in page_obj]
            return JsonResponse({
                'publications': serialized_publications,
                'meta': {
                    'returned_page' : page_obj.number,
                    'per_page': publication_per_page,
                    'total_pages': paginator.num_pages,
                    'total_publications': paginator.count,
                },
            })
    
    else:
        return JsonResponse({"error": "Invalis mailbox."}, status=400)




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
            return JsonResponse({"message": "The follow is deleted successfully"}, status=201)
        else:
            new_follow = Follow.objects.create(follower=follower, is_followed=is_followed)
            new_follow.save()
            return JsonResponse({"message": "The follow is created successfully"}, status=201)
    if  request.method == 'PUT':
        data = json.loads(request.body)
        is_followed = data.get("body", "")
        follower = request.user.username
        follow_exist = len(Follow.objects.filter(follower=follower, is_followed=is_followed))
        return JsonResponse({"follow_exist": follow_exist}, status=201)


@csrf_exempt
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
