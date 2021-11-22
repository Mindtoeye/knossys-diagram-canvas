import React from "react";
import ReactDOM from "react-dom";

import JSONTree from 'react-json-tree'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import DialogWrapper from './DialogWrapper';
import DataTools from './utils/datatools';

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633'
};

/**
 *
 */
class ExportWindow extends React.Component {

  /**
   *
   */
  constructor(props){
    super(props);

    this.dataTools=new DataTools ();
  }

  /**
  *
  */
  download () {
    //console.log (this.props.data);

    let data=JSON.stringify (this.props.data,null,2);

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', 'export.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  /**
   *
   */
  render () {
  	//console.log ("render ("+window.innerWidth+","+window.innerHeight+")")

  	let data;

  	var w = (window.innerWidth/2)+"px";
    var h = (window.innerHeight/2)+"px";

    console.log ("render ("+w+","+h+")")

  	if (this.props.data) {
  	  data=JSON.stringify (this.props.data, null, 2);	
  	  //data=this.dataTools.syntaxHighlight (this.props.data);
  	}

    return (<DialogWrapper 
             windowController={this.props.windowController} 
             onOk={this.props.onOk} 
             onClose={this.props.onOk}
             onCancel={this.props.onOk}
             centered={true} 
             panelclass="" 
             title="Export Raw Data" 
             innerstyle="scrollcontent" 
             buttons={<button onClick={this.download.bind(this)}>Export ...</button>}
             style={{minWidth: w, minHeight: w, minHeight: h, maxHeight: h}}>
    	  <Tabs>
  	    <TabList>
  	      <Tab>Raw</Tab>
  	      <Tab>Tree View</Tab>
  	    </TabList>

  	    <TabPanel>
  	      <div className="code">
  		    <pre>
  		      {data}
  		    </pre>
  	      </div>
  	    </TabPanel>
  	    <TabPanel>
  	      <JSONTree data={this.props.data} theme={theme} invertTheme={true} />
  	    </TabPanel>
  	  </Tabs>
    </DialogWrapper>);
  }
}

export default ExportWindow;
