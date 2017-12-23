import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Cookies from 'js-cookie'

const Categories = [
    { label: 'Sports', value: 'Sports' },
    { label: 'Lecture', value: 'Lecture' },
    { label: 'Concert', value: 'Concert' },
    { label: 'Tech Talk', value: 'Tech Talk' },
    { label: 'Game', value: 'Game' },
    { label: 'Interview', value: 'Interview' },
    { label: 'Conference', value: 'Conference' },
    { label: 'Other', value: 'Other' },
];

const originvalue = 'Sports,Lecture,Concert,Tech Talk,Game,Interview,Conference,Other';

export default class MultiSelectField extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            displayName: 'MultiSelectField',
            propTypes: {
                label: PropTypes.string,
            },
            value : originvalue,
        };
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    handleSelectChange (value) {
        this.setState({ value });
        //console.log(value.split(','));
        this.props.selectedList(value);
    }

    render () {
        const {stayOpen, value } = this.state;
        return (
            <div className="tags">
              <Select
                  closeOnSelect={!stayOpen}
                  multi
                  onChange={this.handleSelectChange}
                  options={Categories}
                  placeholder="Select category"
                  simpleValue
                  value={value}
              />
            </div>
        );
    }
}
