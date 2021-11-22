
var APIActivity=null;

/**
 *
 */
export function hasOLIBridge () {
  if (APIActivity!=null) {
    return (true);
  }

  return (false);
}

/**
 *
 */
export function getOLIBridge () {
  return (APIActivity);
}

/**
* Create a link to the OLI embedded activity Javascript code and
* get a reference to it's driver so that we can access logging, etc. 
*/
export function initOLIBridge () {
  console.log ("initOLIBridge ()");
  
  if (window.parent) {
    if (window.parent.startOLIBridge) {
      APIActivity=window.parent.startOLIBridge ();
  	  return (APIActivity);
    }
  }

  console.log ("This application is not running in the context of OLI");

  return (null);
}

/**
 * e.g logNavigation ("question1","button1pressed");
 */
export function logNavigation (aQuestion,anAction) {
  console.log ("logNavigation()");

  if (APIActivity) {
    APIActivity.logNavigation (aQuestion,anAction);
  }
}

/**
 * e.g. logCorrect ("question2", "Some additional data, can be String, JSON, XML, etc");
 */
export function logCorrect (aQuestion,anAction) {
  console.log ("logCorrect()");

   if (APIActivity) {
    APIActivity.logCorrect (aQuestion,anAction);
   }
}

/**
 * e.g. logInCorrect ("question3", "Some additional data, can be String, JSON, XML, etc");
 */
export function logInCorrect (aQuestion,anAction) {
   console.log ("logInCorrect()");

   if (APIActivity) {
     APIActivity.logInCorrect (aQuestion,anAction);
   }
}

/**
 * e.g. logCorrect ("question2", "Some additional data, can be String, JSON, XML, etc");
 */
export function logCorrectStep (aQuestion,anAction,aFeedback) {
  console.log ("logCorrectStep()");

   if (APIActivity) {
    APIActivity.logCorrectStep (aQuestion,anAction,aFeedback);
   }
}

/**
 * e.g. logInCorrect ("question3", "Some additional data, can be String, JSON, XML, etc");
 */
export function logInCorrectStep (aQuestion,anAction,aFeedback) {
   console.log ("logInCorrectStep()");

   if (APIActivity) {
     APIActivity.logInCorrectStep (aQuestion,anAction,aFeedback);
   }
}

/**
 * e.g. logHint ("question4", "Hint or feedback text goes here");
 */
export function logHint (aQuestion,aFeedback) {
  console.log ("logHint()");

  if (APIActivity) {
    APIActivity.logHint (aQuestion,aFeedback);
  }
}

/**
 * e.g. logHint ("question4", "Hint or feedback text goes here");
 */
export function sendScore (aScore) {
  console.log ("sendScore("+aScore+")");

  if (APIActivity) {
    APIActivity.sendScore ("percent", aScore);
  }
}
