from django.urls import path

from .views import (
    PostListCreateView,
    PostDetailView,
    LikePostView,
    CommentListCreateView,
    CommentDetailView,
    FeedView,
)





urlpatterns = [
    path("", PostListCreateView.as_view(), name="post-list-create"),
        path("feed/", FeedView.as_view(),name="feed",),

    path("<int:post_id>/like/", LikePostView.as_view(), name="post-like"),
    path("<int:post_id>/comments/", CommentListCreateView.as_view(), name="comment-list-create"),

    path("comments/<int:pk>/", CommentDetailView.as_view(), name="comment-detail"),

    path("<int:pk>/", PostDetailView.as_view(), name="post-detail"),
]