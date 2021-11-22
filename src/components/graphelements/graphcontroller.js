
/**
 *
 */
class GraphController {

  /**
   *
   */
  constructor (anUpdateMethod) {
  	this.propagateGraphUpdate=anUpdateMethod;
  }
 
  /**
   *
   */
  updateGraph (aNewGraph,aCallback) {
  	if (this.propagateGraphUpdate) {
  	  this.propagateGraphUpdate (aNewGraph,aCallback);
  	}
  }
}

export default GraphController;
