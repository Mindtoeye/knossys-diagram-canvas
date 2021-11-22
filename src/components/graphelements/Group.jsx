import React from "react";
import ReactDOM from "react-dom";

import NoteIndicator from './NoteIndicator';

import { MOUSEBUTTON } from '../utils/constants';
import { INTMODE } from '../utils/constants';
import { PANELDEFS } from '../utils/constants';
import { GRAPHTYPES } from '../utils/constants';
import { GRAPHICSCONSTS } from '../utils/constants';

/**
 *
 */
export class Group extends React.Component {

  /**
   *
   */
  constructor(props){
    super(props);

    this.clickDelta=Date.now();

    this.state={
      group: this.props.group
    }

    //this.editNote = this.editNote.bind(this);
  }

  /**
   *
   */
  onNotes (e) {
    console.log ("Group:onNotes ()");

    if (this.props.editNote) {
      this.props.editNote (this.props.group.uuid);
    }
  }

  /**
   *
   */
  render () {
    let group=this.props.group;

    let stroke="grey";
    let fill="#ffffbc";
    let notesIcon;

    if (group.selected==true) {
      fill="gold";
    } else {
      if (group.highlighted==true) {
        stroke="black";
      }
    }

    /*
    if ((group.selected==true) || (group.highlighted==true)) {
      let notesPlacement="translate("+(group.width+(GRAPHICSCONSTS.GROUPBORDER*2)-20)+",0) scale(0.8 0.8)";
      notesIcon=<path onMouseUp={this.editNote} transform={notesPlacement} fill="#666666" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z" />;
    }
    */

    return (<svg rx="2" key={("group-"+this.props.propKey)} x={group.x-GRAPHICSCONSTS.GROUPBORDER} y={group.y-GRAPHICSCONSTS.GROUPBORDER-10} width={group.width+(GRAPHICSCONSTS.GROUPBORDER*2)} height={group.height+(GRAPHICSCONSTS.GROUPBORDER*2)}>      
        <rect width={group.width+(GRAPHICSCONSTS.GROUPBORDER*2)} height={group.height+(GRAPHICSCONSTS.GROUPBORDER*2)} stroke={stroke} fillOpacity="0.9" fill={fill} strokeOpacity="0.5" style={{cursor: "pointer"}} />
        <rect 
         rx="2"
         x="2" 
         y="2" 
         width={group.width+(GRAPHICSCONSTS.GROUPBORDER*2)-4} 
         height={20} 
         style={{fill:"rgb(226, 224, 224)", fillOpacity: "0.7", pointerEvents: "all", cursor: "pointer"}}>
        </rect>
        <text 
         x="4" 
         y="16" 
         fontWeight="bold" 
         fontFamily="Arial" 
         fontSize="10"
         style={{pointerEvents: "all", cursor: "pointer"}}>
         Linked
        </text>      
        <NoteIndicator notes={group.notes} x={(group.width+GRAPHICSCONSTS.GROUPBORDER-4)} y="4" editNotes={this.onNotes.bind (this)} />
      </svg>);    
  }
}

export default Group;
