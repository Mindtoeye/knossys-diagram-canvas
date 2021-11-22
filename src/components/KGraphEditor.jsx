import React, { Component } from 'react';

import DataTools from './utils/datatools';
import GraphTools from './utils/graphtools';
import ToolbarTools from './utils/toolbartools';
import DataPermanence from './utils/datapermanence';

import WindowController from './windowtools/windowcontroller';
import WindowBlocker from './WindowBlocker';
import GraphController from './graphelements/graphcontroller';
import GraphEditor from './GraphEditor';
import ToolBar from './ToolBar';
import ToolButtonFloat from './ToolButtonFloat';
import ExportWindow from './ExportWindow';
import ImportWindow from './ImportWindow';
import DocumentPropertiesDialog from './DocumentPropertiesDialog';
import NoteManager from './NoteManager';
import PanelSettings from './panels/PanelSettings';

import TextEditor from './panels/TextEditor';
import StringEditor from './panels/StringEditor';

import './css/main.css';
import './css/toolbar.css';
import './css/diagrammer.css';
import './css/dividers.css';
import './css/minibuttons.css';

import { menu } from './data/menu';

import { INTMODE } from './utils/constants';
import { GRAPHTYPES } from './utils/constants';

/**
 * 
 */
class KGraphEditor extends Component {

  /**
   *
   */
  constructor(props) {
    super(props);

    console.log ("KGraphEditor ()");

    this.factory=props.factory;

    this.feedbackChain=[];

    this.dataTools=new DataTools ();
    this.graphTools=new GraphTools ();
    this.toolbarTools=new ToolbarTools ();
    this.permanence=new DataPermanence (this);

    let blocker=false;
    let newGraph=this.graphTools.prepGraph (this.props.factory.newGraph ());

    // We can call this method in the constructor because there is no server call dependency
    if (this.permanence.getDataSource ()=="OLI") {
      blocker=true;
    }

    let compositeMenu=this.dataTools.deepCopy (menu);

    let nodeMenu=this.toolbarTools.findById ("nodes",compositeMenu.items);
    if (nodeMenu!=null) {
      console.log ("Attaching sub menu ...");
      nodeMenu.items=this.factory.getGraphSettings ().nodeTypes;
    } else {
      console.log ("Internal error, unable to find the target menu item to attach the reason submenu to")
    }

    let gridValue=false;
    let labelValue = false;   
    let groupings=[];

    if (this.factory.getGraphSettings ().hasOwnProperty ("groupings")==true) {
      console.log ("Using groupings")
      groupings=this.factory.getGraphSettings ().groupings;
    }

    this.state = {
      graph: newGraph,
      editNode: null,
      editNote: null,
      menu: compositeMenu,
      nodeTypes: this.factory.getGraphSettings ().nodeTypes,
      groupings: groupings,
      rules: this.factory.getGraphSettings ().rules,
      status: "",
      selected: null,
      mode: INTMODE.SELECT,
      subEnabled: false,
      mouseBlocked: false,
      showAccessibility: false,
      lastFeedback: "",
      windowSettings: {
        blocking: blocker
      },
      globalSettings: {
        darkMode: true,
        showLabels: labelValue,
        showGrid: gridValue,
        showBlocker: blocker,
        showStack: false,
        showFontPanel: false,
        showNoteManager: false,
        showExportWindow: false,
        showImportWindow: false,
        showFeedback: false,
        showNodeEditor: false,
        showPanelSettings: false
      },
      keys: {
        altKey: false,
        charCode: 0,
        keyCode: 0,
        ctrlKey: false,
        numCode: 0,
        metaKey: false,
        shiftKey: false
      },
      dialog: null,
      window: null
    };
      
    this.handleIconClicked = this.handleIconClicked.bind(this);
    this.exportGraph = this.exportGraph.bind(this);
    this.toggleSelect = this.toggleSelect.bind(this);
    this.enableButtons = this.enableButtons.bind(this);
    this.disableButtons = this.disableButtons.bind(this);
    this.blockMouse = this.blockMouse.bind(this);
  
    this.editNode = this.editNode.bind(this);
    this.editNote = this.editNote.bind (this);
    this.selectNote = this.selectNote.bind (this);
    this.setModeSelect = this.setModeSelect.bind (this);

    this.setGraphData = this.setGraphData.bind (this);
    this.getGraphCopy = this.getGraphCopy.bind (this);

    this.changePanelSettings = this.changePanelSettings.bind (this);
    this.onProcessPanelChange = this.onProcessPanelChange.bind (this);

    this.getStoredData = this.getStoredData.bind (this);

    //this.graphController = new GraphController (this.updateGraph);
    this.windowController = new WindowController (this.setStateExternal.bind(this), 
                                                  this.getState.bind(this),
                                                  this.setGraphData.bind(this),
                                                  this.getGraphCopy.bind(this),
                                                  this.onWindowClose.bind(this));
  }

  /**
   *
   */
  onWindowClose (aWindowId) {
    console.log ("onWindowClose ("+aWindowId+")");

    /*
    this.setState ({
      globalSettings: {
        showStack: false,
        showFontPanel: false,
        showNoteManager: false,
        showExportWindow: false,
        showImportWindow: false,
        showFeedback: false,
        showNodeEditor: false,
        showPanelSettings: false
      }
    });
    */
  }

