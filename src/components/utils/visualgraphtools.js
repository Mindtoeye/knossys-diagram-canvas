
import GraphTools from './graphtools';
import GeometryTools from './geometrytools';

/**
 * 
 */
class VisualGraphTools {

  /**
   *
   */
  constructor () {
    this.geometrytools=new GeometryTools ();
    this.graphTools=new GraphTools ();
  }

  /**
   *
   */
  getPanelCenter (aPanel) {    
    let middle=new Object();
    middle.x=0;
    middle.y=0;

    if (aPanel==null) {
      console.log ("Internal error: can't create center from null panel");
      return (middle);
    }

    middle.x=(aPanel.x+(aPanel.width/2));
    middle.y=(aPanel.y+(aPanel.height/2));

    return (middle);
  }

  /**
   *
   */
  getLinePanelIntersection (aPanel,x1,y1,x2,y2,boundingBox) {
    var pointer = null;
    var line2 = new Object ();
    line2.x1 = x1;
    line2.y1 = y1;
    line2.x2 = x2;
    line2.y2 = y2;

    var line1=new Object ();

    // Top line
    line1.x1=aPanel.x-boundingBox;
    line1.y1=aPanel.y-boundingBox;
    line1.x2=aPanel.x+aPanel.width+boundingBox;
    line1.y2=aPanel.y-boundingBox;

    pointer = this.geometrytools.line_line_intersect (line1,line2);

    if (pointer!=null) {
      return (pointer);
    }    

    // Left line
    line1.x1=aPanel.x-boundingBox;
    line1.y1=aPanel.y-boundingBox;
    line1.x2=aPanel.x-boundingBox;
    line1.y2=aPanel.y+aPanel.height+boundingBox;

    pointer = this.geometrytools.line_line_intersect (line1,line2);

    if (pointer!=null) {
      return (pointer);
    }    

    line1.x1=aPanel.x-boundingBox;
    line1.y1=aPanel.y+aPanel.height+boundingBox;
    line1.x2=aPanel.x+aPanel.width+boundingBox;
    line1.y2=aPanel.y+aPanel.height+boundingBox;

    pointer = this.geometrytools.line_line_intersect (line1,line2);

    if (pointer!=null) {
      return (pointer);
    }
    
    line1.x1=aPanel.x+aPanel.width+boundingBox;
    line1.y1=aPanel.y;
    line1.x2=aPanel.x+aPanel.width+boundingBox;
    line1.y2=aPanel.y+aPanel.height;

    pointer = this.geometrytools.line_line_intersect (line1,line2);            

    return (pointer);
  }

  /**
   *
   */
  getNodeFromLocation (aPipeline,aX,aY) {
    for (var i=0;i < aPipeline.nodes.length; i++) {
      var panel=aPipeline.nodes [i];
      if ((aX>=panel.x) && (aY>=panel.y) && (aX<=(panel.x+panel.width)) && (aY<=(panel.y+panel.height))) {
        return panel;
      }
    }
    return (null);
  }

  /**
   *
   */
  getGroupFromLocation (aPipeline,aX,aY) {
    for (var i=0;i < aPipeline.groups.length; i++) {
      var group=aPipeline.groups [i];
      if ((aX>=group.x) && (aY>=group.y) && (aX<=(group.x+group.width)) && (aY<=(group.y+group.height))) {
        return group;
      }
    }
    return (null);
  }  

  /**
   *
   */
  calculateGroupsPanels (updatedGraph) {
    //console.log ("calculateGroupsPanels ()");

    var groups=updatedGraph.groups;
    if (groups==null) {
      console.log ("Internal error: no groups found in graph!");
      return;
    }

    for (var i=0;i<groups.length;i++) {
      //console.log ("Mapping group ...");
      var group=groups [i];
      var groupNodeIds=group.nodes;

      let x1=0;
      let y1=0;
      let x2=10;
      let y2=10; 

      for (var j=0;j<groupNodeIds.length;j++) {
        var groupNodeId=groupNodeIds [j];

        // find the node id first
        var target=this.graphTools.getNodeById (updatedGraph,groupNodeId);

        // then update our bounding rect based on the node's dimensions and placement
        if (target!=null) {
          // To get started simply place the group around the first node
          if (j==0) {
            x1=target.x;
            y1=target.y;
            x2=target.x+target.width;
            y2=target.y+target.height;
          } else {
            if (target.x<=x1) {
              x1=target.x;
            }

            if (target.y<=y1) {
              y1=target.y;
            }

            if ((target.x+target.width)>x2) {
              x2=target.x+target.width;
            }

            if ((target.y+target.height)>y2) {
              y2=target.y+target.height;
            }
          }
        } else {
          console.log ("Internal error: target node not found!");
        }     
      }  

      group.x=x1;
      group.y=y1;
      group.width=x2-x1;
      group.height=y2-y1;          
    }

    return (updatedGraph);
  }

  /**
   * Select all nodes (and edges) within a given boundary rect
   */
  selectInRect (aGraph, aSelection) {
    let shouldDeleteEnable=false;

    let x1=aSelection.x1;
    let y1=aSelection.y1;
    let x2=aSelection.x2;
    let y2=aSelection.y2;

    // Let's not compare to negative dimensions

    if (x1>x2) {
      let temp=x1;
      x1=x2;
      x2=temp;
    }

    if (y1>y2) {
      let temp=y1;
      y1=y2;
      y2=temp;
    }  
   
    // Groups first

    // Then nodes, but only if there wasn't a group found first
    for (var i=0;i < aGraph.nodes.length; i++) {
      var panel=aGraph.nodes [i];
      panel.selected=false;
      if ((x1<=panel.x) && (y1<=panel.y) && (x2>=(panel.x+panel.width)) && (y2>=(panel.y+panel.height))) {
        panel.selected=true;
        shouldDeleteEnable=true;
      }
    }    

    return (shouldDeleteEnable);
  }  
}

export default VisualGraphTools;
