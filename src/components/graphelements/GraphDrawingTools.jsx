import React from 'react';

import GraphController from './graphcontroller';
import GraphPanel from './GraphPanel';
import GraphPanelBasic from './GraphPanelBasic';
import GraphPanelModule from './GraphPanelModule';
import Arrow from './Arrow';
import Group from './Group';

import VisualGraphTools from '../utils/visualgraphtools';
import GraphTools from '../utils/graphtools';

import { GRAPHTYPES } from '../utils/constants';
import { GRAPHICSCONSTS } from '../utils/constants';
import { INTMODE } from '../utils/constants';
import { GRID } from '../utils/constants';

/**
 *
 */
class GraphDrawingTools {

  /**
   *
   */
  constructor () {
  	this.visualGraphTools=new VisualGraphTools();
  	this.graphTools=new GraphTools ();
  }

  /**
    <marker id="arrow_black" viewBox="0 0 60 60" refX="48" refY="28" markerUnits="strokeWidth" markerWidth="4" markerHeight="4" orient="auto">
      <path d="M 0 0 L 60 30 L 0 60 z" fill="#000000" />
    </marker>
  */
  createMarkers (nodeTypes) {
    let markers=[];

    markers.push (<marker key={"marker-0"} id="arrow_black" viewBox="0 0 60 60" refX="48" refY="28" markerUnits="strokeWidth" markerWidth="4" markerHeight="4" orient="auto"><path d="M 0 0 L 60 30 L 0 60 z" fill="#000000" /></marker>);
    markers.push (<marker key={"marker-1"} id="arrow_yellow" viewBox="0 0 60 60" refX="48" refY="28" markerUnits="strokeWidth" markerWidth="4" markerHeight="4" orient="auto"><path d="M 0 0 L 60 30 L 0 60 z" fill="#ffff00" /></marker>);
    markers.push (<marker key={"marker-2"} id="arrow_grey" viewBox="0 0 60 60" refX="48" refY="28" markerUnits="strokeWidth" markerWidth="4" markerHeight="4" orient="auto"><path d="M 0 0 L 60 30 L 0 60 z" fill="#cccccc" /></marker>);

    for (let i=0;i<nodeTypes.length;i++) {
      let type=nodeTypes [i];
      markers.push (<marker key={("marker-"+i+3)} id={type.id} viewBox="0 0 60 60" refX="48" refY="28" markerUnits="strokeWidth" markerWidth="4" markerHeight="4" orient="auto"><path d="M 0 0 L 60 30 L 0 60 z" fill={type.color} /></marker>);
    }

    return (markers);
  }

  /**
   *
   */	
  createGrid (w,h) {
    //console.log ("createGrid ("+w+","+h+")");

    let lineIndex=0;
    let lines=[];

    let xIndex=0;
    let yIndex=0;

    let gridTicker=0;
    let strokeColor="#cccccc";

    while (xIndex<w) {
      lines.push(<line key={"gridline"+lineIndex} x1={xIndex} y1={0} x2={xIndex} y2={h} stroke={strokeColor} strokeWidth="1" />);
      lineIndex++;
      xIndex+=GRID.XTICK;

      gridTicker++; 
      if (gridTicker>4) {
        gridTicker=0;
        strokeColor="#bbbbbb";
      } else {
        strokeColor="#cccccc";
      }
    }

    gridTicker=0;
    strokeColor="#cccccc";

    while (yIndex<h) {
      lines.push(<line key={"gridline"+lineIndex} x1={0} y1={yIndex} x2={w} y2={yIndex} stroke={strokeColor} strokeWidth="1" />);
      lineIndex++;
      yIndex+=GRID.YTICK;

      gridTicker++; 
      if (gridTicker>4) {
        gridTicker=0;
        strokeColor="#bbbbbb";
      } else {
        strokeColor="#cccccc";
      }      
    }    

    return (lines);
  }

