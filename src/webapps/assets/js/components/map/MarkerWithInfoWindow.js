import React from 'react'
import { Marker, InfoWindow } from "react-google-maps"
import InfoBox from "react-google-maps/lib/components/addons/InfoBox"
import { EventItem } from "../EventListItem"
import game from '../../../images/marker/game_32.png';
import conference from '../../../images/marker/meeting_32.png';
import concert from '../../../images/marker/concert_32.png';
import lecture from '../../../images/marker/lecture_32.png';
import interview from '../../../images/marker/interview_32.png';
import tech_talk from '../../../images/marker/tech_talk_32.png';
import other from '../../../images/marker/other_32.png';
import sports from '../../../images/marker/sports_32.png';

class MarkerWithInfoWindow extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isOpen : false,
        };
        this.onToggleOpen = this.onToggleOpen.bind(this);
        this.getEvents = this.getEvents.bind(this);
    }

    getEvents() {
        this.props.getEvents();
        this.props.getRecommendation();
    }

    onToggleOpen() {
      this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        let lat = Number(this.props.eventItem.lat);
        let lng = Number(this.props.eventItem.lng);
        let markPosition = {lat: lat, lng: lng};
        let icon;
        //console.log(this.props.eventItem.id);
        //console.log(this.props.eventItem.category);
        switch (this.props.eventItem.category) {
            case "Game":
                icon = game;
                break;
            case "Conference":
                icon = conference;
                break;
            case "Sports":
                icon = sports;
                break;
            case "Concert":
                icon = concert;
                break;
            case "Interview":
                icon = interview;
                break;
            case "Tech Talk":
                icon = tech_talk;
                break;
            case "Lecture":
                icon = lecture;
                break;
            default:
                icon = other;
        }

        return (
            <Marker
                position={markPosition}
                onClick={this.onToggleOpen}
                icon={icon}
            >
                {this.state.isOpen && <EventItem closePopup={this.onToggleOpen}
                                                 eventItem={this.props.eventItem}
                                                 getEvents={this.getEvents}
                />}
            </Marker>

        )
    }
}

export default MarkerWithInfoWindow
