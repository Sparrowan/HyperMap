from django import forms
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from HyperMap.models import *

class RegistrationForm(forms.Form):
    username = forms.CharField()
    email = forms.EmailField()
    firstname = forms.CharField()
    lastname = forms.CharField()
    password1 = forms.CharField()
    password2 = forms.CharField()

class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField()

    def clean(self):
        cleaned_data = super(LoginForm, self).clean()
        username = cleaned_data.get('username')
        password = cleaned_data.get('password')
        user = User.objects.filter(username=username).first()
        return user

class EventForm(forms.Form):
    class Meta:
        model = Event
        exclude = ['user', 'time', 'registered']
