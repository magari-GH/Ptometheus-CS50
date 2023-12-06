from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("export_transactions_csv", views.export_transactions_csv, name="export_transactions_csv"),
    path("chart_income", views.chart_income, name="chart_income"),
    path("chart_expense", views.chart_expense, name="chart_expense"),
    path("chart_account", views.chart_account, name="chart_account"),
    path("chart_income_and_expense", views.chart_income_and_expense, name="chart_income_and_expense"),

    path("get_transactions_history", views.get_transactions_history, name="get_transactions_history"),

    path("get_transaction_info", views.get_transaction_info, name="get_monthly_info"),
    
    path("get_account", views.get_account, name="get_account"),
    path("get_account_detail", views.get_account_detail, name="get_account_detail"),
    path("create_account", views.create_account, name="create_account"),
    path("edit_account", views.edit_account, name="edit_account"),
    path("delete_account", views.delete_account, name="delete_account"),

    path("create_transaction", views.create_transaction, name="create_transaction"),
    path("get_transaction_detail", views.get_transaction_detail, name="get_transaction_detail"),
    path("edit_transaction", views.edit_transaction, name="edit_transaction"),
    path("delete_transaction", views.delete_transaction, name="delete_transaction"),

    path("create_category", views.create_category, name="create_category"),
    path("get_category", views.get_category, name="get_category"),
    path("get_category_detail", views.get_category_detail, name="get_category_detail"),
    path("edit_category", views.edit_category, name="edit_category"),
    path("delete_category", views.delete_category, name="delete_category"),

    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
]
