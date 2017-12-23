import React from 'react'
import GroupListItem from "./GroupListItem";
import Cookies from 'js-cookie'

export default class GroupList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groups:[],
            groupNumber :-1
        }
        this.getGroups = this.getGroups.bind(this);
        this.getGroups();
    }

    getGroups() {
        fetch('/get_groups/', {
            method: "GET",
            credentials: 'include',
            headers: {
                "X-CSRFToken": Cookies.get('csrftoken'),
                'Accept': 'application/json',
                "Authorization": "Token "+ localStorage.token,
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    groups: responseJson.groups,
                    groupNumber : responseJson.groups.length
                });
            })
    }

    render() {
        return (
            <div className="table-groups">

                {this.state.groupNumber === 0 ? <div className="no-matched-message">Oops! You don't have any groups : (</div> :

                    <table>
                        <tbody>
                        <tr>
                            <td>Group Name</td>
                            <td>Group Founder</td>
                            <td>Member Number</td>
                            <td>Options</td>
                        </tr>
                        {
                            this.state.groups.map((groupItem, index) => {
                                return (
                                    <GroupListItem key={index}
                                                   groupItem={groupItem}
                                                   getGroups={this.getGroups}
                                    />
                                )
                            })
                        }
                        </tbody>
                    </table>
                }
            </div>
        );
    }
}
