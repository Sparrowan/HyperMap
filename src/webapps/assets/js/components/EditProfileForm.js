import React from 'react'
import {Redirect} from 'react-router'
import Cookies from 'js-cookie'
import ReactDOM from 'react-dom';

export default class EditProfileForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fireRedirect: false,
            bio: '',
            age: '',
            department: '',
            identity: '',
        };
        this.handleEdit = this.handleEdit.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.getUserInfo();
    }

    getUserInfo() {
        fetch('/get_user_profile/', {
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
            this.setState({
                department: responseJson.department,
                bio: responseJson.bio,
                age: responseJson.age,
                identity: responseJson.identity,
            });
        })
    }

    handleEdit(event) {
        event.preventDefault();
        let form = document.getElementById("myForm");
        let formData = new FormData(form);
        fetch('/edit_profile_api/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "X-CSRFToken": Cookies.get('csrftoken'),
                'Accept': 'application/json',
                "Authorization": "Token " + localStorage.token,
            },
            body: formData,
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.hasOwnProperty('success')) {
                alert(responseJson.success);
                this.setState({
                    fireRedirect:true
                });
            }
            else {
                Object.keys(responseJson).forEach(function(key) {
                    alert(responseJson[key]);
                })
            }
        })
    }


    render() {
        const { fireRedirect } = this.state;
        return (
            <div className="edit-profile-form">
                <div className="form">
                    <form id="myForm" className="login-form" encType="multipart/form-data" method='post' onSubmit={this.handleEdit}>
                        <div>
                            <input className="form-control" key={this.state.age === '' ? 'notLoadedYet' : 'loaded'} type="text" name="age" defaultValue={this.state.age} placeholder="Age"/>
                        </div>
                        <div>
                            <input className="form-control" key={this.state.bio === '' ? 'notLoadedYet' : 'loaded'} name="bio" type="text" defaultValue={this.state.bio.toString()} placeholder="Bio"/>
                        </div>
                        <div>
                            <div>
                                <input id="picture" className="form-control" name="avatar" type="file"></input>
                            </div>
                        </div>
                        <div className="cus-select-group">
                            <select className="select-style form-control" name="identity" defaultValue={this.state.identity}>
                                <option value="Undergraduate Student">Undergraduate Student</option>
                                <option value="Master Student">Master Student</option>
                                <option value="PhD Student">PhD Student</option>
                                <option value="Teacher">Teacher</option>
                                <option value="Staff">Staff</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="cus-select-group myselect">
                            <select className="select-style form-control" name="department" defaultValue={this.state.department}>
                                <option value="ECE">ECE</option>
                                <option value="CS">CS</option>
                                <option value="CEE">CEE</option>
                                <option value="Drama">Drama</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <button className="form-button" type='submit'>Submit</button>
                    </form>
                    {fireRedirect && (
                        <Redirect to={'/main/'}/>
                    )}
                </div>
            </div>
        );
    }
}
