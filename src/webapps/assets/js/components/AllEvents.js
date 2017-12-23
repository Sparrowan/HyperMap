import React from 'react'
import EventListItem from "./EventListItem";
import Cookies from 'js-cookie'
import MultiSelectField from "./MultiSelect";
import DateSelect from "./Calendar";
export default class AllEvents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events:[],
            filter: 'Sports,Lecture,Concert,Tech Talk,Game,Interview,Conference,Other',
            date: Math.floor((new Date()).setHours(0, 0, 0, 0) / 1000),
            eventNumber: -1,
        };

        this.handleCalendarChange = this.handleCalendarChange.bind(this);
        this.handleSelectorChange = this.handleSelectorChange.bind(this);

        this.get_all_events = this.get_all_events.bind(this)
        this.get_all_events();
    }

    get_all_events() {
        fetch('/get_filtered_events/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "X-CSRFToken": Cookies.get('csrftoken'),
                'Accept': 'application/json',
                "Authorization": "Token " + localStorage.token,
            },
            body: JSON.stringify({
                selectedlist: this.state.filter,
                selecteddate: this.state.date,
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {


                this.setState({
                    events: responseJson.events,
                    user: responseJson.user,
                    eventNumber:responseJson.events.length,
                });
            });
    }

    handleCalendarChange(value) {
        // console.log(value);
        this.setState({
            date: Math.floor(value / 1000)
        }, function () {
            // console.log(this.state.filter);
            this.get_all_events();
        })
    }

    handleSelectorChange(value) {
        console.log(value);
        this.setState({
            filter: value
        }, function () {
            // console.log(this.state.filter);
            this.get_all_events();
        })
    }

    render() {
        return (
            <div>
                {/*<div className='row search-bar'>*/}
                {/*<div className='col-lg-9 col-md-9 col-sm-9'>*/}
                {/*<input className="search-box" id="search" placeholder="Search..." type="text" />*/}
                {/*</div>*/}
                {/*<div className='col-lg-3 col-md-3 col-sm-3'>*/}
                {/*<button className="form-button search-bar-button" type='submit'>search</button>*/}
                {/*</div>*/}
                {/*</div>*/}
                <div className="event-list all-list">
                    {this.state.eventNumber === 0 ? <div className="no-matched-message">Oops! There is no matched events : (</div> : null}
                    {
                        this.state.events.map((eventInfo, index)=>{
                            return (
                                <EventListItem eventItem={eventInfo}
                                               key={index}
                                               getEvents={this.get_all_events}
                                />
                            )
                        })
                    }
                </div>
                <div className="select-on-all">
                    <MultiSelectField  selectedList={this.handleSelectorChange}/>
                    <DateSelect selectedDate={this.handleCalendarChange}/>
                </div>

            </div>
        );
    }
}
