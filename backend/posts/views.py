import logging

from django.shortcuts import get_object_or_404
from django.db.models import Count
from django.db.models import Q
from rest_framework import status
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
    ListAPIView

)

from networking.models import Connection
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Post, Like, Comment
from .permissions import IsPostAuthor, IsCommentAuthor
from .serializers import PostSerializer, CommentSerializer


logger = logging.getLogger("proconnect")

permission_classes = [IsAuthenticated,IsPostAuthor,]

class PostListCreateView(ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["author"]
    search_fields = ["content"]
    ordering_fields = ["created_at", "updated_at"]
    ordering = ["-created_at"]

    # def get_queryset(self):
    #     return Post.objects.select_related("author")
    def get_queryset(self):
        return (
        Post.objects
        .select_related("author")
        .annotate(
            likes_total=Count("likes", distinct=True),
            comments_total=Count("comments", distinct=True),
        )
    )

    def perform_create(self, serializer):
        post = serializer.save(
            author=self.request.user)

        logger.info(
            "Post created: user_id=%s post_id=%s",
            self.request.user.id,
            post.id
        )


class PostDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Post.objects.select_related("author")

    def perform_update(self, serializer):
        post = serializer.save()

        logger.info(
            "Post updated: user_id=%s post_id=%s",
            self.request.user.id,
            post.id
        )

    def perform_destroy(self, instance):
        post_id = instance.id

        instance.delete()

        logger.info(
            "Post deleted: user_id=%s post_id=%s",
            self.request.user.id,
            post_id
        )

class PostDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    permission_classes = [
        IsAuthenticated,
        IsPostAuthor,
    ]

    def get_queryset(self):
        return Post.objects.select_related("author")

    def perform_update(self, serializer):
        post = serializer.save()

        logger.info(
            "Post updated: user_id=%s post_id=%s",
            self.request.user.id,
            post.id
        )

    def perform_destroy(self, instance):
        post_id = instance.id

        instance.delete()

        logger.info(
            "Post deleted: user_id=%s post_id=%s",
            self.request.user.id,
            post_id
        )


class LikePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)

        like = Like.objects.filter(
            post=post,
            user=request.user
        ).first()

        if like:
            like.delete()

            logger.info(
                "Post unliked: user_id=%s post_id=%s",
                request.user.id,
                post.id
            )

            return Response(
                {"liked": False},
                status=status.HTTP_200_OK
            )

        Like.objects.create(
            post=post,
            user=request.user
        )

        logger.info(
            "Post liked: user_id=%s post_id=%s",
            request.user.id,
            post.id
        )

        return Response(
            {"liked": True},
            status=status.HTTP_201_CREATED
        )
    



class CommentListCreateView(ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        post_id = self.kwargs["post_id"]

        return (
            Comment.objects
            .filter(post_id=post_id)
            .select_related("user", "post")
            .order_by("-created_at")
        )

    def perform_create(self, serializer):
        post = get_object_or_404(
            Post,
            id=self.kwargs["post_id"]
        )

        comment = serializer.save(
            post=post,
            user=self.request.user
        )

        logger.info(
            "Comment created: user_id=%s post_id=%s comment_id=%s",
            self.request.user.id,
            post.id,
            comment.id
        )


class CommentDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [
        IsAuthenticated,
        IsCommentAuthor
    ]

    def get_queryset(self):
        return Comment.objects.select_related(
            "user",
            "post"
        )

    def perform_update(self, serializer):
        comment = serializer.save()

        logger.info(
            "Comment updated: user_id=%s comment_id=%s",
            self.request.user.id,
            comment.id
        )

    def perform_destroy(self, instance):
        comment_id = instance.id

        instance.delete()

        logger.info(
            "Comment deleted: user_id=%s comment_id=%s",
            self.request.user.id,
            comment_id
        )



class CommentListCreateView(ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        post_id = self.kwargs["post_id"]

        return (
            Comment.objects
            .filter(post_id=post_id)
            .select_related("user", "post")
            .order_by("-created_at")
        )

    def perform_create(self, serializer):
        post = get_object_or_404(
            Post,
            id=self.kwargs["post_id"]
        )

        comment = serializer.save(
            post=post,
            user=self.request.user
        )

        logger.info(
            "Comment created: user_id=%s post_id=%s comment_id=%s",
            self.request.user.id,
            post.id,
            comment.id
        )


class CommentDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [
        IsAuthenticated,
        IsCommentAuthor
    ]

    def get_queryset(self):
        return Comment.objects.select_related(
            "user",
            "post"
        )

    def perform_update(self, serializer):
        comment = serializer.save()

        logger.info(
            "Comment updated: user_id=%s comment_id=%s",
            self.request.user.id,
            comment.id
        )

    def perform_destroy(self, instance):
        comment_id = instance.id

        instance.delete()

        logger.info(
            "Comment deleted: user_id=%s comment_id=%s",
            self.request.user.id,
            comment_id
        )



class FeedView(ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        sent_to = Connection.objects.filter(
            sender=user,
            status="accepted",
        ).values_list("receiver_id", flat=True)

        received_from = Connection.objects.filter(
            receiver=user,
            status="accepted",
        ).values_list("sender_id", flat=True)

        user_ids = list(sent_to) + list(received_from) + [user.id]

        return (
            Post.objects
            .filter(author_id__in=user_ids)
            .select_related("author")
            .order_by("-created_at")
        )