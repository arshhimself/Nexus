from django.core.management.base import BaseCommand
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from datetime import datetime
from utils.selected_emails import selected_users_emails
import sys

class Command(BaseCommand):
    help = "Send Congratulations email (personalized) to selected users"

    def handle(self, *args, **options):
        users = selected_users_emails()
                # TEMPORARY FOR TESTING REAL EMAILS
        # users = [
        #     {"name": "Fareed", "email": "fareedsayed95@gmail.com"},
        #     {"name": "Friend", "email": "rehbar@eng.rizvi.edu.in"},
        # ]

        count = len(users or [])
        self.stdout.write(self.style.NOTICE(f"Found {count} users. Preparing to send emails..."))

        if count == 0:
            self.stdout.write(self.style.WARNING("No users found. Exiting."))
            return

        subject = "Congratulations! You have been selected to Nexus as an L0 Contributor"

        sent = 0
        failed = 0

        for u in users:
            name = u.get("name", "Contributor")
            email = u.get("email")
            if not email:
                continue

            context = {
                "name": name,
                "year": datetime.now().year
            }

            # render plain text and html
            text_body = render_to_string("email/congrats.txt", context)
            html_body = render_to_string("email/congrats.html", context)

            msg = EmailMultiAlternatives(
                subject=subject,
                body=text_body,
                from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@nexus.example"),
                to=[email],
            )
            msg.attach_alternative(html_body, "text/html")

            try:
                msg.send(fail_silently=False)
                sent += 1
                self.stdout.write(self.style.SUCCESS(f"Sent to: {email}"))
            except Exception as e:
                failed += 1
                self.stdout.write(self.style.ERROR(f"Failed to send to {email}: {e}"))
                # optional: log or sys.stderr
                sys.stderr.write(str(e) + "\n")

        self.stdout.write(self.style.NOTICE(f"Done. Sent: {sent}. Failed: {failed}"))
