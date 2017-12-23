import Cookies from 'js-cookie'
import React from 'react'

class CreatGroupForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected_users: [],
            search_result_users: [],
            message: '',
        };
        this.addUser = this.addUser.bind(this);
        this.removeUser = this.removeUser.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.getUsers();
    }

    getUsers() {
        fetch('/get_all_user/', {
            method: "GET",
            credentials: 'include',
            headers: {
                "X-CSRFToken": Cookies.get('csrftoken'),
                'Accept': 'application/json',
                "Authorization": 'Token ' + localStorage.token,
            }
        })
        .then((response) => response.json())
        .then((responseJson) => {
            //console.log(responseJson.users);
            this.setState({
                search_result_users: responseJson.users,
            });
        });
    }

    addUser(user) {
        const {selected_users} = this.state;
        const newUser = user;
        const isOnTheList = selected_users.includes(newUser);
        if (isOnTheList) {
            this.setState({
                message: 'This user is already on the list!'
            })
        } else {
            newUser != '' && this.setState({
                selected_users:[...this.state.selected_users, newUser],
                message:''
            })
        }
    }

    removeUser(user) {
        const new_selected_user = this.state.selected_users.filter(
            userItem => {
                return userItem !== user;
            }
        );
        this.setState({
            selected_users :[...new_selected_user]
        })
    }

    handleCreate(event) {
        event.preventDefault();
        fetch('/create_group/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "X-CSRFToken": Cookies.get('csrftoken'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Token " + localStorage.token,
            },
            body: JSON.stringify({
                name: this.refs.name.value,
                members: this.state.selected_users,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.hasOwnProperty('success')) {
                alert(responseJson.success);
                this.props.closePopupAndRefreshList();
            }
            else {
                Object.keys(responseJson).forEach(function(key) {
                    alert(responseJson[key]);
                })
            }
        })
    }

    render() {
        return (
            <div className="popup">
                <div >
                    <div className="new-group-form">
                        <a className="close" onClick={this.props.closePopupAndRefreshList}>&times;</a>
                        <form  method='post' onSubmit={this.handleCreate}>
                            <h5 className="white-color">New Group</h5>
                            <p className="errorMessage">{this.state.message}</p>
                            <div>
                                <input className="form-control" type="text" ref="name" placeholder="Group Name" required/>
                            </div>
                            <div className="row top">
                                <div className='col-md-6 col-lg-6 col-sm-6'>
                                    <div className="list-tab scrolling">
                                        <table >
                                            <tbody>
                                            {
                                                this.state.selected_users.map((item,index) =>{
                                                    return (
                                                        <tr key={item.username}><td key={item.username}><button key={item.username} type='button' onClick={() => {this.removeUser(item)}}>&times;</button>{item.username}</td></tr>
                                                    )
                                                })
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className='col-md-6 col-lg-6 col-sm-6'>
                                    <div className="list-tab scrolling">
                                        <div className='scrolling'>
                                            <table>
                                                <tbody>
                                                {
                                                    this.state.search_result_users.map((item) =>{
                                                        return (
                                                            <tr key={item.username}><td key={item.username} ref={(td) => this.td }><button key={item.username} type='button' onClick={() => {this.addUser(item)}}>+</button>{item.username}</td></tr>
                                                        )
                                                    })
                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="form-button" type="submit" value="Submit">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default class ShowCreateGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopup: false
        };
        this.closePopupAndRefreshList = this.closePopupAndRefreshList.bind(this);
    }

    closePopupAndRefreshList() {
        this.setState({
            showPopup: !this.state.showPopup
        });
        this.props.getGroups();
    }

    render() {
        return (
            <div className="popup_out">
                <div className="new-group-button">
                    <button className="form-button" onClick={this.closePopupAndRefreshList}>+</button>
                </div>
                {this.state.showPopup ?
                    <CreatGroupForm
                        closePopupAndRefreshList={this.closePopupAndRefreshList}
                    />
                    : null
                }
            </div>
        );
    }
};
