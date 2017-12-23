import React from 'react'
import Cookies from 'js-cookie'

import RegisterUserItem from "./RegisterUserItem";
import unconfirmed_user from '../../images/unconfirmed_user.png'
export class EventManagePopUp extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isEditting : false,
            name: '',
            session_begin: '',
            session_end: '',
            category: '',
            position: '',
            content: '',
            unconfirmed: '',
        }
        this.deleteEvent = this.deleteEvent.bind(this);
        this.closePopupAndRefreshList = this.closePopupAndRefreshList.bind(this);
        this.handleEdit = this.handleEdit.bind(this)
        this.handleSave = this.handleSave.bind(this)
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
                id: this.props.eventInfo.id,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.hasOwnProperty('error')) {
                alert(responseJson.error);
                this.closePopupAndRefreshList();
            } else {
                this.setState({
                    name: responseJson.eventInfo.name,
                    session_begin: responseJson.eventInfo.session_begin,
                    session_end: responseJson.eventInfo.session_end,
                    category: responseJson.eventInfo.category,
                    position: responseJson.eventInfo.position,
                    content: responseJson.eventInfo.content,
                    unconfirmed: responseJson.eventInfo.unconfirmed,
                });
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
                id: this.props.eventInfo.id,
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

    handleEdit(){
        //event.preventDefault();
        this.setState({
            isEditting: !this.state.isEditting
        });
    }

    handleSave(event){
        event.preventDefault();
        let form = document.getElementById("editEventForm");
        let formData = new FormData(form);
        fetch('/edit_event/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "X-CSRFToken": Cookies.get('csrftoken'),
                'Accept': 'application/json',
                //'Content-Type': 'application/json',
                "Authorization": "Token " + localStorage.token,
            },
            body: formData,
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.hasOwnProperty('success')) {
                alert(responseJson.success);
                this.handleEdit();
            }
            else {
                Object.keys(responseJson).forEach(function(key) {
                    alert(responseJson[key]);
                })
            }
        })
    }

    closePopupAndRefreshList() {
        this.props.closePopup();
        this.props.getEvents();
    }

    render() {
        // console.log(this.props.eventInfo.isregistered);
        // alert(this.props.eventInfo.isregistered);
        return (
            <div className="view-event-form">
                <div >
                    <div className="new-event-form">
                        <a className="close" onClick={this.closePopupAndRefreshList}>&times;</a>
                        {this.state.isEditting ?
                            <form id='editEventForm' method='post' className='white-color' encType="multipart/form-data" onSubmit={this.handleSave} >
                                <input name='id' ref="id" value={this.props.eventInfo.id} type='hidden'/>
                                <div className='row'>
                                    <img className="event-pic" src={this.props.eventInfo.image} alt=""/>
                                </div>
                                <div className='row'>
                                    <div className='col-4'>Name</div>
                                    <div className='col-8'>
                                        <input className="form-control" type="text" name="name" defaultValue={this.state.name} placeholder="Event name"/>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-4'>From</div>
                                    <div className='col-8'>
                                        <input className="form-control input-date" name="session_begin" type="datetime-local" defaultValue={this.state.session_begin} />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-4'>To</div>
                                    <div className='col-8'>
                                        <input className="form-control input-date" name="session_end" type="datetime-local" defaultValue={this.state.session_end} />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-4'>Content:</div>
                                    <div className='col-8'>
                                        <input className="form-control" colSpan="2" type="text" name="content" defaultValue={this.state.content} placeholder='Content'/>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-4'>
                                        Image:
                                    </div>
                                    <div className='col-8'>
                                        <input className="form-control" colSpan="2" name="image" type="file"/>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-4'>
                                        Category:
                                    </div>
                                    <div className='col-8'>
                                        <select className="select-style form-control" name="category" defaultValue={this.state.category}>
                                            <option value="Conference">Conference</option>
                                            <option value="Game">Game</option>
                                            <option value="Sports">Sports</option>
                                            <option value="Concert">Concert</option>
                                            <option value="Lecture">Lecture</option>
                                            <option value="Tech Talk">Tech Talk</option>
                                            <option value="Interview">Interview</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-4'>
                                        Location:
                                    </div>
                                    <div className='col-8'>
                                        {this.state.position}
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-6'>
                                        <button className='btn btn-danger mybtn' type='button' onClick={this.deleteEvent}>Delete</button>
                                    </div>
                                    <div className='col-6'>
                                        <button className='btn btn-success mybtn' type='submit'>Save</button>
                                    </div>
                                </div>
                            </form>
                            :
                            <form method='post' className='white-color' >
                                <h5 className="white-color">{this.state.name}</h5>
                                <table className='table-style'>
                                    <tbody>
                                    <tr>
                                        <td colSpan="2">
                                            <img className="event-pic" src={this.props.eventInfo.image} alt="" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>From</td>
                                        <td>{this.state.session_begin.replace('T',' ')}</td>
                                    </tr>
                                    <tr>
                                        <td>To</td>
                                        <td>{this.state.session_end.replace('T',' ')}</td>
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
                                <div className='row'>
                                    <div className='col-6'>
                                        <button className='btn btn-danger mybtn' type='button' onClick={this.deleteEvent}>delete</button>
                                    </div>
                                    <div className='col-6'>
                                        <button className='btn btn-success mybtn' type='button' onClick={this.handleEdit}>edit</button>
                                    </div>
                                </div>
                                {this.state.unconfirmed.length != 0 ?
                                    <div  className="registered-user">
                                        <div className='row'>
                                            <div className='col-6'>
                                                Registered User
                                            </div>
                                            <div className='col-6'>
                                                Confirmation
                                            </div>
                                        </div>
                                        {/*{console.log(this.props.eventInfo.followed)}*/}
                                        {this.state.unconfirmed.map((user) =>
                                            // console.log(following.username);_
                                            <RegisterUserItem key={user.username} user={user} id={this.props.eventInfo.id} />
                                        )}
                                        {/*<RegisterUserItem />*/}
                                    </div>
                                    :null}
                            </form>}
                    </div>
                </div>
            </div>
        );
    }
}


