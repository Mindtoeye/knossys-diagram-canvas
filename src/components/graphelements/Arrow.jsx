import React from "react";
import ReactDOM from "react-dom";

import { INTMODE, COLORS } from '../utils/constants';

import NoteIndicator from './NoteIndicator';

import '../css/grapheditor.css';

/**
 *
 */
export class Arrow extends React.Component {

  /**
   *
   */
  constructor(props){
    super(props);

    this.clickDelta=Date.now();

    this.state={
      edge: this.props.edge
    }

    this.onEdgeDoubleClick=this.onEdgeDoubleClick.bind(this);
    //this.editNote=this.editNote.bind(this);
  }

  /**
   *
   */  
  selectArrowDown (e) {
    console.log ("selectArrowDown ()");

    e.stopPropagation();
  }

  /**
   *
   */  
  selectArrowUp (e) {
    console.log ("selectArrowUp ()");

    e.stopPropagation();

    if (this.props.selectArrow) {
      this.props.selectArrow (this.state.edge.uuid);
    }    
  }

  /**
   *
   */
  arrowIn (e) {
    if (this.props.highlightArrow) {
      this.props.highlightArrow (this.state.edge.uuid);
    } else {
      console.log ("Internal error: no arrow-in method defined");
    }

    e.stopPropagation();
  }

  /**
   *
   */
  arrowOut (e) {
    if (this.props.unhighlightArrow) {
      this.props.unhighlightArrow (this.state.edge.uuid);
    } else {
      console.log ("Internal error: no arrow-out method defined");
    }

    e.stopPropagation();
  }

  /**
   *
   */
  getTextWidth(text, font) {
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
  }

  /**
   *
   */
  onEdgeDoubleClick () {
    console.log ("onEdgeDoubleClick()");

    if (this.props.editArrow!=null) {
      this.props.editArrow(this.state.edge.uuid);
    } else {
      console.log ("Info: no edge edit function provided");
    }
  }

  /**
   *
   */
  onMouseDown (e) {
    console.log ("Arrow: onMouseDown()");

    e.preventDefault();
    e.stopPropagation();

    let timestamp=Date.now();
    let delta=timestamp-this.clickDelta;
    this.clickDelta=timestamp;

    if ((delta>=150) && (delta<400)) {
      this.onEdgeDoubleClick (e);
      return;
    }
  }  

  /**
   *
   */
  onNotes (e) {
    console.log ("onNotes ()");

    if (this.props.editNote) {
      this.props.editNote (this.state.edge.uuid);
    } else {
      console.log ("No editNote handler provided");
    }
  }

  /**
   *
   */
  generateLabel () {
    let label;

    if (!this.props.edge) {
      return (label);
    }

    let labelContent=this.props.edge.content;
    let labelColor="#ffffbc";
    let notesIcon;

    if (labelContent.length>10) {
      labelContent=(labelContent.substring (0,10) + "...");
    }

    let x1=this.props.x1;
    let x2=this.props.x2;
    let y1=this.props.y1;
    let y2=this.props.y2;

    let labelWidth=100;
    let labelHeight=20;
    let x=((x2-x1)/2)+x1-(labelWidth/2);
    let y=((y2-y1)/2)+y1-(labelHeight/2);

    /*
    notesIcon=<path 
                onMouseDown={this.onNoteDown.bind(this)}
                onMouseUp={this.editNote.bind(this)}  
                transform={notesPlacement} 
                d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"
                className="edgeicon"/>  
    */
   
    if (this.props.edge.content) {
      if (this.props.edge.content!="") {
        label=<svg x={x} y={y} width={labelWidth} height={labelHeight}>
          <rect 
            rx="2"
            x={0} 
            y={0}
            width={labelWidth} 
            height={labelHeight} 
            className="edgelabel"
            onMouseDown={this.onMouseDown.bind(this)}>
           </rect>
          <text 
            x={4}
            y={14}
            onMouseDown={this.onMouseDown.bind(this)}
            fontWeight="bold" 
            fontFamily="Arial" 
            fontSize="10"
            width={labelWidth} 
            height={labelHeight} 
            style={{cursor: "pointer"}}>
            {labelContent}
          </text>
          <NoteIndicator notes={this.props.edge.notes} x={labelWidth-20} y={"3"} editNotes={this.onNotes.bind (this)} />
        </svg>
      }
    }

    return (label);
  }

  /*
  getTextWidth(text, font) {
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
  }

  getTextWidth("hello there!", "bold 12pt arial"); 

   UIManager.measure
  */

  /**
   *
   */
  render () {
    let circle;
    let color=COLORS.EDGE_DEFAULT;
    let markerEnd="url(#arrow_black)";
    let label;

    if ((this.props.nodeTypes) && (this.props.from)) {
      for (let i=0;i<this.props.nodeTypes.length;i++){
        let type=this.props.nodeTypes [i];
        if (type.id==this.props.from.id) {
          if (type.color!="default") {
            color=type.color;
            markerEnd="url(#"+type.id+")";   
          }
        }
      }
    }   

    if (this.props.edge.highlighted==true) { 
      color="#cccc00";
      markerEnd="url(#arrow_yellow)";      
    } else {
    	if (this.props.edge.selected==true) {
        color="#cccccc";
        markerEnd="url(#arrow_grey)";
    	}
    }
  
    let x1=this.props.x1;
    let x2=this.props.x2;
    let y1=this.props.y1;
    let y2=this.props.y2;

    //circle=<circle cx={((x2-x1)/2)+x1} cy={((y2-y1)/2)+y1} r="5"/>;

    if (this.props.showLabels==true) {
      label=this.generateLabel ();
    }
  
    return (<g>
      <line 
        x1={x1} 
        y1={y1} 
        x2={x2} 
        y2={y2} 
        stroke={color} 
        strokeWidth="3" 
        markerEnd={markerEnd} 
        onMouseDown={this.selectArrowDown.bind (this)} 
        onMouseUp={this.selectArrowUp.bind (this)} 
        onMouseMove={this.arrowIn.bind(this)} 
        onMouseLeave={this.arrowOut.bind(this)} />
        {circle}
        {label}
    </g>);
  }
}

export default Arrow;
