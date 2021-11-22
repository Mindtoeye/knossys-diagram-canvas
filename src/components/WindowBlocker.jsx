import React from "react";
import ReactDOM from "react-dom";

import './css/windowcontroller.css';

window.appBlocked=false;

/**
 *
 */
class WindowController extends React.Component {

  /**
   *
   */
  constructor(props){
    super(props); 
  }

  /**
   *
   */
  render () {
  	let windowSettings=this.props.windowSettings;

    if (this.props.blocking) {
      if (this.props.blocking=="true") {
        window.appBlocked=true;
        return (<div className="blocker" style={{visibility: "visible"}}></div>);
      } else {
        return (<div className="blocker" style={{visibility: "hidden"}}></div>);    
      }
    } else {
      if (windowSettings.blocking==true) {
        window.appBlocked=true;
        return (<div className="blocker" style={{visibility: "visible"}}></div>);
      }      
    }

    return (<div className="blocker" style={{visibility: "hidden"}}></div>);
  }
}

export default WindowController;
