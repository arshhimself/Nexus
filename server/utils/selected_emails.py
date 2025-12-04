from authentication.models import User

def selected_users_emails():
    """
    Returns a list of dicts:
    [
      {"name": <user name>, "email": <email>}
    ]
    """

    users = User.objects.filter(test_given=True)

    selected_list = []

    for user in users:
        if user.email:  # ensure email exists
            selected_list.append({
                "name": user.name if hasattr(user, "name") else user.username,
                "email": user.email,
                "phone": user.phone if hasattr(user, "phone") else ""
            })

    return selected_list
