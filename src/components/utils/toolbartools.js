
import DataTools from './datatools';

/**
 *
 */
class ToolbarTools {

  constructor () {
  	this.dataTools=new DataTools ();
  }	
	
  /**
   *
   */
  prep (anItemSet) {
  	let prepped=this.dataTools.deepCopy (anItemSet);
 
  	if (!prepped ["inverted"]) {
  	  prepped.inverted=false;
  	}

    let items=prepped.items;

  	for (let i=0;i<items.length;i++) {
  	  let item=items [i];
      item.enabled=true;
  	  item.uuid=this.dataTools.uuidv4 ();
 
      // We must go deeper
  	  if (item.type=="menu") {        
  	  	items [i]=this.prep(item);
        //console.log (JSON.stringify (item));
  	  }
  	}

  	return (prepped);
  }

  /**
   *
   */
  getParent (anItem,items) {
    let anItemId=anItem.uuid;
    
    //console.log ("getParent ("+anItemId+")");

    for (let i=0;i<items.length;i++) {
      let item=items [i];
      
      // We must go deeper
      if (item.type=="menu") {
        if (this.getParentSub (anItemId,item.items)==true) {
          return (item);
        }
      }
    }
        
    return (null);
  }

  /**
   *
   */
  getParentSub (aParent,items) {
    //console.log ("getParentSub ("+aParent+")");
    
    for (let i=0;i<items.length;i++) {
      let item=items [i];
      
      if ((item.type=="button") || (item.type=="menu")) {
        //console.log ("Comparing item " + item.uuid + " to: " + aParent);
        if (item.uuid==aParent) {
          return (true);
        }
      }

      // We must go deeper
      if (item.type=="menu") {
        let result=this.getParentSub (aParent,item.items);
        if (result!=null) {
          return (true);
        }
      }
    }
        
    return (false);
  }

  /**
   *
   */
  findById (anItemId,items) {
  	for (let i=0;i<items.length;i++) {
  	  let item=items [i];
  	  
  	  if ((item.type=="button") || (item.type=="menu")) {
  	    if (item.id==anItemId) {
  	  	  return (item);
  	    }
  	  }

      // We must go deeper
  	  if (item.type=="menu") {
  	  	let result=this.findById (anItemId,item.items);
  	  	if (result!=null) {
  	  	  return (result);
  	  	}
  	  }
  	}

    return (null);
  }

  /**
   *
   */
  findByUUID (anItemId,items) {
  	for (let i=0;i<items.length;i++) {
  	  let item=items [i];
    
      if ((item.type=="button") || (item.type=="menu")) {
  	    if (item.uuid==anItemId) {
  	  	  return (item);
  	    }
  	  }

      // We must go deeper
  	  if (item.type=="menu") {
  	  	let result=this.findByUUID (anItemId,item.items);
  	  	if (result!=null) {
  	  	  return (result);
  	  	}
  	  }	  
  	}

    return (null);
  }

  /**
   *
   */
  createGroups (data) {
  	let groups={};
  	
    let items=data.items;

  	for (let i=0;i<items.length;i++) {
  	  let item=items [i];
      if (item.group) {
      	groups [item.group] = {name: item.group, selected: null};
      }

      // we need to make this fully recursive
      if (item.type=="menu") {
        for (let j=0;j<item.items.length;j++) {
          let subitem=item.items [j];
          if (subitem.group) {
            groups [subitem.group] = {name: subitem.group, selected: null};
          }
        }
      }
  	}
  	
  	return (groups);
  }
}

export default ToolbarTools;
