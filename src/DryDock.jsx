import React, { Component } from 'react';

import KDrydockWindow from './KDrydockWindow';

import KPipelineEditor from './components/KPipelineEditor';
import PipelineFactory from './PipelineFactory';

import '../css/main.css';
import '../css/drydock.css';

/**
 * 
 */
class DryDock extends Component {

  /**
   *
   */
  constructor(props) {
    super(props);

    this.pipelineFactory=new PipelineFactory ();

    this.onKeyDown=this.onKeyDown.bind (this);
  }

  /**
   *
   */
  onKeyDown (e) {
    console.log ("onKeyDown ("+e.keyCode+")");

    // 'l'
    if(e.keyCode==65) {
      console.log ("Adding node");
      return;
    }    
  }  
  /**
   *
   */
  render() {
    return (
      <div tabIndex="0" className="fauxdesktop" onKeyDown={this.onKeyDown}>
        <div className="fauxwm">

        <div className="drydockpanel">
          <p>Use the following keys to show and test the various graph editor functions</p>
          <p>  a: Add node</p>
        </div>
        
        <KDrydockWindow x="50" y="50" width="884" height="700">
          <KPipelineEditor factory={this.pipelineFactory} />
        </KDrydockWindow>

      </div>        
      </div>
    );
  }
}

export default DryDock;
