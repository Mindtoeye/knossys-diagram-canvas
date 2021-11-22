
import GraphElementFactory from './GraphElementFactory';

import moduleImage from './components/css/images/premise-new.png';

/**
 *
 */
class PipelineFactory extends GraphElementFactory {
	
  /**
   *
   */
  constructor () {
    super();

    this.setName ("Pipeline");
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
        id: "module",
        title: "Module",
        image: moduleImage,
        group: "reasons",
        color: "default",
        selected: "default"
      }],
      groupings: [],
      rules: []
    });
  }  

  /**
   *
   */
  newGraph () {
    return ({"name": "", "id": "graph", "uuid": this.dataTools.uuidv4(), "description": "","settings": [],"nodes": [],"edges": [], "notes": [],"groups": []});
  }

  /**
   *
   */
  newNode () {
    return ({
      "class":"GraphPanelModule",
      "name":"Module", 
      "uuid": this.dataTools.uuidv4(), 
      "content": "", 
      "notes": [], 
      "x" : 10, 
      "y": 10, 
      "selected": false,
      "inputs":[{
          name: "stdin",
          type: "string"
        },{
          name: "control",
          type: "string"
        }],
      "outputs": [{
          name: "stdout",
          type: "string"
        },{
          name: "control",
          type: "string"
        }]
    });
  }

  /**
   *
   */
  newEdge () {
    return ({"from": "", "to": "", "notes": [], "uuid": this.dataTools.uuidv4(), "content": ""});
  }
}

export default PipelineFactory;
