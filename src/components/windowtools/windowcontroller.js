
import DataTools from '../utils/datatools';

/**
 *
 */
class WindowController {

  /**
   *
   */
  constructor (aStateSetter, aStateGetter, aSetGraphData, aGetGraphCopy, aWindowClose){ 
    this.setGraphData=aSetGraphData;
    this.getGraphCopy=aGetGraphCopy;

  	this.stateSetter=aStateSetter;
    this.stateGetter=aStateGetter;

    this.onWindowClose=aWindowClose;
  	
    this.dataTools=new DataTools ();
  }

  /**
   *
   */
  modifyWindowSettings (aKey,aValue) {
    var updatedWindowSettings=this.dataTools.deepCopy (this.stateGetter ().windowSettings);
  
    updatedWindowSettings[aKey]=aValue;

    this.stateSetter (updatedWindowSettings);
  }

  /**
   *
   */
  block () {
    this.modifyWindowSettings ("blocking",true);
  } 

  /**
   *
   */
  unblock () {
    this.modifyWindowSettings ("blocking",false);
  }   

  /**
   *
   */
  onClose (aWindowId) {
    console.log ("Propagating onClose (" + aWindowId + ") command ...");

    if (this.onWindowClose) {
      this.onWindowClose (aWindowId);
    }
  }     
}

export default WindowController;