export class EventUsersPopUp extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            users: [],
        };
        this.closePopupAndRefreshList = this.closePopupAndRefreshList.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.getUsers();
    }

    getUsers() {
        fetch('/get_registered_users/', {
            method: "POST",
            credentials: 'include',
            headers: {
                "X-CSRFToken": Cookies.get('csrftoken'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Token " + localStorage.token,
            },
            body: JSON.stringify({
                id: this.props.eventInfo.id,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.hasOwnProperty('error')) {
                alert(responseJson.error);
                this.closePopupAndRefreshList();
            }
            else {
                this.setState({
                    users: responseJson.users,
                })
            }
        });
    }

    closePopupAndRefreshList() {
        this.props.closePopup();
        this.props.getEvents();
    }

    render() {
        return (
            <div className="view-event-form">
                <div >
                    <div className="new-event-form">
                        <a className="close" onClick={this.closePopupAndRefreshList}>&times;</a>
                        <form  method='post' className=' white-color scrolling user_list' >
                            <table className='table-style'>
                                <tbody>
                                {this.state.users.map((useritem) => {
                                    return(
                                        <tr>
                                            <td>
                                                {useritem.first_name} {useritem.last_name}
                                            </td>
                                        </tr>
                                    );
                                })
                                }
                                </tbody>
                            </table>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default class EventListItemCreated extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopup: false,
            showUsers:false
        };
        this.showeventInfo = this.showeventInfo.bind(this);
        this.showUser = this.showUser.bind(this);
    }

    showeventInfo(){
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    showUser(){
        this.setState({
            showUsers: !this.state.showUsers
        });
    }

    render() {
        return (
            <div className="event-card">
                <div>
                    <img className= "event-list-img" src={this.props.eventItem.image} alt="" />
                </div>
                <div>
                    <div className='row'>
                        <div className='col-5'><span  className='tag-font'>#{this.props.eventItem.category}</span></div>
                        <div className='col-7' ><a className='tag-font registered' onClick={this.showUser}>Registered: {this.props.eventItem.registered}</a></div>
                    </div>
                    <div className='col-12'>
                        {this.props.eventItem.unconfirmed == 0 ?
                            <div className='alert alert-success event-name-button' onClick={this.showeventInfo}>{this.props.eventItem.name}</div>
                            : <div className='alert alert-warning event-name-button' onClick={this.showeventInfo}>{this.props.eventItem.name}</div>}
                    </div>
                    {/*{this.props.eventItem.unconfirmed.length != 0 ? <div className='alert alert-danger'>You have unconfirmed users</div> : <div className='transparent alert alert-light'>You have unconfirmed users</div>}*/}
                </div>
                {this.state.showPopup ?
                    <EventManagePopUp
                        eventInfo={this.props.eventItem}
                        closePopup={this.showeventInfo}
                        getEvents={this.props.getEvents}
                    />
                    : null
                }
                {this.state.showUsers ?
                    <EventUsersPopUp
                        eventInfo={this.props.eventItem}
                        closePopup={this.showUser}
                        getEvents={this.props.getEvents}
                    />
                    : null
                }
            </div>
        );
    }
};
