import React from 'react'
import Cookies from 'js-cookie'
export default class GroupListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopup : false,
            showUsers : false,
        }
        this.showUser = this.showUser.bind(this);
        this.closePopupAndRefreshList = this.closePopupAndRefreshList.bind(this);
    }

    closePopupAndRefreshList() {
        this.setState({
            showPopup: !this.state.showPopup
        });
        this.props.getGroups();
    }

    showUser(){
        this.setState({
            showUsers: !this.state.showUsers
        });
        this.props.getGroups();
    }

    render() {
        let button;
        if (this.props.groupItem.isCreator) {
            button = <button className="btn btn-danger" onClick={this.closePopupAndRefreshList}>Delete</button>
        } else {
            button = <button className="btn btn-danger" onClick={this.closePopupAndRefreshList}>Withdraw</button>
        }
        return (
            <tr>
                <td>{this.props.groupItem.name}</td>
                <td>{this.props.groupItem.creator}</td>
                <td><span onClick={this.showUser}>{this.props.groupItem.number}</span></td>
                {this.state.showUsers ?
                    <EventUsersPopUp
                        groupInfo={this.props.groupItem}
                        closePopup={this.showUser}
                    />
                    : null
                }
                {this.state.showPopup ?
                    <ConfirmationPopup
                        closePopupAndRefreshList={this.closePopupAndRefreshList}
                        groupItem={this.props.groupItem}
                    />
                    : null
                }
                <td>{button}</td>
            </tr>
        );
    }
}

export class ConfirmationPopup extends React.Component {
    constructor(props) {
        super(props)
        this.handleWithdraw = this.handleWithdraw.bind(this);
    }

    handleWithdraw(event) {
        event.preventDefault();
        fetch('/withdraw_group/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "X-CSRFToken": Cookies.get('csrftoken'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Token " + localStorage.token,
            },
            body: JSON.stringify({
                group: this.props.groupItem.name,
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
            this.props.closePopupAndRefreshList();
        })
    }

    render() {
        let text;
        if (this.props.groupItem.isCreator) {
            text = <div className='col-8 white-color'><p> Are you sure to delete {this.props.groupItem.name}?</p></div>
        } else {
            text = <div className='col-8 white-color'><p> Are you sure to withdraw {this.props.groupItem.name}?</p></div>
        }
        return (
                <div className="view-event-form">
                    <div>
                        <div className="new-event-form">
                            <div className="row">
                                {text}
                                <div className='col-2'><button className="btn btn-success" onClick={this.handleWithdraw}>Yes</button></div>
                                <div className='col-2'><button className="btn btn-default" onClick={this.props.closePopupAndRefreshList}>No</button>
                                </div>
                            </div>
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
        this.getUsers = this.getUsers.bind(this);
        this.getUsers();
    }

    getUsers() {
        fetch('/get_group_users/', {
            method: "POST",
            credentials: 'include',
            headers: {
                "X-CSRFToken": Cookies.get('csrftoken'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Token " + localStorage.token,
            },
            body: JSON.stringify({
                id: this.props.groupInfo.name,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.hasOwnProperty('error')) {
                alert(responseJson.error);
                this.props.closePopup();
            }
            else {
                this.setState({
                    users: responseJson.users,
                })
            }
        });
    }

    render() {
        return (
            <div className="view-event-form">
                <div >
                    <div className="new-event-form">
                        <a className="close" onClick={this.props.closePopup}>&times;</a>
                        <form  method='post' className='white-color scrolling user_list'>
                            <table className='table-style'>
                                <tbody>
                                {this.state.users.map((useritem) => {
                                    return(
                                        <tr key={useritem.first_name}>
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
