import React from "react";
import ReactDOM from "react-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { faPenSquare } from '@fortawesome/free-solid-svg-icons'

// Via: https://www.npmjs.com/package/react-contenteditable
import ContentEditable from 'react-contenteditable';

import ToolButtonSmall from './ToolButtonSmall';
import DataTools from './utils/datatools';
import GraphTools from './utils/graphtools';
import WindowWrapper from './WindowWrapper';

import './css/main.css';
import './css/toolbar.css';
import './css/panelwindow.css';
import './css/notes.css';

import resizeImage from './css/images/resize.png';

import { GRAPHTYPES } from './utils/constants';

/**
 *
 */
export default class NoteManager extends React.Component {

  /**
   *
   */
  constructor(props) {
    super(props);

    this.dataTools=new DataTools ();
    this.graphTools=new GraphTools ();

    this.state={
      value: 0,
      selectedId: ""
    };

    this.scrollStackToBottom = this.scrollStackToBottom.bind (this);
    this.onScoreChange = this.onScoreChange.bind(this);
    this.noteChange = this.noteChange.bind (this);
    this.selectNote = this.selectNote.bind (this);
    this.handleChange = this.handleChange.bind (this);
  }

  /**
   *
   */
  handleIconClicked (e) {
    console.log ("handleIconClicked ("+e+")");

    if (e==1) {
      this.addNote ();
    }

    if (e==2) {
      this.deleteNote();
    }

    if (e==3) {
      console.log ("3");
    }
  }

  /**
   *
   */
  addNote () {
    console.log ("addNote ()");

    let ref="";

    let newGraph=this.props.windowController.getGraphCopy ();

    let node=this.graphTools.getById (newGraph,this.props.node);

    if (node==null) {
      alert ("Error: can't find the object in the diagram to add a note to");
      return;
    }

    if (!node.notes) {
      node.notes=[];
    }

    var date=this.dataTools.getDateString ();

    for (let i=0;i<node.notes.length;i++) {
      node.notes [i].selected=false;
    }

    node.notes.push ({uuid: this.dataTools.uuidv4(), date: date, type: GRAPHTYPES.NOTE, text: "", ref: ref, selected: true});

    this.props.windowController.setGraphData (newGraph,(e) => {
      this.scrollStackToBottom ();
    });
  }

  /**
   *
   */
  deleteNote () {
    console.log ("deleteNote ()");

    let newGraph=this.props.windowController.getGraphCopy ();

    let node=this.graphTools.getById (newGraph,this.props.node);

    for (let i=0;i<node.notes.length;i++) {
      let note=node.notes [i];
      if (note.selected==true) {
        this.dataTools.deleteElement (node.notes,note);
        this.props.windowController.setGraphData (newGraph);
        return;
      }
    }
  }

  /**
   *
   */
  selectNote (anId) {
    console.log ("selectNote ("+anId+")");
    
    this.setState ({selectedId: anId},(e) => {
      if (this.props.selectNote) {
        this.props.selectNote (this.props.node, anId);
      }          
    });
  }

  /**
   *
   */
  noteChange (anId, aValue) {
    console.log ("noteChange ("+anId+")");
    
    let newGraph=this.props.windowController.getGraphCopy ();

    let node=this.graphTools.getById (newGraph,this.props.node);

    for (let i=0;i<node.notes.length;i++) {
      if (node.notes [i].uuid==anId) {
        node.notes [i].text=aValue;
        this.props.windowController.setGraphData (newGraph);
        return;
      }
    }
  }

  /**
   *
   */
  handleChange (evt) {
    console.log ("handleChange ("+this.state.selectedId+")");
    
    if (this.state.selectedId!="") {
      this.noteChange (this.state.selectedId,evt.target.value);
    } else {
      console.log ("Internal error: no selected id available to change note content");
    }

    //this.setState({ html: evt.target.value });
  }

