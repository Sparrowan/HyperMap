import React  from 'react'
import Cookies from 'js-cookie'
import MultiSelectField from "./MultiSelect";

export class Popup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            beginTime: '',
        };
        this.dateFormat = this.dateFormat.bind(this);
        this.beginTimeChange = this.beginTimeChange.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.getGroups = this.getGroups.bind(this);
        this.getFullDate = this.getFullDate.bind(this);
        this.getGroups();
    }

    getGroups() {
        fetch('/get_groups/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                "X-CSRFToken": Cookies.get('csrftoken'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Token " + localStorage.token,
            },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            //console.log(responseJson);
            this.setState({
                groups: responseJson.groups,
            });
        });
    }

    handleCreate(event) {
        event.preventDefault();
        document.getElementById("myButton").disabled = true;
        let form = document.getElementById("myForm");
        let formData = new FormData(form);
        fetch('/create_event/', {
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
            Object.keys(responseJson).forEach(function(key) {
                alert(responseJson[key]);
            });
            this.props.closeMarker();
            this.props.closePopup();
            this.props.getEvents();
        });
        document.getElementById("myButton").disabled = false;
    }

    dateFormat() {
        let date = new Date();
        let monthNames = [
            "01", "02", "03",
            "04", "05", "06", "07",
            "08", "09", "10",
            "11", "12"
        ];

        let day = this.getFullDate(date.getDate());
        let monthIndex = date.getMonth();
        let year = date.getFullYear();
        let hour = this.getFullDate(date.getHours());
        let minute = this.getFullDate(date.getMinutes());
        return year + '-' + monthNames[monthIndex] + '-' + day + 'T' + hour + ':' + minute;
    }

    getFullDate(number) {
        number = number.toString();
        if (number.length === 1) {
            number = '0' + number;
        }
        return number;
    }

    beginTimeChange() {
        this.setState({
            beginTime: this.refs.start.value
        });
    }

    render() {
        let localTime = this.dateFormat();
        let position = JSON.parse(JSON.stringify(this.props.position));
        return (
            <div className="popup">
                <div>
                    <div className="new-event-form">
                        <a className="close" onClick={this.props.closePopup}>&times;</a>
                        <form id="myForm" method='post' encType="multipart/form-data" onSubmit={this.handleCreate}>
                            <h5 className="white-color"> New Event</h5>
                            <div className="row">
                                <div className="col-1 white-color">
                                    Begin:
                                </div>
                                <div className="col-5">
                                    <input ref="start" className="form-control input-date" type="datetime-local" min={localTime} max="2020-01-01T00:00" onChange={this.beginTimeChange} name="session_begin" placeholder="Begin Time" required/>
                                </div>
                                <div className="col-1 white-color">
                                    End:
                                </div>
                                <div className="col-5">
                                    <input className="form-control input-date" type="datetime-local" min={this.state.beginTime} max="2020-01-01T00:00" name="session_end" placeholder="End Time" required/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-9 col-lg-9 col-md-9">
                                    <input className="form-control" maxLength={50} type="text" name="name" placeholder="Event Name" required/>
                                </div>
                                <div className="col-xs-3 col-lg-3 col-md-3">
                                    <select className="select-style form-control" name="category" required>
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
                            <div>
                                <input className="form-control" type="text" maxLength={200} name="content" placeholder="Content" required/>
                            </div>
                            <div>
                                <input className="form-control" name="image" type="file"/>
                            </div>
                            <div>
                                <input className="form-control" type="text" name="position" defaultValue={this.props.address} placeholder="address"/>
                            </div>
                            <div>
                                <input className="form-control" type="text" name="room" maxLength={30} placeholder="Room(optional)"/>
                            </div>
                            <div>
                                <select className="select-style form-control" name="group">
                                      <option  value="">Group (optional)</option>
                                    {this.state.groups.map((group) =>{
                                        return (
                                              <option value={group.name}>{group.name}</option>
                                            )
                                    })}
                                </select>
                            </div>
                            <input type="hidden" name="lat" value={position.lat}/>
                            <input type="hidden" name="lng" value={position.lng}/>
                            <input type="hidden" name="creator" value={this.props.user}/>
                            <button className="form-button" type="submit" value="Submit" id="myButton">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default class ShowEditEvent extends React.Component {
    constructor() {
        super();
        this.state = {
            showPopup: false,
        };
        this.closePopup = this.closePopup.bind(this);
        this.updateEvent = this.updateEvent.bind(this);
    }

    closePopup() {
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    updateEvent() {
        this.props.update();
    }

    render() {
        return (
            <div className='search-bar-main'>
                {this.state.showPopup ?
                    <Popup
                        update={this.updateEvent}
                        closePopup={this.closePopup}
                    />
                    : null
                }
            </div>
        );
    }
};
