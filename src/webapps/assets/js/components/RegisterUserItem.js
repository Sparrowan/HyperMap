import React from 'react'
import Cookies from 'js-cookie'

export default class registerUserItem extends React.Component{
    constructor(props){
        super(props);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.state = {
            confirm : false,
        }
    }

    handleConfirm(event){
        event.preventDefault();
        //console.log(this.props.id)
        this.setState ({
            confirm : true,
        })
        fetch('/confirm_event/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "X-CSRFToken": Cookies.get('csrftoken'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Token " + localStorage.token,
            },
            body: JSON.stringify({
                id: this.props.id,
                user: this.props.user.id,
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
            // this.props.closePopup();
            // this.props.getEvents();
        })
        // alert(this.state.confirm);
    }

    render() {
        return (
            <div>
                {this.state.confirm ?
                    null :
                    <div className='registered-user-item row'>
                        <div className='col-6'>
                            {/*{console.log(this.props.follower)}*/}
                            {this.props.user.first_name}
                            {this.props.user.last_name}
                        </div>
                        <div className='col-6'>
                            {/*<button>23333</button>*/}
                            {/*<label className="switch">*/}
                            {/*<input type="checkbox" onChange={this.handleChange} />*/}
                            {/*<span className="slider round"></span>*/}
                            {/*</label>*/}
                            <button className="form-button" onClick={this.handleConfirm} value='confirm'>confirm</button>
                            {/*<button className="form-button" disabled value="confirmed">confirmed</button>*/}
                        </div>
                    </div>
                }
            </div>
        )
    }
};