  /**
   *
   */
  getStoredData () {
    console.log ("getStoredData ()");

    let gridValue=this.permanence.getValue ("showGrid");
    let labelValue=this.permanence.getValue ("showLabels");

    if (gridValue==='true') {
      gridValue=true;
    } else {
      gridValue=false;
    }

    if (labelValue==='true') {
      labelValue=true;
    } else {
      labelValue=false;
    }

    // Make sure we start with a fresh template graph
    let newGraph=this.getBasicGraph ();

    let storedGraph=this.permanence.getValueEncoded ("graph");
  
    if (storedGraph!="") {
      newGraph=JSON.parse (storedGraph);
      newGraph.id="graph";
      newGraph.type=GRAPHTYPES.GRAPH;

      if (newGraph.feedbackhistory) {
        this.feedbackChain=this.dataTools.deepCopy (newGraph.feedbackhistory);
      } else {
        console.log ("Info: graph does not have any feedback history");
      }
    }
 
    if (newGraph==null) {
      if (this.props.factory) {
        newGraph=this.graphTools.prepGraph (this.props.factory.newGraph ());
        newGraph.id="graph";
        newGraph.type=GRAPHTYPES.GRAPH;
      } else {
        console.log ("No factory available to generate graph template");
      }
    }

    var updatedGlobalSettings=this.dataTools.deepCopy (this.state.globalSettings);

    updatedGlobalSettings.showLabels=labelValue;
    updatedGlobalSettings.showGrid=gridValue;

    var updatedWindowSettings=this.dataTools.deepCopy (this.state.windowSettings);
    updatedWindowSettings.blocking=false;

    if (!newGraph.score) {
      newGraph.score="0";
    }

    if (!newGraph.id) {
      newGraph.id="graph";
    }    

    this.refs ["grapheditor"].setGraphData (newGraph,"Graph Loaded",() => {
      this.setState ({
        windowSettings: updatedWindowSettings,
        globalSettings: updatedGlobalSettings
      });      
    })
  }

  /**
   *
   */
  getBasicGraph () {
    return ({"name": "", "uuid": this.dataTools.uuidv4(), properties: {author: "", description: ""},"settings": [],"nodes": [],"edges": [], "notes": [],"groups": []});
  }

  /**
   *
   */
  graphLoaded () {
    console.log ("graphLoaded ()");

    this.getStoredData ();    
  }

  /**
   *
   */
  componentDidMount () {
    this.toggleSelect ();
    this.disableButtons ();

    document.addEventListener("keyup", this.onKeyUp.bind(this));
    document.addEventListener("keydown", this.onKeyDown.bind(this));

    if (this.permanence.getDataSource ()=="COOKIE") {
      this.getStoredData ();
    }
  } 
    
  /**
   *
   */
  toggleSelect () {
    this.refs ["select"].toggleDefaultItem ("1");
  }

  /**
   *
   */
  setGraphData (aNewGraph,aCallback,aDebugLabel) {
    if (aDebugLabel){
      console.log ("iLogos:setGraphData ()");
    }

    //console.log ("Integrating feedback chain ...");
    //console.log (this.feedbackChain);
    aNewGraph.feedbackhistory=this.dataTools.deepCopy (this.feedbackChain);

    this.setState ({graph: aNewGraph},(e) => {
      if (aCallback) {
        aCallback (this.state.graph);
      }
    });
  }

  /**
   *
   */
  /* 
  getGraphData () {
    //console.log ("getGraphData ()");
    return (this.factory.newGraph());
  }
  */

  /**
   *
   */
  getGraphCopy () {
    //console.log ("getGraphCopy ()");
    let graphCopy=this.dataTools.deepCopy (this.state.graph);
    return (graphCopy);
  }  

  /**
   *
   */
  getState () {
    return (this.state);
  }

  /**
   *
   */
  setStateExternal (aWindowState) {    
    this.setState ({windowSettings: aWindowState});
  }  

