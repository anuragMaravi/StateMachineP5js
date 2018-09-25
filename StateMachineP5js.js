var stateMachineName = "Microwave";                                 // Name of the state machine to run

// Setup ---------------------------------------------------------------------------------------------

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);              // Full screen canvas
  noLoop();

  setStateMachineConfig(stateMachineName);
  
  // Set the base as the initialState and center of the canvas as initial position
  addStatePosition(getInitialState(), window.innerWidth/2, window.innerHeight/2);
  
  /** 
      Start traversing from the initial state 
      Set position of the states
      Setup a state-transition rule
      From: StatePositions.pde
  */  
  traverse(getInitialState());

}


// Draw ---------------------------------------------------------------------------------------------

function draw() {
  background(0);
  var themeColor = color(250, 68, 130);                             // Theme color for the UI

 
  //******Local setup************
  
  /** 
      Getting the position of all the states (positionJson) and drawing it on the UI
      Position, from: StatePositions.js
      drawState, from: AddUIObjects.js
  */
  var positionArray = getPositionJson();
  for (i in positionArray) {
      var x = positionArray[i].position.x;
      var y = positionArray[i].position.y;
      var stateName = positionArray[i].stateName;
      drawState(x, y, stateName, 255);
   }
  
  //Draw arrows between the states
  var transitionArray = getTransitions();
  for (i in transitionArray) {
      var fromState = transitionArray[i].fromState;
      var toState = transitionArray[i].toState;
      
      var fromPosition = getStatePosition(fromState);  
      var toPosition = getStatePosition(toState);
      drawArrow(fromPosition[0], fromPosition[1], toPosition[0], toPosition[1]);
   }
  
  //******After Data stream************
  
  textSize(32);
  fill(255);
  text(message, window.innerWidth/2, 30);                              // 'message' from @DataStream.js, message from the broker
  
  if(message.length != 0) {   
    // @ToDo: Get the events from real sensor and parse its value
    
    //Split the message into its status and label
    var eventMessage = message.split(":");
    var eventStatus = eventMessage[0];
    var eventLabel = eventMessage[1];
        
    // Change the state  
    if(isEventValid(eventLabel)) {                                     // Checks if the event is valid for this state machine
      var nextState = getNextState(getCurrentState(), eventLabel);     // Getting next state after checking the transition on the current state
      if(nextState != "Error" || nextState != "") {
        setCurrentState(nextState);                                    // Update the current state 
      }
    } else console.log("Event not valid"); 
   }
   
   // Update the color of the updated active state
   var currentStatePosition = getStatePosition(getCurrentState());                             // Get the position of the current state
   drawState(currentStatePosition[0], currentStatePosition[1], getCurrentState(), themeColor); // Update the state with theme color/Make the state active 

}
