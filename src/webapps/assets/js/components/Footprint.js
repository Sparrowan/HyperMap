import React from 'react'
import EventListItem from "./EventListItem";
import Cookies from 'js-cookie'

export default class Footprint extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events:[],
            eventNumber: -1,
        };

        this.getFooterprint = this.getFooterprint.bind(this);
        this.getFooterprint();
    }

    getFooterprint() {
        fetch('/get_footprint/', {
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
                    eventNumber:responseJson.events.length,
                });
            });
    }

    render() {
        return (

            <div>
                <div className="event-list all-list">
                    {this.state.eventNumber === 0 ? <div className="no-matched-message">Oops! You have no footprints: (</div> : null}

                    {
                        this.state.events.map((eventInfo, index) =>{
                            return (
                                <EventListItem eventItem={eventInfo}
                                               key={index}
                                               getEvents={this.getFooterprint}
                                />
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}
