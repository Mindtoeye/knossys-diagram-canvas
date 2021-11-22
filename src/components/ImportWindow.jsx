import React from "react";
import ReactDOM from "react-dom";

import DialogWrapper from './DialogWrapper';
import DataTools from './utils/datatools';

/**
 *
 */
class ImportWindow extends React.Component {

  /**
   *
   */
  constructor(props){
    super(props);

    this.state = {
      data: ""
    };

    this.dataTools=new DataTools ();
  }

  /**
   *
   */
  importData () {
    if (this.props.importData) {
      this.props.importData (this.state.data);
    }
  }

  /**
   *
   */
  handleChange(event) {
    console.log(event.target.value);
    this.setState({ data: event.target.value });
  }

  /**
   *
   */
  render () {
  	//console.log ("render ("+window.innerWidth+","+window.innerHeight+")")

  	var w = (window.innerWidth/2)+"px";
    var h = (window.innerHeight/2)+"px";

    return (<DialogWrapper 
             type="CANCEL"
             windowController={this.props.windowController} 
             onOk={this.props.onOk} 
             onClose={this.props.onOk}
             onCancel={this.props.onOk}
             centered={true} 
             panelclass="" 
             title="Import Raw Data" 
             innerstyle="scrollcontent" 
             buttons={<button onClick={this.importData.bind(this)}>Import ...</button>}
             style={{minWidth: w, minHeight: w, minHeight: h, maxHeight: h}}>
        <textarea className="codeinput" value={this.state.data} onChange={this.handleChange.bind(this)} />
    </DialogWrapper>);
  }
}

export default ImportWindow;
