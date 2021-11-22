
import cursorImage from '../css/images/cursor.png';
import dragImage from '../css/images/drag.png';
import blackArrowImage from '../css/images/arrow-black.png';
import redArrowImage from '../css/images/arrow-red.png';
import blueArrowImage from '../css/images/arrow-blue.png';
import addImage from '../css/images/argument-new.png';
import linkImage from '../css/images/argument-link.png';
import unlinkImage from '../css/images/argument-unlink.png';
import deleteImage from '../css/images/argument-delete.png';
import gridImage from '../css/images/grid.png';
import labelImage from '../css/images/tags.png';
import undoImage from '../css/images/undo.png';
import redoImage from '../css/images/redo.png';
import menuImage from '../css/images/menu.png';
import diagramImage from '../css/images/diagram.jpg';
import fontImage from '../css/images/font.jpg';
import notesImage from '../css/images/notes.jpg';
import undostackImage from '../css/images/undostack.png';
import exportImage from '../css/images/export.png';
import importImage from '../css/images/import.png';
import documentProperties from '../css/images/doc-properties.png';
import documentNew from '../css/images/doc-new.png';
import helpImage from '../css/images/help.png';
import accessibilityImage from '../css/images/acessibility.png';

import premiseNew from '../css/images/premise-new.png';
import conclusionNew from '../css/images/conclusion-new.png';
import subConclusionNew from '../css/images/sub-conclusion-new.png';
import objectionNew from '../css/images/objection-new.png';
import replyNew from '../css/images/reply-new.png';

export const menu = {
  direction: "vertical",
  toolclass: "",
  inverted: false,
  items: [{
      type: "menu",
      id: "1",
      title: "Main Menu",
      image: menuImage,
      items: [{
        type: "button",
        id: "new",
        title: "New Document",
        image: documentNew
      },{
        type: "button",
        id: "properties",
        title: "Document Properties",
        image: documentProperties
      },{
        type: "divider"
      },{
        type: "button",
        id: "11",
        title: "Show Undo Stack",
        image: undostackImage
      },{
        type: "button",
        id: "12",
        title: "Select Font",
        image: fontImage
      },{
        type: "button",
        id: "13",
        title: "Show Notes",
        image: notesImage
      }/*,{
        type: "button",
        id: "minimap",
        title: "Show Minimap",
        image: diagramImage
      }*/,{
        type: "divider"
      },{
        type: "button",
        id: "23",
        title: "Show / Hide Labels",
        image: labelImage
      },{
        type: "button",
        id: "8",
        title: "Show / Hide Grid",
        image: gridImage
      },{
        type: "divider"
      },{
        type: "button",
        id: "export",
        title: "Export to JSON",
        image: exportImage
      },{
        type: "button",
        id: "import",
        title: "Import JSON",
        image: importImage
      }],
    },{
      type: "divider"
    },{
      type: "button",
      id: "1",
      title: "Select",
      image: cursorImage,
      group: "select"
    },/*{
      type: "button",
      id: "24",
      title: "Pan and Scroll",
      image: dragImage,
      group: "select"
    },*/{
      type: "button",
      id: "2",
      title: "Create Argument",
      image: blackArrowImage,
      group: "select"
    },{
      type: "menu",
      id: "nodes",
      title: "Add Reason",
      image: addImage,
      items: [],      
      group: "select"
    },{
      type: "divider"
    },{
      type: "button",
      id: "5",
      title: "Link Arguments",
      image: linkImage
    },{
      type: "button",
      id: "6",
      title: "Unlink Arguments",
      image: unlinkImage
    },{
      type: "button",
      id: "7",
      title: "Delete Argument",
      image: deleteImage
    },{
      type: "divider"
    },{
      type: "button",
      id: "undo",
      title: "Undo",
      image: undoImage
    },{
      type: "button",
      id: "redo",
      title: "Redo",
      image: redoImage
    }/*,{
      type: "button",
      id: "accessibility",
      title: "Turn on Accessibility Features",
      image: accessibilityImage
    }*/
    ]
};
