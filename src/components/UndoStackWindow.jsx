import React from "react";
import ReactDOM from "react-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { faPenSquare } from '@fortawesome/free-solid-svg-icons'

import ToolButtonSmall from './ToolButtonSmall';
import DataTools from './utils/datatools';
import WindowWrapper from './WindowWrapper';

import './css/main.css';
import './css/toolbar.css';
import './css/panelwindow.css';

import resizeImage from './css/images/resize.png';

/**
 *
 */
export default class UndoStackWindow extends React.Component {

  /**
   *
   */
  constructor(props) {
    super(props);

    this.dataTools=new DataTools ();
  }

  /**
   *
   */
  createUndoList () {
    var list=[];
    for (var i=0;i<this.props.undoStack.stack.length;i++) {
      var undoObject=this.props.undoStack.stack [i];
      var name=undoObject.key;
      if (this.props.undoStack.index==i) {
        list.push(<li className="undoitem" key={"undoitem-"+i} style={{border: "1px solid black"}}><b>{name}</b></li>);
      } else {
        list.push(<li className="undoitem" key={"undoitem-"+i}>{name}</li>);          
      }
    }

    return (list);
  }  

  /**
   *
   */
  scrollStackToBottom () {
    if (this.props.showStack) {
      if (this.props.showStack==true) {
       this.messagesEnd.scrollIntoView({ behavior: "smooth" }); 
      }
    }    
  }    

  /**
   *
   */ 
  render () {
    let undoList=this.createUndoList ();
    return (<WindowWrapper 
      showstatus={true} 
      panelclass=""  
      title="Undo Stack" 
      status={"Current size ("+this.props.undoStack.index+"): " + this.props.undoStack.stack.length} 
      style={{minHeight: "250px", maxHeight: "350px",left: "50px", top: "50px"}}>
        <ul className="undolist">
          {undoList}
        </ul>
        <div style={{ float:"left", clear: "both" }} ref={(el) => { this.messagesEnd = el; }}>
        </div>
     </WindowWrapper>);
  }
}
