
from django.urls import path
from .views.user import  RegisterView, LoginView, LogoutView, PasswordResetView, PasswordResetRequestView, ResendotpView, UserView,UpdateTestGivenView

urlpatterns = [
    path('register',RegisterView.as_view()),
    path('resendotp',ResendotpView.as_view()),
    path('login',LoginView.as_view()),
    path('user',UserView.as_view()),
    path('logout',LogoutView.as_view()),
    path('password-reset-request/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path('update-test-status/', UpdateTestGivenView.as_view(), name='update_test_status'),
]
