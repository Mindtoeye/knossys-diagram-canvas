import React, { Component } from 'react';

import WindowTools from './WindowTools';

import '../../css/diagrammer.css';

/**
 *
 */
class KDiagramEditor extends Component {

  /**
   * 
   */
  constructor (props) {
    super (props);

    this.state={      
    };

    this.windowTools=new WindowTools ();    
  }

  /**
   * 
   */
  render () {
    return (<div className="kdiagrammer"> 
      {this.windowTools.generateGrid ()} 
    </div>);
  }
}

export default KDiagramEditor;
