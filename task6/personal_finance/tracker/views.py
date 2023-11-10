from django.shortcuts import render
import json
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from .models import User, Transaction, Account
from django.core.paginator import Paginator

from django.db.models import Avg, Sum

def index(request):
    # function for representing main page
    return render (request, "tracker/index.html")


def get_account(request):
    # fucnction for represent accounts
    if request.method == "GET":
        user = request.user
        accounts = Account.objects.filter(user=user)
        serialised_accounts = [account.serialize() for account in accounts]


        # accounts = Account.objects.order_by('currency').distinct()
        # curennsies = curennsies.user

        sum_total = Account.objects.filter(currency='EUR').aggregate(Sum('amount'))
        return JsonResponse({
            'accounts': serialised_accounts,
            'sum_total': sum_total,
            # 'curennsies': curennsies,
        })
    else: 
        return JsonResponse({"error" : "Invalid request"}, status=400)


def get_transactions_history(request):
    # fucnction for represent history of the transactions
    if request.method == "GET":
        user = request.user
        transactions = Transaction.objects.filter(user=user)

        # block for pagination
        page_namber = int(request.GET.get('page'))
        transactions_per_page = int(request.GET.get('per_page', 3))
        paginator = Paginator(transactions, transactions_per_page)
        page_obj = paginator.get_page(page_namber)

        # block for serialization
        serialised_transactions = [transaction.serialize() for transaction in page_obj]     
        # serialised_transactions = [transaction.serialize() for transaction in transactions]     
        return JsonResponse({
            'transactions': serialised_transactions,
            'pagination': {
                'returned_page' : page_obj.number,
                'per_page': transactions_per_page,
                'total_page': paginator.num_pages,
                'total_transactions': paginator.count,
            }
        })
    else: 
        return JsonResponse({"error" : "Invalid request"}, status=400)


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
