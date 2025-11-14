from django.core.management.base import BaseCommand
from utils.selected_emails import selected_users_emails

class Command(BaseCommand):
    help = "Print selected users (name + email)"

    def handle(self, *args, **kwargs):
        users = selected_users_emails()

        for user in users:
            print(f"Name: {user['name']}  |  Email: {user['email']}")
