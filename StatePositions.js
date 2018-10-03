var traversedStatesList = [];                                                    // List of all the states already traversed
var positionJson = {"positions":[]};                                             // JSON of positions of all the states
var transitionJson = {"transitions":[]};
var stateGap = 200;                                                              // Gap between the states in the UI


/**
  Position of all the states in the UI
  Uses the initial state as the base and draws all the other states in reference to the initial state
  Directions for each state in reference to the previous state are from the configuration file 
*/




/**
  Traverse all the states 
  Make the stateTransition list (stateName#nextState)
*/
var traverse = function(nextState) {
  if(!traversedStatesList.includes(nextState)){ 
    traversedStatesList.push(nextState);                                          // Add the state on which currently traversing to a list to avoid traversing again
    var statesArray = getStateConfigArray();
    for (i in statesArray) {                                                 // Traverse over all the states on configuration
      var stateName = statesArray[i].stateName;
      if(stateName == nextState) {                                                // Traverse the transitions of the nextState only
        var transitionArray = statesArray[i].transition;
        for (j in transitionArray) {
          addTransition(stateName, transitionArray[j].event, transitionArray[j].nextState);      // Add transitions between states
          while(traverse(transitionArray[j].nextState))
            traverse(transitionArray[j].nextState);                              //Recursively traversing the digraph until all the states are traversed
        }
      }
    }
    return true;
  } else return false;
}



/**
  Adds a new state and its position (x, y) on the UI
*/
function addStatePosition(stateName, x, y) {
    positionJson["positions"].push({"stateName":stateName, "position":{"x":x, "y":y}});
}


/**
  Adds transition and event/condition between the states
*/
function addTransition(fromState, condition, toState) {
    transitionJson["transitions"].push({"fromState":fromState, "condition": condition, "toState": toState});
}


/**
  Check if the position for a state is already present
*/
function isPositionPresent(stateName) {
  var hasMatch =false;
  var positionArray = positionJson["positions"];
  for (i in positionArray) {
    if(positionArray[i].stateName == stateName) {
      hasMatch = true;
     break;
    }
  }  
  return hasMatch;
}


/**
  Returns the position of a state
  Required: stateName
*/
function getStatePosition(a) {
  var fx, fy;
  var statesArray = getStateConfigArray();
  for (i in statesArray) {
    var state = statesArray[i];
    if(state.stateName == a) {
      var x = state.x;
      var y = state.y;
      var stateName = state.stateName;
      fx = x;
      fy = y;
    }
   }
   return [fx, fy];
}


/**
  Returns all the possible transitions for the state machine
*/
function getTransitions() {
  return transitionJson["transitions"];
}


/**
  Returns all the possible transitions for the state machine
*/
function getPositionJson() {
  return positionJson["positions"];
}
