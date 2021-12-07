/**
* Notes:
*
* SVG arrow head:
* http://jsfiddle.net/Zv57N/
*
* http://vanseodesign.com/web-design/svg-markers/
* <line x1="50" y1="50" x2="250" y2="50" stroke="#feb645" strokeWidth="2" markerEnd="url(#arrow)" />
* https://gigacore.github.io/demos/svg-stroke-dasharray-generator/
*/

import React from 'react';

import DoUndoComponent from './DoUndoComponent';

import VisualGraphTools from './utils/visualgraphtools';
import GraphTools from './utils/graphtools';
import DataTools from './utils/datatools';

import WindowWrapper from './WindowWrapper';
import MiniMap from './MiniMap';
import UndoStackWindow from './UndoStackWindow';

import GraphController from './graphelements/graphcontroller';
import Arrow from './graphelements/Arrow';
import Group from './graphelements/Group';
import GraphDrawingTools from './graphelements/GraphDrawingTools';

import './css/grapheditor.css';
import './css/undostack.css';

import zoomin from './css/images/zoom-in.png';
import zoomout from './css/images/zoom-out.png';
import reset from './css/images/reset.png';

import { MOUSEBUTTON } from './utils/constants';
import { INTMODE } from './utils/constants';
import { PANELDEFS } from './utils/constants';
import { GRAPHTYPES } from './utils/constants';
import { GRAPHICSCONSTS } from './utils/constants';

var breaker=false;

var selectRect = { 
  x1: 0,
  y2: 0,
  x2: 0,
  y2: 0
};

/**
 * 
 */
export default class GraphEditor extends DoUndoComponent {
    
  /**
   * @param {any} props
   */  
  constructor(props) {
    super(props);
    
    this.clickDelta=Date.now();

    this.edgeIndex=0;
    this.dataTools=new DataTools ();
    this.visualGraphTools=new VisualGraphTools();
    this.graphTools=new GraphTools ();  
    this.graphDrawingTools=new GraphDrawingTools ();

    this.state = {
      groupings: this.props.groupings,
      nodeTypes: this.props.nodeTypes,
      hovering: false,
      panX: 0,
      panY: 0,
      mouseXOld: 0,
      mouseYOld: 0,      
      mouseX: 0,
      mouseY: 0,
      mouseDown: false,
      mouseBlocked: false,
      panning: false,
      allowZooming: false,
      mode: INTMODE.SELECT,
      selecting: false,
      leftDown: false,
      leftBlocked: false,
      rightBlocked: false,
      status: "",
      from: null,
      to: null,
      editText: "",
      canvasScale: 1.00,
      panelResizing: false,
      panelSizingId: -1,
      panelSizingDirection: ""
    };

    // Enable undo functionality, we'll refactor this so that it doesn't rely on inheritance
    // Calling this method adds all the approprate variables to the state
    this.init (this.props.graph);

    this.selectInRect = this.selectInRect.bind (this);
    this.highlightNodes = this.highlightNodes.bind (this);
    this.highlightGroups = this.highlightGroups.bind (this); 
    this.addEdge = this.addEdge.bind (this);
    this.getGraphData = this.getGraphData.bind (this);
    this.selectGroup = this.selectGroup.bind (this);
    this.selectNode = this.selectNode.bind (this);
    this.deSelectAll = this.deSelectAll.bind (this);
    this.calculateGroupsPanels = this.calculateGroupsPanels.bind (this);
    this.blockMouse = this.blockMouse.bind (this);
    this.onMouseSingleClick = this.onMouseSingleClick.bind (this);
    this.resetGraphUpdates = this.resetGraphUpdates.bind (this);
    this.onEdgeDoubleClick = this.onEdgeDoubleClick.bind(this);
    this.onHandleDown = this.onHandleDown.bind(this);
    this.onSave = this.onSave.bind(this);
    this.toLocalX = this.toLocalX.bind(this);
    this.toLocalY = this.toLocalY.bind(this);

    /*
    this.showFeedback = this.showFeedback.bind (this);
    this.showFeedbackString = this.showFeedbackString.bind (this);
    */

    window.addEventListener('beforeunload', this.beforeunload.bind(this));

    console.log ("Starting save timer ...");
    this.saveTimer=window.setInterval (this.onSave,60*1000*10); // Every 10 minutes
  }

