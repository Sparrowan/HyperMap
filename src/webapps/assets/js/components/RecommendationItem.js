import React from 'react'
import Cookies from 'js-cookie'
import fire from '../../images/fire.png'
export class RecommendationItemPopup extends React.Component {
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
                id: this.props.item.id,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            //console.log(responseJson);
            if (responseJson.hasOwnProperty('error')) {
                alert(responseJson.error);
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
                id: this.props.item.id,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.hasOwnProperty('error')) {
                alert(responseJson.error);
            }
            this.props.closePopup();
            this.props.getRecommendation();
        })
    }

    render() {
        return (
            <div className="view-event-form">
                <div>
                    <div className="new-event-form">
                        <a className="close" onClick={this.props.closePopup}>&times;</a>
                        <form method='post' className=' white-color'>
                            <h5 className="white-color">{this.state.name}</h5>
                            <table className='table-style'>
                                <tbody>
                                <tr>
                                    <td colSpan="2">
                                        <img className="event-pic"
                                             src={this.props.item.image}
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
                            <button className="form-button" type="button" onClick={this.registerEvent}>Register</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default class RecommendationItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopup: false
        };
        this.showeventInfo = this.showeventInfo.bind(this);
    }

    showeventInfo() {
        //this.getEvent();
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    render() {
        return (
            <div >
                <div className='recommendation' onClick={this.showeventInfo}><div className='recommendation'><img src={fire}/>{this.props.item.name}<img src={fire}/></div></div>
                {this.state.showPopup ?
                    <RecommendationItemPopup
                        item={this.props.item}
                        closePopup={this.showeventInfo}
                        getRecommendation={this.props.getRecommendation}
                    />
                    : null
                }
            </div>
        );
    }
};
