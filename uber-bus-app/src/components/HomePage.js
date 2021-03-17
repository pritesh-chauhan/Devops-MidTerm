import React, { Component } from "react";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
const currDate = new Date();
export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            source: 'Select Source',
            destination: 'Select Destination',
            date: currDate
        };
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSourceChange = this.handleSourceChange.bind(this);
        this.handleDestinationChange = this.handleDestinationChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSourceChange(event) {
        this.setState({ source: event.target.value });
    }

    handleDateChange(value) {
        this.setState({ date: value });
    }

    handleDestinationChange(event) {
        this.setState({ destination: event.target.value });
    }

    handleSubmit(event) {
        console.log(currDate);
        console.log(this.state.date);
        if (this.state.date !== currDate && this.state.date < currDate) {
            alert("Invalid start date selection");
        } else {
            alert('Your Source is: ' + this.state.source + '\nYour Destination is: ' + this.state.destination + '\nSelected Date: ' + this.state.date);
        }
        event.preventDefault();
    }


    render() {
        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form onSubmit={this.handleSubmit}>
                        <h3>Bus Ticket Booking</h3>
                        <div className="form-group">
                            <select className="custom-select" value={this.state.source} onChange={this.handleSourceChange}>
                                <option value="destination">Select Source</option>
                                <option value="boston">Boston</option>
                                <option value="newyork">New York</option>
                                <option value="pittsburgh">Pittsburgh</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <select className="custom-select" value={this.state.destination} onChange={this.handleDestinationChange}>
                                <option value="destination">Select Destination</option>
                                <option value="boston">Boston</option>
                                <option value="newyork">New York</option>
                                <option value="pittsburgh">Pittsburgh</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <DatePicker className="custom-select" value={this.state.date} onChange={this.handleDateChange} selected={this.state.date} minDate={moment().toDate()} />
                        </div>

                        <button type="submit" className="btn btn-secondary btn-block" value="Submit">Book</button>
                    </form>
                </div>
            </div>
        );
    }
}
