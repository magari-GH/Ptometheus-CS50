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
from .models import User, Transaction, Account, Category
from django.core.paginator import Paginator

from django.db.models import Avg, Sum


def index(request):
    # function for representing main page
    return render(request, "tracker/index.html")


def get_account(request):
    # fucnction for represent accounts
    if request.method == "GET":
        user = request.user
        accounts = Account.objects.filter(user=user)
        serialised_accounts = [account.serialize() for account in accounts]

        # accounts = Account.objects.order_by('currency').distinct()
        # curennsies = curennsies.user

        sum_total = Account.objects.filter(currency="EUR").aggregate(Sum("amount"))
        return JsonResponse(
            {
                "accounts": serialised_accounts,
                "sum_total": sum_total,
                # 'curennsies': curennsies,
            }
        )
    else:
        return JsonResponse({"error": "Invalid request"}, status=400)


def get_account_detail(request):
    if request.method == "GET":
        user = request.user
        account = request.GET.get("selected_account")
        account = Account.objects.filter(user=user, title=account).first()
        serialised_account = account.serialize()
        return JsonResponse(
            {
                "account": serialised_account,
            }
        )
    else:
        return JsonResponse({"error": "Invalid request"}, status=400)


def get_category(request):
    # fucnction for represent accounts
    if request.method == "GET":
        user = request.user
        type = request.GET.get("type")
        if type == "Income":
            categories = Category.objects.filter(user=user, type="Income")
        elif type == "Expense":
            categories = Category.objects.filter(user=user, type="Expense")
        else:
            categories = Category.objects.filter(user=user)
        serialised_categories = [category.serialize() for category in categories]
        return JsonResponse(
            {
                "categories": serialised_categories,
            }
        )
    else:
        return JsonResponse({"error": "Invalid request"}, status=400)


def get_transactions_history(request):
    # fucnction for represent history of the transactions
    if request.method == "GET":
        user = request.user
        filter = request.GET.get("filter")
        if filter == "Income":
            transactions = Transaction.objects.filter(
                user=user, type="Income"
            ).order_by("-date")
        elif filter == "Expense":
            transactions = Transaction.objects.filter(
                user=user, type="Expense"
            ).order_by("-date")
        elif filter == "all":
            transactions = Transaction.objects.filter(user=user).order_by("-date")
        else:
            category = Category.objects.get(title=filter)
            transactions = Transaction.objects.filter(
                user=user, category=category
            ).order_by("-date")

        # block for pagination
        page_namber = int(request.GET.get("page"))
        transactions_per_page = int(request.GET.get("per_page", 4))
        paginator = Paginator(transactions, transactions_per_page)
        page_obj = paginator.get_page(page_namber)

        # block for serialization
        serialised_transactions = [transaction.serialize() for transaction in page_obj]
        # serialised_transactions = [transaction.serialize() for transaction in transactions]
        return JsonResponse(
            {
                "transactions": serialised_transactions,
                "pagination": {
                    "returned_page": page_obj.number,
                    "per_page": transactions_per_page,
                    "total_page": paginator.num_pages,
                    "total_transations": paginator.count,
                },
            }
        )
    else:
        return JsonResponse({"error": "Invalid request"}, status=400)


@login_required
def get_transaction_info(request):
    if request.method == "GET":
        user = request.user
        today = datetime.date.today()
        current_month = today.month
        current_year = today.year
        monthly_income = Transaction.objects.filter(
            date__month=current_month, type="Income"
        ).aggregate(Sum("amount"))
        monthly_expense = Transaction.objects.filter(
            date__month=current_month, type="Expense"
        ).aggregate(Sum("amount"))
        previous_monthly_income = Transaction.objects.filter(
            date__month=current_month - 1, type="Income"
        ).aggregate(Sum("amount"))
        previous_monthly_expense = Transaction.objects.filter(
            date__month=current_month - 1, type="Expense"
        ).aggregate(Sum("amount"))
        yearly_income = Transaction.objects.filter(
            date__year=current_year, type="Income"
        ).aggregate(Sum("amount"))
        yearly_expense = Transaction.objects.filter(
            date__year=current_year, type="Expense"
        ).aggregate(Sum("amount"))
        month_number = Transaction.objects.dates("date", "month").count()
        total_income = Transaction.objects.filter(type="Income").aggregate(
            Sum("amount")
        )
        total_expense = Transaction.objects.filter(type="Expense").aggregate(
            Sum("amount")
        )

        return JsonResponse(
            {
                "monthly_income": monthly_income,
                "monthly_expense": monthly_expense,
                "previous_monthly_income": previous_monthly_income,
                "previous_monthly_expense": previous_monthly_expense,
                "yearly_income": yearly_income,
                "yearly_expense": yearly_expense,
                "total_income": total_income,
                "total_expense": total_expense,
                "month_number": month_number,
            }
        )
    else:
        return JsonResponse({"error": "Invalid request"}, status=400)


