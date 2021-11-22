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
    e.preventDefault();
    e.stopPropagation();

    if (this.props.editNotes) {
      this.props.editNotes(e);
    } else {
      console.log ("Error: no editNote prop available");
    }    
  }

  /**
   *
   */
  render () {
    let notesIndicator;

    let noteIndicator="0";

    if (this.props.notes) {
     if (this.props.notes.length>9) {
        noteIndicator="9+";
      } else {
        noteIndicator=this.props.notes.length;
      }
    }

    return (<svg rx="2" x={(this.props.x)} y={this.props.y} width="20" height="15">
        <rect 
         rx="2"
         x="0"
         y="0"
         width="20"
         height="15"
         className="mouseover"
         onMouseDown={this.defaultMouseDown.bind (this)}
         onMouseUp={this.notesMouseUp.bind (this)}          
         style={{fill:"rgb(255,255,255)", fillOpacity: "0.7", pointerEvents: "all", cursor: "pointer"}}>
        </rect>
        <text 
         x="6"
         y="12"
         fontWeight="bold" 
         fontFamily="Arial" 
         fontSize="12"
         onMouseDown={this.defaultMouseDown.bind (this)}
         onMouseUp={this.notesMouseUp.bind (this)}                   
         style={{pointerEvents: "all", cursor: "pointer"}}>
         {noteIndicator}
        </text>    
      </svg>);    
  }
}

export default NoteIndicator;
