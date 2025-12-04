import threading
from datetime import datetime
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from authentication.models import User   # adjust if needed

def send_idea_email_background(idea):
    """
    Send idea notification emails to all users in background.
    Each user receives a personalized email with their own name.
    """

    users = User.objects.all()

    for usr in users:
        try:
            # Personalized variables
            html_content = render_to_string("emails/new_idea.html", {
                "idea": idea,
                "year": datetime.now().year,
                "name": usr.name,  
            })

            # Send individually (Gmail safe)
            msg = EmailMultiAlternatives(
                subject=f"New Idea Posted: {idea.title}",
                body="A new idea has been posted.",
                from_email="nexus.rcoe@gmail.com",
                to=[usr.email]
            )

            msg.attach_alternative(html_content, "text/html")
            msg.send()

            print(f"📨 Email sent to {usr.email}")

        except Exception as e:
            print(f"❌ Email failed for {usr.email}: {e}")
            continue  # move to next user safely


def start_email_thread(idea):
    """Runs email sending in background thread."""
    thread = threading.Thread(target=send_idea_email_background, args=(idea,))
    thread.start()
