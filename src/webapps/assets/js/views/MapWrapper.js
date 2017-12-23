import React  from 'react'
import MyMap from "../components/map/MyMap.js"

export default class MapWrapper extends React.Component {
    render(){
        return (
            <div>

                <MyMap
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBfdFp-fMPb8j-7c_4ROezxqsGai0b-2h8&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `600px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    cmuPosition={{lat: 40.4428, lng: 280.057}}
                    markPosition={{lat: 40.4428, lng: 280.057}}
                    events={[

                        {
                            title:"FootBall game1",
                            time:'2017/11/28 20:00 - 22:00',
                            intro:'this is a football game',
                            markPosition:{lat: 40.4438, lng: 280.057},
                        },

                        {
                            title:"FootBall game2",
                            time:'2017/11/28 20:00 - 22:00',
                            intro:'this is another football game',
                            markPosition:{lat: 40.4428, lng: 280.057},
                        },

                    ]}
                />


            </div>


        )
    }
}