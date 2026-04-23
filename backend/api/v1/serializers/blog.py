from rest_framework import serializers
from domain.models import Topic, Article

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'name']

class ArticleSerializer(serializers.ModelSerializer):
    topic_name = serializers.CharField(source='topic.name', read_only=True)
    creator_name = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Article
        fields = ['id', 'title', 'content', 'topic', 'topic_name', 'creator_name', 'is_public', 'created_at']
