import React from 'react'
import Cookies from 'js-cookie'
import RecommendationItem from './RecommendationItem'

export default class Recommendation extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            events: [],
        }
        this.getRecommendation = this.getRecommendation.bind(this);
        this.getRecommendation();
    }

    getRecommendation() {
        fetch('/get_recommendation_events/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                "X-CSRFToken": Cookies.get('csrftoken'),
                'Accept': 'application/json',
                "Authorization": "Token " + localStorage.token,
            },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.hasOwnProperty('error')) {
                alert(responseJson.error);
            } else {
                this.setState({
                    events: responseJson.events,
                });
            }
        })
    }

    render() {
        return (
            <div>
                {this.state.events.length === 0 ? null :
                    <div className="recommendation-style my-detail">
                        <div className="my-detail">
                            <div>
                                <h5>See what's going on..</h5>
                            </div>
                            {this.state.events.map((event) =>
                                <RecommendationItem
                                    item={event}
                                    key={event.name}
                                    getRecommendation={this.getRecommendation}
                                />
                            )}
                        </div>
                    </div>
                }
            </div>
        );
    }
}
