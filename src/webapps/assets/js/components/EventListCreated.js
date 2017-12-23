import React from 'react'
import {EventItem} from "./EventListItem";
import Cookies from 'js-cookie'
import EventListItemCreated from "./EventListItemCreated";

export default class EventListCreated extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            eventNumber : -1
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
                events: responseJson.events,
                eventNumber:responseJson.events.length
            });
        });
    }

    render() {
        return (
            <div className="event-list all-list">
                    {this.state.eventNumber === 0 ? <div className="no-matched-message">Oops! You haven't created any events : (</div> : null}

                {
                    this.state.events.map((eventInfo, index) =>
                    <EventListItemCreated key={index}
                                   eventItem={eventInfo}
                                   getEvents={this.get_event_list}
                    />)
                }
            </div>
        );
    }
}
