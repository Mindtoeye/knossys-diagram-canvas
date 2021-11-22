import React from "react";
import ReactDOM from "react-dom";

import DataTools from '../utils/datatools';
import DialogWrapper from '../DialogWrapper';

import '../css/main.css';
import '../css/fontmanager.css';

/**
 *
 */
class PanelSettings extends React.Component {

  /**
   *
   */
  constructor(props) {
    super(props);

    this.state={
      panel: this.props.panel,
      choice: this.props.panel.id
    }

    this.dataTools=new DataTools ();

    this.onChange=this.onChange.bind(this);
  }

  /**
   *
   */ 
  onChange (e) {
    console.log ("onChange ()");

    this.setState ({choice: e.target.value});
  }

  /**
   *
   */
  onOk (e) {
    console.log ("onOk ()");

    if (this.props.onProcessPanelChange) {
      this.props.onProcessPanelChange(this.state.choice, this.state.panel);
    } else {
      console.log ("onProcessPanelChange () not provided to Panel");
    }
  }

  /**
   *
   */
  onCancel (e) {
    console.log ("onCancel ()");

    if (this.props.onProcessPanelChange) {
      this.props.onProcessPanelChange("",null);
    }
  }    

  /**
   *
   */ 
  render () {
  	let options=[];

  	for (let i=0;i<this.props.options.length;i++) {
  	  options.push (<option key={"options-"+i} value={this.props.options [i].id}>{this.props.options [i].title}</option>);
  	}

    return (<DialogWrapper type="OKCANCEL" centered={true} onOk={this.onOk.bind(this)} onCancel={this.onCancel.bind(this)} windowController={this.props.windowController} showstatus={false} panelclass={this.props.panelclass} title="Panel Settings" style={{minHeight: "152px"}}>
      <select size={this.props.options.length} onChange={this.onChange} value={this.state.choice}>
      {options}  
      </select>
     </DialogWrapper>);
  }
}

export default PanelSettings;
