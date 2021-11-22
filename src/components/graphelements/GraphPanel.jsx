import React from 'react';

import '../css/grapheditor.css';

import iconInfo from '../css/images/info.png';
import iconSettings from '../css/images/settings.png';
import iconDelete from '../css/images/delete.png';

import GraphPanelBasic from './GraphPanelBasic';

/**
 * 
 */
class GraphPanel extends GraphPanelBasic {
    
  /**
   * 
   * @param {any} props
   */  
  constructor(props) {
    super(props);
  }
      
  /**
   * As we're calculating where the ports go, use the opportunity to note down
   * these relative positions. That way the graph driver itself doesn't have to
   * calculate them and can leave out a portion of what would be a costly
   * operation
   */
  renderInputPorts (aWidth,aBound) {
      
    let inputComponents;  
      
    if (this.props.panel) {        
      if (this.props.panel.inputs) {  
        var inputs=this.props.panel.inputs;
        var inputY=30;
        var xPlace=4;
        var yPlace=inputY;
        
        inputComponents=inputs.map ((anInput,index) => {
          var comp;
          
          anInput ["x"]=xPlace;
          anInput ["y"]=yPlace;
          
          let boundStyle;
        
          if (aBound==true) {
            boundStyle={fill:"rgb(255,211,51)", strokeWidth: "1", stroke: "rgb(192,188,174)"};  
          } else {
            boundStyle={fill:"rgb(255,255,255)", strokeWidth: "1", stroke: "rgb(0,0,0)"};  
          }
            
          comp=<g><rect  
            key={index}
            x={xPlace}
            y={yPlace} 
            width="10" 
            height="10"
            style={boundStyle}>
          </rect>
          <text style={{pointerEvents: "none"}} x={xPlace+12} y={yPlace+6} alignmentBaseline="middle" textAnchor="start" fontFamily="Arial" fontSize="10">{anInput.name}</text></g>
                    
          inputY+=16; 
          
          return (comp); 
        });    
      } 
    }
    return (inputComponents);
  }
  
  /**
   * As we're calculating where the ports go, use the opportunity to note down
   * these relative positions. That way the graph driver itself doesn't have to
   * calculate them and can leave out a portion of what would be a costly
   * operation
   * 
   * @param {any} aWidth
   * @param {any} aBound
   */
  renderOutputPorts (aWidth,aBound) {

    let outputComponents;  
      
    if (this.props.panel) {        
      if (this.props.panel.outputs) {  
        var outputs=this.props.panel.outputs;
        var outputY=30;
      
        outputComponents=outputs.map ((anOutput,index) => {                    
          var comp;
          var xPlace=aWidth-4-10;
          var yPlace=outputY;
          
          anOutput ["x"]=xPlace;
          anOutput ["y"]=yPlace;
          
          let boundStyle;
          
          if (aBound==true) {
            boundStyle={fill:"rgb(255,211,51)", strokeWidth: "1", stroke: "rgb(192,188,174)"};  
          } else {
            boundStyle={fill:"rgb(255,255,255)", strokeWidth: "1", stroke: "rgb(0,0,0)"};  
          }
          
          comp=<g><rect  
            key={index}
            x={xPlace}
            y={yPlace} 
            width="10" 
            height="10"
            style={boundStyle}>
          </rect>
          <text style={{pointerEvents: "none"}} x={xPlace-2} y={yPlace+6} alignmentBaseline="middle" textAnchor="end" fontFamily="Arial" fontSize="10">{anOutput.name}</text></g>
                    
          outputY+=16; 
          
          return (comp);           
        });    
      }
    }
    return (outputComponents);    
  }
  
