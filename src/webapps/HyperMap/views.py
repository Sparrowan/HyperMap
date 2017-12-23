from HyperMap.models import *
from HyperMap.forms import *
from HyperMap.serializers import *

from datetime import datetime

from rest_framework import status
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.views import exception_handler
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authtoken.views import obtain_auth_token
import json
from rest_framework.request import Request
from django.utils.functional import SimpleLazyObject
from django.contrib.auth.middleware import get_user

from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.urlresolvers import reverse
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.core import serializers
from django.db.models import Count, Case, When, Value, IntegerField
import random
from django.db.models import Q
import time
import pytz
import operator

# Create your views here.
def home(request):
    return redirect('/main/')#return render(request, 'index.html', {})

#@api_view(["GET"])
#@authentication_classes((TokenAuthentication,))
#@permission_classes((IsAuthenticated,))
def react_render(request):
    return render(request, 'index.html', {})

#@api_view(["GET", "POST"])
@csrf_exempt
def register(request):
    #if request.user.is_authenticated():
    #    return redirect('/main/')
    if request.method == 'GET':
        return render(request, 'index.html', {})
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = UserSerializer(data=data)#data)
        # print data
        #print(serializer)
        if serializer.is_valid():
            serializer.save()
            new_user = User.objects.get(username=serializer.data['username'])
            token = default_token_generator.make_token(new_user)
            email_body = """
            Welcome to HyperMap. Please click the link below to verify your email address and complete the registration of your account:
            http://%s%s
            """ % (request.get_host(), reverse('confirm_registration', kwargs={'id':new_user.id, 'token':token}))
            send_mail(subject="[HyperMap]Verify your email address", message=email_body, from_email="admin@hypermap.com", recipient_list=[new_user.email])
            return JsonResponse({'success': 'You register account successfully!'}, status=201)
        return JsonResponse(serializer.errors, status=400)

def confirm_registration(request, id, token):
    try:
        user = User.objects.get(id=id)
    except ObjectDoesNotExist:
        return redirect("/error/")# JsonResponse({'errors': 'User does not exist!'}, status=400)
    if user != None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return redirect("/main/")
    else:
        return redirect("/error/")# JsonResponse({'errors': 'Wrong confirmation link!'}, status=400)

@api_view(["GET","POST"])
@csrf_exempt
def user_login(request):
    if request.method == "GET":
        return render(request, 'index.html', {})
    data = JSONParser().parse(request)
    #if not "username" in data or not "password" in data:
    #    return JsonResponse({'errors': 'Please enter username and password!'}, status=400)
    if not data["username"] or not data["password"]:
        return JsonResponse({'error': 'Please enter username and password!'}, status=400)
    try:
        user = User.objects.get(username=data["username"])
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'User does not exist!'}, status=400)
    if not user.check_password(data["password"]):
        return JsonResponse({'error': 'Wrong password!'}, status=403)
    if not user.is_active:
        return JsonResponse({'error': 'Need confirmation!'}, status=403)
    token, created = Token.objects.get_or_create(user=user)
    return JsonResponse({'token': token.key}, status=200)

@api_view(["GET"])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def get_all_user(request):
    #print(request.user)
    users = User.objects.exclude(is_active=False).exclude(username=request.user.username).values('username', 'id')
    user_list = list(users)
    return JsonResponse({'users': user_list}, status=200)