  /**
   * 
   */  
  handleIconClicked (anId,anItem) {
    let e=anId;

    if (anItem) {
      e=anItem.id;
    }

    console.log ("handleIconClicked ("+e+")");

    this.setState ({selected: anItem});
 
    if (e=="1") {
      console.log ("Operation:Select");
      this.refs ["grapheditor"].setMode (INTMODE.SELECT);
      this.setState ({mode: INTMODE.SELECT});
    }

    if (e=="24") {
      console.log ("Operation:Pan");
      this.refs ["grapheditor"].setMode (INTMODE.PAN);
      this.setState ({mode: INTMODE.PAN});
    }    

    if (e=="2") {
      console.log ("Operation:AddArgumentation");
      this.refs ["grapheditor"].setMode (INTMODE.LINK_BLACK);
      this.setState ({mode: INTMODE.LINK_BLACK});
    }

    if (e=="3") {
      console.log ("Operation:AddRefutation");
      this.refs ["grapheditor"].setMode (INTMODE.LINK_RED);
      this.setState ({mode: INTMODE.LINK_RED});
    }

    if (e=="35") {
      console.log ("Operation:AddReply");
      this.refs ["grapheditor"].setMode (INTMODE.LINK_BLUE);
      this.setState ({mode: INTMODE.LINK_BLUE});
    }

    //>--------------------------------------------------------

    if (e=="5") {
      console.log ("Operation:LinkArgument");
      this.refs ["grapheditor"].createGroup ();
    }

    if (e=="6") {
      console.log ("Operation:UnlinkArgument");
      this.refs ["grapheditor"].deleteGroup (true);
    }

    if (e=="7") {
      console.log ("Operation:DeleteArgument");
      this.refs ["grapheditor"].deleteElement ();
    }

    //>--------------------------------------------------------    
    
    if (e=="8") {
      console.log ("Operation:ToggleGrid");
      this.showGrid ();
    }

    if (e=="23") {
      console.log ("Operation:ToggleLabels");
      this.showLabels ();
    }
    
    if (e=="9") {
      console.log ("Operation:undo");
      this.refs ["grapheditor"].doUndo (); 
    }
    
    if (e=="10") {
      console.log ("Operation:redo");
      this.refs ["grapheditor"].doRedo ();
    }      
    
    //>--------------------------------------------------------

    if (e=="11") {
      console.log ("Operation:showStack");
      this.showStack ();
    }       

    if (e=="12") {
      console.log ("Operation:showFontPanel");
      this.showFontPanel ();
    }

    if (e=="13") {
      console.log ("Operation:showNotePanel");
      this.showNoteManager (null);
    }

    if (e=="minimap") {
      console.log ("Operation:showMiniMap");
      this.showMiniMap ();
    }

    if (e=="export") {
      console.log ("Operation:Export");
      this.exportGraph ();
    }

    if (e=="import") {
      console.log ("Operation:Import");
      this.importGraph ();
    }

    if (e=="properties") {
      console.log ("Operation:DocumentProperties");
      this.showDocumentProperties ();
    }    

    if (e=="new") {      
      var r = confirm("Are you sure you want to discard your current data and start with a blank document?");

      if (r == true) {
        console.log ("Operation:DocumentNew");
        this.newDocument ();
      }
    }

    if (e=="module") { 
      console.log ("Operation:createModule");
      this.refs ["grapheditor"].addNode (this.dataTools.getRandomInt(5,50),this.dataTools.getRandomInt(5,50),"Module", "module");
    }

    if (e=="premise") { 
      console.log ("Operation:createPremise");
      this.refs ["grapheditor"].addNode (this.dataTools.getRandomInt(5,50),this.dataTools.getRandomInt(5,50),"Module", "module");
    }

    if (e=="premise") { 
      console.log ("Operation:createPremise");
      this.refs ["grapheditor"].addNode (this.dataTools.getRandomInt(5,50),this.dataTools.getRandomInt(5,50),"Premise", "premise");
    }    

    if (e=="conclusion") { 
      console.log ("Operation:createConclusion");
      this.refs ["grapheditor"].addNode (this.dataTools.getRandomInt(5,50),this.dataTools.getRandomInt(5,50),"Conclusion", "conclusion");
    }

    if (e=="subconclusion") { 
      console.log ("Operation:createSubConclusion");
      this.refs ["grapheditor"].addNode (this.dataTools.getRandomInt(5,50),this.dataTools.getRandomInt(5,50),"Sub-Conclusion", "subconclusion");
    }
    
    if (e=="objection") { 
      console.log ("Operation:createObjection");
      this.refs ["grapheditor"].addNode (this.dataTools.getRandomInt(5,50),this.dataTools.getRandomInt(5,50),"Objection", "objection");
    }
    
    if (e=="reply") { 
      console.log ("Operation:createReply");
      this.refs ["grapheditor"].addNode (this.dataTools.getRandomInt(5,50),this.dataTools.getRandomInt(5,50),"Reply", "reply");
    }            

    if (e=="accessibility") { 
      if (this.state.showAccessibility==false) {
        this.setState ({showAccessibility: true});
      } else {
        this.setState ({showAccessibility: false});
      }
    }      
  }

  /**
   *
   */
  newDocument () {
    console.log ("newDocument ()");

    this.refs ["grapheditor"].resetUndo((e) => {
      let newGraph={};
      this.feedbackChain=[];

      if (this.props.factory) {
        newGraph=this.graphTools.prepGraph (this.factory.newGraph ());
        newGraph.id="graph";
        newGraph.type=GRAPHTYPES.GRAPH;
      } else {
        console.log ("No factory available to generate graph template");
        newGraph=this.graphTools.prepGraph (newGraph);
      }

      this.refs ["grapheditor"].setGraphData (newGraph,"New Graph",()=>{
        this.refs ["grapheditor"].closeFeedbackWindow ();
      });    
    });
  }  

  /**
   *
   */
  showHelpWindow () {
    console.log ("showHelpwindow ()");

    var updatedSettings=this.dataTools.deepCopy (this.state.globalSettings);

    updatedSettings.showHelpWindow=true;

    this.setState ({globalSettings : updatedSettings});
  }  

  /**
   *
   */
  exportGraph () {
    console.log ("exportGraph ()");

    var updatedSettings=this.dataTools.deepCopy (this.state.globalSettings);

    updatedSettings.showExportWindow=true;

    this.setState ({globalSettings : updatedSettings});
  }

  /**
   *
   */
  importGraph () {
    console.log ("importGraph ()");

    var updatedSettings=this.dataTools.deepCopy (this.state.globalSettings);

    updatedSettings.showImportWindow=true;

    this.setState ({globalSettings : updatedSettings});
  }