  /**
   *
   */ 
  createGridDark (w,h) {
    //console.log ("createGridDark ("+w+","+h+")");

    let colorMain="#444444";
    let colortick="#555555";

    let lineIndex=0;
    let lines=[];

    let xIndex=0;
    let yIndex=0;

    let gridTicker=0;
    let strokeColor=colorMain;

    while (xIndex<w) {
      lines.push(<line key={"gridline"+lineIndex} x1={xIndex} y1={0} x2={xIndex} y2={h} stroke={strokeColor} strokeWidth="1" />);
      lineIndex++;
      xIndex+=GRID.XTICK;

      gridTicker++; 
      if (gridTicker>4) {
        gridTicker=0;
        strokeColor=colortick;
      } else {
        strokeColor=colorMain;
      }
    }

    gridTicker=0;
    strokeColor="#cccccc";

    while (yIndex<h) {
      lines.push(<line key={"gridline"+lineIndex} x1={0} y1={yIndex} x2={w} y2={yIndex} stroke={strokeColor} strokeWidth="1" />);
      lineIndex++;
      yIndex+=GRID.YTICK;

      gridTicker++; 
      if (gridTicker>4) {
        gridTicker=0;
        strokeColor=colortick;
      } else {
        strokeColor=colorMain;
      }      
    }    

    return (lines);
  }  

  /**
   *
   */
  createHandles (aNode,forced) {
    //console.log ("createHandles ("+aNode.uuid+")");

    if (forced==false) {
      if (aNode.handles!=null) {
        return (aNode.handles);
      }
    }

    let handles=[];
    let w=aNode.width;
    let h=aNode.height;
    let wDiv=w/2;
    let hDiv=h/2;

    if (aNode.class=="GraphPanelModule") {
      /*
          1---------2
          |         |
          |         |
          |         |
          3---------4
      */
      handles.push ({ key: "handler-8", x: (w-8), y: (h-8),       width: 8, height: 8, style: {cursor: "nwse-resize"}, cursor: "nwse-resize", id: 8, selected: false});    
    } else {
      /*
          1----2----3
          |         |
          4         5
          |         |
          6----7----8
      */

      handles.push ({ key: "handler-1", x: -4,       y: -4,       width: 8, height: 8, style: {cursor: "nwse-resize"}, cursor: "nwse-resize", id: 1,selected: false});
      handles.push ({ key: "handler-2", x: (wDiv-4), y: -4,       width: 8, height: 8, style: {cursor: "ns-resize"}, cursor: "ns-resize", id: 2, selected: false});
      handles.push ({ key: "handler-3", x: (w-4),    y: -4,       width: 8, height: 8, style: {cursor: "nesw-resize"}, cursor: "nesw-resize", id: 3, selected: false});
      handles.push ({ key: "handler-4", x: -4,       y: (hDiv-4), width: 8, height: 8, style: {cursor: "ew-resize"}, cursor: "ew-resize", id: 4, selected: false});
      handles.push ({ key: "handler-5", x: (w-4),    y: (hDiv-4), width: 8, height: 8, style: {cursor: "ew-resize"}, cursor: "ew-resize", id: 5, selected: false});
      handles.push ({ key: "handler-6", x: -4,       y: (h-4),    width: 8, height: 8, style: {cursor: "nesw-resize"}, cursor: "nesw-resize", id: 6, selected: false});
      handles.push ({ key: "handler-7", x: (wDiv-4), y: (h-4),    width: 8, height: 8, style: {cursor: "ns-resize"}, cursor: "ns-resize", id: 7, selected: false});
      handles.push ({ key: "handler-8", x: (w-4), y: (h-4),       width: 8, height: 8, style: {cursor: "nwse-resize"}, cursor: "nwse-resize", id: 8, selected: false});    
    } 

    return (handles);
  }

  /**
   *
   */
  mapArrow (aGraph,state,nodeTypes) {
    let arrow;

    if (!aGraph) {
      return arrow;
    }

    if ((state.leftDown==true) && (state.from!=null)) {
      let arrow_stroke="#000000";
      let arrow_end="url(#arrow_black)";

      // First test if 'from' is in fact a group

      let group=this.graphTools.getGroupById (aGraph,state.from.uuid);
      if (group!=null) {
        var center=this.visualGraphTools.getPanelCenter (group);

        var x1=center.x;
        var y1=center.y;
        var x2=state.mouseXOld;
        var y2=state.mouseYOld;

        var point=this.visualGraphTools.getLinePanelIntersection (group,x1,y2,x2,y2);
        if (point!=null) {
          arrow=<line key={1} x1={point.x} y1={point.y} x2={state.mouseX} y2={state.mouseY} stroke={arrow_stroke} strokeWidth="3" markerEnd={arrow_end} />;  
        } else {
          arrow=<line key={1} x1={state.mouseXOld} y1={state.mouseYOld} x2={state.mouseX} y2={state.mouseY} stroke={arrow_stroke} strokeWidth="3" markerEnd={arrow_end} />;
        }

        return (arrow);
      }

      // Test if from is in a group
      if (this.graphTools.getGroupIdFromNode (aGraph,state.from.uuid)!=null) {
        return (arrow);
      }

      if (state.mode==INTMODE.LINK_RED) {    
        arrow_stroke="#b02418";
        arrow_end="url(#arrow_red)";        
      }

      if (state.mode==INTMODE.LINK_BLUE) {    
        arrow_stroke="#0049d0";
        arrow_end="url(#arrow_blue)";
      }      

      // Now clip the arrow line with the 4 sides of the 'from' panel if there is one

      var center=this.visualGraphTools.getPanelCenter (state.from);

      var x1=center.x;
      var y1=center.y;
      var x2=state.mouseXOld;
      var y2=state.mouseYOld;

      var point=this.visualGraphTools.getLinePanelIntersection (state.from,x1,y2,x2,y2);
      if (point!=null) {
        arrow=<line key={1} x1={point.x} y1={point.y} x2={state.mouseX} y2={state.mouseY} stroke={arrow_stroke} strokeWidth="3" markerEnd={arrow_end} />;  
      } else {
        arrow=<line key={1} x1={state.mouseXOld} y1={state.mouseYOld} x2={state.mouseX} y2={state.mouseY} stroke={arrow_stroke} strokeWidth="3" markerEnd={arrow_end} />;
      }
    }

    return (arrow);
  }

