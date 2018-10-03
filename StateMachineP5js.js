var bgImg;
var stateMachineName = "a";     // Name of the state machine to run

// Switch between configure environment and state machine environment
var configure = false;
var stateMachine = true;

//Configure
var buttonConfigure;

// Configure Palette
var controlPalette = new ConfigurePalette();



// Setup ---------------------------------------------------------------------------------------------

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);              // Full screen canvas
  bgImg = loadImage("assets/background.jpg");
  
  //noLoop();

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
    
  
  //******Configure Button************
  buttonConfigure = createButton('Configure');
  buttonConfigure.position(10, 10);
  buttonConfigure.mousePressed(configureEnvironment);
  
  
  //******Configure Palette************
  
  var gui = new dat.GUI();
  gui.remember(controlPalette);   // Gives the functionality to save the configuration
  
  // Folder 0
  var f1 = gui.addFolder('Events');
  f1.add(controlPalette, 'eventName');
  f1.add(controlPalette, 'AddEvent');
  
  // Folder 1
  var f1 = gui.addFolder('State');
  f1.add(controlPalette, 'stateName');
  f1.add(controlPalette, 'AddState');
  
  // Folder 2
  var f2 = gui.addFolder('Transition');
  f2.add(controlPalette, 'fromState');
  f2.add(controlPalette, 'condition');
  f2.add(controlPalette, 'toState');
  f2.add(controlPalette, 'addTransition');
  
  // Folder 3
  var f3 = gui.addFolder('UI');
  f3.add(controlPalette, 'radius', 10, 100);
  
  // Folder 4
  var f4 = gui.addFolder('StateMachine');
  f4.add(controlPalette, 'stateMachineName');
  f4.add(controlPalette, 'initialState');
  
  gui.add(controlPalette, 'Save');

  f1.open();
  
  
  
} // Setup ends here



// Draw ---------------------------------------------------------------------------------------------
function draw() {
  background(bgImg);
  
  
  //**************************
  // Configuration Environment
  //**************************
  
  if(configure) {
    
    //******Configure Palette************  
    
    
    
    //******Configure Environment************    
    //Drag 
    ellipseMode(RADIUS);
    console.log(stateConfigArray);
    if (stateConfigArray.length > 0) {
      for (var i = 0; i < stateConfigArray.length; i++) {
        var circle = stateConfigArray[i];
        drawState(circle.x, circle.y, circle.stateName, circle.color, 30);
      }
    }
    
    // Draw Arrows between states
  if (transitions.length > 0) {
    var x1, y1, x2, y2;
    
    for(i in transitions) {
      var transition = transitions[i];
      var fromState = transition.fromState;
      var toState = transition.toState;
      
    for(j in stateConfigArray) {
       var state = stateConfigArray[j];
       if(fromState == state.stateName) {
         x1 = state.x;
         y1 = state.y;
       }
       
       if(toState == state.stateName) {
         x2 = state.x;
         y2 = state.y;
       }
     }
     drawArrow(x1, y1, x2, y2, 30*2);
    }    
  }
    
  }
  
  
  
  
  //**************************
  // State Machine Environment
  //**************************
  
  
  if(stateMachine) {
  //******Local setup************

  var themeColor = color(250, 68, 130);                             // Theme color for the UI

  /** 
      Getting the position of all the states (positionJson) and drawing it on the UI
      Position, from: StatePositions.js
      drawState, from: AddUIObjects.js
  */
  var stateArr = getStateConfigArray();
  for (i in stateArr) {
    var state = stateArr[i]
      var x = state.x;
      var y = state.y;
      var stateName = state.stateName;
      drawState(x, y, stateName, 255, 60);
   }
  
  //Draw arrows between the states
  var transitionArray = getTransitions();
  for (i in transitionArray) {
      var fromState = transitionArray[i].fromState;
      var toState = transitionArray[i].toState;
      
      var fromPosition = getStatePosition(fromState);  
      var toPosition = getStatePosition(toState);
      drawArrow(fromPosition[0], fromPosition[1], toPosition[0], toPosition[1], 60);
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
   drawState(currentStatePosition[0], currentStatePosition[1], getCurrentState(), themeColor, 60); // Update the state with theme color/Make the state active 
  }
} // Draw ends here