  /**
   *
   */
  showGrid () {
    console.log ("showGrid ()");

    var updatedSettings=this.dataTools.deepCopy (this.state.globalSettings);

    if (updatedSettings.showGrid==false) {
      updatedSettings.showGrid=true;
    } else {
      updatedSettings.showGrid=false;      
    }

    this.setState ({globalSettings : updatedSettings},(e) => {
      this.permanence.setValue ("showGrid",String (updatedSettings.showGrid));
    });
  }

  /**
   *
   */
  showLabels () {
    console.log ("showLabels ()");

    var updatedSettings=this.dataTools.deepCopy (this.state.globalSettings);

    if (updatedSettings.showLabels==false) {
      updatedSettings.showLabels=true;
    } else {
      updatedSettings.showLabels=false;      
    }

    this.setState ({globalSettings : updatedSettings},(e) => {
      this.permanence.setValue ("showLabels",String (updatedSettings.showLabels));
    });
  }  

  /**
   *
   */
  showStack () {
    console.log ("showStack ()");

    var updatedSettings=this.dataTools.deepCopy (this.state.globalSettings);

    if (updatedSettings.showStack==true) {
      updatedSettings.showStack=false;
    } else {
      updatedSettings.showStack=true;
    }

    this.setState ({globalSettings : updatedSettings});
  }

  /**
   *
   */
  showFontPanel () {
    console.log ("showFontPanel ()");

    var updatedSettings=this.dataTools.deepCopy (this.state.globalSettings);

    if (updatedSettings.showFontPanel==true) {
      updatedSettings.showFontPanel=false;
    } else {
      updatedSettings.showFontPanel=true;
    }

    this.setState ({globalSettings : updatedSettings});
  }  

  /**
   *
   */
  showNoteManager (aNode) {
    console.log ("showNoteManager ()");

    var updatedSettings=this.dataTools.deepCopy (this.state.globalSettings);

    if (updatedSettings.showNoteManager==true) {
      updatedSettings.showNoteManager=false;
    } else {
      updatedSettings.showNoteManager=true;
    }

    this.setState ({editNote: aNode, globalSettings : updatedSettings}); 
  }

  /**
   *
   */
  showMiniMap () {
    console.log ("showMiniMap ()");

    var updatedSettings=this.dataTools.deepCopy (this.state.globalSettings);

    if (updatedSettings.showMiniMap==true) {
      updatedSettings.showMiniMap=false;
    } else {
      updatedSettings.showMiniMap=true;
    }

    this.setState ({globalSettings : updatedSettings});    
  }

  /**
   *
   */
  showDocumentProperties () {
    var updatedSettings=this.dataTools.deepCopy (this.state.globalSettings);

    updatedSettings.showDocumentProperties=true;
    
    this.setState ({globalSettings : updatedSettings});        
  }

  /**
   *
   */
  selectNode (aData) {
    if (aData!=null) {
      console.log ("selectNode (mousedown)");
      console.log (JSON.stringify (aData));
    }
  }

  /**
   *
   */
  setModeSelect () {
    this.refs ["grapheditor"].setMode (INTMODE.SELECT);
    this.setState ({mode: INTMODE.SELECT});

    this.toggleSelect ();
  }

  /**
   *
   */
  generateNewNode () {
    console.log ("generateNewNode ()");

    let newNode=this.factory.newNode ();
    newNode.id="node";
    newNode.type=GRAPHTYPES.NODE;

    return (newNode);
  }

  /**
   *
   */
  generateNewEdge () {
    console.log ("generateNewEdge ()");

    /*
    this.refs ["grapheditor"].setMode (INTMODE.SELECT);
    this.setState ({mode: INTMODE.SELECT});

    this.toggleSelect ();
    */

    let newEdge=this.factory.newEdge ();
    newEdge.id="edge";
    newEdge.type=GRAPHTYPES.EDGE;

    return (newEdge);

    //return (this.factory.newEdge ());
  }

  /**
   *
   */
  evaluateData (anAction) {
    console.log ("evaluateData ("+anAction+")");

    let feedback=this.generateFeedback ();
    let OLI=this.permanence.getOLIActivity ();

    if (feedback) {
      if (feedback.length) {
        if (feedback.length>0) {

          for (let i=0;i<feedback.length;i++) {
            let feedbackObject=feedback [i];

            console.log ("Adding feedback object to chain ...");
            this.feedbackChain.push (feedbackObject);

            if (OLI!=null) {  
              OLI.logInCorrectStep (OLI.getQuestionId (),anAction,feedbackObject.details);
            }
          }
        }
      } else {
        console.log ("Possible internal error: feedback has no length");
      }
    } else {
      console.log ("Possible internal error: feedback is undefined");
    }

    if (feedback) {
      if (feedback.length==0) {
        if (OLI!=null) {  
          OLI.logCorrect (OLI.getQuestionId (),anAction);
        }
      }
    } else {
      if (OLI!=null) {  
        OLI.logCorrect (OLI.getQuestionId (),anAction);
      }
    }


    this.setState({lastFeedback: feedback});

    return (feedback);
  }

