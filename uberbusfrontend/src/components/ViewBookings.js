import React, { Component } from "react";
import { getbookings } from "./BookingApiCalls";
import { deletebooking } from "./BookingApiCalls";
import Navbar from "./Navbar";

export default class ViewBookings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookings: [],
            message: "",
            success: ""
        }
        this.handleSearchKeyUp = this.keyUpHandler.bind();
        this.deleteBooking = this.deleteBooking.bind(this);
        this.refreshPage = this.refreshPage.bind(this);
    }

    deleteBooking(e) {
        console.log(e.target.value);
        var data = (e.target.value);
        data = data.split(",");
        const object = {
            email: localStorage.getItem('email'),
            operator: data[0],
            source: data[1],
            destination: data[2],
            date: data[3]
        }
        console.log(object);
        deletebooking(object).then(res => {
            if (res.status === 200) {
                if (res.data["message"] === "No bookings found") {
                    this.setState({
                        message: res.data["message"]
                    });
                } else {
                    this.setState({
                        success: res.data["message"]
                    });
                    // this.props.history.push('/view-bookings');
                    this.props.history.push('/home');
                    // this.refreshPage();
                }
            }
        })
    }

    refreshPage() {
        const booking = {}
        getbookings(booking).then(res => {
            if (res.status === 200) {
                if (res.data["message"] === "No bookings found") {
                    this.setState({
                        message: res.data["message"]
                    });
                } else {
                    this.setState({
                        bookings: res.data
                    })
                }
            }
        });
    }

    keyUpHandler() {
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        table = document.getElementById("bookings");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[1];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }

    componentDidMount() {
        if (localStorage.getItem('isLoggedIn') === null) {
            this.props.history.push('/');
        }
        const booking = {}
        getbookings(booking).then(res => {
            if (res.status === 200) {
                if (res.data["message"] === "No bookings found") {
                    this.setState({
                        message: res.data["message"]
                    });
                } else {
                    this.setState({
                        bookings: res.data
                    })
                }
            }
        })
    }


    render() {
        return (
            
            <>
                <Navbar />
            <div>
                <br /><br /><br />
                <input type="text" id="myInput" onKeyUp={this.handleSearchKeyUp} placeholder="Search for names.." title="Type in a name" />
                {this.state.success !== '' && <span className='success'>{this.state.success}</span>}
                <table id='bookings'>
                    <tbody>
                        <tr>
                            <th>Sr No.</th>
                            <th>Operator</th>
                            <th>Source</th>
                            <th>Destination</th>
                            <th>Date of Journey</th>
                            <th>Actions</th>
                        </tr>
                        {Object.keys(this.state.bookings).map((booking, index) => (
                            <tr>
                                <td>{index}</td>
                                <td>{this.state.bookings[index]["operator"]}</td>
                                <td>{this.state.bookings[index]["source"]}</td>
                                <td>{this.state.bookings[index]["destination"]}</td>
                                <td>{this.state.bookings[index]["date"].substring(0, 10)}</td>
                                <td><button value={this.state.bookings[index]["operator"]+","+this.state.bookings[index]["source"]+","+this.state.bookings[index]["destination"]+","+this.state.bookings[index]["date"]} onClick={this.deleteBooking}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </>
        )
    }
}