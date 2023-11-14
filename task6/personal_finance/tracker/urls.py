from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("get_transaction_info", views.get_transaction_info, name="get_monthly_info"),
    path("get_transactions_history", views.get_transactions_history, name="get_transactions_history"),
    path("get_account", views.get_account, name="get_account"),
    path("create_transaction", views.create_transaction, name="create_transaction"),
    path("create_account", views.create_account, name="create_account"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
]
