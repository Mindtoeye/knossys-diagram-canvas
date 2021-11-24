import React from "react";
import ReactDOM from "react-dom";

import WindowWrapper from './WindowWrapper';

import './css/minimap.css';

/**
 *
 */
export class MiniMap extends React.Component {

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
    let svgStyle;

    return (<WindowWrapper panelclass={this.props.panelclass} style={{width: "215px"}} title="MiniMap">
      <div style={{width: "200px", height: "200px"}}>
      <svg id="minimap">
        <defs>
          <marker id="arrow" markerWidth="7" markerHeight="7" refX="0" refY="2" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,2 z" fill="#feb645" />
          </marker>
        </defs>
      </svg>
      </div>
      </WindowWrapper>);
  }
}

export default MiniMap;
