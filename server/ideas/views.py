import jwt
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed

from django.db.models import Count
from random import randint


from authentication.models import User

from .models import Idea, Comment, Vote
from .serializers import IdeaSerializer, IdeaCreateSerializer, CommentSerializer



SECRET = "secret"   # apne hisaab se env me daal dena
MAX_VOTES = 3


# ---------------------- JWT VALIDATION ----------------------
import jwt
from rest_framework.exceptions import AuthenticationFailed

def auth_user(request):
        token = request.headers.get('Authorization')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token expired!')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token!')

        user = User.objects.filter(email=payload['email']).first()
        return user

# --------------------------- IDEAS ---------------------------
class IdeaListCreateView(APIView):

    # GET → No login needed
    def get(self, request):
        ideas = (
            Idea.objects.all()
            .annotate(num_votes=Count("votes"))
            .order_by("-votes_count", "-created_at")
        )
        return Response(IdeaSerializer(ideas, many=True).data)

    # POST → Login needed
    def post(self, request):
            user = auth_user(request)  # JWT user
            serializer = IdeaCreateSerializer(data=request.data, context={'user': user})

            if serializer.is_valid():
                serializer.save()  # author automatically set
                return Response(serializer.data, status=201)

            return Response(serializer.errors, status=400)


class IdeaRetrieveUpdateDeleteView(APIView):

    # GET → allowed
    def get(self, request, idea_id):
        idea = get_object_or_404(Idea, id=idea_id)
        return Response(IdeaSerializer(idea).data)

    # PUT → login
    def put(self, request, idea_id):
        user = auth_user(request)
        idea = get_object_or_404(Idea, id=idea_id)

        serializer = IdeaCreateSerializer(idea, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    # DELETE → login
    def delete(self, request, idea_id):
        user = auth_user(request)
        idea = get_object_or_404(Idea, id=idea_id)
        idea.delete()
        return Response({"message": "Idea deleted"})


# --------------------------- COMMENTS ---------------------------
class CommentListCreateView(APIView):

    # GET
    def get(self, request, idea_id):
        comments = Comment.objects.filter(idea_id=idea_id).order_by("created_at")
        return Response(CommentSerializer(comments, many=True).data)

    # POST
    def post(self, request, idea_id):
        user = auth_user(request)
        idea = get_object_or_404(Idea, id=idea_id)

        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(idea=idea, author=user)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


# ---------------------------- VOTING ----------------------------
class ToggleVoteView(APIView):

    def post(self, request, idea_id):
        user = auth_user(request)
        idea = get_object_or_404(Idea, id=idea_id)

        existing = Vote.objects.filter(user=user, idea=idea).first()

        # UNVOTE
        if existing:
            existing.delete()
            idea.votes_count = max(0, idea.votes_count - 1)
            idea.save(update_fields=["votes_count"])

            return Response({
                "message": "unvoted",
                "votes_count": idea.votes_count
            })

        # VOTE LIMIT CHECK
        if Vote.objects.filter(user=user).count() >= MAX_VOTES:
            return Response(
                {"detail": f"Vote limit reached ({MAX_VOTES})."},
                status=400
            )

        # NEW VOTE
        Vote.objects.create(user=user, idea=idea)
        idea.votes_count += 1
        idea.save(update_fields=["votes_count"])

        return Response({
            "message": "voted",
            "votes_count": idea.votes_count
        }, status=201)
