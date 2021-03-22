import { Component } from "react";
import { Link } from "react-router-dom";

class Navbar extends Component {
    render() {
        const afterLogin = (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                    <div className="container">
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                            <Link className="nav-link" to={"/home"}><img src="static/bus.png" alt="" width='50px' height='50px' /> </Link>
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to={"/view-bookings"}>View Bookings</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to={"/home"}>Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to={"/logout"}>Logout</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        )

        const beforeLogin = (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                    <div className="container">
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                            <Link className="nav-link" to={"/home"}><img src="static/bus.png" alt="" width='50px' height='50px' /> </Link>
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to={"/sign-in"}>Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        )

        return (
            <>
                {localStorage.isLoggedIn ? afterLogin : beforeLogin}
            </>
        )
    }
}

export default Navbar