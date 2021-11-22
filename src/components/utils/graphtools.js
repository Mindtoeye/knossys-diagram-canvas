import DataTools from './datatools';

import { INTMODE, PANELDEFS, GRAPHTYPES, GRAPHICSCONSTS } from './constants';

/**
 * 
 */
export default class GraphTools {

  /**
   *
   */
  constructor () {
    this.dataTools=new DataTools ();
  }
	
  /** 
   * @param {any} min
   * @param {any} max
   */
  getRandomArbitrary(min, max) { 
    return Math.random() * (max - min) + min;
  }
	  
  /**
   * 
   */
  generateVisualAttributes (testNode,index) {
	  console.log ("generateVisualAttributes ()");  
	
	  var needLayout=false;
	
    if (!testNode ["dragging"]) {
      testNode ["dragging"]=false;  
      needLayout=true;
    }
        
    if (!testNode ["executionOrder"]) {
      testNode ["executionOrder"]=index;  
      needLayout=true;
    }

    if (!testNode ["resizing"]) {
      testNode ["resizing"]=false;
      needLayout=true;
    }    
        
    // Just in case the layout generation isn't called we'll put in a reasonable valuable
    if (!testNode ["x"]) {
      testNode ["x"]=this.getRandomArbitrary (10,50);
      needLayout=true;
    }

    // Just in case the layout generation isn't called we'll put in a reasonable valuable    
    if (!testNode ["y"]) {
      testNode ["y"]=this.getRandomArbitrary (10,50);
      needLayout=true;
    } 
        
    if (!testNode ["width"]) {
      testNode ["width"]=PANELDEFS.PANELWIDTH;
      needLayout=true;
    }
        
    if (!testNode ["height"]) {
      testNode ["height"]=PANELDEFS.PANELHEIGHT;
      needLayout=true;
    }   
        
    if (!testNode ["inputs"]) {
      testNode ["inputs"]=new Array();
    }
    
    if (testNode ["inputs"].length==0) {
      var input1=new Object ();
      input1.name="primary";
      input1.x=0;
      input1.y=0;
      testNode ["inputs"].push (input1);            
    } 
        
    if (!testNode ["outputs"]) {
      testNode ["outputs"]=new Array();
    }  
     
    if (testNode ["outputs"].length==0) {
      var output1=new Object ();
      output1.name="primary";
      output1.x=0;
      output1.y=0;
      testNode ["outputs"].push (output1);
    }	  
    
    return (needLayout);
  }

  /**
   *
   */
  getNodeById (graph, anId) {
    for (var i=0;i < graph.nodes.length; i++) {
      var aNode=graph.nodes [i];
      if (aNode.uuid==anId) {
        return (aNode);
      }
    }

    return (null);
  }  

  /**
   *
   */
  getNodeByLocation (graph, aX, aY) {
    //console.log ("getNodeByLocation ("+aX+","+aY+")");

    for (var i=0;i < graph.nodes.length; i++) {
      var aNode=graph.nodes [i];
      //console.log (aNode.x+","+aNode.y+"," + aNode.width +"," + aNode.height);
      if ((aX>=aNode.x) && (aY>=aNode.y) && (aX<=(aNode.x+aNode.width)) && (aY<=(aNode.y+aNode.height))) {
        //console.log ("found");
        return (aNode);
      }
    }

    return (null);
  }

  /**
   *
   */
  getSelectedNode (graph, aX, aY) {
    return (this.getNodeByLocation (graph, aX, aY));
  }

  /**
   *
   */
  getSelected (aGraph) {
    for (var i=0;i < aGraph.nodes.length; i++) {
      var aNode=aGraph.nodes [i];
      if (aNode.selected==true) {
        return (aNode);
      }
    }

    return (null);  
  }

  /**
   *
   */
  getHighlightedEdge (aGraph) {
    for (var i=0;i < aGraph.edges.length; i++) {
      var anEdge=aGraph.edges [i];
      if (anEdge.highlighted==true) {
        return (anEdge);
      }
    }

    return (null);  
  }  