  /**
   *
   */
  addFeedback (aFeedback,aType,aContent) {
    for (let i=0;i<aFeedback.length;i++) {
      let testFeedback=aFeedback [i];
      // We already have this one
      if (testFeedback.details==aContent) {
        return (aFeedback);
      }
    }

    aFeedback.push ({
      "issue": aType,
      "details": aContent
    });    
    
    return (aFeedback);
  }

  /**
   *
   */
  generateFeedback (anAction) {
    console.log ("generateFeedback ()");

    let feedback=[];

    var graph=this.refs ["grapheditor"].getGraphData ();

    // First check is to see if any conclusions are connected the wrong way to
    // premises

    /*
    if (this.graphTools.isADirectional (graph)==true) {
      return ({ 
        "issue": "adirectional", 
        "details": "You can not connect these two nodes in that way"});
    }

    if (this.graphTools.isCyclic (graph)==true) {
      return ({ 
        "issue": "cyclic", 
        "details": "You have a cyclic argument, please change your arguments"});
    }
    */

    for (let l=0;l<graph.edges.length;l++) {
      let edge=graph.edges [l];
      if (edge.fresh==true) {
        let from=edge.from;
        let to=edge.to;

        if (this.graphTools.getEdgeById (graph,to)!=null) {
          let fromNode=this.graphTools.getNodeById (graph,from);
          
          // We're testing the inverse from what we're after. We only need
          // to find those cases in which an element that isn't an objection
          // or a group of objections is creating a link to a link

          if (fromNode!=null) { // Could be a group 
            //console.log ("We have a from node");

            if (fromNode.id!="objection") {
              //console.log ("Found a non-objection from node");

              let target=this.graphTools.getEdgeById (graph,to);
              if (target!=null) {
                //console.log ("The to id represents an edge");
                /*
                feedback.push ({
                  "issue": "mismatch",
                  "details": "You can only draw an arrow to another arrow if the arrow is coming from an objection or a group of objections"
                });
                */
                feedback=this.addFeedback (feedback,"mismatch","You can only draw an arrow to another arrow if the arrow is coming from an objection or a group of objections");
                return(feedback);
              }
            }          
          } else {
            //console.log ("There is no from node for this edge, maybe it's a group");

            let fromGroup=this.graphTools.getGroupById (graph,from);

            if (fromGroup!=null) {
              //console.log ("It is indeed a group");
              let testList=fromGroup.nodes;
              let found=true;
              for (let m=0;m<testList.length;m++) {
                let testNodeId=testList [m];
                let testNode=this.graphTools.getNodeById(graph,testNodeId);
                if (testNode!=null) {
                  if (testNode.id!="objection") {
                    console.log ("Bump: " + testNode.id);
                    found=false;
                  } 
                }
              }

              if (found==false) {
                /*
                feedback.push ({
                  "issue": "mismatch",
                  "details": "You can only draw an arrow to another arrow if the arrow is coming from an objection or a group of objections"
                });
                */
                feedback=this.addFeedback (feedback,"mismatch","You can only draw an arrow to another arrow if the arrow is coming from an objection or a group of objections");
                return(feedback);
              }            
            }
          }
        } else {
          console.log ("The target element is not an edge, we don't have to do edge to edge checking");
        }
      }
    }

    for (let i=0;i<this.state.rules.length;i++) {
      let ruleObject=this.state.rules [i];

      console.log ("Prepping rule string: '" + ruleObject.rule + "'");

      let splitter=ruleObject.rule.split (" ");

      if (splitter.length>2) {
        console.log ("Checking rule with length: " + splitter.length);

        let from=splitter [0].toLowerCase().trim();
        let operator=splitter [1].trim();
        let to=splitter [2].toLowerCase().trim();

        for (let j=0;j<graph.edges.length;j++) {
          let edge=graph.edges [j];
          if (edge.fresh==true) {
            // We can't process any rules right now in case the arrow comes from a group
            if (this.graphTools.isGroup (graph,edge.from)==false) {
              let fromNode=this.graphTools.getNodeById (graph,edge.from);
              let toNode=this.graphTools.getNodeById (graph,edge.to);

              if (fromNode==null) {
                console.log ("Internal error: unable to retrieve the node from which a link was created");
                return;
              }

               if (toNode==null) {
                console.log ("Internal error: unable to retrieve the node to which a link was created");
                return;
              }

              let fromTest=fromNode.id.toLowerCase().trim();
              let toTest=toNode.id.toLowerCase().trim();

              if (from=="*") {
                fromTest="*";
              }

              if (to=="*") {
                toTest="*";
              }

              console.log ("from:(" + fromTest + ", " + from + ") && to:("+toTest+", "+to+")");           
              
              // Test to see if we should swap operands. Swap sides and operators so that we only 
              // have 1 rule to check in code
              
              let swap=false;

              if (operator=="<!") {
                operator="!>";
                swap=true;
              }

              if (operator=="<") {
                operator=">";
                swap=true;
              }

              if (swap==true) {
                console.log ("Swapping operands ...");
                let tmpFrom=from;
                from=fromTest;
                fromTest=tmpFrom;

                let tmpTo=to;
                to=toTest;
                toTest=tmpTo;
              }

              // Now we can test the rules in turn

              //>----------------------------------------------------------------------------------

              if ((fromTest==from) && (toTest==to) && (operator=="!>")) {
                console.log ("Matched operator !>");

                console.log ("Firing rule: " + ruleObject.feedback);

                /*  
                feedback.push ({
                  "issue": "mismatch",
                  "details": ruleObject.feedback
                });
                */

                feedback=this.addFeedback (feedback,"mismatch",ruleObject.feedback);
              }

              //>----------------------------------------------------------------------------------

              if ((fromTest==from) && (operator==">")) {
                console.log ("Matched operator >, testing against: " + to);

                let targets=to.split (";");
                console.log ("Testing against option(s): " + JSON.stringify(targets));
                let found=false;
                for (let w=0;w<targets.length;w++) {
                  console.log ("Comparing " + targets [w].trim () + " to: " + toTest);
                  if (targets [w].trim ()==toTest) {
                    found=true;
                  }
                }
                if (found==false) {
                  /*
                  feedback.push ({
                    "issue": "mismatch",
                    "details": ruleObject.feedback
                  });
                  */
                  feedback=this.addFeedback (feedback,"mismatch",ruleObject.feedback);
                }           
              }

              //>----------------------------------------------------------------------------------

            } else {
              console.log ("We don't have or check rules for groups yet");
            }
          }
        }         
      }
    }
         
    return (feedback);
  }

