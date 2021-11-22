import React from "react";
import ReactDOM from "react-dom";

import DialogWrapper from '../DialogWrapper';

import '../css/main.css';
import '../css/panelwindow.css';

import {Editor, EditorState, ContentState, convertToRaw, convertFromRaw} from 'draft-js';
import 'draft-js/dist/Draft.css';

/**
 * 
 */
class TextEditor extends React.Component {

  /**
   * 
   */  
  constructor(props) {
    super(props);
    
    if (props.text) {
      let storedState=EditorState.createWithContent (convertFromRaw(props.text));
      this.state = {
        raw: props.text,
        editorState: storedState
      }      
    } else {
      this.state = {
        raw: "",
        editorState: EditorState.createWithContent(ContentState.createFromText('Enter text here'))
      }
    }

    this.onTextChange=this.onTextChange.bind(this);
  }

  /**
   * 
   */
  onTextChange (editorState) {    
    let rawValue=convertToRaw(editorState.getCurrentContent());

    this.setState({
      raw : rawValue,
      editorState
    });
  }

  /**
   * 
   */
  onOk () {
    console.log ("onOk ()");

    //console.log (this.state.raw);

    if (this.props.onNodeChange) {
      this.props.onNodeChange (this.state.raw);
    }    
  }

  /**
   *
   */
  onCancel () {
    console.log ("onCancel ()");

    if (this.props.onNodeChange) {
      this.props.onNodeChange (null);
    }
  }

  /**
   * @return {Element}
   */
  render() {
    let toolbar;
    let title="Window";
   
    if (this.props.title) {
      title=this.props.title;
    }

    return (
      <DialogWrapper 
        centered={true} 
        showstatus={true} 
        panelclass="" 
        title={title}
        innerstyle="scrollcontent" 
        style={{minWidth: "350px", minHeight: "350px", maxHeight: "350px"}}
        type="OKCANCEL"
        onOk={this.onOk.bind(this)}
        onCancel={this.onCancel.bind(this)}
        windowController={this.props.windowController}>        
        <Editor 
          editorState={this.state.editorState} 
          onChange={this.onTextChange} />
      </DialogWrapper>      
    )
  }  
}

export default TextEditor;
