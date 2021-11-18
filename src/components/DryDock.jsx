import React, { Component } from 'react';

import KDrydockWindow from './KDrydockWindow';
import KDiagramEditor from './KDiagramEditor';

import '../../css/main.css';
import '../../css/drydock.css';

/**
 * 
 */
class DryDock extends Component {

  /**
   *
   */
  constructor(props) {
    super(props);
  }

  /**
   *
   */
  render() {
    return (
      <div className="fauxdesktop">
        <div className="fauxwm">

        <div className="drydockpanel">
          <p>Use the following keys to show and test the various window manager features</p>
          <p>  d: show modal dialog</p>
          <p>  s: show modeless dialog</p>          
          <p>  t: show tool window</p>          
          <p>  w: add generic window</p>
          <p>  a: add application</p>
          <p>  b: add basic application</p>
          <p>  c: show confirm modal dialog</p>
        </div>
        
        <KDrydockWindow x="50" y="50" width="600" height="600">
          <KDiagramEditor />
        </KDrydockWindow>

      </div>        
      </div>
    );
  }
}

export default DryDock;
