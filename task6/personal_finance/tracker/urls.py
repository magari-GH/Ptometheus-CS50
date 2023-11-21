from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("chart_income", views.chart_income, name="chart_income"),
    path("chart_expense", views.chart_expense, name="chart_expense"),
    path("chart_account",views.chart_account, name="chart_account"),
    path("chart_income_and_expense",views.chart_income_and_expense, name="chart_income_and_expense"),
    path("get_transaction_info", views.get_transaction_info, name="get_monthly_info"),
    path("get_transactions_history", views.get_transactions_history, name="get_transactions_history"),
    path("get_account", views.get_account, name="get_account"),
    path("get_account_detail", views.get_account_detail, name="get_account_detail"),
    path("edit_account", views.edit_account, name="edit_account"),
    path("delete_account", views.delete_account, name="delete_account"),
    path("create_transaction", views.create_transaction, name="create_transaction"),
    path("create_account", views.create_account, name="create_account"),
    path("create_category", views.create_category, name="create_category"),
    path("get_category", views.get_category, name="get_category"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
]