@csrf_exempt
def create_transaction(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user = request.user
            type = data.get("type", "")
            category_title = data.get("category", "")
            category = Category.objects.get(title=category_title)
            title = data.get("title", "")
            amount = data.get("amount", "")
            currency = data.get("currency", "")
            account = data.get("account", "")
            date = data.get("date", "")
            account = Account.objects.get(title=account)
            if type == "Income":
                account.amount = account.amount + float(amount)
            else:
                account.amount = account.amount - float(amount)
            account.save()
            transaction = Transaction(
                user=user,
                type=type,
                category=category,
                title=title,
                amount=amount,
                currency=currency,
                account=account,
                date=date,
            )
            transaction.save()
        except AttributeError:
            return JsonResponse({"error": "AttributeError catched"}, status=500)
        return JsonResponse({"message": "Transaction is created"}, status=201)
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
        return JsonResponse({"message": "Account is created"}, status=201)
    else:
        return JsonResponse({"error": "Method have to be POST"}, status=404)


@csrf_exempt
def edit_account(request):
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            user = request.user
            selected_account = data.get("selected_account", "")
            title = data.get("title", "")
            amount = data.get("amount", "")
            currency = data.get("currency", "")
            account = Account.objects.filter(user=user, title=selected_account).first()
            account.title = title
            account.amount = amount
            account.currency = currency
            account.save()
        except AttributeError:
            return JsonResponse({"error": "AttributeError catched"}, status=500)
        return JsonResponse({"message": "Account is edited"}, status=201)
    else:
        return JsonResponse({"error": "Method have to be PUT"}, status=404)


@csrf_exempt
def delete_account(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user = request.user
            selected_account = data.get("selected_account", "")
            account = Account.objects.filter(user=user, title=selected_account).first()
            account.delete()
        except AttributeError:
            return JsonResponse({"error": "AttributeError catched"}, status=500)
        return JsonResponse({"message": "Account is deleted"}, status=201)
    else:
        return JsonResponse({"error": "Method have to be PUT"}, status=404)


@csrf_exempt
def create_category(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user = request.user
            title = data.get("title", "")
            type = data.get("type", "")
            color = data.get("color", "")
            category = Category(user=user, title=title, type=type, color=color)
            category.save()
        except AttributeError:
            return JsonResponse({"error": "AttributeError catched"}, status=500)
        return JsonResponse({"message": "Category is created"}, status=201)
    else:
        return JsonResponse({"error": "Method have to be POST"}, status=404)


def chart_income(request):
    labels = []
    data = []
    user = request.user
    transactions = Transaction.objects.order_by("date").filter(user=user, type="Income")
    for transaction in transactions:
        labels.append(transaction.date.strftime("%d/%m/%y"))
        data.append(transaction.amount)
    if len(labels) == 0 and len(data) == 0:
        return JsonResponse({"message": "Empty lists"}, status=201)
    return JsonResponse(
        data={
            "labels": labels,
            "data": data,
        }
    )


def chart_expense(request):
    labels = []
    data = []
    user = request.user
    transactions = Transaction.objects.order_by("date").filter(
        user=user, type="Expense"
    )
    for transaction in transactions:
        labels.append(transaction.date.strftime("%d/%m/%y"))
        data.append(transaction.amount)
    if len(labels) == 0 and len(data) == 0:
        return JsonResponse({"message": "Empty lists"}, status=201)
    return JsonResponse(
        data={
            "labels": labels,
            "data": data,
        }
    )


def chart_income_and_expense(request):
    labels = []
    data = []
    labels_expense = []
    data_expense = []
    user = request.user
    transactions = Transaction.objects.order_by("date").filter(user=user, type="Income")
    for transaction in transactions:
        labels.append(transaction.date.strftime("%d/%m/%y"))
        data.append(transaction.amount)
    transactions = Transaction.objects.order_by("date").filter(
        user=user, type="Expense"
    )
    for transaction in transactions:
        labels_expense.append(transaction.date.strftime("%d/%m/%y"))
        data_expense.append(transaction.amount)
    if (
        len(labels) == 0
        and len(data) == 0
        and len(labels_expense) == 0
        and len(data_expense) == 0
    ):
        return JsonResponse({"message": "Empty lists"}, status=201)
    return JsonResponse(
        data={
            "labels": labels,
            "data": data,
            "labels_expense": labels_expense,
            "data_expense": data_expense,
        }
    )


def chart_account(request):
    labels = []
    data = []
    user = request.user
    accounts = Account.objects.order_by("id").filter(user=user)
    for account in accounts:
        labels.append(account.title)
        data.append(account.amount)
    if len(labels) == 0 and len(data) == 0:
        return JsonResponse({"message": "Empty lists"}, status=201)
    return JsonResponse(
        data={
            "labels": labels,
            "data": data,
        }
    )


def register(request):
    # function for user registration
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]

        # check if the passwords are equal
        if password != confirmation:
            return render(
                request,
                "tracker/register.html",
                {"massage": "Password must be the same"},
            )
        # try to create a new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        # if username exists redirect to "index"
        except IntegrityError:
            return render(
                request,
                "tracker/register.html",
                {"message": "Username is already exists"},
            )
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "tracker/register.html")


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
            return render(
                request,
                "tracker/login.html",
                {"message": "Invalid username or password"},
            )
    else:
        return render(request, "tracker/login.html")


def logout_view(request):
    logout(request)
    # function for go out
    return HttpResponseRedirect(reverse("index"))
