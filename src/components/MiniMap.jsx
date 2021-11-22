import React from "react";
import ReactDOM from "react-dom";

import WindowWrapper from './WindowWrapper';

import './css/minimap.css';

import grid1Background from './css/images/grid-bg2-1x.png';
import grid2Background from './css/images/grid-bg2-2x.png';
import grid4Background from './css/images/grid-bg2.png';
import blankBackground from './css/images/blank-bg.png';

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
    let svgStyle={backgroundImage: "url("+blankBackground+")", backgroundRepeat: "repeat", width: "100%", height: "100%"};

    if (this.props.showGrid==true) {
      svgStyle={backgroundImage: "url("+grid1Background+")", backgroundRepeat: "repeat", width: "100%", height: "100%"};
    }

    return (<WindowWrapper panelclass={this.props.panelclass} style={{width: "215px"}} title="MiniMap">
      <div style={{width: "200px", height: "200px"}}>
      <svg id="minimap" style={svgStyle}>
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
