from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Publication(models.Model):
    # model represents a publication functionality 
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="publications")
    body = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
    # function serializing model's fields for use by JSON 
        return {
            "id": self.id,
            "user": self.user.username,
            "body": self.body,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
        }
    
    
class Follow(models.Model):
    # model represents a follow functionality
    follower = models.CharField(max_length=120)
    is_followed = models.CharField(max_length=120)


class Like(models.Model):
    # model represent a like functionality
    publication_like = models.CharField(max_length=120)
    username_like = models.CharField(max_length=120)


