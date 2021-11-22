import React from "react";
import ReactDOM from "react-dom";

import DataTools from './utils/datatools';

import './css/main.css';
import './css/toolbar.css';
import './css/panelwindow.css';
import './css/notes.css';

/**
 *
 */
export default class FeedbackManager extends React.Component {

  /**
   *
   */
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      feedback: "",
      feedbackAnim: "",
      feedbackAlert: ""
    };

    this.dataTools = new DataTools ();

    this.closeFeedbackWindow = this.closeFeedbackWindow.bind(this);
    this.showFeedbackContent = this.showFeedbackContent.bind(this);
    this.stopAlert = this.stopAlert.bind(this);
  }

  /**
   * {"issue":"adirectional","details":"One of your arguments is not connected properly"}
   */
  showFeedbackString (aFeedback) {
    this.showFeedback ([{"issue":"invalidaction","details": aFeedback}]);
  }

  /**
   * {"issue":"adirectional","details":"One of your arguments is not connected properly"}
   */
  showFeedback (aFeedback) {
    //console.log (JSON.stringify (aFeedback));

    if (aFeedback==null) {
      console.log ("showFeedback() => bump");
      return;
    }

    if (aFeedback.length==0) {
      console.log ("showFeedback(0) => bump");
      return;
    }

    console.log ("Showing " + aFeedback.length + " piece(s) of feedback ...");

    let feedback="";

    for (let i=0;i<aFeedback.length;i++) {
      if (i>0) {
        feedback+=" "; 
      }
      feedback+=aFeedback [i].details;      
    }

    this.setState ({
      feedback: feedback,
      feedbackAnim: "fade-in",
      feedbackAlert: "alertclass",
      open: true
    }, (e) => {
      setTimeout (this.closeFeedbackWindow,10000);
    });
  }

  /**
   *
   */
  stopAlert () {
    console.log ("stopAlert()");
    this.setState ({
      feedbackAlert: "",
      feedbackAnim: ""
    });
  }

  /**
   *
   */
  closeFeedbackWindow () {
    this.setState ({open: false, feedback: ""});
  }

  /**
   *
   */
  showFeedbackContent (aValue) {
    if (this.state.open==false) {
      this.setState ({open: true});
    } else  {
      this.setState ({open: false});
    }
  }  

  /**
   * dangerouslySetInnerHTML is React’s replacement for using innerHTML in the browser DOM. In general, setting 
   * HTML from code is risky because it’s easy to inadvertently expose your users to a cross-site scripting (XSS) 
   * attack. So, you can set HTML directly from React, but you have to type out dangerouslySetInnerHTML and pass 
   * an object with a __html key, to remind yourself that it’s dangerous. For example:
   */ 
  render () {
    let feedbackcontent;
    let feedbackmenu;
    let fbackClass;
    let feedbackButtonClass="feedbackbutton";
    let foldIconClass="material-icons feedbackopen";

    feedbackButtonClass=("feedbackbutton " + this.state.feedbackAlert);

    if (this.state.open==true) {      
      fbackClass=("feedbackcontent " + " fade-in");
      foldIconClass=foldIconClass + " rotateaway" ;
    } else {
      fbackClass=("feedbackcontent mousedisabled");
      foldIconClass=foldIconClass + " rotateback" ;
    }

    feedbackcontent=<div ref="feedbackcontent" key="feedbackcontent" className={fbackClass} dangerouslySetInnerHTML={{ __html: this.state.feedback }}></div>

    feedbackmenu=<div ref="feedbackmenu" key="feedbackmenu" className="feedbackcontainer fade-in"><div className={feedbackButtonClass} onClick={(e) => this.showFeedbackContent(e)}><i className={foldIconClass}>eject</i></div></div>;

    return ([feedbackcontent,feedbackmenu]);
  }
}