  /**
   *
   */
  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.beforeunload.bind(this));
  }

  /**
   *
   */
  beforeunload(e) {
    console.log ("beforeunload ()");
    this.onSave ();
  }

  /**
   *
   */
  onSave () {
    //console.log ("onSave ()");

    let strValue=JSON.stringify(this.getGraphData());

    if (this.props.permanence) {
      this.props.permanence.setValueEncoded ("graph",strValue);
    }    
  }

  /**
   *
   */  
  toLocalX (e) {
    var offsets = document.getElementById('diagrammer').getBoundingClientRect();

    return (e.pageX-offsets.left);
  }

  /**
   *
   */  
  toLocalY (e) {
    var offsets = document.getElementById('diagrammer').getBoundingClientRect();

    return (e.pageY-offsets.top);
  }  

  /**
   *
   */ 
  getGraphData () {
    return (this.props.graph);
  }

  /**
   * For some reason the graph object in props isn't always updated. Will need
   * to figure out why
   */
  getGraphCopy () {

    //return (this.dataTools.deepCopy (this.props.graph));
       
    if (this.props.getGraphCopy) {
      return (this.props.getGraphCopy ());
    }

    return (null);
  }

  /**
   * Careful with debugging this one because it's called
   * every time on mouse move events
   */
  setGraphData (aNewGraph,anUndoName,aCallback) {
    //console.log ("GraphEditor:setGraphData ()");

    if (anUndoName) {
      console.log ("GraphEditor:setGraphData ("+anUndoName+")")
      this.addUndoPoint (aNewGraph,anUndoName,aCallback);
      return;  
    }

    if (this.props.setGraphData) {
      this.props.setGraphData (aNewGraph,aCallback);
    }
  }

  /**
   *
   */
  /* 
  closeFeedbackWindow () {
    console.log ("closeFeedbackWindow ()");
    if (this.refs ["feedbackmanager"]) {
      this.refs ["feedbackmanager"].closeFeedbackWindow ();
    }
  }
  */

  /**
   *
   */
  /* 
  showFeedback (aMessage) {
    console.log ("showFeedback ()");
    if (this.refs ["feedbackmanager"]) {
      this.refs ["feedbackmanager"].showFeedback (aMessage);    
    }
  }
  */

  /**
   *
   */
  /*
  showFeedbackString (aMessage) {
    console.log ("showFeedbackString ()");
    if (this.refs ["feedbackmanager"]) {
      this.refs ["feedbackmanager"].showFeedbackString (aMessage);    
    }
  }
  */ 
  
  /**
   * Bit of a roundabout way of doing things. We'll have to simplify this
   */
  setMode (aMode) {
    console.log ("setMode ("+aMode+")");

    this.setState ({mode: aMode},(e) => {
      if (this.state.mode==INTMODE.PAN) {
        this.setState ({panning: true});
        this.deSelectAll ();
      }

      if (this.state.mode==INTMODE.SELECT) {
        this.deSelectAll ();
      }
      
      if ((this.state.mode==INTMODE.LINK_BLACK) || (this.state.mode==INTMODE.LINK_RED) || (this.state.mode==INTMODE.LINK_BLUE)) {
        this.deSelectAll ();
      }            
    });
  }

  /**
   *
   */
  blockMouse (aValue) {
    console.log ("blockMouse ("+aValue+")");

    this.setState ({mouseBlocked: aValue}, (e) => {
      if (this.props.blockMouse) {
        this.props.blockMouse (aValue);
      }      
    });
  }
  
  /**
   *
   */
  selectGroup (aGroupId, aGraph) {
    //console.log ("selectGroup ("+aGroupId+")");

    //this.addUndoPoint ("Select Group"); 

    for (var i=0;i < aGraph.groups.length; i++) {
      var aGroup=aGraph.groups [i];
      aGroup.selected=false;
      if (aGroup.uuid==aGroupId) {
        aGroup.selected=true;
      }
    }

    return (aGraph);    
  }

  /**
   *
   */
  selectNode (aNodeId, newGraph, shouldResize) {
    console.log ("selectNode ("+aNodeId+")");

    //this.addUndoPoint ("Select Node"); 

    for (var i=0;i < newGraph.nodes.length; i++) {
      var aNode=newGraph.nodes [i];
      aNode.selected=false;
      if (aNode.uuid==aNodeId) {
        aNode.selected=true;
        aNode.resizing=shouldResize;
        let handles=this.graphDrawingTools.createHandles (aNode,false);
        aNode.handles=handles;

        // Re-order the nodes so that the newly selected node is at the top
        // and rendered last. We need to do this because we can resize nodes
        // now and that allows for overlap

        this.dataTools.deleteElement (newGraph.nodes,aNode);

        newGraph.nodes.push(aNode);
      }
    }

    return (newGraph);    
  }

  /**
   *
   */
  selectArrow (uuid) {
    console.log ("selectArrow ("+uuid+")");

    //this.addUndoPoint ("Select Arrow"); 

    if ((this.state.mode==INTMODE.LINK_BLACK) || (this.state.mode==INTMODE.LINK_RED) || (this.state.mode==INTMODE.LINK_BLUE)) {
      let toEdge=this.graphTools.getEdgeById (this.getGraphData(),uuid);
      if (toEdge!=null) {
        this.addEdge (this.state.from,toEdge,GRAPHTYPES.EDGE);
        this.setState({
          leftDown: false
        });
      } else {
        console.log ("Internal error: unable to find to Edge for uuid: " + uuid);
      }
    } else {
      let newGraph=this.getGraphCopy ();
      let hasSelected=false;

      for (var i=0;i < newGraph.edges.length; i++) {
        var edge=newGraph.edges [i];
        newGraph.edges [i].selected=false;
        if (edge.uuid==uuid) {
          newGraph.edges [i].selected=true;
          hasSelected=true;
        }
      }        

      this.setGraphData (newGraph,"Select Arrow",null);

      if (hasSelected==true) {
        if (this.props.enableFunctions) {
          this.props.enableFunctions (true);
        }
      }      
    }
  }

  /**
   *
   */
  highlightArrow (uuid) {
    console.log ("highlightArrow ()");

    let newGraph=this.getGraphCopy ();

    for (var i=0;i < newGraph.edges.length; i++) {
      var edge=newGraph.edges [i];
      if (edge.uuid==uuid) {
        //console.log ("true");
        newGraph.edges [i].highlighted=true;
      }
    }        

    this.setGraphData (newGraph,null,null);
  }

  /**
   *
   */
  unhighlightArrow (uuid) {
    console.log ("unhighlightArrow ()");

    let newGraph=this.getGraphCopy ();

    for (var i=0;i < newGraph.edges.length; i++) {
      var edge=newGraph.edges [i];
      if (edge.uuid==uuid) {
        //console.log ("false");
        newGraph.edges [i].highlighted=false;
      }
    }        

    this.setGraphData (newGraph,null,null);   
  }   

  /**
   * 
   */
  deSelectAll (aGraph) {
    console.log ("deSelectAll ()");

    var newGraph=aGraph;

    if (aGraph==null) {
      newGraph=this.getGraphCopy ();
    }

    for (let i=0;i < newGraph.groups.length; i++) {
      newGraph.groups [i].selected=false;  
    }       

    for (let i=0;i < newGraph.nodes.length; i++) {
      newGraph.nodes [i].selected=false;
      newGraph.nodes [i].highlighted=false;
      newGraph.nodes [i].resizing=false;
      newGraph.nodes [i].handles=null;
    }    

    for (let i=0;i < newGraph.edges.length; i++) {
      newGraph.edges [i].selected=false;  
    }        

    if (aGraph==null) {
      this.setGraphData (newGraph,"Deselect All",()=>{
        this.setState({
          panning: false,
          hovering: false
        },() => {    
          if (this.props.enableFunctions) {
            this.props.enableFunctions (false);
          }
        });
      });
    }

    return (newGraph);
  }

  /**
   *
   */
  onHandleDown (e,aHandle,aIsDown) {
    console.log ("onHandleDown ("+aHandle.cursor+","+aIsDown+")");

    let x=this.toLocalX(e);
    let y=this.toLocalY(e);

    //console.log (aHandle);
    this.setState({
      mouseXOld: x,
      mouseYOld: y,
      mouseX: x,
      mouseY: y,
      panelResizing: aIsDown,
      panelSizingId: aHandle.id,
      panelSizingDirection: aHandle.cursor});
  }

  /**
   *
   */
  onMouseDown (e) {
    console.log ("onMouseDown ()");

    let x=this.toLocalX(e);
    let y=this.toLocalY(e);

    if (this.state.mouseBlocked==true) {
      console.log ("mouseBlocked == true, bump");
      return;
    }
        
    let timestamp=Date.now();
    let delta=timestamp-this.clickDelta;
    this.clickDelta=timestamp;

    if ((delta>=150) && (delta<400)) {
      this.onMouseDoubleClick (e);
      return;
    }

    if (e.button==MOUSEBUTTON.LEFT) {
      //>-----------------------------------------------------------------------

      if (this.state.mode==INTMODE.SELECT) {
        this.onMouseSingleClick (e);
        return;
      }

      if (this.state.mode==INTMODE.PAN) {        
        this.setState({
          mouseXOld: x,
          mouseYOld: y,
          mouseX: x,
          mouseY: y,
          mouseDown: true,
          panning: true
        });
        return;
      }      

      //>-----------------------------------------------------------------------      

      if ((this.state.mode==INTMODE.LINK_BLACK) || (this.state.mode==INTMODE.LINK_RED) || (this.state.mode==INTMODE.LINK_BLUE)) {
        var group=this.visualGraphTools.getGroupFromLocation (this.getGraphData(),x,y);
        var from=this.visualGraphTools.getNodeFromLocation (this.getGraphData(),x,y);
        if (group!=null) {
          from=group;
        }
        var center=this.visualGraphTools.getPanelCenter (from);
        var xOld=x;
        var yOld=y;

        if (from!=null) {
          xOld=center.x;
          yOld=center.y;
          x=center.x;
          y=center.y; 
        }

        this.setState({
          mouseXOld: xOld,
          mouseYOld: yOld,
          mouseX: x,
          mouseY: y,
          leftDown: true,
          from: from,
          panning: false,
          to: null
        });

        return;
      }

      //>-----------------------------------------------------------------------      
    }
  }

  /**
   *
   */
  onMouseUp (e) {
    console.log ("onMouseUp ()");

    let x=this.toLocalX(e);
    let y=this.toLocalY(e);

    if (this.state.panelResizing==true) {
      breaker=false;
      this.setState({
        panelResizing: false
      });
      
      return;
    }

    if (this.state.mouseBlocked==true) {
      return;
    }

    if (this.state.mode==INTMODE.SELECT) {
      // check to see if we've selected any nodes
      
      let found=false;

      if (this.props.graph) {
        for (let i=0;i<this.props.graph.nodes.length;i++) {
          let testNode=this.props.graph.nodes [i];
          if (testNode.selected==true) {
            found=true;
          }
        }
      }

      if (found==true) {
        let newGraph=this.getGraphCopy ();
        this.setGraphData (newGraph,"Area Select",null);
      }
    }

    //>----------------------------------------------------

    if (this.state.mouseDown==true) {
      this.setState({
        mouseDown: false,
        mouseXOld: x,
        mouseYOld: y,        
        mouseX: x,
        mouseY: y,
        panning: false,
        hovering: false,
        selecting: false,
      });
    }

    //>----------------------------------------------------

    if (this.state.mode==INTMODE.LINK_BLACK) {
      console.log ("Processing potential link generation");

      // Let's first see if an edge was highlighted
      var toEdge=this.graphTools.getHighlightedEdge (this.getGraphData());
      if (toEdge!=null) {
        this.addEdge (this.state.from,toEdge,GRAPHTYPES.EDGE);

        this.setState({
          leftDown: false
        });        
        return;
      }

      // Nope, no edge highlighted, could be a node (or a group)
      var to=this.visualGraphTools.getNodeFromLocation (this.getGraphData(),x, y);
      
      if ((to!=null) && (this.state.from!=null)) {
        this.setState ({
          to: to
        },()=>{
          this.addEdge (this.state.from,to,GRAPHTYPES.EDGE);
        })

        this.setState({
          leftDown: false
        });
      }
      return;
    }
   
    //>----------------------------------------------------      
  }

  /**
   * @param {any} e
   */
  onMouseMove (e) {
    //console.log ("onMouseMove ()");

    let x=this.toLocalX(e);
    let y=this.toLocalY(e);

    if (breaker==true) {
      console.log ("breaker");
      return;
    }

    breaker=true;

    if (this.state.mouseBlocked==true) {
      breaker=false;
      console.log ("breaker, mouseblocked==true");
      return;
    }

    //>----------------------------------------------------    

    if (this.state.panelResizing==true) {
      let newGraph=this.getGraphCopy ();

      let aNode=this.graphTools.getSelected (newGraph);
      if (aNode!=null) {

        /*
            1----2----3
            |         |
            4         5
            |         |
            6----7----8
        */

        if (this.state.panelSizingId==1) {
          let oldX=aNode.x+aNode.width;
          let oldY=aNode.y+aNode.height;

          aNode.x=x;
          aNode.y=y;
                    
          aNode.width=oldX-aNode.x;
          aNode.height=oldY-aNode.y;
        }

        if (this.state.panelSizingId==2) {
          let oldY=aNode.y+aNode.height;

          aNode.y=x;

          aNode.height=oldY-aNode.y;
        }
        
        if (this.state.panelSizingId==3) {
          let oldY=aNode.y+aNode.height;

          aNode.y=y;
                    
          aNode.height=oldY-aNode.y;                 

          let width=x-aNode.x;
          aNode.width=width;          
        }
        
        if (this.state.panelSizingId==4) {
          let oldX=aNode.x+aNode.width;

          aNode.x=x;
                    
          aNode.width=oldX-aNode.x;
        }
        
        if (this.state.panelSizingId==5) {
          let width=x-aNode.x;
          aNode.width=width;
        }
        
        if (this.state.panelSizingId==6) {
          let oldX=aNode.x+aNode.width;
          let height=y-aNode.y;

          aNode.x=x;
                    
          aNode.width=oldX-aNode.x;
          aNode.height=height;
        }
        
        if (this.state.panelSizingId==7) {
          let height=y-aNode.y;
          aNode.height=height;    
        }
        
        if (this.state.panelSizingId==8) {
          let width=x-aNode.x;
          let height=y-aNode.y;
          aNode.width=width;
          aNode.height=height;                    
        }

        // Make this a constant
        if (aNode.width<PANELDEFS.MINWIDTH) {
          aNode.width=PANELDEFS.MINWIDTH;
        }

        // Make this a constant
        if (aNode.height<PANELDEFS.MINHEIGHT) {
          aNode.height=PANELDEFS.MINHEIGHT;
        }        

        aNode.handles=this.graphDrawingTools.createHandles (aNode,true);
      }

      this.setGraphData (newGraph,null,(e) => {
        this.calculateGroupsPanels ();
      });

      breaker=false;

      return;
    }

    //>----------------------------------------------------

    if (this.state.mouseDown==true) {
      if (this.state.panning==true) {
        let deltaX = x - this.state.mouseXOld;
        let deltaY = y - this.state.mouseYOld;

        let localPanX = this.state.panX + deltaX;
        let localPanY = this.state.panY + deltaY;

        this.setState({
          mouseXOld: this.state.mouseX,
          mouseYOld: this.state.mouseY,        
          mouseX: x,
          mouseY: y,
          panX: localPanX,
          panY: localPanY,
          mouseDown: true,
          panning: true
        });            
      }

      if (this.state.selecting==true) {
        selectRect=this.dataTools.deepCopy (selectRect);

        selectRect.x2=x;
        selectRect.y2=y;

        this.setState({
          mouseXOld: this.state.mouseX,
          mouseYOld: this.state.mouseY,        
          mouseX: x,
          mouseY: y
        },(e) => {
          this.selectInRect (selectRect);
        });
      } else {
        var newMouseX=x;
        var newMouseY=y;

        var deltaX = newMouseX - this.state.mouseX;
        var deltaY = newMouseY - this.state.mouseY;

        //var newGraph=this.dataTools.deepCopy (this.state.graph);
        let newGraph=this.getGraphCopy ();

        // Check groups first, then nodes
        var groupMove=null;

        for (var j=0;j < newGraph.groups.length; j++) {
          var group=newGraph.groups [j];
          if (group.selected==true) {
            // Don't move the group here, move all the nodes in the group instead
            // because the group location is calculated from node locations
            groupMove=group;
          }
        }

        if (groupMove==null) {
          for (var i=0;i < newGraph.nodes.length; i++) {
            var panel=newGraph.nodes [i];
            if (panel.selected==true) {
              panel.x += deltaX;
              panel.y += deltaY;
            }
          }
        } else {
          for (var i=0;i < newGraph.nodes.length; i++) {
            var panel=newGraph.nodes [i];
            var inGroup=this.graphTools.isNodeInGroup (newGraph,groupMove.uuid,panel.uuid);
            if (inGroup==true) {
              panel.x += deltaX;
              panel.y += deltaY;
            }
          }
        }

        this.setGraphData (newGraph,null,() => {
          this.setState({
            mouseXOld: this.state.mouseX,
            mouseYOld: this.state.mouseY,        
            mouseX: newMouseX,
            mouseY: newMouseY
          }, (e) => {
            this.calculateGroupsPanels ();
          });
        });
      }
    } else {
      // Is this really the best way to handle this?
      if ((this.state.panning==false) && (this.state.selecting==false)) {
        //var testGraph=this.dataTools.deepCopy (this.state.graph);
        let newGraph=this.getGraphCopy ();
        this.highlightGroups (newGraph, x, y);
        this.highlightNodes (newGraph, x, y);
        this.setGraphData (newGraph,null,null);
      }
    }

    //>----------------------------------------------------

    if ((this.state.mode==INTMODE.LINK_BLACK) || (this.state.mode==INTMODE.LINK_RED) || (this.state.mode==INTMODE.LINK_BLUE)) {
      this.setState({
        mouseX: x,
        mouseY: y,
        status: "x: " + x + ", y: " + y
      });
    }

    //>----------------------------------------------------    

    this.setState ({status: "x: " + x + ", y: " + y});

    breaker=false;
  }

  /**
   *
   */
  onWheel (e) {
    if (this.state.allowZooming==false) {
      return;
    }

    if (e.deltaY) {
      if (e.deltaY<0) {
        this.onZoomIn ();
      }

      if (e.deltaY>0) {
        this.onZoomOut ();
      }
    }
  }

  /**
   *
   */
  onMouseSingleClick (e) {
    console.log ("onMouseSingleClick ()");

    let x=this.toLocalX(e);
    let y=this.toLocalY(e);

    let newGraph=this.getGraphCopy ();

    // First we need to check the handles

    for (let i=0;i<newGraph.nodes.length;i++) {
      let testNode=newGraph.nodes [i];
      if (testNode.handles!=null) {
        for (let j=0;j<testNode.handles.length;j++) {
          let testHandle=testNode.handles [j];
          testHandle.selected=false;

          let xAbs=testNode.x+testHandle.x;
          let yAbs=testNode.y+testHandle.y; 

          let compX=x;
          let compY=y;

          if ((compX>xAbs) && 
              (compX<(xAbs+testHandle.width)) &&
              (compY>yAbs) &&
              (compY<(yAbs+testHandle.height))) {
            testHandle.selected=true;
          }
        }
      }
    }

    newGraph=this.deSelectAll (newGraph);

    var selected=this.graphTools.getSelectedNode (newGraph,x,y);

    if (selected!=null) {
      newGraph=this.selectNode (selected.uuid,newGraph,true);
      
      this.setState({
        mouseDown: true,
        mouseXOld: x,
        mouseYOld: y,
        mouseX: x,
        mouseY: y,            
        selecting: false
      },() => {
        this.setGraphData (newGraph,"Select",()=>{
          if (this.props.enableFunctions) {
            this.props.enableFunctions (true);
          }          
        });
      });
    } else {
      var selectedGroup=this.graphTools.getSelectedGroup (newGraph,x,y);

      if (selectedGroup!=null) {
        newGraph=this.selectGroup (selectedGroup.uuid,newGraph);

        this.setState({
          mouseDown: true,
          mouseXOld: x,
          mouseYOld: y,
          mouseX: x,
          mouseY: y,            
          selecting: false
        },() => {
          this.setGraphData (newGraph,"Select Link",()=>{
            if (this.props.enableFunctions) {
              this.props.enableFunctions (true);
            }          
          });
        });        
      } else {
        if (this.state.mode==INTMODE.SELECT) {
          console.log ("We're in selection mode, resetting canvas ...");

          selectRect.x1 = x;
          selectRect.y1 = y;
          selectRect.x2 = x;
          selectRect.y2 = y;

          this.setState({
            mouseDown: true,
            mouseXOld: x,
            mouseYOld: y,        
            mouseX: x,
            mouseY: y,
            selecting: true /* We didn't find a node that was selected and the mouse is down, therefore we're doing rectangle selection*/
          },()=>{
            this.setGraphData (newGraph,"Deselect All",null);
          });        
        }        
      }
    }
  }

  /**
   * We have no choice but do the edge and edge-label double clicking through a different
   * mechanism, because otherwise we would have to store the rendered dimensions of the
   * label in the state
   */
  onMouseDoubleClick (e) {
    console.log ("onMouseDoubleClick ()");

    let x=this.toLocalX(e);
    let y=this.toLocalY(e);

    if (this.state.mode==INTMODE.SELECT) {
      var selected=this.graphTools.getSelectedNode (this.getGraphData(),x,y);
      if (selected!=null) {
        if (this.props.editNode) {
          this.props.editNode (selected.uuid);
        }
      }
    }
  }  

  /**
   *
   */
  onEdgeDoubleClick (anEdge) {
    console.log ("onEdgeDoubleClick ("+anEdge+")");

    if (this.props.editNode) {
      this.props.editNode (anEdge);
    }    
  }

  /**
   * Select all nodes (and edges) within a given boundary rect
   */
  selectInRect (aSelection) {
    //console.log ("selectInRect ()");

    let newGraph=this.getGraphCopy ();
    
    let shouldDeleteEnable=this.visualGraphTools.selectInRect (newGraph,aSelection);

    if (shouldDeleteEnable) {
      this.setGraphData (newGraph, null, () => {
        if (this.props.enableFunctions) {
          this.props.enableFunctions (shouldDeleteEnable);
        }
      });
    }
  }

   /**
   * 
   */
  highlightGroups (testGraph, aX, aY) {
    if (testGraph.groups!=null) {
      for (var i=0;i < testGraph.groups.length; i++) {
        var group=testGraph.groups [i];
        group.highlighted=false;
        if ((aX>=(group.x-GRAPHICSCONSTS.GROUPBORDER)) && (aY>=(group.y-GRAPHICSCONSTS.GROUPBORDER)) && (aX<=(group.x+group.width+GRAPHICSCONSTS.GROUPBORDER)) && (aY<=(group.y+group.height+GRAPHICSCONSTS.GROUPBORDER))) {
          group.highlighted=true;
        }
      }
    }
  } 

  /**
   * 
   */
  highlightNodes (testGraph, aX, aY) {    
    // Update nodes ...
    for (var i=0;i < testGraph.nodes.length; i++) {
      var panel=testGraph.nodes [i];
      if (this.graphTools.getGroupIdFromNode (this.getGraphData(),panel.uuid)==null) {    
        panel.highlighted=false;
        if ((aX>=panel.x) && (aY>=panel.y) && (aX<=(panel.x+panel.width)) && (aY<=(panel.y+panel.height))) {
          panel.highlighted=true;
        }
      }
    }

    // Update groups ...

    for (var j=0;j < testGraph.groups.length; j++) {
      var group=testGraph.groups [j];

    }
  }

  /**
   *
   */
  addNode (anX,anY,aName,anId) {
    console.log ("addNode ("+aName+","+anId+")");

    let newGraph=this.getGraphCopy ();

    var x=10;
    var y=10;

    if (anX) {
      x=anX;
    }

    if (anY) {
      y=anY;
    }

    var newNode=this.props.generateNewNode ();

    newNode.name=aName;
    newNode.x=x;
    newNode.y=y;
    newNode.width=PANELDEFS.PANELWIDTH;
    newNode.height=PANELDEFS.PANELHEIGHT;
    newNode.selected=false;
    newNode.highlighted=false;
    newNode.content="";

    if (anId) {
      newNode.id=anId;
    }

    if (newNode.uuid!=null) {
      newNode.uuid=this.dataTools.uuidv4();
    }

    newGraph.nodes.push (newNode);

    console.log (newGraph);

    this.setGraphData (newGraph,"Add Element",() => {
      if (this.props.setModeSelect) {
        this.props.setModeSelect();
      }
 
      /*
      if (this.props.evaluateData) {
        let feedback=this.props.evaluateData ("addNode:"+anId+"");
        this.showFeedback (feedback);        
      }
      */
    });
  }

  /**
   *
   */
  addEdgeInternal (aFrom, aTo, aType) {
    console.log ("addEdgeInternal ("+aFrom.uuid+","+aTo.uuid+","+aType+")"); 

    // First check to see if we're trying to connect to ourselves
    if (aFrom.uuid==aTo.uuid) {
      console.log ("Can't create edge to yourself (yet)");
      return (null);
    }

    let toGroup=this.graphTools.getGroupFromNode (this.getGraphData(),aTo.uuid);
    let fromGroup=this.graphTools.getGroupById (this.getGraphData(),aFrom.uuid);

    if ((fromGroup!=null) && (toGroup!=null)) {
      if (fromGroup.uuid==toGroup.uuid) {
        console.log ("Can't create an arrow from a group to a node in the same group");
        return (null);        
      }
    }

    if (this.graphTools.getGroupIdFromNode (this.getGraphData(),aFrom.uuid)!=null) {
      console.log ("Can't create an arrow from a node in a group");
      return (null);
    }

    // Next see if we already have the same edge
    for (let i=0;i<this.getGraphData().edges.length;i++) {
      let edge=this.getGraphData().edges [i];

      if ((edge.from==aFrom.uuid) && (edge.to==aTo.uuid)) {
        console.log ("Edge already exists");
        return (null);
      }
    }
   
    var newEdge = new Object();    
    newEdge.from = aFrom.uuid;
    newEdge.to = aTo.uuid;
    newEdge.type = aType;    
    newEdge.uuid = this.dataTools.uuidv4();

    if (this.props.generateNewEdge) {
      newEdge=this.props.generateNewEdge ();
      newEdge.from = aFrom.uuid;
      newEdge.to = aTo.uuid;
      newEdge.type = aType;      
    }

    newEdge.fresh = true;
    newEdge.content = ("edge-" + this.edgeIndex);
    this.edgeIndex++;

    console.log ("New edge generated, returning ...");

    return (newEdge);
  }

  /**
   *
   */
  addEdge (aFrom, aTo, aType) {
    console.log ("addEdge ("+aFrom.uuid+","+aTo.uuid+","+aType+")"); 

    if (this.props.settings.allowMultipleFrom==false) {
      if (this.graphTools.getEdgeByFromId (this.getGraphData(),aFrom.uuid)!=null) {     
        //this.showFeedbackString ("You can't create more than one link from a node");
        this.resetGraphUpdates();
        return;
      }
    }

    let newGraph=this.getGraphCopy ();
   
    var newEdge=this.addEdgeInternal (aFrom, aTo, aType);

    if (newEdge==null) {
      console.log ("Shouldn't create new edge, bump");
      return;
    }

    newGraph.edges.push(newEdge);

    this.setGraphData (newGraph,"Add Edge",()=>{      
      /*
      if (this.props.evaluateData) {
        let feedback=this.props.evaluateData ("addEdge:"+aFrom.id+":"+aTo.id);
        this.showFeedback (feedback);        
      }
      */
            
      if (this.props.setModeSelect) {
        this.props.setModeSelect();
      }

      this.resetGraphUpdates();
    });    
  }
  
  /**
   *
   */
  resetGraphUpdates () {
    console.log ("resetGraphUpdates ()");

    let newGraph=this.getGraphCopy ();

    for (let i=0;i<newGraph.edges.length;i++) {
      newGraph.edges [i].fresh=false;
    }

    this.setGraphData (newGraph,null,null);
  }

  /**
   *
   */
  createDragRect () {
    let x1=selectRect.x1;
    let y1=selectRect.y1;
    let x2=selectRect.x2;
    let y2=selectRect.y2;

    if (x2<x1) {
      let temp=x2;
      x2=x1;
      x1=temp;
    }

    if (y2<y1) {
      let temp=y2;
      y2=y1;
      y1=temp;
    }    

    let width=(x2-x1);
    let height=(y2-y1);

    return (<rect x={x1} y={y1} width={width} height={height} stroke="black" fillOpacity="0.0" strokeOpacity="1" style={{strokeDasharray: "10 5"}}/>);
  }

  /**
   *
   */
  createGroup () {
    console.log ("createGroup ()");

    if (this.props.settings) {
      if (this.props.settings.useGroups==false) {
        return;
      }
    }

    //var newGraph=this.dataTools.deepCopy (this.state.graph);
    let newGraph=this.getGraphCopy ();

    var nodes=newGraph.nodes;

    // Get this from the factory instead! It's already written
    var newGroup={
      "id": "group",
      "type": GRAPHTYPES.GROUP,
      "uuid": this.dataTools.uuidv4(),
      "nodes": [],
      "selected": false,
      "highlghted": false,
      "x": 0, // Want to make sure this exists so that we don't always have to check if it's a valid attribute
      "y": 0, // Want to make sure this exists so that we don't always have to check if it's a valid attribute
      "width": 1, // Want to make sure this exists so that we don't always have to check if it's a valid attribute
      "height": 1, // Want to make sure this exists so that we don't always have to check if it's a valid attribute
      "notes": ""
    };

    let selectionSet=[];
    let groupingSet=[];

    // First let's create a proper set so that we can more easily think about comparisons using
    // sets. Also this makes it easier to give the selection to any functions
    for (var k=0;k<nodes.length;k++) {
      if (nodes [k].selected==true) {
        //console.log ("Adding selected node: " + nodes [k].id);
        selectionSet.push(nodes [k]);
        groupingSet.push(nodes [k].id);
      }
    }

    //console.log ("Checking selected nodes: " + selectionSet.length);
    //console.log (selectionSet);

    for (var i=0;i<selectionSet.length;i++) {
      if (this.graphTools.getGroupIdFromNode (this.getGraphData(),selectionSet [i].uuid)!=null) {
        //this.showFeedbackString ("One of the selected nodes is already part of a group");
        return;
      }

      // Let's leave this feature for now. It simply skips this check if the property doesn't exist
      if (selectionSet [i].hasOwnProperty ("groupable")==true) {
        if (selectionSet [i].groupable==false) {
          //this.showFeedbackString ("One of the selected nodes can't be grouped");
          return;        
        }
      }

      // Check for membership in the groupings sets, if defined

      if (this.state.groupings.length>0) {
        if (this.dataTools.isValidSet (this.state.groupings,groupingSet)==false) {
          //this.showFeedbackString ("The selected nodes can't be grouped together");
          return;  
        } 
      }

      newGroup.nodes.push (selectionSet [i].uuid);
    }

    if (newGroup.nodes.length>0) {
      newGraph.groups.push(newGroup);
    }

    // Find out if we need to create any new edges as a result of group formation

    let newToList=[];

    for (let j=0;j<newGroup.nodes.length;j++) {
      let testNode=newGroup.nodes [j];
      let testEdge=this.graphTools.getEdgeByFromId (newGraph,testNode);
      if (testEdge!=null) {
        let toNode=this.graphTools.getNodeById (newGraph,testEdge.to);
        if (toNode!=null) {
          newToList.push (toNode);
        } else {
          console.log ("Internal error: unable to find toNode from edge!");
        }
      }
    }

    // Add the actual edges in the model and remove any superfluous edges

    for (let t=0;t<newToList.length;t++) {
      let newEdge=this.addEdgeInternal (newGroup,newToList [t],GRAPHTYPES.EDGE);

      if (newEdge!=null) {
        newGraph.edges.push(newEdge);
      }

      let deleter=this.graphTools.getEdgeByToId (newGraph,newToList [t].uuid);
      if (deleter!=null) {
        // Before deleting, first verify that the 'to' node isn't inside the group
        newGraph.edges=this.dataTools.deleteElement (newGraph.edges,deleter);
      }
    }

    console.log ("Removing any duplicate edges created as a result of merging elements into a group");

    // Remove duplicate edges that are the result of the process above
    let duplicate=true;

    while (duplicate==true) {
      duplicate=false;

      for (let m=0;m<newGraph.edges.length;m++) {
        let testEdge=newGraph.edges [m];
        for (let n=0;n<newGraph.edges.length;n++) {
          let comparator=newGraph.edges [n];
          if (n!=m) {
            if ((testEdge.from==comparator.from) && (testEdge.to==comparator.to)) {
              console.log ("Deleting one duplicate edge ...");
              newGraph.edges=this.dataTools.deleteElement (newGraph.edges,comparator);
              duplicate=true;
              break;
            }
          }
        }
      }
    }

    // Remove any dangling edges. This can happen for example when you group 2
    // premises where one of them participates in an edge that has an objection

    let found=false;

    while (found==false) {
      found=true;
 
      for (let k=0;k<newGraph.edges.length;k++) {
        let testEdge=newGraph.edges [k];
        // first let's see if a target node exists
        if (this.graphTools.getNodeById (newGraph,testEdge.to)==null) {
          // See if the to edge still exists
          if (this.graphTools.getEdgeById (newGraph,testEdge.to)==null) {
            console.log ("Deleting one spurious edge ...");
            newGraph.edges=this.dataTools.deleteElement (newGraph.edges,testEdge);
            found=false;
            break; 
          }
        }
      }
    }

    this.setGraphData (newGraph, "Create Group",() => {
      /*
      if (this.props.evaluateData) {
        let feedback=this.props.evaluateData ("addGroup");
        this.showFeedback (feedback);        
      }
      */

      this.calculateGroupsPanels ();
    });
  }

  /**
   * Note that as of right now this method can't handle deleting multiple selected
   * groups
   */
  deleteGroup (softDelete) {
    console.log ("deleteGroup ()");

    //var newGraph=this.dataTools.deepCopy (this.state.graph);
    let newGraph=this.getGraphCopy ();
    
    for (var w=0;w<newGraph.groups.length;w++) {
      var aGroup=newGraph.groups [w];
      if (aGroup.selected==true) {
        if (aGroup.nodes.length==0) {
          // Delete all edges where the 'from' is the group to be deleted

          let done=false;
          while (done==false) {
            done=true;
            for (let t=0;t < newGraph.edges.length; t++) {
              let edge=newGraph.edges [t];
              if ((edge.from==aGroup.uuid) || (edge.to==aGroup.uuid)) {
                newGraph.edges=this.dataTools.deleteElement (newGraph.edges,edge);
                done=false;
              }
            }
          }

          this.dataTools.deleteElement (newGraph.groups,aGroup);
        } else {
          var doDelete=true;

          if (softDelete==false) {
            var r = confirm("You're deleting a group that has arguments, do you wish to continue?");
            doDelete=r;
          }
          
          if (doDelete==true) {
            // Delete all edges where the 'from' is the group to be deleted

            let done=false;
            while (done==false) {
              done=true;
              for (let t=0;t < newGraph.edges.length; t++) {
                let edge=newGraph.edges [t];
                if ((edge.from==aGroup.uuid) || (edge.to==aGroup.uuid)) {
                  newGraph.edges=this.dataTools.deleteElement (newGraph.edges,edge);
                  done=false;
                }
              }
            }

            this.dataTools.deleteElement (newGraph.groups,aGroup);
          }
        }
      }
    }

    this.setGraphData (newGraph,"Delete Group",()=>{
      /*
      if (this.props.evaluateData) {
        let feedback=this.props.evaluateData ("deleteGroup");
        this.showFeedback (feedback);        
      }
      */
    });
  }

  /**
   *
   */
  deleteElement () {
    console.log ("deleteElement ()");

    let verifier=this.getGraphData();

    if (!verifier) {
      return;
    }

    //this.addUndoPoint ("Delete Element");

    for (var x=0;x<verifier.groups.length;x++) {
      var aGroup=verifier.groups [x];
      if (aGroup.selected==true) {
        console.log ("Found a selected group, deleting ...");
        //console.trace (aGroup);
        this.deleteGroup (false);
        return;
      }
    }
   
    //var newGraph=this.dataTools.deepCopy (this.state.graph);
    let newGraph=this.getGraphCopy ();

    // First remove selected nodes from their group(s) if any

    for (var i=0;i < newGraph.nodes.length; i++) {
      var panel=newGraph.nodes [i];
      if (panel.selected==true) {
        // Find the group
        var aGroup=this.graphTools.getGroupFromNode (newGraph,panel.uuid);
        if (aGroup!=null) {
          for (var t=0;t<aGroup.nodes.length;t++) {
            if (aGroup.nodes [t]==panel.uuid) {          
              this.dataTools.deleteElement (aGroup.nodes,panel.uuid);
            }
          }
        }
      }
    }

    // Delete any groups that now have no nodes

    for (var w=0;w<newGraph.groups.length;w++) {
      var aGroup=newGraph.groups [w];
      if (aGroup.nodes.length==0) {
        console.log ("Deleting empty group ...");
        this.dataTools.deleteElement (newGraph.groups,aGroup);
        break;
      }
    }

    // Delete selected nodes 
 
    console.log ("Deleting selected nodes ...");

    // FIX AND REWRITE

    var targetNode=null;
    var deleting=true;

    while (deleting==true) {
      deleting=false;

      for (var i=0;i < newGraph.nodes.length; i++) {
        var panel=newGraph.nodes [i];
        if (panel.selected==true) {
           targetNode=panel;
           deleting=true;
        }
      }   
        
      if (targetNode) {
        console.log ("Deleting node ...");

        /*
        if (this.props.evaluateData) {
          let feedback=this.props.evaluateData ("deleteNode:"+targetNode.id);
          this.showFeedback (feedback);        
        }
        */

        /*
        if (this.state.selected) {
          if (this.state.selected.uuid==targetNode.uuid) {
            console.log ("Removing selected entry from state");
            this.setState ({selected: null});
          }
        }
        */

        // Before we delete this node, first see if we have to delete
        // any involved edges

        console.log ("Deleting any dangling edges ...");

        var done=false;
        while (done==false) {
          done=true;
          for (var t=0;t < newGraph.edges.length; t++) {
            var edge=newGraph.edges [t];
            if ((edge.from==targetNode.uuid) || (edge.to==targetNode.uuid)) {

              // Check to see if perphaps the edge is the 'to' target for another edge
              let sideEffect=this.graphTools.getEdgeByToId (newGraph,edge.uuid);
              if (sideEffect!=null) {
                console.log ("Deleting side-effect edge first ...")
                newGraph.edges=this.dataTools.deleteElement (newGraph.edges,sideEffect);
              }

              console.log ("Deleting involved edge ...");
              newGraph.edges=this.dataTools.deleteElement (newGraph.edges,edge);
              done=false;
            }
          }
        }

        console.log ("Deleting the actual node ...");

        // now we can remove the bugger
        newGraph.nodes=this.dataTools.deleteElement (newGraph.nodes,targetNode);
      }      

    }

    // Delete any selected edges

    var targetEdge=null;

    for (var i=0;i < newGraph.edges.length; i++) {
      var edge=newGraph.edges [i];
      if (edge.selected==true) {
         targetEdge=edge;
      }
    }   
      
    if (targetEdge) {
      // Check to see if perphaps the edge is the 'to' target for another edge
      let sideEffect=this.graphTools.getEdgeByToId (newGraph,targetEdge.uuid);
      if (sideEffect!=null) {
        console.log ("Deleting side-effect edge first ...")
        newGraph.edges=this.dataTools.deleteElement (newGraph.edges,sideEffect);
      }

      newGraph.edges=this.dataTools.deleteElement (newGraph.edges,targetEdge);
    }    
 
    this.setGraphData (newGraph,"Delete Element",null);
  }

  /**
   *
   */
  calculateGroupsPanels () {
    //var updatedGraph=this.dataTools.deepCopy (this.state.graph);
    let newGraph=this.getGraphCopy ();

    this.visualGraphTools.calculateGroupsPanels (newGraph);

    this.setGraphData (newGraph,null,null);

    //this.setState ({graph: newGraph});
  }  

  /**
   *
   */
  onZoomIn (e) {
    //console.log ("onZoomIn ()");

    let currentZoom=this.state.canvasScale;
    currentZoom+=0.1;

    if (currentZoom>2.0) {
      currentZoom=2.0;
    }

    this.setState ({canvasScale: currentZoom});
  }

  /**
   *
   */
  onZoomOut (e) {
    //console.log ("onZoomOut ()");

    let currentZoom=this.state.canvasScale;
    currentZoom-=0.1;

    if (currentZoom<0.5) {
      currentZoom=0.5;
    }

    this.setState ({canvasScale: currentZoom});
  }

  /**
   *
   */
  onZoomReset (e) {
    console.log ("onZoomReset ()");
    this.setState ({
      canvasScale: 1,
      panX: 0,
      panY: 0,
      mouseXOld: 0,
      mouseYOld: 0,      
      mouseX: 0,
      mouseY: 0,
      mouseDown: false,      
      panning: false});
  }

  /**
   * http://www.petercollingridge.co.uk/tutorials/svg/interactive/pan-and-zoom/
   */
  render() {
    let graph=this.getGraphData ();
    let grid;
    let panels;
    let edges;
    //let feedback=<div/>;
    let mark;
    let stack;
    let fontmanager;
    let panelsettings;
    let noteeditor;
    let minimap;
    let dragRect;
    let arrow;
    let selected=null;
    let groups;
    let markers;
    let svgContainerClass="svgcontainer";

    if (this.props.env) {
      if (this.props.env.darkMode==true) {
        svgContainerClass="svgcontainer-dark";
      }
    }    

    let statusbar=<div id="statusbar" className="statusbarfloat">{this.state.status}</div>;

    markers=this.graphDrawingTools.createMarkers(this.state.nodeTypes);

    if (this.props.showStack) {
      if(this.props.showStack==true) {
        stack=<UndoStackWindow windowController={this.props.windowController} ref="undowindow" undoStack={this.state.undoStack} />
      }
    }

    /*
    if (this.props.showMiniMap) {
      if (this.props.showMiniMap==true) {
        minimap=<MiniMap windowController={this.props.windowController} showGrid={this.props.showGrid} panelclass="minimapclass" diagram={this.getGraphData()} />
      }
    }
    */

    if (this.state.selecting==true) {
      dragRect=this.createDragRect();
    }

    if (this.props.mark) {
      mark=this.props.mark;
    }

    if (this.props.showGrid==true) {
      let divShim=document.getElementById ("diagramcontainer");
      if (divShim) {
        let divShimDimensions=divShim.getBoundingClientRect();
        if (this.props.env) {
          if (this.props.env.darkMode==true) {
            grid=this.graphDrawingTools.createGridDark (divShimDimensions.right,divShimDimensions.bottom);
          } else {
            grid=this.graphDrawingTools.createGrid (divShimDimensions.right,divShimDimensions.bottom);
          }
        } else {
          grid=this.graphDrawingTools.createGrid (divShimDimensions.right,divShimDimensions.bottom);
        }
      }
    }

    arrow=this.graphDrawingTools.mapArrow(graph,
                                          this.state,
                                          this.state.nodeTypes);

    groups=this.graphDrawingTools.mapGroups(graph,
                                            this.props.editNote);

    panels=this.graphDrawingTools.mapPanels(graph,
                                            this.state,
                                            this.blockMouse,
                                            this.props.changePanelSettings,
                                            this.props.editNote,
                                            this.onHandleDown,
                                            this.state.nodeTypes);
    
    edges=this.graphDrawingTools.mapEdges(graph,
                                          this.state,
                                          this.highlightArrow.bind (this),
                                          this.unhighlightArrow.bind (this),
                                          this.selectArrow.bind(this),
                                          this.onEdgeDoubleClick,
                                          this.props.editNote,
                                          this.props.showLabels,
                                          this.state.nodeTypes);
    let cursor="pointer";

    let graphcontainerclass="graphcontainer";

    if (this.state.panning==true) {
      cursor="grab";
    }

    let scale="scale("+this.state.canvasScale+") translate("+this.state.panX+" "+this.state.panY+")";
    let invScale="translate(" + -this.state.panX + " " + -this.state.panY + ")";
    let zoomIn;
    //zoomIn=<div style={{position: "fixed", right: "23px", top: "54px", backgroundImage: "url("+zoomin+")", backgroundRepeat: "no-repeat", backgroundSize: "16px", width: "16px", height: "16px"}} onClick={this.onZoomIn.bind(this)} />
    let zoomOut;
    //zoomOut=<div style={{position: "fixed", right: "23px", top: "74px", backgroundImage: "url("+zoomout+")", backgroundRepeat: "no-repeat", backgroundSize: "16px", width: "16px", height: "16px"}} onClick={this.onZoomOut.bind(this)} />
    let zoomReset;
    //zoomReset==<div style={{position: "fixed", right: "23px", top: "94px", backgroundImage: "url("+reset+")", backgroundRepeat: "no-repeat", backgroundSize: "16px", width: "16px", height: "16px"}} onClick={this.onZoomReset.bind(this)} />

    if (this.state.panning==true) {
      //console.log (scale + ", " + this.state.panning);
    }

    return (<div id="diagramcontainer" className={graphcontainerclass}>
      <svg id="diagrammer" transform={scale}        
        className={svgContainerClass}
        onMouseMove={this.onMouseMove.bind(this)}
        onMouseDown={this.onMouseDown.bind(this)}
        onMouseUp={this.onMouseUp.bind(this)}
        onWheel = {this.onWheel.bind(this)}>

        <filter id="dropshadow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
          <feOffset dx="0" dy="0" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.7"/>
          </feComponentTransfer>            
          <feMerge> 
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <filter id="black-glow">
          <feColorMatrix type="matrix" values=
                      "0 0 0 0   0
                       0 0 0 0   0
                       0 0 0 0   0
                       0 0 0 0.7 0"/>
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <defs>{markers}</defs>
        {grid}
        {dragRect}
        {groups}
        {edges}
        {panels}
        {arrow}
      </svg>
      {statusbar}

      {zoomIn}
      {zoomOut}
      {zoomReset}

      {stack}
      {fontmanager}
      {minimap}
      {noteeditor}
    </div>);
  }
}
