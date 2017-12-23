import React from 'react'
import star from '../../images/star.png'
import level1 from '../../images/achievement/level1.png'
import level2 from '../../images/achievement/level2.png'
import level3 from '../../images/achievement/level3.png'
import level4 from '../../images/achievement/level4.png'

import group_icon from '../../images/group_icon.png';
import event_icon from '../../images/event_icon.png';
import puzzle from '../../images/puzzle.png';
import internet from '../../images/internet.png';
import Cookies from 'js-cookie'

export default class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            lastname: '',
            firstname: '',
            department: '',
            bio: '',
            identity: '',
            credits: '',
            avatar: '',
            age : null,
        };
        this.getUserInfo = this.getUserInfo.bind(this);
        this.getUserInfo();
    }

    getUserInfo() {
        fetch('/get_user_info/', {
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
                    username: responseJson.username,
                    lastname: responseJson.last_name,
                    firstname: responseJson.first_name,
                });
            });
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
                //console.log(responseJson);
                this.setState({
                    department: responseJson.department,
                    bio: responseJson.bio,
                    identity: responseJson.identity,
                    age: responseJson.age,
                    credits: responseJson.credits,
                    avatar: responseJson.avatar,
                });
            });
    }

    render() {
        let achievement;
        if (this.state.credits < 25) {
            achievement = level1;
        } else if (this.state.credits < 50) {
            achievement = level2;
        } else if (this.state.credits < 100) {
            achievement = level3;
        } else {
            achievement = level4;
        }
        return (
            <div>
                <div className="about-fixed my-detail">
                    <div className="my-detail">
                        <img className="my-pic"
                             src={this.state.avatar}
                             alt=""/>
                    </div>
                    <div className="my-detail">
                        <div className="white-spacing">
                            <h2><img src={star}/>{this.state.firstname} {this.state.lastname}<img src={star}/></h2>
                            <h1><img src={star}/>Username:{this.state.username}<img src={star}/></h1>
                            {this.state.identity === '' ? null :
                                <h6><img src={star}/>{this.state.identity}<img src={star}/></h6>}
                            {this.state.department ==='' ? null :
                                <h6><img src={star}/>Department:{this.state.department}<img src={star}/></h6>}

                            {this.state.age === null ? null :
                                <h6><img src={star}/>Age:{this.state.age}<img src={star}/></h6>}
                            {this.state.bio === '' ? null :
                                <h6><img src={star}/>Bio:{this.state.bio}<img src={star}/></h6>}
                        </div>
                        <div className='sidebar-icon'>
                            <div><h6>My Achievement</h6><img className="nav-logo" src={achievement}/></div>
                            <div><h6>{this.state.credits} points</h6></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
