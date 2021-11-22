import React from "react";
import ReactDOM from "react-dom";

import './css/toolbar.css';

/**
 *
 */
export class ToolButtonSmall extends React.Component {

  /**
   *
   */
  constructor(props){
    super(props);
  }

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
    if (this.props.image) {
      return (<div id={this.props.id} className="tooliconsmall" role="button" aria-pressed="false" onClick={(e) => this.handleIconClicked(anId)} alt={this.props.alt} title={this.props.title}><img src={this.props.image} className="icon" /></div>)
    }
    return (<div id={this.props.id} className="tooliconsmall" role="button" aria-pressed="false" onClick={(e) => this.handleIconClicked(anId)} alt={this.props.alt} title={this.props.title}>{this.props.children}</div>);
  }
}

export default ToolButtonSmall;
