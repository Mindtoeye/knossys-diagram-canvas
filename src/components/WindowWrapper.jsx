import React from "react";
import ReactDOM from "react-dom";

import Draggable, {DraggableCore} from 'react-draggable';

import HorizontalBar from './controls/HorizontalBar';

import DataTools from './utils/datatools';

import './css/main.css';
import './css/toolbar.css';
import './css/panelwindow.css';

import resizeImage from './css/images/resize.png';
import closeImage from './css/images/delete.png';

/**
 * https://stackoverflow.com/questions/20926551/recommended-way-of-making-react-component-div-draggable
 */
export class WindowWrapper extends React.Component {

  /**
   *
   */
  constructor(props){
    super(props);

    this.dataTools=new DataTools ();
    this.windowId=this.dataTools.uuidv4();

    this.state={
      elementId: this.dataTools.uuidv4(),
      currentResizerId: this.dataTools.uuidv4(),
      minimum_size: 20,
      original_width: 0,
      original_height: 0,
      original_mouse_x: 0,
      original_mouse_y: 0,
      original_x: 0,
      original_y: 0
    };

    this.onClose=this.onClose.bind(this);
    this.resizeStart=this.resizeStart.bind(this);
    this.resize=this.resize.bind(this);
    this.stopResize=this.stopResize.bind(this);
  }

  /**
   *
   */
  componentDidMount() {
    console.log ("componentDidMount()");
    
    let currentResizer = document.getElementById (this.state.currentResizerId);
    
    // this is legit since some windows that are not dialogs should not be
    // resizable
    if (currentResizer!=null) {
      currentResizer.addEventListener('mousedown', this.resizeStart);
    }
  }

  /**
   *
   */
  onClose (e) {
    console.log ("onClose ()");

    if (this.props.onWindowClose) {
      this.props.onWindowClose ();
    }

    if (this.props.windowController) {      
      this.props.windowController.unblock();
      this.props.windowController.onClose(this.windowId);
    }
  }

  /**
   *
   */
  resizeStart (e) {
    console.log ("resizeStart ()");

    e.preventDefault();

    let element=document.getElementById (this.state.elementId);

    let original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
    let original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
    let original_x = element.getBoundingClientRect().left;
    let original_y = element.getBoundingClientRect().top;
    let original_mouse_x = e.pageX;
    let original_mouse_y = e.pageY;
    
    this.setState ({
      original_width: original_width,
      original_height: original_height,
      original_mouse_x: original_mouse_x,
      original_mouse_y: original_mouse_y,
      original_x: original_x,
      original_y: original_y      
    },(e) => {
      window.addEventListener('mousemove', this.resize);
      window.addEventListener('mouseup', this.stopResize);      
    });
  }

  /**
   *
   */  
  resize(e) {
    console.log ("resize ()");

    let element=document.getElementById (this.state.elementId);

    const width = this.state.original_width + (e.pageX - this.state.original_mouse_x);
    const height = this.state.original_height + (e.pageY - this.state.original_mouse_y)

    if (width > this.state.minimum_size) {
      element.style.width = width + 'px'
    }

    if (height > this.state.minimum_size) {
      element.style.height = height + 'px'
    }
  }

  /**
   *
   */    
  stopResize() {
    console.log ("stopResize ()");
    window.removeEventListener('mousemove', this.resize);
  }  

  /**
   *
   */
  render () {
    let closeButton;
    let statusbar;
    let dialogcontrols;
    let innerstyle="notecontainer";
    let additionalClass="windowpanel " + this.props.panelclass;

    if (this.props.controls) {
      dialogcontrols=<HorizontalBar centered={true}>{this.props.controls}</HorizontalBar>;
    }

    if (this.props.innerstyle) {
      innerstyle="notecontainer " + this.props.innerstyle;
    }

    let showstatus=true;

    if (this.props.centered) {
      if (this.props.centered==true) {
        additionalClass = additionalClass + " centered";
        showstatus=false;
      }
    }

    if (this.props.showstatus) {
      if ((this.props.showstatus==true) && (showstatus==true)) {
        statusbar=<div className="slimstatusbar"><div className="slimstatusbartext">{this.props.status}</div><img id={this.state.currentResizerId} className="resizegripper" src={resizeImage}/></div>;
        additionalClass="windowpanel " + this.props.panelclass;
      }
    }

    closeButton=<div id="closebutton" className="closebutton" onClick={this.onClose}><img src={closeImage} /></div>

    let aStyle=this.props.style;

    return (<Draggable handle=".tooltitlebar" defaultPosition={{x: 0, y: 0}} scale={1}>
        <div id={this.state.elementId} ref={this.windowId} className={additionalClass} style={aStyle}>
          <div className="tooltitlebar draggable">{this.props.title}</div>
          {this.props.toolbar}
          <div className={innerstyle}>
            {this.props.children}
            {closeButton}
          </div>
          {dialogcontrols}
          {statusbar}
        </div>
      </Draggable>);
  }
}

export default WindowWrapper;
