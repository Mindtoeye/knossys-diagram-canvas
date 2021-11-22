import React from "react";
import ReactDOM from "react-dom";

import ToolbarTools from './utils/toolbartools';

import './css/toolbar.css';

/**
 *
 */
export class ToolButton extends React.Component {

  /**
   *
   */
  constructor(props){
    super(props);

    console.log ("ToolButton ()");
    console.log (props.id);

    this.toolbarTools=new ToolbarTools ();

    this.state={
      enabled: props.enabled
    };

    this.handleIconClicked = this.handleIconClicked.bind(this);
  }

  /**
   * 
   */  
  /* 
  componentWillReceiveProps(nextProps) {            
    if (typeof nextProps.enabled !== 'undefined') {
      this.setState ({enabled: nextProps.enabled}); 
    }
  }
  */

  /**
   *
   */  
  handleIconClicked (anId) {
    console.log ("handleIconClicked ("+anId+")");
    if (this.props.onButtonClick) {
      this.props.onButtonClick (anId);
    }
  }

  /**
   *
   */
  render () {
  	let anId=this.props.buttonid;
    let buttonClass="toolicon";
    let inverted=false;

    let enabled=true;

    if (this.props.hasOwnProperty ("enabled")) {
      console.log ("We have an 'enabled' property: " + this.props.enabled);
      enabled=this.props.enabled;
    }    

    if (this.props.hasOwnProperty ("inverted")) {
      if (this.props.inverted==true) {
        inverted=true;
      }
    }    

    if (enabled==false) {
      buttonClass="toolicon tool-disabled";
    } else {
      buttonClass="toolicon hoverable tool-enabled";
    }

    let face=<img src={this.props.image} className="icon" />;

    if (inverted==true) {
      face=<img src={this.props.image} className="icon iconinverted" />;
    }

    if (this.props.icon) {
      face=<i className="material-icons" style={{margin: "1px"}}>{this.props.icon}</i>

      if (inverted==true) {
        face=<i className="material-icons iconinverted" style={{margin: "1px"}}>{this.props.icon}</i>
      }
    }

    let label=<div>{this.props.title}</div>;

    if (this.props.label){
      let character = this.props.label;
      return (<div id={this.props.id} className={buttonClass} role="button" aria-pressed="false" onClick={(e) => this.handleIconClicked(anId)} alt={this.props.title} title={this.props.title}><div className="texticon">{character.toUpperCase()}</div>{label}</div>)
    }    

    if ((this.props.image) || (this.props.icon)) {
      return (<div id={this.props.id} className={buttonClass} role="button" aria-pressed="false" onClick={(e) => this.handleIconClicked(anId)} alt={this.props.title} title={this.props.title}>{face}{label}</div>)
    }

    return (<div id={this.props.id} className={buttonClass} role="button" aria-pressed="false" onClick={(e) => this.handleIconClicked(anId)} alt={this.props.title} title={this.props.title}>{this.props.children}</div>);
  }
}

export default ToolButton;