  /**
   *
   */
  mapGroups (aGraph,editNote) {
    if (!aGraph) {
      return [];
    }

    var groups=aGraph.groups;
    
    if (groups==null) {
      console.log ("Internal error: no groups found in graph!");
      return;
    }

    var nodes=aGraph.nodes;
    if (nodes==null) {
      console.log ("Internal error: no nodes found in graph!");
      return;
    }

    var renderables=[];

    for (var i=0;i<groups.length;i++) {
      let group=groups [i];
      renderables.push(<Group key={"group-"+i} editNote={editNote} group={group} propKey={i} />);
    }

    return (renderables);
  }

  /**
   * 
   */
  mapPanels (aGraph,
	           state,
	           blockMouse,
	           changePanelSettings,
	           editNote,
             onHandleDown,
             nodeTypes) { 
    if (!aGraph) {
      return [];
    }

    let panelListing = [];
     
    if (aGraph.nodes!=null) {
      for (let i=0;i<aGraph.nodes.length;i++) {
        let panel=aGraph.nodes [i];
        if (panel.class=="GraphPanel") {
          panelListing.push(<GraphPanel index={i} onHandleDown={onHandleDown} changePanelSettings={changePanelSettings} editNote={editNote} blockMouse={blockMouse} nodeTypes={state.nodeTypes} key={"panel-"+i} fontStyle={state.fontStyle} panel={panel} nodeTypes={nodeTypes} />);
        } else {
          if (panel.class=="GraphPanelModule") {
            panelListing.push(<GraphPanelModule index={i} onHandleDown={onHandleDown} changePanelSettings={changePanelSettings} editNote={editNote} blockMouse={blockMouse} nodeTypes={state.nodeTypes} key={"panel-"+i} fontStyle={state.fontStyle} panel={panel} nodeTypes={nodeTypes} />);
          } else {
            panelListing.push(<GraphPanelBasic index={i} onHandleDown={onHandleDown} changePanelSettings={changePanelSettings} editNote={editNote} blockMouse={blockMouse} nodeTypes={state.nodeTypes} key={"panel-"+i} fontStyle={state.fontStyle} panel={panel} nodeTypes={nodeTypes} />);
          }
        }
      }
    }
     
    return (panelListing);
  }
    
