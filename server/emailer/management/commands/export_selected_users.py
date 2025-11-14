from django.core.management.base import BaseCommand
from utils.selected_emails import selected_users_emails
import openpyxl
import os


class Command(BaseCommand):
    help = "Export selected users (name + email) to Excel"

    def handle(self, *args, **options):
        users = selected_users_emails()

        if not users:
            self.stdout.write(self.style.WARNING("No users found. Exiting."))
            return

        # Create workbook
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Selected Users"

        # Header
        ws.append(["Name", "Email"])

        # Add rows
        for u in users:
            ws.append([u.get("name", ""), u.get("email", "")])

        # Output folder
        output_folder = "exports"
        os.makedirs(output_folder, exist_ok=True)

        file_path = os.path.join(output_folder, "selected_users.xlsx")

        wb.save(file_path)

        self.stdout.write(self.style.SUCCESS(f"Excel exported successfully!"))
        self.stdout.write(self.style.NOTICE(f"Saved at: {file_path}"))
