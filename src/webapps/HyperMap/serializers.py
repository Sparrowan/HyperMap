from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.fields import *
from datetime import datetime
from HyperMap.models import *

class ProfileSerializer(serializers.ModelSerializer):
    user = CurrentUserDefault()

    class Meta:
        model = Profile
        #fields = ('user','footprint','posted_event','bio','age','avatar','department','followed','identity')
        fields = ('bio', 'age', 'avatar', 'department', 'identity', 'credits')
        extra_kwargs = {'bio': {'required': False}, 'age': {'required': False}, 'avatar': {'required': False}}

    def isint(self, value):
      try:
        int(value)
        return True
      except:
        return False

    def validate_age(self, age):
        if age != None and self.isint(age):
            if int(age) < 0 or int(age) > 200:
                raise serializers.ValidationError("Age cannot be negative or larger than 200.")
        return age

class UserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(allow_blank=False, write_only=True)
    profile = ProfileSerializer(required=False)
    class Meta:
        model = User
        fields = ('username','password','email','first_name','last_name','password1','profile')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data["password"] != data["password1"]:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def validate_email(self, value):
        norm_email = value.lower()
        if User.objects.filter(email=norm_email).exists():
            raise serializers.ValidationError("Email address has already been registered.")
        return norm_email

    def create(self, validated_data):
        new_user = User.objects.create_user(username=validated_data['username'],
                                            password=validated_data['password'],
                                            email=validated_data['email'],
                                            first_name=validated_data['first_name'],
                                            last_name=validated_data['last_name'])
        new_user.is_active = False
        new_user.save()
        Profile.objects.create(user=new_user, credits=0)
        return new_user

class GroupSerializer(serializers.ModelSerializer):
    #member = serializers.PrimaryKeyRelatedField(allow_empty=True, many=True, queryset=User.objects.all())
    class Meta:
        model = Group
        fields = ('name', 'creator', 'member')

    def create(self, validated_data):
        group = Group(name=validated_data['name'],
                      creator=validated_data['creator'],)
        group.save()
        group.member.add(validated_data['creator'])
        for member in validated_data['member']:
            group.member.add(member)
        group.save()
        return group

    def update(self, instance, validated_data):
        if validated_data['member']:
            if instance.member.filter(user=validated_data['member']):
                instance.member.remove(validated_data['member'])
            else:
                instance.member.add(validated_data['member'])
        #else:
        #    instance.content = validated_data['content']
        instance.save()
        return instance

class EventSerializer(serializers.ModelSerializer):
    #created_time = serializers.DateTimeField()
    #creator = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    #registered = serializers.PrimaryKeyRelatedField(allow_empty=True, many=True, queryset=User.objects.all())
    group = serializers.CharField(allow_blank=True, write_only=True)

    class Meta:
        model = Event
        exclude = ('created_time',)

    def create(self, validated_data):
        event = Event(name=validated_data['name'],
                      content=validated_data['content'],
                      category=validated_data['category'],
                      created_time=datetime.now(),
                      session_begin=validated_data['session_begin'],
                      session_end=validated_data['session_end'],
                      position=validated_data['position'],
                      lat=validated_data['lat'],
                      lng=validated_data['lng'],
                      creator=validated_data['creator'])
        if 'image' in validated_data and validated_data['image']:
            event.image = validated_data['image']
        event.save()
        creator_profile = Profile.objects.get(user_id=event.creator)
        # handle group member adding event function when creating new event
        if 'group' in validated_data and validated_data['group']:
            registered = []
            members = Group.objects.get(name=validated_data['group']).member.exclude(id=event.creator)
            for member in members:
                event.registered.add(member.id)
                event.unconfirmed.add(member.id)
                profile = Profile.objects.get(user_id=member.id)
                profile.footprint.add(event.pk)
                profile.save()
                creator_profile.credits += 1
        creator_profile.posted_event.add(event.id)
        creator_profile.save()
        event.save()
        return event

    def update(self, instance, validated_data):
        if 'unconfirmed' in validated_data and validated_data['unconfirmed']:
            if instance.unconfirmed.filter(username=validated_data['unconfirmed'][0]).exists():
                instance.unconfirmed.remove(validated_data['unconfirmed'][0])
                profile = Profile.objects.get(user_id=validated_data['unconfirmed'][0])
                profile.credits += 1
                profile.save()
        if 'registered' in validated_data and validated_data['registered']:
            if instance.registered.filter(username=validated_data['registered'][0]).exists():
                instance.registered.remove(validated_data['registered'][0])
                instance.unconfirmed.remove(validated_data['registered'][0])
                profile = Profile.objects.get(user_id=validated_data['registered'][0])
                profile.footprint.remove(instance.pk)
                profile.save()
                creator_profile = Profile.objects.get(user_id=instance.creator)
                creator_profile.credits -= 1
                creator_profile.save()
            else:
                instance.registered.add(validated_data['registered'][0])
                instance.unconfirmed.add(validated_data['registered'][0])
                profile = Profile.objects.get(user_id=validated_data['registered'][0])
                profile.footprint.add(instance.pk)
                profile.save()
                creator_profile = Profile.objects.get(user_id=instance.creator)
                creator_profile.credits += 1
                creator_profile.save()
        if 'content' in validated_data and validated_data['content']:
            instance.name = validated_data['name']
            instance.content = validated_data['content']
            instance.category = validated_data['category']
            instance.session_begin = validated_data['session_begin']
            instance.session_end = validated_data['session_end']
        if 'image' in validated_data and validated_data['image']:
            instance.image = validated_data['image']
        instance.save()
        # print(instance.unconfirmed.filter(username=validated_data['unconfirmed'][0]))
        return instance
