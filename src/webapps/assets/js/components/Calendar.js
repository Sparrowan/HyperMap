import React from 'react';
import Calendar from 'react-calendar';

export default class DateSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            date: event
        });
        this.props.selectedDate(event);
    }

    render() {
        return (
            <div className="main-page-calendar" >
              <Calendar
                  language="en_US"
                  className="calendar"
                  value={this.state.date}
                  onClickDay={this.handleChange}
              />
            </div>
        );
    }
}