  /**
   *
   */
  getEdgeByFromId (graph,aFromId) {
    for (var i=0;i < graph.edges.length; i++) {
      var anEdge=graph.edges [i];
      console.log ("Comparing " + anEdge.from + " to : " + aFromId);
      if (anEdge.from==aFromId) {
        return (anEdge);
      }
    }

    return (null);
  }

  /**
   *
   */
  getEdgeByToId (graph,aToId) {
    for (var i=0;i < graph.edges.length; i++) {
      var anEdge=graph.edges [i];
      console.log ("Comparing " + anEdge.to + " to : " + aToId);
      if (anEdge.to==aToId) {
        return (anEdge);
      }
    }

    return (null);
  }     

  /**
   *
   */
  getEdgeById (graph,anId) {
    for (var i=0;i < graph.edges.length; i++) {
      var anEdge=graph.edges [i];
      if (anEdge.uuid==anId) {
        return (anEdge);
      }
    }

    return (null);    
  }

  /**
   *
   */
  getGroupIdFromNode (graph, aNodeId) {
    //console.log ("getGroupIdFromNode ()");

    var groups=graph.groups;

    for (var i=0;i<groups.length;i++) {
      var group=groups [i];
      var nodes=group.nodes;

      //console.log (group);

      for (var j=0;j<nodes.length;j++) {
        let aTest=nodes [j];
        //console.log ("Comparing: " + aTest + "," + aNodeId);
        if (aTest==aNodeId) {
          //console.log ("Match: " + aTest);
          return (aTest);
        }
      }
    }
    
    return (null);
  }

  /**
   *
   */
  getGroupFromNode (graph, aNodeId) {
    //console.log ("getGroupFromNode ()");

    var groups=graph.groups;

    for (var i=0;i<groups.length;i++) {
      var group=groups [i];
      var nodes=group.nodes;

      for (var j=0;j<nodes.length;j++) {
        var node=nodes [j];
        if (node==aNodeId) {
          return (group);
        }
      }
    }
    
    return (null);
  }  

  /**
   *
   */
  getGroupById (graph, aGroupId) {
    //console.log ("getGroupById ()");

    var groups=graph.groups;

    for (var i=0;i<groups.length;i++) {
      var group=groups [i];
      if (group.uuid==aGroupId) {
        return (group);
      }
    }
    
    return (null);
  }  

  /**
   *
   */
  getGroupByLocation (graph, aX, aY) {
    //console.log ("getGroupByLocation ("+aX+","+aY+")");
    for (var i=0;i < graph.groups.length; i++) {
      var aGroup=graph.groups [i];
      var lowerRightX=aGroup.x+aGroup.width;
      var lowerRightY=aGroup.y+aGroup.height;
      //console.log ("Testing " + aX + "," + aY + ", with " + aGroup.x + "," +aGroup.y + " => " + lowerRightX + "," + lowerRightY);
      if ((aX>=(aGroup.x-GRAPHICSCONSTS.GROUPBORDER)) && (aY>=(aGroup.y-GRAPHICSCONSTS.GROUPBORDER)) && (aX<=(lowerRightX+GRAPHICSCONSTS.GROUPBORDER)) && (aY<=(lowerRightY+GRAPHICSCONSTS.GROUPBORDER))) {
        return (aGroup);
      }
    }

    return (null);
  }

  /**
   *
   */
  getSelectedGroup (graph, aX, aY) {
    return (this.getGroupByLocation (graph, aX, aY));
  }

  /**
   *
   */
  getById (graph, anId) {
    //console.log ("getById ("+anId+")");

    if (anId==null) {
      return (graph);
    }
    
    let aNode=this.getGroupById (graph, anId);
    
    if (aNode!=null) {
      return (aNode);
    }

    aNode=this.getEdgeById (graph, anId);
    
    if (aNode!=null) {
      return (aNode);
    }

    aNode=this.getNodeById (graph, anId);
    
    if (aNode!=null) {
      return (aNode);
    }        

    return (graph);
  }

