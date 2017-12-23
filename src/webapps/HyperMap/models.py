# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import User
from django.db import models

EVENT_CATEGORY_CHOICES = (('Sports','Sports'),('Concert','Concert'),('Game','Game'),('Conference','Conference'),
                          ('Lecture','Lecture'),('Tech Talk','Tech Talk'),('Interview','Interview'),('Other','Other'))
USER_DEPARTMENT_CHOICES = (('CS','CS'),('ECE','ECE'),('CEE','CEE'),('Drama','Drama'),('Other','Other'))
USER_IDENTITY_CHOICES = (('Undergraduate Student','Undergraduate Student'),('Master Student','Master Student'),
                         ('PhD Student','PhD Student'),('Teacher','Teacher'),('Staff','Staff'))
# Create your models here.
class Event(models.Model):
    name = models.CharField(max_length=21)
    content = models.CharField(max_length=420)
    image = models.ImageField(default="media/event-photos/images.gif", upload_to="media/event-photos", blank=True)
    category = models.CharField(choices=EVENT_CATEGORY_CHOICES,max_length=21)
    created_time = models.DateTimeField(auto_now=True) # create time of this event
    session_begin = models.DateTimeField() # event begin time
    session_end = models.DateTimeField()  # event end time
    #registered = models.IntegerField() # how many people register for this event
    position = models.CharField(max_length=420) # where this event will hold
    room = models.CharField(max_length=42, blank=True)
    lat = models.FloatField()
    lng = models.FloatField()
    creator = models.ForeignKey(User)
    registered = models.ManyToManyField(User, blank=True, related_name='registered+')
    unconfirmed = models.ManyToManyField(User, blank=True, related_name='uncomfirmed+')

class Group(models.Model):
    name = models.CharField(max_length=100, unique=True)
    member = models.ManyToManyField(User,related_name='member+')
    creator = models.ForeignKey(User)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    footprint = models.ManyToManyField(Event,related_name='footprint+')
    posted_event = models.ManyToManyField(Event,related_name='posted_event+')
    bio = models.CharField(max_length=420, blank=True)
    age = models.IntegerField(null=True, blank=True)
    avatar = models.ImageField(default="media/profile-photos/images.jpg", upload_to="media/profile-photos", blank=True)
    department = models.CharField(choices=USER_DEPARTMENT_CHOICES,max_length=50)
    #group = models.ManyToManyField(Group,related_name='group+')
    identity = models.CharField(choices=USER_IDENTITY_CHOICES,max_length=50)
    credits = models.IntegerField(null=True, blank=True)
#