  /**
   *
   */
  mapEdges (aGraph,
	          state,
	          highlightArrow,
            unhighlightArrow,
            selectArrow,
            editArrow,
            editNote,
            showLabels,
            nodeTypes) {
    if (!aGraph) {
      return [];
    }

    var edgeListing; 
      
    if (aGraph!=null) { 
      if (aGraph.edges!=null) {
        edgeListing = aGraph.edges.map((edge,index) => {          
          var fromNode=this.graphTools.getGroupById (aGraph,edge.from);
          var boundingBoxTo=10;
          var boundingBoxFrom=0;
          if (fromNode==null) {
            fromNode=this.graphTools.getNodeById (aGraph,edge.from);
          } else {
            boundingBoxFrom=(GRAPHICSCONSTS.GROUPBORDER+2);
          }

          var toEdge=this.graphTools.getEdgeById (aGraph,edge.to);

          //>-----------------------------------------------------------------

          // This edge represents an arrow to an arrow
          if ((toEdge!=null) && (fromNode!=null)) {
            //console.log ("Drawing edge from node/group to edge ...")
            var e1From=this.graphTools.getNodeById (aGraph,toEdge.from);
            if (e1From==null) {
              e1From=this.graphTools.getGroupById (aGraph,toEdge.from);
            }
            var e1To=this.graphTools.getNodeById (aGraph,toEdge.to);
            var e1FromCenter=this.visualGraphTools.getPanelCenter (e1From);
            var e1ToCenter=this.visualGraphTools.getPanelCenter (e1To);

            var fromPointTemp=this.visualGraphTools.getPanelCenter (fromNode);

            // Get the mid point of the edge it's pointing to

            let x1=e1FromCenter.x;
            let y1=e1FromCenter.y;
            let x2=e1ToCenter.x;
            let y2=e1ToCenter.y;

            let x=((x2-x1)/2)+x1;
            let y=((y2-y1)/2)+y1;

            if (showLabels==true) {
              
            } else {
              
            }

            // Turn it into a point so that it fits with the rest of the arguments

            var toPoint={x: x,y: y};

            var fromPoint=this.visualGraphTools.getLinePanelIntersection (fromNode,fromPointTemp.x,fromPointTemp.y,toPoint.x,toPoint.y,boundingBoxFrom);
            if (fromPoint==null) {
              return (<svg key={edge.uuid} />);
            }

            let edgeLabel="";

            if (state.showLabels==true) {
              if (edge.content) {
                edgeLabel=edge.content;
              }
            }

            return (<Arrow 
              editNote={editNote} 
              key={edge.uuid} 
              x1={fromPoint.x} 
              y1={fromPoint.y} 
              x2={toPoint.x} 
              y2={toPoint.y} 
              highlightArrow={highlightArrow} 
              unhighlightArrow={unhighlightArrow}
              selectArrow={selectArrow}
              editArrow={editArrow}
              edge={edge}
              nodeClass={fromNode.class}
              showLabels={showLabels}
              label={edgeLabel} 
              from={fromNode}
              to={null}
              nodeTypes={nodeTypes} />);           
          } 

          //>-----------------------------------------------------------------          

          var toNode=this.graphTools.getNodeById (aGraph,edge.to);

          // We've already concluded that this edge is not to another edge so it must be
          // to a regular node or group 
          if ((fromNode!=null) && (toNode!=null)) {
            var fromPointTemp=this.visualGraphTools.getPanelCenter (fromNode);
            var toPointTemp=this.visualGraphTools.getPanelCenter (toNode);

            var fromPoint=this.visualGraphTools.getLinePanelIntersection (fromNode,fromPointTemp.x,fromPointTemp.y,toPointTemp.x,toPointTemp.y,boundingBoxFrom);
            var toPoint=this.visualGraphTools.getLinePanelIntersection (toNode,fromPointTemp.x,fromPointTemp.y,toPointTemp.x,toPointTemp.y,boundingBoxTo);

            if (fromPoint==null) {
              fromPoint=fromPointTemp;
            }

            if (toPoint==null) {
              toPoint=toPointTemp;
            }

            let edgeLabel="";

            if (state.showLabels==true) {
              if (edge.content) {
                edgeLabel=edge.content;
              }
            }

            return (<Arrow 
              editNote={editNote} 
              key={edge.uuid} 
              x1={fromPoint.x} 
              y1={fromPoint.y} 
              x2={toPoint.x} 
              y2={toPoint.y} 
              highlightArrow={highlightArrow} 
              unhighlightArrow={unhighlightArrow}
              selectArrow={selectArrow}
              editArrow={editArrow}
              edge={edge}
              nodeClass={fromNode.class}
              showLabels={showLabels}
              label={edgeLabel} 
              from={fromNode}
              to={toNode}
              nodeTypes={nodeTypes} />);
          }

          //>-----------------------------------------------------------------          
        });
      }  
    }
      
    return (edgeListing);      
  }	

  /**
   * 
   */
  /* 
  renderedTextSize(string, font, fontSize) {
    var paper = Raphael(0, 0, 0, 0)
    paper.canvas.style.visibility = 'hidden'
    var el = paper.text(0, 0, string)
    el.attr('font-family', font)
    el.attr('font-size', fontSize)
    var bBox = el.getBBox()
    paper.remove()
    return {
        width: bBox.width,
        height: bBox.height
    }
  }
  */ 
}

export default GraphDrawingTools;
