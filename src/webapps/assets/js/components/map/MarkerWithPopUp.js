import React from 'react'
import {Marker, InfoWindow} from "react-google-maps"
import {Popup} from "../CreatEventForm"
import Cookies from 'js-cookie'
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";

class MarkerWithPopUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopup: false,
        };
        this.onToggleOpen = this.onToggleOpen.bind(this);
        this.props.closeotherMarker();
    }

    onToggleOpen() {
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    render() {
        return (
            <Marker
                position={this.props.position}
                onClick={this.onToggleOpen}
            >
                {this.state.showPopup && <Popup closePopup={this.onToggleOpen}
                                                position={this.props.position}
                                                address={this.props.address}
                                                getEvents={this.props.getEvents}
                                                closeMarker={this.props.closeMarker}
                                                key={this.props.key}
                                                user={this.props.user}
                />}
            </Marker>
        )
    }
}

export default MarkerWithPopUp
