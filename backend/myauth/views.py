from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.middleware.csrf import get_token
from django.conf import settings
from .serializers import UserSerializer
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

def get_tokens_for_user(user):
    """
    Generate refresh and access tokens for a user.
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
    
    
class CSRFTokenView(APIView):
    """
    Returns a CSRF token.
    """
    permission_classes = []
    
    def get(self, request, *args, **kwargs):
        csrf_token = get_token(request)
        return Response({'csrfToken': csrf_token})



class RegistrationView(APIView):
    """
    Registers a new user
    """
    permission_classes = []
    
    def post(self, request, *args, **kwargs):
        data = request.data
        user_serializer = UserSerializer(data=data)
        if user_serializer.is_valid():
            user = user_serializer.save()  # Save the user and get the instance
            tokens = get_tokens_for_user(user)  # Generate JWT tokens
            user_data = user_serializer.data
            user_data['tokens'] = tokens  # Add tokens to the response data
            return Response(user_data, status=status.HTTP_201_CREATED)
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    Authenticates a user and returns JWT tokens.
    """
    
    permission_classes = []
    
    def post(self, request, *args, **kwargs):
        data = request.data
        email = data.get('email')
        password = data.get('password')
        
        try:
            user = User.objects.get(email=email)
            if not user.check_password(password):
                return Response({"error": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST)
            
            tokens = get_tokens_for_user(user)
            user_data = UserSerializer(user).data
            user_data['tokens'] = tokens
            return Response(user_data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User does not exist"}, status=status.HTTP_400_BAD_REQUEST)

class HelloView(APIView):
    """
    A simple view that returns a greeting.
    """
    permission_classes = []

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)

class LogoutView(APIView):
    """
    Logs out a user by blacklisting their refresh token.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh")
        print("refresh_token", refresh_token)   
        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the refresh token
            return Response({"success": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Invalid or already blacklisted token"}, status=status.HTTP_400_BAD_REQUEST)
