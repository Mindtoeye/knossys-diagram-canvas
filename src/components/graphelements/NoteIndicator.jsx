import React from "react";
import ReactDOM from "react-dom";

import '../css/grapheditor.css';
import '../css/panelwindow.css';

/**
 *
 */
export class NoteIndicator extends React.Component {

  /**
   *
   */
  constructor(props){
    super(props);
    this.state={};
    this.defaultMouseDown=this.defaultMouseDown.bind(this);
    this.notesMouseUp=this.notesMouseUp.bind(this);
  }

  /**
   *
   */
  defaultMouseDown (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   *
   */
  notesMouseUp (e) {
    console.log ("notesMouseUp ("+e.button+")");
    console.log (e);

    e.preventDefault();
    e.stopPropagation();

    if (e.button === 0) {
      //console.log('Left click');
      if (this.props.editNotes) {
        this.props.editNotes(e);
      } else {
        console.log ("Error: no editNote prop available");
      }      
    } else if (e.button === 2) {
      console.log('Right click');
    }    
  }

  /**
   *
   */
  render () {
    let notesIndicator;

    let noteIndicator="0";
    let xfix="4";

    if (this.props.notes) {
     if (this.props.notes.length>9) {
        noteIndicator="9+";
        xfix=2;
      } else {
        noteIndicator=this.props.notes.length;
      }
    }

    return (<svg rx="2" x={(this.props.x)} y={this.props.y} width="16" height="15">
        <rect 
         rx="2"
         x="0"
         y="0"
         width="16"
         height="16"
         className="mouseover"
         onMouseDown={(e) => this.defaultMouseDown(e)}
         onMouseUp={(e) => this.notesMouseUp(e)}          
         style={{fill:"rgb(255,255,255)", fillOpacity: "0.7", pointerEvents: "all", cursor: "pointer"}}>
        </rect>
        <text 
         x={xfix}
         y="12"
         fontWeight="bold" 
         fontFamily="Arial" 
         fontSize="12"
         onMouseDown={(e) => this.defaultMouseDown(e)}
         onMouseUp={(e) => this.notesMouseUp(e)}
         style={{pointerEvents: "all", cursor: "pointer"}}>
         {noteIndicator}
        </text>    
      </svg>);    
  }
}

export default NoteIndicator;
