import React from "react";
import ReactDOM from "react-dom";

/**
 *
 */
export class VerticalBar extends React.Component {

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
    return (<div>{this.props.children}</div>);
  }
}

export default VerticalBar;