  /**
   *
   */
  isNode (graph, anEntity) {
    if (anEntity!=null) {
      if (typeof anEntity == "string") {
        for (let i=0;i < graph.nodes.length;i++) {
          if (graph.nodes [i].uuid==anEntity) {
            return (true);
          }
        } 
      } else {
        for (let i=0;i < graph.nodes.length;i++) {
          if (graph.nodes [i].uuid==anEntity.uuid) {
            return (true);
          }
        } 
      }
    }

    return (false);
  }

  /**
   *
   */
  isGroup (graph, anEntity) {
    if (anEntity!=null) {
      if (typeof anEntity == "string") {
        for (let i=0;i < graph.groups.length;i++) {
          if (graph.groups [i].uuid==anEntity) {
            return (true);
          }
        } 
      } else {
        for (let i=0;i < graph.groups.length;i++) {
          if (graph.groups [i].uuid==anEntity.uuid) {
            return (true);
          }
        } 
      }
    }

    return (false)
  }

    /**
   *
   */
  isNodeInGroup (graph, aGroupId,aNodeId) {
    var groups=graph.groups;

    for (var i=0;i<groups.length;i++) {
      var group=groups [i];
      if (group.uuid==aGroupId) {
        for (var j=0;j<group.nodes.length;j++) {
          var uuid=group.nodes [j];
          if (uuid==aNodeId) {
            return (true);
          }
        }
      }
    }
    
    return (false);
  } 

  /**
   *
   */
  isADirectional (graph) {
    console.log ("isADirectional ()");

    for (let i=0;i<graph.edges.length;i++) {
      let edge=graph.edges [i];
      let fromNode=this.getNodeById (graph,edge.from);
      let toNode=this.getNodeById (graph,edge.to);

      if ((toNode.name=="Premise") && (fromNode.name=="Conclusion")) {
        return (true);
      }

      if ((toNode.name=="Conclusion") && (fromNode.name=="Conclusion")) {
        return (true);
      }
      
      if ((toNode.name=="Premise") && (fromNode.name=="Premise")) {
        return (true);
      }            
    } 

    return (false);
  }

  /**
   * It is safe to assume that we have at least something like reasonable
   * x and y coordinates and stable width and height values.
   */
  isCyclic (graph) {
    console.log ("isCyclic ()");
        
    if (graph!=null) {
      for (let i=0;i < graph.nodes.length; i++) {

      }
    }

    return (false);
  }  

  /**
   * It is safe to assume that we have at least something like reasonable
   * x and y coordinates and stable width and height values.
   */
  generateDefaultLayout (aGraph, needLayout) {
    console.log ("generateDefaultLayout ()");

    if (needLayout==false) {
      return;
    }
    
    var xPlace=10;
    var yPlace=50;
    var flip=true;
    
    if (aGraph!=null) {
      for (var i=0;i < aGraph.nodes.length; i++) {
        var testNode = aGraph.nodes [i];
        
        testNode ['x']=xPlace;
        testNode ['y']=yPlace;
        
        xPlace+=(PANELDEFS.PANELWIDTH+20);
        if (flip==true) {
          flip=false;
          yPlace+=(PANELDEFS.PANELHEIGHT*2);
        } else {
          flip=true;
          yPlace-=(PANELDEFS.PANELHEIGHT*2);
        }
      }
    }    
  }

