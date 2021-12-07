import React from 'react';

import DataTools from '../utils/datatools';
import DOMTools from '../utils/domtools'; 

import NoteIndicator from './NoteIndicator';

import { Editor, EditorState, convertFromRaw } from 'draft-js';

import { COLORS } from '../utils/constants';

import '../css/grapheditor.css';
import '../css/panelwindow.css';

/**
 * 
 */
class GraphPanelBasic extends React.Component {
    
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
    this.DOMTools = new DOMTools ();

    this.onHandleDown = this.onHandleDown.bind(this);
  }

  /**
   * 
   */ 
  onHandleDown (e,aHandle,isDown) {
    console.log ("onHandleDown ()");

    e.preventDefault();
    e.stopPropagation();

    if (this.props.onHandleDown) {
      this.props.onHandleDown (e,aHandle,isDown);
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
    console.log ("settingsMouseUp ()");

    e.preventDefault();
    e.stopPropagation();

    if (this.props.changePanelSettings) {
      this.props.changePanelSettings (this.props.panel.uuid);
    } else {
      console.log ("Error: no method provided to propagate show panel settings event");
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
  render() {
    let base;
    let handles=[];
    let fontStyle=this.props.fontStyle;
    let color=COLORS.NODE_DEFAULT;
    let style;
    let dropdown;
    let nodeClass;
    let notesIcon;
    
    let editor;

    if (this.props.panel.content) {
      if (this.props.panel.content != "") {
        let storedState=EditorState.createWithContent (convertFromRaw(this.props.panel.content));
        editor=<Editor editorState={storedState} readOnly={true} />;
      }
    }

    let colorDefault=COLORS.NODE_DEFAULT;
    let colorSelected=COLORS.NODE_SELECTED;

    if (this.props.nodeTypes) {
      for (let i=0;i<this.props.nodeTypes.length;i++){
        let type=this.props.nodeTypes [i];
        if (type.id==this.props.panel.id) {
          if (type.color!="default") {
            colorDefault=type.color;
          }

          if (type.selected!="default") {
            colorSelected=type.selected;
          }
        }
      }
    }

    //console.log (this.props.panel);
    
    if (this.props.panel.selected==true) {
      color=colorSelected;

      if (this.props.panel.resizing==true) {
        for (let i=0;i<this.props.panel.handles.length;i++) {
          let handle=this.props.panel.handles [i];
          let handleStyle=this.dataTools.deepCopy (handle.style);

          handles.push (<rect key={handle.key} x={handle.x} y={handle.y} width={handle.width} height={handle.height} className="handle pointerall" style={handleStyle} onMouseDown={(e) => this.onHandleDown (e,handle,true)} onMouseUp={(e) => this.onHandleDown (e,handle,false)} />);
        }
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
    
    let title="Undefined";

    if (this.props.panel.name) {
      title=this.props.panel.name;
    }

    let blockWidth=""+(this.props.panel.width-24)+"";
    let settingsIcon;

    settingsIcon=<svg x={this.props.panel.width-42} y={4} width="16" height="16">
      <rect 
        x="0" 
        y="0" 
        width={16}
        height={16} 
        style={{fill:"rgb(200,200,200)", fillOpacity: "0.7", pointerEvents: "all", cursor: "pointer"}}
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
    </svg> 

    // https://yoksel.github.io/svg-filters/#/

    return (
      <svg className="pointerfix" key={this.k++} x={this.props.panel.x} y={this.props.panel.y} width={this.props.panel.width} height={this.props.panel.height} id={"group"+this.props.panel.name} filter="url(#dropshadow)">
        {base}      
        <rect 
          className="pointerfix"
          rx="2"
          x="2" 
          y="2" 
          width={this.props.panel.width-4} 
          height={20} 
          style={{fill:"rgb(200,200,200)", fillOpacity: "0.7", pointerEvents: "all", cursor: "pointer"}}>
         </rect>
        <text 
          x="4" 
          y="16" 
          fontWeight="bold" 
          fontFamily="Arial" 
          fontSize="10"
          className="pointerfix"
          style={{pointerEvents: "all", cursor: "pointer"}}>
          {this.props.panel.name}
        </text>
        <NoteIndicator notes={this.props.panel.notes} x={(this.props.panel.width-23)} y="4" editNotes={this.onNotes.bind (this)}/>
        {settingsIcon}        
        <foreignObject 
          x="2"
          y="22"
          width={this.props.panel.width-4}
          height={this.props.panel.height-24}
          className="foreignhider pointerfix">
          <div
            style={fontStyle}
            className="contentEditable pointerfix">
            {editor}
           </div>
        </foreignObject>
        {handles}
        {dropdown}
      </svg>);
  }  
}

export default GraphPanelBasic;
