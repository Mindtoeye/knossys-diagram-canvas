import React from "react";
import ReactDOM from "react-dom";

import DialogWrapper from './DialogWrapper';
import DataTools from './utils/datatools';

/**
 *
 */
export class DocumentPropertiesDialog extends React.Component {

  /**
   *
   */
  constructor(props){
    super(props);
    this.state={
      doc: props.doc,
      author: props.doc.properties.author,
      description: props.doc.properties.description
    }

    this.dataTools=new DataTools ();

    this.onOk=this.onOk.bind(this);
    this.onCancel=this.onCancel.bind(this);
  }

  /**
   *
   */
  onOk () {
    console.log ("onOk ()");

    if (this.props.setGraphData) {
      console.log ("Updating graph ...");
      let updatedDocument=this.dataTools.deepCopy (this.props.doc);
      updatedDocument.properties.author=this.state.author;
      updatedDocument.properties.description=this.state.description;
      this.props.setGraphData (updatedDocument,null);
    }    

    if (this.props.onClose) {
      this.props.onClose ();
    }    
  }

  /**
   *
   */  
  onCancel () {
    console.log ("onCancel ()");
    
    if (this.props.onClose) {
      this.props.onClose ();
    }    
  }

  /**
   * e.target.value;
   */
  onNameChange (e) {
    this.setState ({author: e.target.value});
  }

  /**
   * e.target.value;
   */
  onDescriptionChange (e) {
    this.setState ({description: e.target.value});
  }

  /**
   *
   */
  render () {  	
  	//var w = (window.innerWidth/2)+"px";
    //var h = (window.innerHeight/2)+"px";

    var w="320px";
    var h="200px";

    return (<DialogWrapper 
        windowController={this.props.windowController} 
        onOk={this.onOk} 
        onCancel={this.onCancel}
        centered={true} 
        panelclass="" 
        title="Document Properties" 
        innerstyle="" 
        type="OKCANCEL"
        style={{minWidth: w, minHeight: w, minHeight: h, maxHeight: h}}>
      <label htmlFor="name">Author name</label>
      <input type="text" name="name" id="name" value={this.state.author} onChange={this.onNameChange.bind(this)}></input>
      <label htmlFor="desc">Document description</label>
      <textarea id="desc" name="desc" rows="4" cols="10" style={{"resize": "none"}} onChange={this.onDescriptionChange.bind(this)} value={this.state.description}></textarea>
    </DialogWrapper>);
  }
}

export default DocumentPropertiesDialog;