  /**
   * https://www.w3schools.com/jsref/obj_keyboardevent.asp
   */
  onKeyDown (e) {
    //console.log ("onKeyDown ()");

    this.setState ({
      keys: {
        altKey: e.altKey,
        charCode: e.charCode,
        keyCode: e.keyCode,
        ctrlKey: e.ctrlKey,
        numCode: e.code,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey
      }
    });
  }

  /**
   * https://www.w3schools.com/jsref/obj_keyboardevent.asp
   */
  onKeyUp (e) {
    //console.log ("onKeyUp ("+e.keyCode+")");

    if (window.appBlocked==true) {
      //console.log ("App blocked, bump");
      return;
    }

    if ((e.keyCode==90) && (e.ctrlKey==true)) {
      //this.doUndo();
      this.refs ["grapheditor"].doUndo (); 
    }

    if ((e.keyCode==89) && (e.ctrlKey==true)) {
      //this.doRedo();
      this.refs ["grapheditor"].doRedo (); 
    }    

    if (e.keyCode==46) {
      this.refs ["grapheditor"].deleteElement ();
    }

    this.setState ({
      keys: {
        altKey: e.altKey,
        charCode: e.charCode,
        keyCode: e.keyCode,
        ctrlKey: e.ctrlKey,
        numCode: e.code,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey
      }
    });    
  }

  /**
   *
   */
  onDialogOk () {
    console.log ("onDialogOk ()");

    var updatedSettings=this.dataTools.deepCopy (this.state.globalSettings);

    updatedSettings.showHelpWindow=false;
    updatedSettings.showExportWindow=false;
    updatedSettings.showImportWindow=false;
    updatedSettings.showDocumentProperties=false;

    this.setState ({globalSettings : updatedSettings});
  }

  /**
   *
   */
  onWindowClose () {
    console.log ("onWindowClose ()");

    var updatedSettings=this.dataTools.deepCopy (this.state.globalSettings);

    updatedSettings.showNoteManager=false;

    this.setState ({win: null, globalSettings : updatedSettings});
  }

  /**
   *
   */
  disableButtons () {
    this.refs ["select"].enableItem ("5,6,7",false);
    this.refs ["select"].enableItem ("undo,redo",false);
  }

  /**
   *
   */
  enableButtons () {
    this.refs ["select"].enableItem ("5,6,7",true);
  }

  /**
   *
   */
  blockMouse (aValue) {
    console.log ("blockMouse ("+aValue+")");

    this.setState ({
      blockMouse: aValue
    });
  }
  
  /**
   *
   */
  enableFunctions (aSelected) {
    //console.log ("enableFunctions ("+aSelected+")");

    if (aSelected==true) {
      this.enableButtons (aSelected);
    }

    if (aSelected==false) {
      this.disableButtons (aSelected);
    }    
  }

  /**
   *
   */
  updateUndoRedo () {
    console.log ("updateUndoRedo ("+this.refs ["grapheditor"].getDoUndoStack ().length+")");

    if (this.refs ["grapheditor"].getDoUndoStack ().length>0) {
      this.refs ["select"].enableItem ("undo,redo",true);
    } else {
      this.refs ["select"].enableItem ("undo,redo",false);
    }
  }

  /**
   *
   */
  editNode (aNodeID) {
    console.log ("editNode ("+aNodeID+")");
    
    let aNode=this.graphTools.getNodeById (this.state.graph,aNodeID);

    // Could also be an edge
    if (aNode==null) {
      console.log ("Node ID is not a node, could be an edge ...");
      aNode=this.graphTools.getEdgeById (this.state.graph,aNodeID);
    }

    if (aNode==null) {
      console.log ("Internal error: can't find object to edit");
      return;
    }

    console.log ("Editing node with type: " + aNode.class);

    // Turn this into a data driven mechanism!
    if (aNode.class) {
      if(aNode.class=="GraphPanelModule") {
        console.log ("This type of node does not have a global editor!");
        return;
      }
    }

    var updatedWindowSettings=this.dataTools.deepCopy (this.state.windowSettings);
    var updatedSettings=this.dataTools.deepCopy (this.state.globalSettings);

    updatedWindowSettings.blocking=true;
    updatedSettings.showNodeEditor=true;

    this.setState ({
      windowSettings : updatedWindowSettings,
      globalSettings : updatedSettings,
      editNode: aNode
    }); 
  }

