import React from 'react'
import Cookies from 'js-cookie'

export class EventItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            creator: '',
            present_user: '',
            isValid: '',
            isRegistered: '',
            name: '',
            session_begin: '',
            session_end: '',
            creator_firstname: '',
            creator_lastname: '',
            category: '',
            position: '',
            content: '',
        }
        this.registerEvent = this.registerEvent.bind(this);
        this.closePopupAndRefreshList = this.closePopupAndRefreshList.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
        this.getEvent = this.getEvent.bind(this);
        this.getEvent();
    }

    getEvent() {
        fetch('/get_event/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "X-CSRFToken": Cookies.get('csrftoken'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Token " + localStorage.token,
            },
            body: JSON.stringify({
                id: this.props.eventItem.id,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            //console.log(responseJson);
            if (responseJson.hasOwnProperty('error')) {
                alert(responseJson.error);
                this.closePopupAndRefreshList();
            } else {
                this.setState({
                    creator: responseJson.eventInfo.creator,
                    present_user: responseJson.eventInfo.present_user,
                    isValid: responseJson.eventInfo.isValid,
                    isRegistered: responseJson.eventInfo.isRegistered,
                    name: responseJson.eventInfo.name,
                    session_begin: responseJson.eventInfo.session_begin,
                    session_end: responseJson.eventInfo.session_end,
                    creator_firstname: responseJson.eventInfo.creator_firstname,
                    creator_lastname: responseJson.eventInfo.creator_lastname,
                    category: responseJson.eventInfo.category,
                    position: responseJson.eventInfo.position,
                    content: responseJson.eventInfo.content,
                });
            }
        })
    }

    registerEvent(event) {
        event.preventDefault();
        fetch('/register_event/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "X-CSRFToken": Cookies.get('csrftoken'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Token " + localStorage.token,
            },
            body: JSON.stringify({
                id: this.props.eventItem.id,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.hasOwnProperty('success')) {
                alert(responseJson.success);
                this.getEvent();
            }
            else {
                Object.keys(responseJson).forEach(function(key) {
                    alert(responseJson[key]);
                })
                this.closePopupAndRefreshList();
            }
        })
    }

    deleteEvent(event) {
        event.preventDefault();
        fetch('/delete_event/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "X-CSRFToken": Cookies.get('csrftoken'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Token " + localStorage.token,
            },
            body: JSON.stringify({
                id: this.props.eventItem.id,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.hasOwnProperty('success')) {
                alert(responseJson.success);
            }
            else {
                Object.keys(responseJson).forEach(function(key) {
                    alert(responseJson[key]);
                })
            }
            this.closePopupAndRefreshList();
        })
    }

    closePopupAndRefreshList() {
        this.props.closePopup();
        this.props.getEvents();
    }

    render() {
        let button;
        if (this.state.creator !== '') {
            if (this.state.creator === this.state.present_user) {
                button = <button className="btn btn-danger mybtn" type="button" onClick={this.deleteEvent}>Delete</button>
            } else {
                if (this.state.isValid && this.state.isRegistered) {
                    button = <button className="form-button" type="button" onClick={this.registerEvent}>Unregister</button>
                } else if (this.state.isValid && !this.state.isRegistered) {
                    button = <button className="form-button" type="button" onClick={this.registerEvent}>Register</button>
                } else if (!this.state.isValid) {
                    button = <button type="button" className="btn btn-lg btn-secondary mybtn" disabled>No Longer Available</button>
                }
            }
        }
        return (
            <div className="view-event-form">
                <div>
                    <div className="new-event-form">
                        <a className="close" onClick={this.closePopupAndRefreshList}>&times;</a>
                        <form method='post' className=' white-color'>
                            <h5 className="white-color">{this.state.name}</h5>
                            <table className='table-style'>
                                <tbody>
                                <tr>
                                    <td colSpan="2">
                                        <img className="event-pic"
                                             src={this.props.eventItem.image}
                                             alt=""/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>From</td>
                                    <td>{this.state.session_begin.replace('T', ' ')}</td>
                                </tr>
                                <tr>
                                    <td>To</td>
                                    <td>{this.state.session_end.replace('T', ' ')}</td>
                                </tr>
                                <tr>
                                    <td>Creator:</td>
                                    <td>{this.state.creator_firstname} {this.state.creator_lastname}</td>
                                </tr>
                                <tr>
                                    <td>Category:</td>
                                    <td>{this.state.category}</td>
                                </tr>
                                <tr>
                                    <td>Location:</td>
                                    <td>{this.state.position}</td>
                                </tr>
                                <tr>
                                    <td>Content:</td>
                                    <td>{this.state.content}</td>
                                </tr>
                                </tbody>
                            </table>
                            {button}
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default class EventListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopup: false
        };
        this.showeventInfo = this.showeventInfo.bind(this);
    }

    showeventInfo() {
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    render() {
        return (
            <div className="event-card">
                <div>
                    <img className="event-list-img"
                         src={this.props.eventItem.image}
                         alt=""/>
                </div>
                <div className='row event-buttons'>
                    <div className='col-12'>
                        <div className='row'>
                            <div className='col-12'><span className='tag-font'>#{this.props.eventItem.category}</span></div>
                        </div>
                        <div className='alert alert-success event-name-button'
                             onClick={this.showeventInfo}>{this.props.eventItem.name}</div>
                    </div>
                </div>
                {this.state.showPopup ?
                    <EventItem
                        eventItem={this.props.eventItem}
                        closePopup={this.showeventInfo}
                        getEvents={this.props.getEvents}
                    />
                    : null
                }
            </div>
        );
    }
};
