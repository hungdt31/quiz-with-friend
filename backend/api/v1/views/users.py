from rest_framework import generics
from rest_framework.permissions import AllowAny
from domain.models.users import CustomUser
from api.v1.serializers.users import UserSerializer

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer
