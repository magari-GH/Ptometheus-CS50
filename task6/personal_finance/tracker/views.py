import datetime
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
        filter = request.GET.get('filter')
        if filter == 'income':
            transactions = Transaction.objects.filter(user=user, type="Income")
        elif filter == 'expense':
            transactions = Transaction.objects.filter(user=user, type="Expense")
        else:
            transactions = Transaction.objects.filter(user=user)
        
        # block for pagination
        page_namber = int(request.GET.get('page'))
        transactions_per_page = int(request.GET.get('per_page', 10))
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
    
def get_transaction_info(request):
    if request.method == "GET":
        user = request.user
        today = datetime.date.today()
        current_month = today.month
        current_year = today.year
        monthly_income = Transaction.objects.filter(date__month = current_month, type="Income").aggregate(Sum('amount'))
        monthly_expense = Transaction.objects.filter(date__month = current_month, type="Expense").aggregate(Sum('amount'))
        previous_monthly_income = Transaction.objects.filter(date__month = current_month-1, type="Income").aggregate(Sum('amount'))
        previous_monthly_expense = Transaction.objects.filter(date__month = current_month-1, type="Expense").aggregate(Sum('amount'))
        yearly_income = Transaction.objects.filter(date__year = current_year, type="Income").aggregate(Sum('amount'))
        yearly_expense = Transaction.objects.filter(date__year = current_year, type="Expense").aggregate(Sum('amount'))
        month_namber = Transaction.objects.dates("date", "month").count()
        total_income = Transaction.objects.filter(type="Income").aggregate(Sum('amount'))
        total_expense = Transaction.objects.filter(type="Expense").aggregate(Sum('amount'))
        avarage_income = total_income['amount__sum']/int(month_namber)
        avarage_expense = total_expense['amount__sum']/int(month_namber)
        return JsonResponse({
            'monthly_income': monthly_income,
            'monthly_expense': monthly_expense,
            'previous_monthly_income': previous_monthly_income,
            'previous_monthly_expense': previous_monthly_expense,
            'yearly_income': yearly_income,
            'yearly_expense': yearly_expense,
            'avarage_income': avarage_income,
            'avarage_expense': avarage_expense,
        })
    else: 
        return JsonResponse({"error" : "Invalid request"}, status=400)

@csrf_exempt
def create_transaction(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user = request.user
            type = data.get("type", "")
            category = data.get("category", "")
            title = data.get("title", "")
            amount = data.get("amount", "")
            currency = data.get("currency", "")
            account = data.get("account", "")
            date = data.get("date", "")
            account = Account.objects.get(title=account)
            if type == "Income":
                account.amount = account.amount + int(amount)
            else:
                account.amount = account.amount - int(amount)
            account.save()
            transaction = Transaction(user=user, type=type, category=category, title=title, amount=amount, currency=currency, account=account, date=date)
            transaction.save()
        except AttributeError:
            return JsonResponse({"error": "AttributeError catched"}, status=500)
        return JsonResponse({'message': "Transaction is created"}, status=201)
    else:
        return JsonResponse({"error": "Method have to be POST"}, status=404)
    
    
@csrf_exempt
def create_account(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user = request.user
            title = data.get("title", "")
            amount = data.get("amount", "")
            currency = data.get("currency", "")
            account = Account(user=user, title=title, amount=amount, currency=currency)
            account.save()
        except AttributeError:
            return JsonResponse({"error": "AttributeError catched"}, status=500)
        return JsonResponse({'message': "Account is created"}, status=201)
    else:
        return JsonResponse({"error": "Method have to be POST"}, status=404)
    

def chart_income(request):
    labels = []
    data = []
    user =request.user
    transactions = Transaction.objects.order_by('date').filter(user=user, type='Income')
    for transaction in transactions:
        labels.append(transaction.date.strftime('%d/%m/%y'))
        data.append(transaction.amount)

    return JsonResponse(
        data = {
            'labels': labels,
            'data': data,
        })


def chart_expense(request):
    labels = []
    data = []
    user =request.user
    transactions = Transaction.objects.order_by('date').filter(user=user, type='Expense')
    for transaction in transactions:
        labels.append(transaction.date.strftime('%d/%m/%y'))
        data.append(transaction.amount)

    return JsonResponse(
        data = {
            'labels': labels,
            'data': data,
        })


def chart_account(request):
    labels = []
    data = []
    user =request.user
    accounts = Account.objects.order_by('id').filter(user=user)
    for account in accounts:
        labels.append(account.title)
        data.append(account.amount)

    return JsonResponse(
        data = {
            'labels': labels,
            'data': data,
        })

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
