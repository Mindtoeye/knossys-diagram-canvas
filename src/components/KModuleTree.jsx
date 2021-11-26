import React from "react";
import ReactDOM from "react-dom";

// https://react-icons.github.io/react-icons/
import { FaFile, FaFolder, FaFolderOpen } from 'react-icons/fa';
import { MdAddLocation } from 'react-icons/md';
import { IoMdAddCircleOutline } from 'react-icons/io';

import { KTree, KButton, KToolbar, KToolbarItem } from '@knossys/knossys-ui-core';

import './css/moduletree.css';

const treeData = {
  '/modules': {
    path: '/modules',
    type: 'folder',
    isOpen: true,
    isRoot: true,
    children: [
      '/modules/input', 
      '/modules/output'
    ]
  },
  '/modules/input': {
    path: '/modules/input',
    type: 'folder',
    isOpen: true,
    children: [
      '/modules/input/debug',
      '/modules/input/mysql'
    ]
  },
  '/modules/input/debug': {
    path: '/modules/input/debug',
    type: 'file',
    content: 'The most basic module. Use this for testing. It will directly copy the input to the output without modification'
  },  
  '/modules/input/mysql': {
    path: '/modules/input/mysql',
    type: 'file',
    content: 'Load data directly from a MySQL database'
  },
  '/modules/output': {
    path: '/modules/output',
    isOpen: true,
    type: 'folder',
    children: []
  }
};

const getNodeLabel = (node) => {
  let splitter=node.path.split('/');
  return (splitter[splitter.length-1]);
}

/**
 *
 */
class KModuleTree extends React.Component {

  /**
   *
   */
  constructor(props){
    super(props);

    this.state={
      selected: null
    }

    this.onTreeNodeSelect=this.onTreeNodeSelect.bind(this);
    this.onToolbarItemClick=this.onToolbarItemClick.bind(this);
  }

  /**
   *
   */
  onTreeNodeSelect (anItem) {
    console.log ("onTreeNodeSelect ()");
    console.log (anItem);

    let selected=null;

    if (anItem.type=='file') {
      if (anItem.content) {
        selected=anItem;
      }
    }

    this.setState ({
      selected: selected
    });    
  }  

  /**
   *
   */
  onToolbarItemClick (e,anItem) {
    console.log ("onToolbarItemClick ("+anItem+")");

    if (this.props.onToolbarItemClick) {
      this.props.onToolbarItemClick (anItem);
    }
  }

  /**
   *
   */
  render () {  
    let selected;
    if (this.state.selected) {
      selected=<span><p>Module: {getNodeLabel (this.state.selected)}</p><p>Description: { this.state.selected.content}</p></span>
    }
    return (
      <div className="moduletree">

        <KToolbar classes="kdiagramtoolbar">
          <KToolbarItem onClick={(e) => this.onToolbarItemClick (e,1)}><IoMdAddCircleOutline /></KToolbarItem>
          <KToolbarItem onClick={(e) => this.onToolbarItemClick (e,2)}><FaFolder /></KToolbarItem>
          <KToolbarItem onClick={(e) => this.onToolbarItemClick (e,3)}><FaFolderOpen /></KToolbarItem>
          <KToolbarItem onClick={(e) => this.onToolbarItemClick (e,4)}><MdAddLocation /></KToolbarItem>
        </KToolbar>

        <KTree classes="moduletreeview" onSelect={this.onTreeNodeSelect} data={treeData} />
        
        <div className="moduleinfo">
        {selected}
        </div>                
      </div>
    );
  }
}

export default KModuleTree;
