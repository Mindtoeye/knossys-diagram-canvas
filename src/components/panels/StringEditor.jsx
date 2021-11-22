import React from "react";
import ReactDOM from "react-dom";

//import { menu } from './menutexteditor';

//import { INTMODE } from '../utils/constants';

import DataTools from '../utils/datatools';
import DialogWrapper from '../DialogWrapper';

import '../css/main.css';
//import '../css/notes.css';
import '../css/panelwindow.css';
//import '../css/bubbles.css';

/**
 * The rich text example.
 * @type {Component}
 */
class StringEditor extends React.Component {

  /**
   * @param {any} props
   */  
  constructor(props) {
    super(props);

    this.state = {value: this.props.text};

    this.dataTools=new DataTools ();

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * 
   */
  handleChange(event) {    
    this.setState({value: event.target.value});  
  }

  /**
   * 
   */
  onOk () {
    console.log ("onOk ()");

    if (this.props.onNodeChange) {
      this.props.onNodeChange (this.state.value);
    }
  }

  /**
   *
   */
  onCancel () {
    console.log ("onCancel ()");

    if (this.props.onNodeChange) {
      this.props.onNodeChange (null);
    }
  }

  /**
   * @return {Element}
   */
  render() {
    let title="Window";
   
    if (this.props.title) {
      title=this.props.title;
    }

    return (
      <DialogWrapper 
        centered={true} 
        showstatus={true} 
        panelclass="" 
        title={title}
        innerstyle="whitecontent" 
        /*style={{minWidth: "350px", minHeight: "150px", maxHeight: "150px"}}*/
        style={{minWidth: "350px"}}
        type="OKCANCEL"
        onOk={this.onOk.bind(this)}
        onCancel={this.onCancel.bind(this)}
        windowController={this.props.windowController}>
        <input type="text" name="input" value={this.state.value} onChange={this.handleChange} />
      </DialogWrapper>      
    )
  }  
}

export default StringEditor;
