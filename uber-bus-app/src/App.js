import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import logo from './static/bus.png';
import Home from "./components/HomePage"; 
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ViewBookings from './components/ViewBookings';
import ManageBookings from './components/ManageBookings';

// var logo = require("./static/bus.png");
function App() {
  return (<Router>
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <Link className="nav-link" to={"/home"}><img  src="static/bus.png" alt="" width='50px' height='50px'/> </Link>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/manage-bookings"}>Manage Bookings</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/view-bookings"}>View Bookings</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/home"}>Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/sign-in"}>Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/sign-in"}>Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Switch>
        <Route exact path='/' component={Login} />
        <Route path="/view-bookings" component={ViewBookings} />
        <Route path="/manage-bookings" component={ManageBookings} />
        <Route path="/home" component={Home} />
        <Route path="/sign-in" component={Login} />
        <Route path="/sign-up" component={SignUp} />
      </Switch>
    </div></Router>
  );
}

export default App;