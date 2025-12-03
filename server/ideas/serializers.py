from rest_framework import serializers
from .models import Idea, Comment, Vote


class CommentSerializer(serializers.ModelSerializer):
    author_exists = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ("id", "text", "created_at", "author_exists")
        read_only_fields = ("id", "created_at", "author_exists", 'author')

    def get_author_exists(self, obj):
        return bool(obj.author)


class IdeaCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Idea
        fields = ['title', 'description'] 

    def create(self, validated_data):
        user = self.context.get('user')
        if not user:
            raise serializers.ValidationError("User not found in context")
        return Idea.objects.create(author=user, **validated_data)


class IdeaSerializer(serializers.ModelSerializer):
    author_email = serializers.CharField(source='author.email', read_only=True)
    num_votes = serializers.IntegerField(source='votes_count', read_only=True)
    comments = CommentSerializer(many=True, read_only=True) 

    class Meta:
        model = Idea
        fields = ['id', 'title', 'description', 'author_email', 'num_votes', 'created_at', 'comments']