  /**
   *
   */
  onNodeChange (aValue) {
    if (aValue==null) {
      console.log ("onNodeChange () => No change");

      var updatedWindowSettings=this.dataTools.deepCopy (this.state.windowSettings);
      var updatedSettings=this.dataTools.deepCopy (this.state.globalSettings);

      updatedWindowSettings.blocking=false;
      updatedSettings.showNodeEditor=false;

      this.setState ({
        windowSettings : updatedWindowSettings,
        globalSettings : updatedSettings,
        editNode: null
      }); 

      return;
    }

    //let aValue=window.atob (aValue);

    var updatedWindowSettings=this.dataTools.deepCopy (this.state.windowSettings);
    var updatedSettings=this.dataTools.deepCopy (this.state.globalSettings);

    updatedWindowSettings.blocking=false;
    updatedSettings.showNodeEditor=false;

    var graph=this.dataTools.deepCopy (this.state.graph);

    let aNode=this.graphTools.getNodeById (graph,this.state.editNode.uuid);

    // Could also be an edge
    if (aNode==null) {
      console.log ("Node ID is not a node, could be an edge ...");
      aNode=this.graphTools.getEdgeById (graph,this.state.editNode.uuid);
    }

    if (aNode==null) {
      console.log ("Internal error: can't find object to edit");
      return;
    }

    aNode.content=aValue;

    this.setState ({
      windowSettings : updatedWindowSettings,
      globalSettings : updatedSettings,
      editNode: null,
      graph: graph
    }); 
  }

  /**
   *
   */
  editNote (e) {
    console.log ("iLogos:editNote ("+e+")");

    var updatedSettings=this.dataTools.deepCopy (this.state.globalSettings);
    updatedSettings.showNoteManager=true;

    this.setState ({editNote: e, globalSettings : updatedSettings}); 
  }

  /**
   *
   */
  selectNote (aSource,aNoteId) {
    console.log ("iLogos:selectNote ("+aSource+","+aNoteId+")");

    var graph=this.dataTools.deepCopy (this.state.graph);

    let node=this.graphTools.getById (graph,aSource);
    if (node!=null) {      
      for (let i=0;i<node.notes.length;i++) {
        let note=node.notes [i];        
        note.selected=false;
        if (note.uuid==aNoteId) {
          note.selected=true;
        }
      }
    }

    this.setState ({graph: graph}); 
  }

  /**
   *
   */
  changePanelSettings (aPanelId) {
    //console.log ("changePanelSettings ("+aPanelId+")");
    
    let updatedSettings=this.dataTools.deepCopy (this.state.globalSettings);
    updatedSettings.showPanelSettings=true;

    for (let i=0;i<this.state.graph.nodes.length;i++) {
      let aPanel=this.state.graph.nodes [i];
      if (aPanel.uuid==aPanelId) {
      
        // Check for membership first
        
        if (this.graphTools.getGroupFromNode (this.state.graph,aPanel.uuid)!=null) {
          this.refs ["grapheditor"].showFeedbackString ("You can't currently change the type when grouped");
          return;
        }

        // We're good to go
        this.setState ({
          selected: aPanel, 
          globalSettings: updatedSettings
        });
      }
    }
  }

  /**
   *
   */
  onProcessPanelChange (newPanelValue, aPanel) {
    console.log ("onProcessPanelChange ("+newPanelValue+")");

    let updatedSettings=this.dataTools.deepCopy (this.state.globalSettings);
    updatedSettings.showPanelSettings=false;

    // The user canceled
    if (newPanelValue=="") {
      this.setState ({
        selected: null,
        globalSettings: updatedSettings
      });
      return;
    }

    //var updatedGraph=this.dataTools.deepCopy (this.state.graph);
    let newGraph=this.getGraphCopy ();

    for (let i=0;i<newGraph.nodes.length;i++) {
      let aNode=newGraph.nodes [i];
      if (aNode.uuid==aPanel.uuid) {
        for (let j=0;j<this.state.nodeTypes.length;j++) {
          let aType=this.state.nodeTypes [j];

          if (aType.id==newPanelValue) {
            newGraph.nodes [i].id=aType.id;
            newGraph.nodes [i].name=aType.title;
          }
        }
      }
    }

    // Make sure we check all edges!
    for (let j=0;j<newGraph.edges.length;j++) {
      newGraph.edges [j].fresh=true;
    }

    this.setGraphData (newGraph, () => {
      this.setState ({        
          selected: null,
          globalSettings: updatedSettings
        },(e) => {
          // Now that we've made potentially fundamental changes to the model, we should
          // re-evaluate all edges again
          let feedback=this.evaluateData ("changeType");
          if (feedback!=null) {
            if (feedback.length>0) {
              this.refs ["grapheditor"].showFeedback (feedback);
              this.refs ["grapheditor"].resetGraphUpdates();
            }
          }
        });
    });    
  }

