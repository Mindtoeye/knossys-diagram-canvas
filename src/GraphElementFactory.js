
import DataTools from './components/utils/datatools';

/**
 *
 */
class GraphElementFactory {

  /**
   *
   */
  constructor () {
    this.name="Graph";
  	this.dataTools=new DataTools ();
  }


  /**
   *
   */
  getGraphSettings () {
    return ({
      useGroups: false,
      allowMultipleFrom: false,
      nodeTypes: [{
        type: "button",
        id: "premise",
        title: "Premise",
        image: premiseNew,
        group: "reasons",
        color: "default",
        selected: "default"
      }],
      groupings: [["premise","subconclusion"],["reply"],["objection"]],
      rules: []
    });
  } 

  /**
   *
   */
  setName (aName) {
    this.name=aName;
  }

  /**
   *
   */

  /**
   *
   */
  getGraph () {
    return (this.name);
  }

  /**
   *
   */
  newPipeline () {
    return ({"name": "", "id": "graph", "uuid": this.dataTools.uuidv4(), "description": "","settings": [],"nodes": [],"edges": [], "notes": [],"groups": []});
  }

  /**
   *
   */
  newNode () {
    return ({"class":"GraphPanelBasic", "name": "Node", "uuid": this.dataTools.uuidv4(), "content": "", "x" : 10, "y": 10, "notes": [], "selected": false});
  }

  /**
   *
   */
  newEdge () {
    return ({"from": "", "to": "", "content": "", "notes": [],"uuid": this.dataTools.uuidv4()});
  }
}

export default GraphElementFactory;