  /**
   * 
   */
  render() {
    // We should be able to optimize this by pre-loading render classes
    // from a factory, instead of trying to determine this on the fly
    if (this.props.panel.class) {
      if (this.props.panel.class=="GraphPanelBasic") {
        return (super.render());
      }
    }

    let inputports;
    let outputports;
    let base;
    let handles=[];
    let executionOrder;
    let executionOrderLabel;
    let selected="rgb(255,255,255)";
    let style;
    
    if (this.props.showExecutionOrder) {
      if (this.props.showExecutionOrder==true) {
        executionOrder=<rect 
          x="-10" 
          y={this.state.height-10} 
          width={20} 
          height={20} 
          style={{fill:"rgb(0,0,0)", fillOpacity: "0.5"}}>
        </rect> 
        executionOrderLabel=<text fill="white" style={{pointerEvents: "none"}} x={-4} y={this.state.height+4} fontWeight="bold" fontFamily="Arial" fontSize="14">{this.props.executionOrder}</text>  
      }
    }

    if (this.props.panel.selected==true) {
      selected="rgb(51,187,51)";

      handles.push (<rect key="handler-1" x="-4"                     y="-4"                      width="8" height="8" style={{fill:"rgb(255,255,255)", strokeWidth:1, stroke:"rgb(0,0,0)", cursor: "nwse-resize"}}></rect>);
      handles.push (<rect key="handler-2" x={(this.state.width/2)-4} y="-4"                      width="8" height="8" style={{fill:"rgb(255,255,255)", strokeWidth:1, stroke:"rgb(0,0,0)", cursor: "ns-resize"}}></rect>);
      handles.push (<rect key="handler-3" x={this.state.width-4}     y="-4"                      width="8" height="8" style={{fill:"rgb(255,255,255)", strokeWidth:1, stroke:"rgb(0,0,0)", cursor: "nesw-resize"}}></rect>);
      handles.push (<rect key="handler-4" x="-4"                     y={(this.state.height/2)-4} width="8" height="8" style={{fill:"rgb(255,255,255)", strokeWidth:1, stroke:"rgb(0,0,0)", cursor: "ew-resize"}}></rect>);
      handles.push (<rect key="handler-5" x={this.state.width-4}     y={(this.state.height/2)-4} width="8" height="8" style={{fill:"rgb(255,255,255)", strokeWidth:1, stroke:"rgb(0,0,0)", cursor: "ew-resize"}}></rect>);
      handles.push (<rect key="handler-6" x="-4"                     y={this.state.height-4}     width="8" height="8" style={{fill:"rgb(255,255,255)", strokeWidth:1, stroke:"rgb(0,0,0)", cursor: "nesw-resize"}}></rect>);
      handles.push (<rect key="handler-7" x={(this.state.width/2)-4} y={this.state.height-4}     width="8" height="8" style={{fill:"rgb(255,255,255)", strokeWidth:1, stroke:"rgb(0,0,0)", cursor: "ns-resize"}}></rect>);
      handles.push (<rect key="handler-8" x={this.state.width-4}     y={this.state.height-4}     width="8" height="8" style={{fill:"rgb(255,255,255)", strokeWidth:1, stroke:"rgb(0,0,0)", cursor: "nwse-resize"}}></rect>);
    }     

    if (this.props.panel.highlighted==true) {
      style={fill:selected,strokeWidth:"1",stroke: "rgb(0,0,0)"};
    } else {
      style={fill:selected};      
    }    
        
    inputports=this.renderInputPorts (this.state.width,false);
    outputports=this.renderOutputPorts (this.state.width,false);
      
    let title="Undefined";

    if (this.props.panel.name) {
      title=this.props.panel.name;
    }

    return (
      <svg x={this.state.x} y={this.state.y} width={this.state.width} height={this.state.height} id={"group"+this.props.panel.name} filter="url(#dropshadow)">
        {base}
        <rect                       
         x="2" 
         y="22" 
         width={this.state.width-4} 
         height={this.state.height-24}
         style={{fill:"rgb(245,245,245)"}}>
        </rect>             
        <image xlinkHref={iconInfo} x={this.state.width-4-16-2-16-16-2} y="4" height="16px" width="16px"/>
        <image xlinkHref={iconSettings} x={this.state.width-4-16-2-16} y="4" height="16px" width="16px"/>
        <image xlinkHref={iconDelete} x={this.state.width-4-16} y="4" height="16px" width="16px"/>            
        <rect 
          x="2" 
          y="2" 
          width={this.state.width-4} 
          height={20} 
          style={{fill:"rgb(200,200,200)", fillOpacity: "0.7", pointerEvents: "all", cursor: "pointer"}}>
         </rect>  
        <text style={{pointerEvents: "none"}} x="4" y="16" fontWeight="bold" fontFamily="Arial" fontSize="10">{this.props.panel.name}</text>  
        {inputports}
        {outputports}
        {executionOrder}
        {executionOrderLabel}
        {handles}
      </svg>);
  }
}

export default GraphPanel;