  /**
   *
   */
  createNoteList () {
    let notesList=[];

    let node=this.graphTools.getById (this.props.graph,this.props.node);

    if (node==null) {
      return notesList;
    }

    for (let i=0;i<node.notes.length;i++) {
      let note=node.notes [i];
      let bubbleClass="talk-bubble tri-right left-in";
      if (note.selected==true) {
        bubbleClass="talk-bubble-selected tri-right left-in selected";
      }

      let ref="";
      if (i==(node.notes.length-1)) {
        ref="last";
      }
      notesList.push (<div ref={ref} key={note.uuid} className={bubbleClass} onClick={(e) => this.selectNote (note.uuid)} >
       <ContentEditable
          ref={note.uuid} 
          id={note.uuid}
          className="notewrapper"
          html={note.text}
          onChange={this.handleChange}
        />
        <div className="datelabel">
          {note.date}
        </div>
      </div>);
    }

    return (notesList);
  }  

  /**
   *
   */
  onScoreChange (e) {
    //console.log ("onScoreChange ("+e.target.value+")");
    let score="0";
    let test=e.target.value;
    let testValue=0;

    if (test.length>0) {
      if (parseInt (test)!=NaN) {
        testValue=parseInt (test);
        if (testValue>10) {
          console.log ("Test value is larger than 10");
          testValue=10;
        } else {
          if (testValue<0) {
            console.log ("Test value is less than 0");
            testValue=0;
          } else {
            //console.log ("Test value is in valid range: " + testValue);
          }
        }
      } else {
        console.log ("Test value is NaN");
      }

      score=""+testValue;
    } else {
      console.log ("Test value is empty");
      score="";
    }

    if (this.props.OLI) {
      let scoreValue=parseInt (score);
      let percentage=scoreValue/10;
      //console.log ("score: " + score +", scoreValue: " + scoreValue + ", percentage: " + percentage);
      this.props.OLI.sendScore ("percent",""+percentage);
    }

    /*
    this.setState ({
      value: score
    });
    */

    let newGraph=this.props.windowController.getGraphCopy ();
    
    newGraph.score=score;

    this.props.windowController.setGraphData (newGraph);
  }

  /**
   *
   */
  scrollStackToBottom () {
    this.refs ["last"].scrollIntoView({ behavior: "smooth" }); 
    this.refs ["last"].focus(); 
    //this.refs ["last"].select();
  }    

  /**
   *
   */ 
  render () {
    let notes="Notes";
    let notesLabel;
    let toolbar;
    let notesList;
    let gradeControls;

    let node=this.graphTools.getById (this.props.graph,this.props.node);

    /*
    console.log (this.props.graph);
    console.log (this.props.node);
    console.log (node);
    */

    if (node) {
      if (node.id=="graph") {
        if (node.score) {
          if (this.props.OLI) {
            if (this.props.OLI.isInInstructorMode()==true) {
              gradeControls=<div><input className="smallinput" type="text" value={this.props.graph.score} onChange={this.onScoreChange}></input>out of 10</div>;              
            }
          } else {
            gradeControls=<div><input className="smallinput" type="text" value={this.props.graph.score} onChange={this.onScoreChange}></input>out of 10</div>;
          }
        }
      }
    }

    if (!node) {
      notes=<div>Error: no notes list provided</div>;
    } else {
      notes=this.createNoteList ();
      notesLabel="Notes for: " + this.dataTools.capitalizeFLetter (node.id);

      toolbar=<div className="toolmenuhorizontal">
          <ToolButtonSmall buttonid="1" alt="New Note" title="New Note" onButtonClick={this.handleIconClicked.bind (this)}>
            <FontAwesomeIcon icon={faPlusSquare}/>
          </ToolButtonSmall>
          <ToolButtonSmall buttonid="2" alt="Delete Note" title="Delete Note" onButtonClick={this.handleIconClicked.bind (this)}>
            <FontAwesomeIcon icon={faTrashAlt}/>
          </ToolButtonSmall>
          <ToolButtonSmall buttonid="3" alt="Edit Note" title="Edit Note" onButtonClick={this.handleIconClicked.bind (this)}>
            <FontAwesomeIcon icon={faPenSquare}/>
          </ToolButtonSmall>
          {gradeControls}        
        </div>;
    }

    return (<WindowWrapper 
        onWindowClose={this.props.onWindowClose} 
        windowController={this.props.windowController} 
        showstatus={true} 
        panelclass={this.props.panelclass} 
        title={notesLabel} toolbar={toolbar} 
        style={{width: "auto", minWidth: "180px", minHeight: "250px", left: "50px", top: "50px"}}>
        {notes}
      </WindowWrapper>);
  }
}
