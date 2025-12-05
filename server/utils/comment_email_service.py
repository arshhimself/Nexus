import threading
from datetime import datetime
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from authentication.models import User


def send_comment_notification_background(comment):
    idea = comment.idea
    commenter = comment.author

    idea_title = idea.title
    idea_link = "https://nexus-rcoe.vercel.app/idea"   # STATIC LINK FIXED

    notify_user_ids = set()

    # Notify post owner
    notify_user_ids.add(idea.author_id)

    # Notify all past commenters except the one who commented now
    previous_commenters = (
        idea.comments.exclude(author=commenter)
        .values_list("author_id", flat=True)
        .distinct()
    )
    notify_user_ids.update(previous_commenters)

    # Remove current commenter
    notify_user_ids.discard(commenter.id)

    users = User.objects.filter(id__in=notify_user_ids)

    for user in users:
        try:
            # Choose template
            if user.id == idea.author_id:
                template = "emails/comment_notify_author.html"
                subject = f"💬 New Comment on: {idea_title}"
            else:
                template = "emails/comment_notify_others.html"
                subject = f"🔔 New Activity on: {idea_title}"

            html_content = render_to_string(template, {
                "comment_text": comment.text,
                "idea_title": idea_title,
                "idea_link": idea_link,    # STATIC LINK USED
                "year": datetime.now().year,
            })

            msg = EmailMultiAlternatives(
                subject=subject,
                body=comment.text,
                from_email="nexus.rcoe@gmail.com",
                to=[user.email]
            )

            msg.attach_alternative(html_content, "text/html")
            msg.send()

            print(f"📨 Email sent to {user.email}")

        except Exception as e:
            print(f"❌ Failed for {user.email}: {e}")


def start_comment_notification_thread(comment):
    threading.Thread(
        target=send_comment_notification_background,
        args=(comment,)
    ).start()
