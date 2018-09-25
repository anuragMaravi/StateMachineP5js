var currentState = "";


/**
  Checks for the possible transition on the current state
  Returns the next state
*/
function getNextState(currentState, eventLabel) {
  var transitionArray = getTransitions();
  for (i in transitionArray) {
      var fromState = transitionArray[i].fromState;      
      if(fromState == currentState) {
        var condition = transitionArray[i].condition;
        if(condition == eventLabel) {
          return transitionArray[i].toState;
        } else {
          console.log("No transition for this state");
          return "Error";
        }  
      }    
   }
}


/**
  Updates the current state
*/
function setCurrentState(nextState) {
 currentState = nextState;
}


/**
  Returns the current state
  If there is no current state, returns initial state as the current state
*/ 
function getCurrentState() {
 if (currentState == "")
  return getInitialState();          // Returns the initial state if there is no current state
 else
  return currentState;
}
