import React, { Component} from "react";
import { NavigationBar } from '../../common';

class NewEntryComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
          test: ""
        };
    }

    componentDidUpdate() {
        console.log("Home Widget mounted");
    }

    render() {
        return(
            <React.Fragment>
                <NavigationBar showControls={true} selectedService={2}/>
                <h1>This is the new entry widget mounted</h1>
                <hr/>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </React.Fragment>   
            
        )
    }
}

export default NewEntryComponent;