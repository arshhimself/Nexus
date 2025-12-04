from django.contrib import admin
from .models import Idea, Comment, Vote

admin.site.register(Idea)
admin.site.register(Comment)
admin.site.register(Vote)


# Register your models here.
