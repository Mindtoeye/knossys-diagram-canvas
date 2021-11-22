import React from 'react';

import DataTools from './utils/datatools';

/**
 * 
 */
class DoUndoComponent extends React.Component {
    
  /**
   * 
   */  
  constructor(props) {
    super (props);

    this.dataTools=new DataTools ();

    this.updateStates=this.updateStates.bind(this);
  }

  /**
   *
   */
  init (templateData) {
    this.state.undoStack={
      index: 0,
      stack: [],
      stackMax: 100,
      liveData: null,
      templateData: templateData
    };
  }

  /**
   *
   */
  getStackDataCopy () {
    return (this.dataTools.deepCopy (this.state.undoStack));
  }

  /**
   *
   */
  resetUndo (aCallback) {
    console.log ("resetUndo ()");

    let templateData=this.dataTools.deepCopy (this.state.templateData);
    let undoStack=this.getStackDataCopy ();
    undoStack.stack=[];
    undoStack.index=0;
    undoStack.liveData=templateData;

    this.setState({
      undoStack: undoStack
    },()=>{
      if (aCallback) {
        aCallback ();
      }
    });
  }

  /**
   *
   */
  getDoUndoStack () {
    return (this.state.undoStack.stack);
  }

  /**
   *
   */
  getDoUndoStackObject () {
    return (this.state.undoStack);
  }  

  /**
   *
   */
  doUndo () {
    console.log ("doUndo ()");

    if (this.state.undoStack.index==0) {
      console.log ("Nothing to undo");
      return;
    }

    let undoStack=this.dataTools.deepCopy (this.state.undoStack);
    let index=undoStack.index;
    index--;
    if (index<0) {
      index=0;
    }

    let undoObject=undoStack.stack [undoStack.index];
    undoStack.index=index;

    this.setState({
      undoStack: undoStack
    },(e)=>{
      if (this.props.setGraphData) {
        this.props.setGraphData (undoObject.value);
      }
      this.restoreSelected ();
      this.updateStates ();      
    });    

    /*
    if (this.state.undoStack.stack.length==0) {
      console.log ("Nothing to undo");
      return;
    }

    var undoStack=this.dataTools.deepCopy (this.state.undoStack);
    var undoObject=undoStack.stack [undoStack.stack.length-1];
    var poppedGraph=undoObject.value;
    var updatedStack=this.dataTools.popElement (undoStack.stack);

    if (updatedStack.length>0) {
      undoStack.liveData = poppedGraph;
      undoStack.index=updatedStack.length-1;
      this.setState({
        undoStack: undoStack
      },(e)=>{
        this.restoreSelected ();
        this.updateStates ();
        if (this.props.setGraphData) {
          this.props.setGraphData (poppedGraph);
        }
      });
    } else {
      if (poppedGraph!=null) {
        undoStack.stack=[];
        undoStack.index=0;
        undoStack.liveData=poppedGraph;
        this.setState({
          undoStack: undoStack,
        },(e)=>{
          this.restoreSelected ();
          this.updateStates ();
          if (this.props.setGraphData) {
            this.props.setGraphData (poppedGraph);
          }          
        });
      } else {
        undoStack.stack=[];
        undoStack.index=0;
        undoStack.liveData=undoStack.templateData;
        this.setState({
          undoStack: undoStack
        },(e)=> {
          this.restoreSelected();
          this.updateStates ();
          if (this.props.setGraphData) {
            this.props.setGraphData (templateData);
          }
        });     
      }
    }
    */    
  }

  /**
   *
   */
  doRedo () {
    console.log ("doRedo ()");

    if (this.state.undoStack.index==(this.state.undoStack.stack.length-1)) {
      console.log ("Nothing to redo");
      return;
    }

    let undoStack=this.dataTools.deepCopy (this.state.undoStack);
    undoStack.index++;
    if (this.state.undoStack.index>=(this.state.undoStack.stack.length-1)) {
      this.state.undoStack.index=(this.state.undoStack.stack.length-1);
    }
    let undoObject=undoStack.stack [undoStack.index];

    this.setState({
      undoStack: undoStack
    },(e)=>{
      this.restoreSelected ();
      this.updateStates ();
      if (this.props.setGraphData) {
        this.props.setGraphData (undoObject.value);
      }
    });      

    this.updateStates ();
  }

  /**
   * Restore any selections that were made in the graph we just popped 
   */
  restoreSelected () {
    if (this.props.getGraphData) {
      let testGraph=this.props.getGraphData ();

      for (var i=0;i<testGraph.nodes.length;i++) {
        var testNode=testGraph.nodes [i];
        if (testNode.selected==true) {
          this.setState ({selected: testNode});
        }
      }      
    }
  }

  /**
   *
   */
  addUndoPoint (newGraph,aName,aCallback) {
    console.log ("addUndoPoint ("+aName+" => "+this.state.undoStack.stack.length+")");

    if (this.state.undoStack.stack.length>0) {
      // If what we want to put on the stack is the same as the most recent object then we skip
      if (this.dataTools.jsonEqual (this.state.undoStack.stack [this.state.undoStack.stack.length-1].value,newGraph)==true) {
        console.log ("Nothing new (new state is identical to old state), bump");
        return;
      }
    }

    var newUndoStack=this.dataTools.deepCopy (this.state.undoStack);
    var newElement={"key": aName,"value": newGraph};

    //console.log ("Previous undo point" + JSON.stringify (newUndoStack.stack [newUndoStack.stack.length-1]));
    //console.log ("New undo point" + JSON.stringify (newElement));
   
    // Remove the end of the list in case we did a undo first    
    let removalIndex=newUndoStack.index+1;
    if (removalIndex<(newUndoStack.stack.length-1)) {
      newUndoStack.stack.splice (removalIndex,newUndoStack.stack.length-removalIndex);  
    }
    
    newUndoStack.stack.push (newElement);
    newUndoStack.index=newUndoStack.stack.length-1;

    if (this.props.setGraphData) {
      this.props.setGraphData (newGraph,()=>{
        this.setState({
          undoStack: newUndoStack
        },()=>{
          this.updateStates ();

          /*
          if (this.state.undoStack.stack.length>=this.state.undoStack.stackMax) {
            var reducedUndoStack=this.dataTools.deepCopy (this.state.undoStack);
            reducedUndoStack.stack.splice(0, 1);
            this.setState ({undoStack: reducedUndoStack});
          }
          */

          if (aCallback) {
            aCallback ();
          }    
        });      
      });
    } else {
      console.log ("Internal error: can't propagate new data to owner!");
    }
  }

  /**
   *
   */
  updateStates () {
    if (this.props.showStack) {
      if (this.props.showStack==true) {
        this.refs ["undowindow"].scrollStackToBottom ();
      }
    }

    if (this.props.updateUndoRedo) {
      this.props.updateUndoRedo ();
    }
  }
}

export default DoUndoComponent;
