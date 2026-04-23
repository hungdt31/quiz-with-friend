from rest_framework import serializers
from domain.models import FlashcardSet, Flashcard

class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ['id', 'flashcard_set', 'front_text', 'back_text']

class FlashcardSetSerializer(serializers.ModelSerializer):
    cards = FlashcardSerializer(many=True, read_only=True)
    creator_name = serializers.CharField(source='created_by.username', read_only=True)
    
    cards_data = serializers.ListField(child=serializers.DictField(), write_only=True, required=False)

    class Meta:
        model = FlashcardSet
        fields = ['id', 'title', 'description', 'creator_name', 'is_public', 'created_at', 'cards', 'cards_data']
        
    def create(self, validated_data):
        cards_data = validated_data.pop('cards_data', [])
        flashcard_set = FlashcardSet.objects.create(**validated_data)
        for card in cards_data:
            Flashcard.objects.create(
                flashcard_set=flashcard_set,
                front_text=card.get('front_text'),
                back_text=card.get('back_text')
            )
        return flashcard_set
