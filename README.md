# Introduction
HyperMap is a full stack web app powered by React and Django. It enables people in CMU to discover and share interesting ongoing campus events, funny scenes or even requests for some help on this map. At a click on a dot on the map, a postcard edited by other users will show up to tell you what's up. Instead of traditional event notice in CMU via emails, with this website, people will never miss the most popular ongoing events on campus. Users will be presented with the most genuine perspectives of the events provided by their peers. Users can post a postcard on a point of the CMU campus map for current events or those in the future. User can decide who can see the post, maybe to close friends, to students in the same department, to professors, or even to all the users on the websites. The map also has a time line, by adjusting the timeline, users can see posts at present, in the past or in the future. Users can also search the events with keywords in a specific time period. In addition, users can see their footprints in the past. This postcard can include text, images, audios and videos. The postcard can also involve comments, likes, votes and registration for an event. This project has already been deployed to Google App Engine, click https://hypermap-cmu.appspot.com/ to visit.

## Tech Stack
* React
* HTML/CSS/Bootstrap/JavaScript
* Django/python
* Google Map API
* MYSQL

## Recommendation Algorithm(content-based)
In this project, I recommend events based on categories that the user has favorited. By knowing the category of the item the user registered, I recommend some events belong to this category nearby this user. Concrete steps are as follow. <br>
1. Fetch all the events (ids) this user has visited. 
2. Given all these events, fetch the categories of these events. 
3. Given these categories, find what are the events that belong to them. 
4. Filter events that this user has visited. 
5. Sort the recommendation list on ascending order of distance between recommended events's locations and user's location.

## Requirements
* Webpack
* Django REST framwork 3
* Django 1.11
* python 2/3

## Installation
Clone the GitHub repository and then import source code under /src into your PyCharm.

```
git clone https://github.com/weijian2/HyperMap
python manage.py makemigrations
python manage.py migrate
python runserver
```


## Usage/Quick Start
* Register account(you need to confirm in your email)
* Right Click Map and click the shown marker to add event
* Click markers to register that event
* Filter events based on categories and dates
* Create group that only group members can see the events
* Register events to get credits! enjoy!:+1:

## Screenshots
login page
![](https://github.com/weijian2/HyperMap/raw/master/demoPics/login.png)
register page
![](https://github.com/weijian2/HyperMap/raw/master/demoPics/register.png)
main page
![](https://github.com/weijian2/HyperMap/raw/master/demoPics/mainPage.png)
group page
![](https://github.com/weijian2/HyperMap/raw/master/demoPics/group.png)
created page
![](https://github.com/weijian2/HyperMap/raw/master/demoPics/created.png)

## Known bugs
1. Click register button multiple times will create same event multiple times.
If you find any more bugs, feel free to contact weijian1@andrew.cmu.edu

## Todo list
1. Optimize Recommendation system based on user-based algorithm.
2. Optimize user experience when creating event.

## Deployment
Deployment Environment: Google App Engine <br>
[demo link](https://hypermap-cmu.appspot.com/) <br>
(Please contact me at weijian1@andrew.cmu.edu if this instance is not running)

## Change Log
v1.0.0(12/01/2017)<br>
* user can see all events on Google map in main page
* user can register or create event
* System will recommend events to user

## Licenses
NAN

## Notes
You need to have Django and python installed on local machine in order to run this project or you can click deployed link above to run it remotely.

