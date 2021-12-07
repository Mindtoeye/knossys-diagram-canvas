import React from 'react';

import DataTools from '../utils/datatools';

import NoteIndicator from './NoteIndicator';

import { COLORSDARK } from '../utils/constants';

import '../css/grapheditor.css';
import '../css/panelwindow.css';

import resizeImage from '../css/images/resize.png';

/**
 * 
 */
class GraphPanelModule extends React.Component {
    
  /**
   * @param {any} props
   */  
  constructor(props) {    
    super(props);
                
    this.state = {
      resizing: false,
      mXOld: -1,
      mYOld: -1,
      mX: -1,
      mY: -1
    };

    this.k = 1;

    this.dataTools = new DataTools ();

    this.onHandleDown = this.onHandleDown.bind(this);
    this.onConnectorDown = this.onConnectorDown.bind(this);
  }

  /**
   * 
   */ 
  onHandleDown (e,isDown) {
    console.log ("onHandleDown ()");

    e.preventDefault();
    e.stopPropagation();

    // This code mimics the alternative resize method using handles by pretending that
    // the resize gripper is one of the handles
    if (this.props.onHandleDown) {
      this.props.onHandleDown (e,{ 
        key: "handler-8",
        id: 8, 
        selected: true},
      isDown);
    }
  }

  /**
   * 
   */ 
  onConnectorDown (e,aConnector,isDown) {
    console.log ("onConnectorDown ()");

    e.preventDefault();
    e.stopPropagation();

    if (this.props.onConnectorDown) {
      this.props.onConnectorDown (e,aConnector,isDown);
    }
  }

  /**
   * 
   */
  defaultMouseDown (e) {
    console.log ("defaultMouseDown ()");
    e.preventDefault();
    e.stopPropagation();
  }  

  /**
   * 
   */
  settingsMouseUp (e) {
    console.log ("settingsMouseUp ("+e.button+")");

    e.preventDefault();
    e.stopPropagation();

    if (e.button === 0) {
      //console.log('Left click');
      if (this.props.changePanelSettings) {
        this.props.changePanelSettings (this.props.panel.uuid);
      } else {
        console.log ("Error: no method provided to propagate show panel settings event");
      }
    } else if (e.button === 2) {
      console.log('Right click');
    }
  }  

  /**
   * 
   */
  onNotes (e) {
    console.log ("onNotes ()");

    if (this.props.editNote) {
      this.props.editNote(this.props.panel.uuid);
    } else {
      console.log ("Error: no editNote prop available");
    }
  }    

  /**
   * 
   */
  generateConnectors (aPanel) {
    if ((aPanel.inputs.length==0) && (aPanel.outputs.length==0)) {
      return (<foreignObject x="4" y="26" width={aPanel.width-8} height={aPanel.height-30} >
        <div className="panel-error" xmlns="http://www.w3.org/1999/xhtml">
        Error: no inputs or outputs defined
        </div>
      </foreignObject>);
    }

    let connectors=[];
    let connectorKey=0;

    if (this.props.panel.inputs) {
      let yOffset=42;
      for (let i=0;i<this.props.panel.inputs.length;i++) {
        var inputObject=this.props.panel.inputs [i];
        connectors.push(<circle onMouseDown={(e) => this.onConnectorDown (e,inputObject,true)} onMouseUp={(e) => this.onConnectorDown (e,inputObject,false)} key={"conn-circle-"+connectorKey} cx="0" cy={yOffset} r="6" fill="#cccccc" stroke="#444444" />);
        connectors.push(<text key={"conn-text-"+connectorKey} x="10" y={yOffset+3} fontFamily="Arial" fontSize="10" className="pointerfix" style={{fill: "white", pointerEvents: "all", cursor: "pointer"}}>{inputObject.name}</text>);
        yOffset+=20;
        connectorKey++;
      }
    }
    
    if (this.props.panel.outputs) {
      let yOffset=42;
      for (let i=0;i<this.props.panel.outputs.length;i++) {
        var outputObject=this.props.panel.outputs [i];
        connectors.push(<circle onMouseDown={(e) => this.onConnectorDown (e,outputObject,true)} onMouseUp={(e) => this.onConnectorDown (e,outputObject,false)} key={"conn-circle-"+connectorKey} cx={this.props.panel.width} cy={yOffset} r="6" fill="#cccccc" stroke="#444444" />);
        connectors.push(<text key={"conn-text-"+connectorKey} x={this.props.panel.width-50} y={yOffset+3} fontFamily="Arial" fontSize="10" className="pointerfix" style={{fill: "white", pointerEvents: "all", cursor: "pointer"}}>{outputObject.name}</text>);
        yOffset+=20;
        connectorKey++;
      }
    }

    return (connectors);
  }

