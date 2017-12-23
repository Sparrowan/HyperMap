import React from 'react'
import {EventItem} from "./EventListItem";
import Cookies from 'js-cookie'
import EventListItem from "./EventListItem";

export default class EventList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events:[],
        };
        this.get_event_list = this.get_event_list.bind(this);
        this.get_event_list();
    }

    get_event_list(){
        fetch('/get_user_events/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                "X-CSRFToken": Cookies.get('csrftoken'),
                'Accept': 'application/json',
                "Authorization": "Token " + localStorage.token,
            },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
                events: responseJson.events
            });
        });
    }

    render() {
        return (
            <div className="event-list">
                {
                    this.state.events.map((eventInfo, index) =>
                    <EventListItem key={index}
                                   eventItem={eventInfo}
                                   getEvents={this.get_event_list}
                    />)
                }
            </div>
        );
    }
}
