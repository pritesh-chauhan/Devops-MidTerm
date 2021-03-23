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
            success: "",
            present: false
        }
        this.handleSearchKeyUp = this.keyUpHandler.bind();
        this.deleteBooking = this.deleteBooking.bind(this);
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
                        message: res.data["message"],
                        present: false
                    });
                } else {
                    console.log(this.state.bookings)
                    this.setState({
                        success: res.data["message"]
                    });
                    this.props.history.push('/home');
                }
            } else{
                this.setState({
                    message: "",
                    present: false
                });
            }
        });
    }

    keyUpHandler() {
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        table = document.getElementById("bookings");
        tr = table.getElementsByTagName("tr");
        console.log(tr);
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
                if(res.data === null){
                    console.log('Test1')
                    this.setState({
                        message: '',
                        present: false
                    });
                }
                 else if (res.data["message"] === "No bookings found") {
                    console.log('Test1')
                    this.setState({
                        message: res.data["message"],
                        present: false
                    });
                } else {
                    this.setState({
                        message: 'Data Present',
                        bookings: res.data,
                        present: true
                    })
                }
            } else{
                console.log('Test2')
                this.setState({
                    message: '',
                    present: false
                });
            }
        })
    }

    render() {
        return (
            
            <>
                <Navbar />
            <div>
                <br /><br /><br />
                {/* <table id="bookings1" hidden={this.state.present}><tr>No bookings available</tr></table> */}
                <input type="text" id="myInput" onKeyUp={this.handleSearchKeyUp} placeholder="Search for names.." title="Type in a operator name"/>
                {this.state.success !== '' && <span className='success'>{this.state.success}</span>}

                <table id='bookings' hidden={!this.state.present}>
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
                                <td key = {this.state.bookings[index]["operator"]} value= {this.state.bookings[index]["operator"]}>{this.state.bookings[index]["operator"]}</td>
                                <td>{this.state.bookings[index]["source"]}</td>
                                <td>{this.state.bookings[index]["destination"]}</td>
                                <td>{this.state.bookings[index]["date"].substring(0, 10)}</td>
                                <td><button value={this.state.bookings[index]["operator"] + "," + this.state.bookings[index]["source"] + "," + this.state.bookings[index]["destination"] + "," + this.state.bookings[index]["date"]} onClick={this.deleteBooking}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </>
        )
    }
}