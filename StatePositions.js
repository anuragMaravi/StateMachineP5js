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
  Creates a map of state and its position
*/
function setPosition(previousState, nextState, direction) {
    var statePresent = isPositionPresent(nextState);
    if(!statePresent) {
      var coord = getStatePosition(previousState);  
      var x = coord[0];
      var y = coord[1];
      
      // conditions to get the position of the next state
      if(direction == "N"){ y = y - stateGap; }
      if(direction == "NE"){ x = x + stateGap; y = y - stateGap; }
      if(direction == "E"){ x = x + stateGap; }
      if(direction == "SE"){x = x + stateGap;y = y + stateGap; }
      if(direction == "S"){y = y + stateGap; }
      if(direction == "SW"){ x = x - stateGap; y = y + stateGap; }
      if(direction == "W"){ x = x - stateGap; }
      if(direction == "NW"){ x = x - stateGap; y = y - stateGap; }
      
      addStatePosition(nextState, x, y);
    }
}


/**
  Traverse all the states 
  Make the stateTransition list (stateName#nextState)
*/
var traverse = function(nextState) {
  if(!traversedStatesList.includes(nextState)){ 
    traversedStatesList.push(nextState);                                          // Add the state on which currently traversing to a list to avoid traversing again
    var stateConfigArray = getStateConfigArray();
    for (i in stateConfigArray) {                                                 // Traverse over all the states on configuration
      var stateName = stateConfigArray[i].stateName;
      if(stateName == nextState) {                                                // Traverse the transitions of the nextState only
        var transitionArray = stateConfigArray[i].transition;
        for (j in transitionArray) {
          addTransition(stateName, transitionArray[j].event, transitionArray[j].nextState);      // Add transitions between states
          setPosition(stateName, transitionArray[j].nextState, transitionArray[j].direction);    // Set the position of the state according to the direction
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
function getStatePosition(stateName) {
  var positionArray = positionJson["positions"];
  for (i in positionArray) {
    if(positionArray[i].stateName == stateName) {     
      var x = positionArray[i].position.x;
      var y = positionArray[i].position.y;
      return [x, y];
    }
  }  
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