  /**
   *
   */
  importData (data) {
    console.log ("importData ()");

    this.refs ["grapheditor"].setGraphData (JSON.parse (data),"Graph Imported",()=>{
      if (this.state.graph.feedbackhistory) {
        this.feedbackChain=this.dataTools.deepCopy (this.state.graph.feedbackhistory);
      }
      var updatedSettings=this.dataTools.deepCopy (this.state.globalSettings);
      updatedSettings.showImportWindow=false;
      this.setState ({globalSettings : updatedSettings});
    })
  }

  /**
   *
   */
  render() {
    let win=[];
    let dialog;
    let link;
    let unlink;
    let blocker;
    let OLI=this.permanence.getOLIActivity ();
  
    let accessibilityWindow;

    if (this.state.showAccessibility==true) {
      let summary=this.graphTools.generateSummary (this.state.graph,this.state.lastFeedback);
      accessibilityWindow=<div id="accessibility" className="accessibility">{summary}</div>;
    }

    window.appBlocked=false;

    blocker=<WindowBlocker windowSettings={this.state.windowSettings} />;

    if (this.state.globalSettings.showBlocker==true) {
      dialog=this.state.dialog;
    }

    if (this.state.globalSettings.showNoteManager==true) {            
      win.push(<NoteManager key="nop-1" OLI={OLI} onWindowClose={this.onWindowClose.bind(this)} windowController={this.windowController} graph={this.state.graph} editNote={this.editNote} selectNote={this.selectNote} node={this.state.editNote} panelclass="" />); 
    }

    // The dialog variable represents a single app-blocking window panel

    if (this.state.globalSettings.showDocumentProperties==true) {
      blocker=<WindowBlocker blocking="true" />;
      dialog=<DocumentPropertiesDialog setGraphData={this.setGraphData} doc={this.state.graph} onClose={this.onDialogOk.bind(this)} windowController={this.windowController} graph={this.state.graph} />;      
    }

    if (this.state.globalSettings.showImportWindow==true) {
      blocker=<WindowBlocker blocking="true" />;
      dialog=<ImportWindow windowController={this.windowController} onOk={this.onDialogOk.bind(this)} onClose={this.onDialogOk.bind(this)} importData={this.importData.bind(this)}/>;
    }

    if (this.state.globalSettings.showExportWindow==true) {
      blocker=<WindowBlocker blocking="true" />;
      dialog=<ExportWindow windowController={this.windowController} onOk={this.onDialogOk.bind(this)} onClose={this.onDialogOk.bind(this)} data={this.refs ["grapheditor"].getGraphData ()}/>;
    }

    if (this.state.globalSettings.showPanelSettings==true) {
      blocker=<WindowBlocker blocking="true" />;
      dialog=<PanelSettings onProcessPanelChange={this.onProcessPanelChange} options={this.state.nodeTypes} windowController={this.props.windowController} panel={this.state.selected} />
    }

    if ((this.state.globalSettings.showNodeEditor==true) && (this.state.editNode!=null)) {
      if (this.state.editNode.type==GRAPHTYPES.EDGE) {
        dialog=<StringEditor windowController={this.props.windowController} title="Label Editor" text={this.state.editNode.content} onNodeChange={this.onNodeChange.bind(this)} />;
      } else {
        dialog=<TextEditor windowController={this.props.windowController} title="Text Editor" text={this.state.editNode.content} onNodeChange={this.onNodeChange.bind(this)} />;
      }
    }

    return (
      <div id="main" className="maincontainer">
        <ToolBar direction="vertical" ref="select" data={this.state.menu} handleIconClicked={this.handleIconClicked.bind()}></ToolBar>
        <div id="diagramcontainer" className="diagram">
          <GraphEditor 
            ref="grapheditor"
            id="diagram"

            permanence={this.permanence}
            env={this.state.globalSettings}

            graph={this.state.graph}
            graphController={this.graphController}

            groupings={this.state.groupings}
            nodeTypes={this.state.nodeTypes}
            settings={this.factory.getGraphSettings()}
            mark={this.factory.getGraph ()}
            mode={this.state.mode}
            blockMouse={this.blockMouse}

            showFeedback={this.state.globalSettings.showFeedback}
            showStack={this.state.globalSettings.showStack}
            showGrid={this.state.globalSettings.showGrid}
            showLabels={this.state.globalSettings.showLabels}
            showFontPanel={this.state.globalSettings.showFontPanel}
            showMiniMap={this.state.globalSettings.showMiniMap}
            showAccessibility={this.state.showAccessibility}

            editNode={this.editNode}
            editNote={this.editNote}

            changePanelSettings={this.changePanelSettings.bind(this)}

            getGraphCopy={this.getGraphCopy.bind(this)}
            setModeSelect={this.setModeSelect.bind(this)}
            selectNode={this.selectNode.bind(this)}
            setGraphData={this.setGraphData.bind(this)}
            generateNewNode={this.generateNewNode.bind(this)}
            generateNewEdge={this.generateNewEdge.bind(this)}
            evaluateData={this.evaluateData.bind(this)}
            enableFunctions={this.enableFunctions.bind(this)}
            updateUndoRedo={this.updateUndoRedo.bind(this)}
            windowController={this.windowController}>
          </GraphEditor>
          {accessibilityWindow}          
        </div>
        {win}
        {blocker}
        {dialog} 
      </div>
    );
  }
}

export default KGraphEditor;
