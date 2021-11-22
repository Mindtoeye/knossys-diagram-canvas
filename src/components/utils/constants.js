
export const GRID = {
  XTICK: 25,
  YTICK: 25
}

export const INTMODE = {
  SELECT: 'select',
  PAN: 'pan',
  CREATE_MODULE: 'create_module', // Generic node
  CREATE_ARGUMENT: 'create_argument',
  CREATE_PREMISE: 'create_premise',
  CREATE_CONCLUSION: 'create_conclusion',
  CREATE_SUBCONCLUSION: 'create_subconclusion',
  CREATE_OBJECTION: 'create_objection',
  CREATE_REPLY: 'create_reply',
  LINK_BLACK: 'link_black',
  LINK_RED: 'link_red',
  LINK_BLUE: 'link_blue'
}

// https://www.w3schools.com/jsref/event_button.asp
export const MOUSEBUTTON = {
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2
}

export const PANELDEFS = {
  MINWIDTH: 75,
  MINHEIGHT: 54,
  PANELWIDTH: 150,
  PANELHEIGHT: 100
}

export const GRAPHTYPES = {
  NODE: 0,
  GROUP: 1,
  EDGE: 2,
  GRAPH: 3,
  NOTE: 4
}

export const GRAPHICSCONSTS = {
  GROUPBORDER: 20
}

export const COLORS = {
  NODE_DEFAULT: "rgb(255,255,255)",
  NODE_SELECTED: "rgb(100,100,100)",
  EDGE_DEFAULT: "rgb(0,0,0)",
  EDGE_SELECTED: "rgb(100,100,100)",  
}

export const COLORSDARK = {
  NODE_DEFAULT: "rgb(131,131,131)",
  NODE_SELECTED: "rgb(100,100,100)",
  EDGE_DEFAULT: "rgb(0,0,0)",
  EDGE_SELECTED: "rgb(100,100,100)",  
}

// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]" 
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1 - 79
var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

// Edge (based on chromium) detection
var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);

// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;
