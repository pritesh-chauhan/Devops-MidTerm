import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import logo from './static/bus.png';
import Home from "./components/HomePage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Logout from './components/Logout';
import ViewBookings from './components/ViewBookings';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route exact path='/' component={Login} />
          <Route path="/view-bookings" component={ViewBookings} />
          <Route path="/home" component={Home} />
          <Route path="/sign-in" component={Login} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/logout" component={Logout} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;