@api_view(["GET"])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def get_user_info(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(["GET"])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def get_user_profile(request):
    profile = Profile.objects.get(user=request.user)
    serializer = ProfileSerializer(profile)
    return Response(serializer.data)

@api_view(["POST"])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def edit_profile(request):
    #data = JSONParser().parse(request)
    profile = Profile.objects.get(user=request.user)
    serializer = ProfileSerializer(profile, data=request.data, partial=True)
    # print(serializer)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'success': 'Profile is edited successfully!'}, status=202)
    # print(serializer.errors)
    return JsonResponse(serializer.errors, status=400)

@api_view(["GET"])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def get_recommendation_events(request):
    profile = Profile.objects.get(user=request.user)
    # print(len(profile.footprint.all()))
    if len(profile.footprint.all()) == 0:
        events = Event.objects.exclude(creator=request.user.id).exclude(session_end__lt=datetime.now()).annotate(num_registered=Count('registered')).order_by('-num_registered').values('id','name','category')[:5]
        event_list = list(events)
    else:
        rec = {}
        for registered_event in profile.footprint.all():
            registered_users = registered_event.registered.exclude(username=request.user.username)
            for user in registered_users:
                registered_profile = Profile.objects.get(user=user)
                events = registered_profile.footprint.exclude(pk__in=profile.footprint.all().values('id')).exclude(session_end__lt=datetime.now())
                for event in events:
                    if event.pk in rec:
                        rec[event.pk] += 1
                    else:
                        rec[event.pk] = 1
        sorted_rec = sorted(rec.items(), key=operator.itemgetter(1), reverse=True)[:5]
        rec_list = []
        for rec in sorted_rec:
            rec_list.append(rec[0])
        events = Event.objects.filter(pk__in=rec_list).values('id','name','category')
        event_list = list(events)
        if len(event_list) < 5:
            more_events = Event.objects.exclude(pk__in=profile.footprint.all().values('id')).exclude(pk__in=events.values('id')).exclude(creator=request.user.id).exclude(session_end__lt=datetime.now()).annotate(num_registered=Count('registered')).order_by('-num_registered').values('id','name','category')[:5-len(event_list)]
            for event in list(more_events):
                event_list.append(event)
    for event in event_list:
        event['image'] = Event.objects.get(id=event['id']).image.url
    return JsonResponse({'events': event_list}, status=200)

@api_view(["POST"])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def create_event(request):
    serializer = EventSerializer(data=request.data, context=request)
    # print(serializer)
    if serializer.is_valid():
        serializer.save()
        # debug = serializer.data
        return JsonResponse({'success': 'Event is created successfully!'}, status=201)
    # print(serializer.errors)
    return JsonResponse(serializer.errors, status=400)

@api_view(["POST"])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def get_event(request):
    data = JSONParser().parse(request)
    try:
        event = Event.objects.get(pk=data['id'])
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Event does not exist or has already been deleted!'}, status=400)
    event = Event.objects.filter(pk=data['id']).values('id', 'name', 'content', 'category', 'session_begin', 'session_end', 'position',
                           'lat', 'lng', 'creator')
    event = list(event)[0]
    profile = Profile.objects.get(user=request.user)
    if request.user.id == event['creator']:
        unconfirmed = list(Event.objects.get(id=event["id"]).unconfirmed.all().values('id','username','first_name','last_name'))
        event["unconfirmed"] = unconfirmed
        registered = list(Event.objects.get(id=event["id"]).registered.all().values('id','username','first_name','last_name'))
        event["registered"] = registered
    else:
        if profile.footprint.filter(pk=event['id']):
            event["isRegistered"] = True
        else:
            event["isRegistered"] = False
        if event['session_end'] < datetime.now():
            event["isValid"] = False
        else:
            event["isValid"] = True
    event['creator_firstname'] = User.objects.get(id=event['creator']).first_name
    event['creator_lastname'] = User.objects.get(id=event['creator']).last_name
    event['creator'] = User.objects.get(id=event['creator']).username
    event['present_user'] = request.user.username
    return JsonResponse({'eventInfo': event}, status=200)

@api_view(["POST"])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def register_event(request):
    data = JSONParser().parse(request)
    try:
        event = Event.objects.get(pk=data['id'])
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Event does not exist or has already been deleted!'}, status=400)
    data['registered'] = [request.user.id]
    serializer = EventSerializer(event, data=data, partial=True)
    # print(serializer)
    if serializer.is_valid():
        serializer.save()
        # print(len(event.registered.all()))
        if event.registered.filter(id=request.user.id).exists():
            return JsonResponse({'success': 'You register this event successfully!'}, status=202)
        else:
            return JsonResponse({'success': 'You unregister this event successfully!'}, status=202)
    # print(serializer.errors)
    return JsonResponse(serializer.errors, status=400)

@api_view(["POST"])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def get_filtered_events(request):
    data = JSONParser().parse(request)
    selectedlist = data["selectedlist"].split(',')
    # transfer timestamp to datetime object
    selecteddate = datetime.fromtimestamp(data["selecteddate"]).date()
    # print(selecteddate)
    events = Event.objects.filter(category__in=selectedlist, session_begin__date__lte=selecteddate, session_end__date__gte=selecteddate).values('id','name','category','lat','lng')
    event_list = list(events)
    for event in event_list:
        event['image'] = Event.objects.get(id=event['id']).image.url
        event['lat'] += (random.uniform(0, 1) - 0.5) / 2500
    return JsonResponse({'events': event_list, 'user': request.user.id}, status=200)

@api_view(["GET"])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def get_all_events(request):
    events = Event.objects.annotate(num_registered=Count('registered')).annotate(
                        is_valid=Case(
                            When(session_end__gt=datetime.now(),
                                then=Value(1)),
                            default=Value(0),
                            output_field=IntegerField())).order_by('-is_valid','session_begin','-num_registered').values('id','name','category')
    event_list = list(events)
    for event in event_list:
        event['image'] = Event.objects.get(id=event['id']).image.url
    #print(event_lists)
    return JsonResponse({'events': event_list}, status=200)

@api_view(["POST"])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def get_registered_users(request):
    data = JSONParser().parse(request)
    try:
        event = Event.objects.get(pk=data['id'])
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Event does not exist or has already been deleted!'}, status=400)
    users = event.registered.all().values('first_name','last_name')
    user_list = list(users)
    return JsonResponse({'users': user_list}, status=200)

@api_view(["POST"])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def get_group_users(request):
    data = JSONParser().parse(request)
    try:
        group = Group.objects.get(name=data['id'])
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Group does not exist or has already been deleted!'}, status=400)
    users = group.member.all().values('first_name','last_name')
    user_list = list(users)
    return JsonResponse({'users': user_list}, status=200)

@api_view(["GET"])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def get_user_events(request):
    profile = Profile.objects.get(user_id=request.user.id)
    events = profile.posted_event.annotate(num_registered=Count('registered')).annotate(
                        is_valid=Case(
                            When(session_end__gt=datetime.now(),
                                then=Value(1)),
                            default=Value(0),
                            output_field=IntegerField())).order_by('-is_valid','session_begin','-num_registered').values('id', 'name', 'category')
    event_list = list(events)
    for event in event_list:
        event["registered"] = len(Event.objects.get(id=event['id']).registered.all())
        event["unconfirmed"] = len(Event.objects.get(id=event['id']).unconfirmed.all().values('id'))
        event['image'] = Event.objects.get(id=event['id']).image.url
    # print(event_lists)
    return JsonResponse({'events': event_list}, status=200)

@api_view(["GET"])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def get_footprint(request):
    profile = Profile.objects.get(user=request.user)
    events = profile.footprint.annotate(num_registered=Count('registered')).annotate(
                        is_valid=Case(
                            When(session_end__gt=datetime.now(),
                                then=Value(1)),
                            default=Value(0),
                            output_field=IntegerField())).order_by('-is_valid','session_begin','-num_registered').values('id', 'name', 'category')
    event_list = list(events)
    for event in event_list:
        event['image'] = Event.objects.get(id=event['id']).image.url
    return JsonResponse({'events': event_list}, status=200)

@api_view(["POST"])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def create_group(request):
    data = JSONParser().parse(request)
    if Group.objects.filter(name=data['name']).exists():
        return JsonResponse({'error': 'This group name has already been registered.'}, status=400)
    data['creator'] = request.user.id
    #print(data)
    data['member'] = [request.user.id]
    for member in data['members']:
        data['member'].append(member['id'])
    serializer = GroupSerializer(data=data)
    #print(serializer)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'success': 'Group is created successfully!'}, status=201)
    # print(serializer.errors)
    return JsonResponse(serializer.errors, status=400)

@api_view(["GET"])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def get_groups(request):
    groups = Group.objects.filter(member__id__contains=request.user.id).values('name','creator')
    group_list = list(groups)
    for group in group_list:
        group["number"] = len(Group.objects.get(name=group["name"]).member.all())
        group["creator"] = User.objects.get(id=group["creator"]).username
        if request.user.username == group["creator"]:
            group["isCreator"] = True
        else:
            group["isCreator"] = False
    return JsonResponse({'groups': group_list}, status=200)

@api_view(["POST"])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def confirm_event(request):
    data = JSONParser().parse(request)
    try:
        event = Event.objects.get(pk=data['id'])
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Event does not exist or has already been deleted!'}, status=400)
    # data['unconfirmed'] = [request.user.id]
    data['unconfirmed'] = [data['user']]
    serializer = EventSerializer(event, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        # debug = serializer.data
        return JsonResponse({'success': 'This user is confirmed successfully!'}, status=202)
    # print(serializer.errors)
    return JsonResponse(serializer.errors, status=400)

@api_view(["POST"])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def withdraw_group(request):
    data = JSONParser().parse(request)
    try:
        group = Group.objects.get(name=data['group'])
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Group does not exist or has already been deleted!'}, status=400)
    if group.creator.id == request.user.id:
        group.delete()
        return JsonResponse({'success': 'Group is deleted successfully!'}, status=202)
    else:
        group.member.remove(request.user)
        group.save()
        return JsonResponse({'success': 'Group is withdrawn successfully!'}, status=202)

@api_view(["POST"])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def delete_event(request):
    data = JSONParser().parse(request)
    try:
        event = Event.objects.get(pk=data['id'])
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Event does not exist or has already been deleted!'}, status=400)
    if event.creator != request.user:
        return JsonResponse({'error': 'Your are not the creator of this event!'}, status=403)
    event.delete()
    return JsonResponse({'success': 'Event is deleted successfully!'}, status=202)

@api_view(["POST"])
@authentication_classes((TokenAuthentication,))
@permission_classes((IsAuthenticated,))
def edit_event(request):
    try:
        event = Event.objects.get(id=request.data['id'])
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Event does not exist or has already been deleted!'}, status=400)
    if event.creator != request.user:
        return JsonResponse({'error': 'Your are not the creator of this event!'}, status=403)
    serializer = EventSerializer(event, data=request.data, partial=True)
    # print(serializer)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'success': 'Event is edited successfully!'}, status=202)
    # print(serializer.errors)
    return JsonResponse(serializer.errors, status=400)

def error404(request):
    return redirect('/error/')

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)
    # Now add the HTTP status code to the response.
    #print (response.status_code)
    if response is not None:
        response.data['status_code'] = response.status_code
        if response.status_code == 401:
            return redirect('/login/')
    #if response.status_code == 400:
    #    return redirect('/login/')
    return response
