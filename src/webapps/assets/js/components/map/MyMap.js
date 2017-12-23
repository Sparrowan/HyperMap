import React, {Component} from 'react'
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps"
import MarkerWithInfoWindow from "./MarkerWithInfoWindow"
import MarkerWithPopUp from "./MarkerWithPopUp"
import Cookies from 'js-cookie'
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
import MultiSelectField from "../MultiSelect";
import DateSelect from "../Calendar";

const {SearchBox} = require("react-google-maps/lib/components/places/SearchBox");
const {StandaloneSearchBox} = require("react-google-maps/lib/components/places/StandaloneSearchBox");
const {compose, withProps, lifecycle, withHandlers} = require("recompose");

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            filter: 'Sports,Lecture,Concert,Tech Talk,Game,Interview,Conference,Other',
            date: Math.floor((new Date()).setHours(0, 0, 0, 0) / 1000),
            clickedPosition: null,
            clickedAddress: '',
            user: '',
            showclickMarker: false,
        };
        this.handleCalendarChange = this.handleCalendarChange.bind(this);
        this.handleSelectorChange = this.handleSelectorChange.bind(this);
        //this.onMarkerClustererClick = this.onMarkerClustererClick.bind(this);
        this.getEvents = this.getEvents.bind(this);
        this.singleClickToAddEvent = this.singleClickToAddEvent.bind(this);
        this.getAddress = this.getAddress.bind(this);
        this.closeclickMarker = this.closeclickMarker.bind(this);
        this.getEvents();
    }

    closeclickMarker() {
        this.setState({
            showclickMarker: false,
        })
    }

    getEvents() {
        fetch('/get_filtered_events/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "X-CSRFToken": Cookies.get('csrftoken'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Token " + localStorage.token,
            },
            body: JSON.stringify({
                selectedlist: this.state.filter,
                selecteddate: this.state.date,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            //console.log(responseJson);
            this.setState({
                events: responseJson.events,
                user: responseJson.user,
            });
        });
    }

    getAddress(fetchURL) {
        fetch(fetchURL, {
            method: 'GET',
        })
        .then((response) => response.json())
        .then((responseJson) => {
            // console.log(JSON.parse(JSON.stringify(responseJSON)).results[0].formatted_address);
            this.setState({
                clickedAddress: responseJson.results[0].formatted_address,
                showclickMarker: true,
            });
        });
    }

    handleCalendarChange(value) {
        // console.log(value);
        this.setState({
            date: Math.floor(value / 1000)
        }, function () {
            this.getEvents();
        })
    }

    handleSelectorChange(value) {
        this.setState({
            filter: value
        }, function () {
            this.getEvents();
        })
    }

    singleClickToAddEvent(event) {
        let latlng = JSON.parse(JSON.stringify(event.latLng));
        let lat = latlng.lat;
        let lng = latlng.lng;
        let fetchURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true`;
        this.getAddress(fetchURL);
        this.setState({
            clickedPosition: latlng
        })
    }

    render() {
        // let myEvents = this.state.events;
        let self = this;
        return (
            <div>
                <GoogleMap
                    ref={this.props.onMapMounted}
                    defaultZoom={15}
                    center={this.props.center}
                    onBoundsChanged={this.props.onBoundsChanged}
                    defaultCenter={this.props.cmuPosition}
                    onRightClick={this.singleClickToAddEvent}
                >
                    <MultiSelectField selectedList={this.handleSelectorChange}/>
                    <DateSelect selectedDate={this.handleCalendarChange}/>
                    <SearchBox
                        ref={this.props.onSearchBoxMounted}
                        bounds={this.props.bounds}
                        controlPosition={google.maps.ControlPosition.TOP_LEFT}
                        onPlacesChanged={this.props.onPlacesChanged}
                        showsearchMarker={this.showsearchMarker}
                    >
                        <input
                            type="text"
                            placeholder="Search place here"
                            style={{
                                boxSizing: `border-box`,
                                border: `1px solid transparent`,
                                width: `240px`,
                                height: `32px`,
                                marginTop: `27px`,
                                padding: `0 12px`,
                                borderRadius: `3px`,
                                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                                fontSize: `14px`,
                                outline: `none`,
                                textOverflow: `ellipses`,
                            }}
                        />
                    </SearchBox>
                    {this.props.markers.map(function (marker, index) {
                            // console.log(JSON.stringify(marker.position));
                            // console.log(JSON.stringify(marker.formatted_address));
                            return (<MarkerWithPopUp key={index}
                                                    position={marker.position}
                                                    address={marker.name + ', ' + marker.formatted_address}
                                                    getEvents={self.getEvents}
                                                    closeotherMarker={self.closeclickMarker}
                                                    closeMarker={self.props.closesearchMarker}
                                                    user={self.state.user}
                            />)
                        }
                    )}
                    {this.state.showclickMarker && <MarkerWithPopUp
                        position={this.state.clickedPosition}
                        address={this.state.clickedAddress}
                        getEvents={this.getEvents}
                        closeotherMarker={this.props.closesearchMarker}
                        closeMarker={this.closeclickMarker}
                        user={this.state.user}
                    />}
                    <MarkerClusterer
                        onClick={this.onMarkerClustererClick}
                        averageCenter
                        enableRetinaIcons
                        gridSize={60}
                    >
                        {this.state.events.map(function(event, index) {
                            return <MarkerWithInfoWindow key={index}
                                                  eventItem={event}
                                                  getEvents={self.getEvents}
                                                  getRecommendation={self.props.getRecommendation}
                            />
                        })}
                    </MarkerClusterer>
                </GoogleMap>
            </div>
        )
    }
}

export default withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBfdFp-fMPb8j-7c_4ROezxqsGai0b-2h8&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{height: `100%`}}/>,
    containerElement: <div style={{height: `550px`, width: `100%`}}/>,
    mapElement: <div style={{height: `100%`, width: `100%`}}/>,
    cmuPosition: {lat: 40.4428, lng: 280.057},
    markPosition: {lat: 40.4428, lng: 280.057},
})(
    lifecycle({
        componentWillMount() {
            const refs = {};
            this.setState({
                bounds: null,
                center: {
                    lat: 40.4428, lng: 280.057
                },
                markers: [],
                onMapMounted: ref => {
                    refs.map = ref;
                },
                onBoundsChanged: () => {
                    this.setState({
                        bounds: refs.map.getBounds(),
                        center: refs.map.getCenter(),
                    })
                },
                onSearchBoxMounted: ref => {
                    refs.searchBox = ref;
                },
                onPlacesChanged: () => {
                    const places = refs.searchBox.getPlaces();
                    const bounds = new google.maps.LatLngBounds();
                    //console.log(places);
                    places.forEach(place => {
                        if (place.geometry === undefined) {
                            alert("Place is undefined!");
                        } else {
                            if (place.geometry.viewport) {
                                bounds.union(place.geometry.viewport)
                            } else {
                                bounds.extend(place.geometry.location)
                            }
                        }
                    });
                    const nextMarkers = places.map(place => ({
                        position: place.geometry.location,
                        name: place.name,
                        formatted_address: place.formatted_address,
                    }));
                    const nextCenter = _.get(nextMarkers, '0.position', this.state.center);
                    // console.log(nextMarkers);
                    this.setState({
                        center: nextCenter,
                        markers: nextMarkers,
                    });
                },
                closesearchMarker: () => {
                    this.setState({
                        markers: [],
                    })
                }
            });

        },
    })(
        withScriptjs(
            withGoogleMap(Map))))
// withScriptjs(withGoogleMap(Map));