  /**
   * Ideally you will want to do this only once per fresh assignment
   */
  prepGraph (aGraph) {
    console.log ("prepGraph ()");

    var needLayout=true;  

    if (!aGraph.id) {
      aGraph.id="graph";
    }
 
    if (!aGraph.score) {
      aGraph.score="0";
    }

    if (!aGraph.properties) {
      aGraph.properties={
        author: "",
        description: ""
      };
    }

    if (aGraph.groups) {
      for (var k=0;k < aGraph.nodes.length; k++) {
        if (!aGraph.groups [k].notes) {
          aGraph.groups [k].notes=[];
        }
      }
    } else {
      aGraph["groups"]=[];
    }
      
    if (aGraph.nodes) {
      for (var i=0;i < aGraph.nodes.length; i++) {
        aGraph.nodes [i].type=GRAPHTYPES.NODE;

        if (!aGraph.nodes [i].notes) {
          aGraph.nodes [i].notes=[];
        }

        if (!aGraph.nodes [i].selected) {
          aGraph.nodes [i].selected = false;
        }
        if (!aGraph.nodes [i].highlighted) {
          aGraph.nodes [i].highlighted = false;
        }

        // Make this a constant
        if (!aGraph.nodes [i].width) {
          aGraph.nodes [i].width = 150;
        }

        // Make this a constant
        if (!aGraph.nodes [i].height) {
          aGraph.nodes [i].height = 100
        }

        if (!aGraph.nodes [i].uuid) {
         aGraph.nodes [i].uuid=this.dataTools.uuidv4();
        } else {
          if (aGraph.nodes [i].uuid=="") {
            aGraph.nodes [i].uuid=this.dataTools.uuidv4();
          }
        }

        if (!aGraph.nodes [i].x) {
          aGraph.nodes [i].x=10;
        }

        if (!aGraph.nodes [i].y) {
          aGraph.nodes [i].y=10;
        }
        
        if (!aGraph.nodes [i].selected) {
          aGraph.nodes [i].selected=false;
        }                    

        var testNode = aGraph.nodes [i]; 
        
        if (this.generateVisualAttributes (testNode,i)==true) {
          needLayout=true;  
        } 
      }
    } else {
      aGraph ["nodes"]=[];
    }

    if (aGraph.edges) {
      for (let j=0;j < aGraph.edges.length; j++) {
        aGraph.edges [j].type=GRAPHTYPES.EDGE;

        if (!aGraph.edges [j].notes) {
          aGraph.edges [j].notes=[];
        }

        if (!aGraph.edges [j].uuid) {
         aGraph.edges [j].uuid=this.dataTools.uuidv4();
        } else {
          if (aGraph.edges [j].uuid=="") {
            aGraph.edges [j].uuid=this.dataTools.uuidv4();
          }
        }          

        aGraph.edges [j].highlighted=false;
        aGraph.edges [j].selected=false;
      }
    } else {
      aGraph ["edges"]=[];
    }

    this.generateDefaultLayout (aGraph,needLayout);

    return (aGraph);
  }  

  /**
   * 
   */
  generateGraphString (aGraph) {    
    var graphString=JSON.stringify (aGraph, null, 4);
    return (graphString);
  }  

  /**
   * 
   */
  generateSummary (aGraph,aFeedback) {
    let result="Document summary: ";
    let hasDescription=false;
 
    if (aGraph.properties) {
      if (aGraph.properties.description) {
        if (aGraph.properties.description!="") {
          result+=('The decription for this diagram says: "' + aGraph.properties.description + '"');
          hasDescription=true;
        }
      }
    } 
    
    if (hasDescription==false) {
      result+=("This diagram does not have a description yet.");
    }

    result+=" ";

    result+="There are " + aGraph.nodes.length + " reasons defined in this diagram and those reasons are linked using " + aGraph.edges.length + " connections.";

    result+=" ";

    if (aFeedback!="") {      
      if (Array.isArray(aFeedback)==true){
        result+="There is feedback for this diagram, which says: ";
        for (let i=0;i<aFeedback.length;i++){
          if (i>0) {
            result+=" ";
          }
          result+=aFeedback [i].details.replace( /(<([^>]+)>)/ig, '');
        }
        result+=" ";         
      } else {
        result+="There is feedback for this diagram, which says: " + aFeedback.replace( /(<([^>]+)>)/ig, '');
        result+=" "; 
      }
    }
    
    return (result);
  }
}
