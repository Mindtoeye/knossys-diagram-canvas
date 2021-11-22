import React from "react";
import ReactDOM from "react-dom";

import FontPicker from './FontPicker';
import FontTools from './utils/fonttools';
import DataTools from './utils/datatools';
import WindowWrapper from './WindowWrapper';

import './css/main.css';
import './css/fontmanager.css';

/**
 *
 */
export default class FontManager extends React.Component {

  /**
   *
   */
  constructor(props) {
    super(props);

    this.state={
      fonts: [
        "Arial",
        "Arial Narrow",
        "Arial Black",
        "Courier New",
        "Georgia",
        "Lucida Console",
        "Lucida Sans Unicode",
        "Tahoma",
        "Times New Roman",
        "Verdana"
      ],
      typeface: [
        "Regular",
        "Italic",
        "Bold",
        "Bold Italic"
      ],
      sizes: [
        "12",
        "14",
        "16",
        "18",
        "20",
        "22",
        "24",
        "28",
        "30",
        "32",
        "36"
      ],
      style: {
        font: this.props.font,
        typeface: this.props.typeface,
        size: this.props.size
      }
    }

    this.dataTools=new DataTools ();
    this.fontTools= new FontTools ();
  }

  /**
   *
   */
  handleFontChange (selectedFont) {
    console.log ("handleFontChange ("+selectedFont+")");

    let newStyle=this.dataTools.deepCopy (this.state.style);

    newStyle.font=selectedFont;

    this.setState ({
      style: newStyle
    },(e)=>{
      if (this.props.applyFontChange) {
        this.props.applyFontChange (this.fontTools.fontSpecToStyle (this.state.style));
      }  
    });

    if (this.props.applyFontChange) {
      this.props.applyFontChange (this.fontTools.fontSpecToStyle (this.state.style));
    }
  }

  /**
   *
   */
  handleTypefaceChange (selectedTypeface) {
    console.log ("handleTypefaceChange ("+selectedTypeface+")");

    let newStyle=this.dataTools.deepCopy (this.state.style);

    newStyle.typeface=selectedTypeface;

    this.setState ({
      style: newStyle
    },(e)=>{
      if (this.props.applyFontChange) {
        this.props.applyFontChange (this.fontTools.fontSpecToStyle (this.state.style));
      }  
    });

    if (this.props.applyFontChange) {
      this.props.applyFontChange (this.fontTools.fontSpecToStyle (this.state.style));
    }   
  }

  /**
   *
   */
  handleFontSizeChange (selectedFontSize) {
    console.log ("handleFontSizeChange ("+selectedFontSize+")");

    let newStyle=this.dataTools.deepCopy (this.state.style);

    newStyle.size=selectedFontSize;

    this.setState ({
      style: newStyle
    },(e)=>{
      if (this.props.applyFontChange) {
        this.props.applyFontChange (this.fontTools.fontSpecToStyle (this.state.style));
      }  
    });      
  }    

  /**
   *
   */ 
  render () {
    let sample=this.fontTools.fontSpecToSample (this.state.style);
    let sampleStyle=this.fontTools.fontSpecToStyle (this.state.style);

    return (<WindowWrapper 
      windowController={this.props.windowController} 
      showstatus={false} 
      panelclass={this.props.panelclass} 
      title="Font Manager" 
      style={{minHeight: "220px"}}>
      <FontPicker label="Choose Font" fonts={this.state.fonts} previews={true} activeColor="#64B5F6" value="" onChange={this.handleFontChange.bind(this)}/>
      <FontPicker label="Typeface" fonts={this.state.typeface} previews={true} activeColor="#64B5F6" value="" onChange={this.handleTypefaceChange.bind(this)}/> 
      <FontPicker label="Size" fonts={this.state.sizes} previews={true} activeColor="#64B5F6" value="" onChange={this.handleFontSizeChange.bind(this)}/> 
      <div id="fontsample" className="fontsample" style={sampleStyle}>
        {sample}
      </div>
     </WindowWrapper>);
  }
}

// Set default props
FontManager.defaultProps = {
  font: "Arial",
  typeface: "Regular",
  size: "12"
};
