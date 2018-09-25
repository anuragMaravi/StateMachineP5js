var dataJson = {};                                 // JSON Object from the configuration file   
var stateMachineConfig;


/**
  Preload the configuration file before setup
*/
function preload() {
  var x = "";
  dataJson = loadJSON('config_direction.json');    // Configuration JSON file
}


/**
  Setup the configuration for the stateMachine in 'stateMachineConfig'
  Required: StateMacine Name
*/
function setStateMachineConfig(stateMachineName) {
  for (i in dataJson.config) {
      if(dataJson.config[i].stateMachineName == this.stateMachineName) 
        stateMachineConfig = dataJson.config[i];
  }   
}


/**
  Returns the initial state of the state machine
*/
function getInitialState() {   
  return stateMachineConfig.initialState;
}


/**
  Returns the configuration of all the states in the state machine as a jsonArray
*/
function getStateConfigArray() {
  return stateMachineConfig.states;
}


/**
  Returns a jsonArray of all the valid events for the state machine
*/
function getValidEvents() {  
  var validEvents = []
  for (i in stateMachineConfig.events) {
    validEvents.push(stateMachineConfig.events[i].eventName);
  } 
  return validEvents;
}



/**
  Checks if the event is valid for current state machine
*/
function isEventValid(eventName) {
  if(getValidEvents().includes(eventName))
    return true;
  else return false;  
}
