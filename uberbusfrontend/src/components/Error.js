import { Component } from "react";
import Navbar from "./Navbar";

class Error extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        return  (
            <>
                <Navbar />
                <div className="auth-wrapper">
                    <h3 style={{color: "red"}}>
                        Page doesn't exist
                    </h3>
                </div>
            </>
        )
    }
}

export default Error