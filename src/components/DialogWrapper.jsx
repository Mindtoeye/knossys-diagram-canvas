import React from "react";
import ReactDOM from "react-dom";

import Draggable, {DraggableCore} from 'react-draggable';

import './css/main.css';
import './css/toolbar.css';
import './css/panelwindow.css';

import resizeImage from './css/images/resize.png';
import closeImage from './css/images/delete.png';

/**
 * 
 */
export class DialogWrapper extends React.Component {

  /**
   *
   */
  constructor(props){
    super(props);
  }

  /**
   * 
   */  
  componentDidMount() {
    console.log ("componentDidMount()");

    if (this.props.windowController) {
      console.log ("Going modal ...");
      //this.props.windowController.block ();
    }
  }
 
  /**
   *
   */
  onOk (e) {
    console.log ("onOk ()");

    if (this.props.onOk) {
      this.props.onOk ();
    }

    if (this.props.windowController) {
      this.props.windowController.unblock();
    }
  }

  /**
   *
   */
  onCancel (e) {
    console.log ("onCancel ()");

    if (this.props.onCancel) {
      this.props.onCancel ();
    }

    if (this.props.windowController) {
      this.props.windowController.unblock();
    }
  }  

  /**
   *
   */
  render () {
    let closeButton;
    let titleClass="tooltitlebar windowpanelflex0";
    let innerstyle="dialogcontainer windowpanelflex1";
    let additionalClass="windowpanel "+ this.props.panelclass;
    let controls=<div className="dialogcontrols windowpanelflex0"><button onClick={this.onOk.bind(this)}>OK</button>{this.props.buttons}</div>;

    if (this.props.innerstyle) {
      innerstyle="dialogcontainer windowpanelflex1 " + this.props.innerstyle;
    }

    if (this.props.centered) {
      if (this.props.centered==true) {
        additionalClass = additionalClass + " centered";
      } else {
        titleClass="tooltitlebar draggable windowpanelflex0";
      }
    } else {
      titleClass="tooltitlebar draggable windowpanelflex0";
    }

    if (this.props.type) {
      if (this.props.type=="OK") {
        controls=<div className="dialogcontrols"><button onClick={this.onOk.bind(this)}>OK</button>{this.props.buttons}</div>;
      }

      if (this.props.type=="CANCEL") {
        controls=<div className="dialogcontrols"><button onClick={this.onCancel.bind(this)}>Cancel</button>{this.props.buttons}</div>;
      }

      if (this.props.type=="OKCANCEL") {
        controls=<div className="dialogcontrols"><button onClick={this.onOk.bind(this)}>OK</button><button onClick={this.onCancel.bind(this)}>Cancel</button>{this.props.buttons}</div>;
      }      
    }

    if (this.props.controls) {
      controls=<div className="dialogcontrols">{this.props.controls}</div>;
    }

    closeButton=<div id="closebutton" className="closebutton" onClick={this.onCancel.bind(this)}><img onClick={this.onCancel.bind(this)} src={closeImage} /></div>

    let aStyle=this.props.style;

    if (this.props.centered==true) {
      return (<div className={additionalClass} style={aStyle}>
        <div className={titleClass}>
          {this.props.title}
          {closeButton}
        </div>
        {this.props.toolbar}
        <div className={innerstyle}>
          {this.props.children}
        </div>
        {controls} 
      </div>);
    }

    return (<Draggable handle=".tooltitlebar" defaultPosition={{x: 0, y: 0}} scale={1}>
        <div className={additionalClass} style={aStyle}>
          <div className="tooltitlebar windowpanelflex0">
            {this.props.title}
            {closeButton}
          </div>
          {this.props.toolbar}
          <div className={innerstyle}>
            {this.props.children}
          </div>
          {controls}
        </div>
      </Draggable>);
  }
}

export default DialogWrapper;
