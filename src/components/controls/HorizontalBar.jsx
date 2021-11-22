import React from "react";
import ReactDOM from "react-dom";

import '../css/toolbar.css';

/**
 *
 */
class HorizontalBar extends React.Component {

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
    let barclass="toolbarhorizontal";
 
    if (this.props.centered) {
      if (this.props.centered==true) {
        barclass="toolbarhorizontal toolbarcentered";
      }
    }
  
    return (<div className={barclass} style={{"flex": 0}}>{this.props.children}</div>);
  }
}

export default HorizontalBar;
