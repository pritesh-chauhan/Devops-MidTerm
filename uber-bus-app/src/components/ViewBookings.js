import React, {Component} from "react";

export default class ViewBookings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            students: [
                { id: 1, name: 'Wasif', source: 'Pittsburgh', destination: 'Boston', date:"" },
                { id: 2, name: 'Ali', source: 'Boston', destination: 'New York', date:"" },
                { id: 3, name: 'Saad', source: 'Boston', destination: 'Pittsburgh', date:"" },
                { id: 4, name: 'Asad', source: 'New York', destination: 'Boston', date:"" }
            ]
        }
        this.handleSearchKeyUp = this.keyUpHandler.bind();
    }

    renderTableHeader() {
        let header = Object.keys(this.state.students[0])
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    renderTableData() {
        return this.state.students.map((student, index) => {
            const { id, name, source, destination, date } = student
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{source}</td>
                    <td>{destination}</td>
                    <td>{date}</td>
                </tr>
            )
        })
    }
    keyUpHandler() {
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        table = document.getElementById("students");
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

    render() {
        return (
            <div>
                <br/><br/><br/>
                <input type="text" id="myInput" onKeyUp={this.handleSearchKeyUp} placeholder="Search for names.." title="Type in a name"/>
                <table id='students'>
                    <tbody>
                        <tr>{this.renderTableHeader()}</tr>
                        {this.renderTableData()}
                    </tbody>
                </table>
            </div>
        )
    }
}