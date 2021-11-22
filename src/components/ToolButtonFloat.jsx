import React from "react";
import ReactDOM from "react-dom";

import './css/toolbar.css';

/**
 *
 */
export class ToolButtonFloat extends React.Component {

  /**
   *
   */
  constructor(props){
    super(props);

    this.state={
      enabled: props.enabled
    };
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
    if (this.props.onButtonClick) {
      this.props.onButtonClick (anId);
    }
  }

  /**
   *
   */
  render () {
  	var anId=this.props.buttonid;
    var buttonClass="tooliconfloat";

    if (this.state.enabled==false) {
      buttonClass="tooliconfloat tool-disabled";
    } else {
      buttonClass="tooliconfloat tooliconfloathoverable tool-enabled";
    }

    var face=<img src={this.props.image} className="icon centeredicon" />;

    if (this.props.icon) {
      face=<i className="material-icons">{this.props.icon}</i>
    }

    if ((this.props.image) || (this.props.icon)) {
      return (<div id={this.props.id} className={buttonClass} style={{"top": this.props.top, "right": this.props.right}} role="button" aria-pressed="false" onClick={(e) => this.handleIconClicked(anId)} alt={this.props.alt} title={this.props.title}>{face}</div>)
    }

    return (<div id={this.props.id} className={buttonClass} style={{"top": this.props.top, "right": this.props.right}} role="button" aria-pressed="false" onClick={(e) => this.handleIconClicked(anId)} alt={this.props.alt} title={this.props.title}>{this.props.children}</div>);
  }
}

export default ToolButtonFloat;
