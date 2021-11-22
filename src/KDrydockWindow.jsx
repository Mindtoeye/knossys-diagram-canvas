import React, { Component } from 'react';

import '../css/drydock.css';

/**
 *
 */
class KDrydockWindow extends Component {

  /**
   * 
   */
  constructor (props) {
    super (props);

    this.state={      
    };
  }

  /**
   * 
   */
  render () {
    return (<div ref={this.refId} className="genericWindow" style={{'left' : this.props.x+'px', 'top': this.props.y+'px', 'width' : this.props.width+'px', 'height': this.props.height+'px'}}>
        <div className="title">
        Knossys Flow Diagram Editor
        </div>
        <div className="content">
        {this.props.children}
        </div>
      </div>);
  }
}

export default KDrydockWindow;