  /**
   * 
   */
  generateSettingsIcon (aPanel) {
    return (<svg x={aPanel.width-40} y={4} width="16" height="16">
      <rect 
        x="0" 
        y="0" 
        width={16}
        height={16} 
        style={{fill:"rgb(255,255,255)", fillOpacity: "0.7", pointerEvents: "all", cursor: "pointer"}}
        onMouseDown={this.defaultMouseDown.bind (this)}
        onMouseUp={this.settingsMouseUp.bind (this)}>
       </rect>
      <path 
         transform="translate(-2,-2) scale(0.8 0.8)"
         className="mouseover"
         fill="#666666"
         onMouseDown={this.defaultMouseDown.bind (this)}
         onMouseUp={this.settingsMouseUp.bind (this)}
         d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm7-7H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-1.75 9c0 .23-.02.46-.05.68l1.48 1.16c.13.11.17.3.08.45l-1.4 2.42c-.09.15-.27.21-.43.15l-1.74-.7c-.36.28-.76.51-1.18.69l-.26 1.85c-.03.17-.18.3-.35.3h-2.8c-.17 0-.32-.13-.35-.29l-.26-1.85c-.43-.18-.82-.41-1.18-.69l-1.74.7c-.16.06-.34 0-.43-.15l-1.4-2.42c-.09-.15-.05-.34.08-.45l1.48-1.16c-.03-.23-.05-.46-.05-.69 0-.23.02-.46.05-.68l-1.48-1.16c-.13-.11-.17-.3-.08-.45l1.4-2.42c.09-.15.27-.21.43-.15l1.74.7c.36-.28.76-.51 1.18-.69l.26-1.85c.03-.17.18-.3.35-.3h2.8c.17 0 .32.13.35.29l.26 1.85c.43.18.82.41 1.18.69l1.74-.7c.16-.06.34 0 .43.15l1.4 2.42c.09.15.05.34-.08.45l-1.48 1.16c.03.23.05.46.05.69z" 
        />;
    </svg>);
  }

  /**
   * https://yoksel.github.io/svg-filters/#/
   */
  render() {
    let title="Undefined";
    let base;
    let connectors;    
    let resizer;
    let handles=[];
    let fontStyle=this.props.fontStyle;
    let color=COLORSDARK.NODE_DEFAULT;
    let style;
    let nodeClass;
    let notesIcon;
    let settingsIcon;
    
    let colorDefault=COLORSDARK.NODE_DEFAULT;
    let colorSelected=COLORSDARK.NODE_SELECTED;
    
    if (this.props.panel.selected==true) {
      color=colorSelected;

      if (this.props.panel.resizing==true) {
        resizer=<image href={resizeImage} x={(this.props.panel.width-16)} y={(this.props.panel.height-16)} height="16" width="16" style={{cursor: "nwse-resize", pointerEvents: "all"}} onMouseDown={(e) => this.onHandleDown (e,true)} onMouseUp={(e) => this.onHandleDown (e,false)} />;
      }
    } else {
      color = colorDefault;
    }   

    if (this.props.panel.highlighted==true) {
      style={fill: color, strokeWidth:"1", stroke: "rgb(0,0,0)"};
    } else {
      style={fill: color};      
    }

    nodeClass=this.props.panel.class + " pointerfix";
    
    base=<rect  
       rx="2"         
       x="0" 
       y="0" 
       width={this.props.panel.width} 
       height={this.props.panel.height}
       style={style}
       className={nodeClass}>
    </rect>     
    
    if (this.props.panel.name) {
      title=this.props.panel.name;
    }

    settingsIcon=this.generateSettingsIcon (this.props.panel);

    connectors=this.generateConnectors (this.props.panel);

    return (
      <svg className="pointerfix" key={this.k++} x={this.props.panel.x} y={this.props.panel.y} width={this.props.panel.width} height={this.props.panel.height} id={"group"+this.props.panel.name} filter="url(#dropshadow)">
        {base}      
        <rect 
          className="pointerfix"
          rx="2"
          x="2" 
          y="2" 
          rx="3" 
          ry="3"
          width={this.props.panel.width-4} 
          height={20} 
          style={{fill:"rgb(0,0,0)", fillOpacity: "0.7", pointerEvents: "all", cursor: "pointer"}}>
         </rect>
        <text 
          x="8" 
          y="16" 
          fontWeight="bold" 
          fontFamily="Arial" 
          fontSize="10"
          className="pointerfix"
          style={{fill: "white", pointerEvents: "all", cursor: "pointer"}}>
          {this.props.panel.name}
        </text>
        <NoteIndicator notes={this.props.panel.notes} x={(this.props.panel.width-20)} y="4" editNotes={this.onNotes.bind (this)}/>
        {settingsIcon}
        {connectors}
        {resizer}
        {handles}
      </svg>);
  }  
}

export default GraphPanelModule;
