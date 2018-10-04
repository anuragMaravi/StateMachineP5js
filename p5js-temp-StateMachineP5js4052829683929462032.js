var bgImg;
var stateMachineName = "a";     // Name of the state machine to run
// Switch between configure environment and state machine environment
var configure = false;
var stateMachine = true;
//Configure
var buttonConfigure;
// Configure Palette
var controlPalette = new ConfigurePalette();
// Smooothing
var timeLastEvent;
var nameLastEvent, statusLastEvent;
// Colors
var colorInactive, themeColor;
//GUI
var gui;

// Setup ---------------------------------------------------------------------------------------------

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);              // Full screen canvas
  bgImg = loadImage("assets/background.jpg");
  themeColor = color(234, 239, 245, 200);                             // Active state color
  colorInactive = color(255,255,255, 120);                            // Inactive state color
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
  buttonConfigure.class('button1');
  buttonConfigure.position(10, 50);
  buttonConfigure.mousePressed(configureEnvironment);
  
  
  //******Configure Palette************
  gui = new dat.GUI();
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
  //// Folder 3
  //var f3 = gui.addFolder('UI');
  //f3.add(controlPalette, 'radius', 10, 100);
  // Folder 4
  var f4 = gui.addFolder('StateMachine');
  f4.add(controlPalette, 'stateMachineName');
  f4.add(controlPalette, 'initialState');
  
  gui.add(controlPalette, 'Save');

  f1.open();
  
  //******Data Stream************
  getDataStream();
    
} // Setup ends here



// Draw ---------------------------------------------------------------------------------------------
function draw() {
  background(bgImg);
  
  //**************************
  // Configuration Environment
  //**************************
  
  
  if(configure) {
    fill(255);
    textAlign(LEFT);
    text(eventsJArray, 20, window.innerHeight - 20);

    
    gui.open();
    //Draw the states on configure environment 
    ellipseMode(RADIUS);
    console.log(stateConfigArray);
    if (stateConfigArray.length > 0) {
      for (var i = 0; i < stateConfigArray.length; i++) {
        var circle = stateConfigArray[i];
        drawState(circle.x, circle.y, circle.stateName, colorInactive, 30);
      }
    }
    
  // Draw Arrows between states on configure environment
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
    
  } // Configure Environment ends here


  //**************************
  // State Machine Environment
  //**************************
  
  if(stateMachine) {
    gui.close();
    //******Local setup************  
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
        drawState(x, y, stateName, colorInactive, 60);
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
    
    textAlign(LEFT);
    text(getEventStatus() + ":" + getEventLabel(), 20, 400);
    
    if(message.length != 0) {   
        var eventStatus = getEventStatus();
        var eventLabel = getEventLabel();
        var eventTime = getEventTime(); 
        
        
        // Change the state  
        if(isEventValid(eventLabel)) {            // Checks if the event is valid for this state machine
        
        //  //Smoothing after last event
        //  statusLastEvent = eventStatus;
        //  nameLastEvent = eventLabel;
        //  timeLastEvent = int(eventTime) * 1000;
          
          var nextState = getNextState(getCurrentState(), eventLabel);    // Getting next state after checking the transition on the current state
                  console.log("Current State: " + getCurrentState());
                  console.log("Next State: " + nextState);  

          if(nextState != "Error" && nextState != "") {
            //if(statusLastEvent == "START" && !smoothingActive) {                                // Change the current state only when it starts
            if(eventStatus == "START") {                                // Change the current state only when it starts
              setCurrentState(nextState);                                 // Update the current state 
            } 
        //    message = '';                                                 // Reset the message   
          }
          
        //  if(!smoothingActive) {
        //    smoothingActive = true;
        //    currentSmoothingEvent = nameLastEvent;
        //  }
        //  smoothCurrentState(eventLabel, eventStatus);                                    //smoothing the current state

        } else console.log("Event not valid"); 
        
        message = '';                             // Reset the message after use, this module gets executed only once when a new message is received
     }
     
     //******Change States******
     var currentStatePosition = getStatePosition(getCurrentState());                                   // Get the position of the current state

     // -----Default-----: (Persistent) When the state is active it won't deactivate until next event happens
     drawState(currentStatePosition[0], currentStatePosition[1], getCurrentState(), themeColor, 60); // Update the state with theme color/Make the state active
     
     
     // -----Impersistent-----:  When the state is active and no event happens for few seconds it will deactivate
     // Update the color of the updated active state
     //if(!isEventOvertime(3000))                                                                        // Reset the state after overtime
     //  drawState(currentStatePosition[0], currentStatePosition[1], getCurrentState(), themeColor, 60); // Update the state with theme color/Make the state active 
     //else
     //  drawState(currentStatePosition[0], currentStatePosition[1], getCurrentState(), 0, 60);          // Make the state inactive again
       
       
       
  } // StateMachine Environment ends here
} // Draw ends here



/**
  Checks overtime after END Label
  To reset the state back to inactive after overtime
  overTimeDuration: in millisec
*/
function isEventOvertime(overTimeDuration) {
    var timeNow = +new Date;
    var diff = timeNow - timeLastEvent;
    if(diff > overTimeDuration && statusLastEvent == "END")
      return true;
    else 
      return false;    
}

//Smoothing for current state
var endTime0, startTime0;
var smoothingActive = false;
var currentSmoothingEvent;
var start = false;
function smoothCurrentState(eventLabel, eventStatus) {
  console.log("Smoothing started for: " + currentSmoothingEvent);
  if(currentSmoothingEvent == eventLabel){
    if(eventStatus == "END" && start){
      endTime0 = timeLastEvent;
      start = false;
      smoothingActive = false;
    }
    if(eventStatus == "START"){
      startTime0 = timeLastEvent;
      start = true;
      smoothingActive = true;
    }
    console.log("Smoothe" + endTime0);
    console.log("Smooths" + startTime0);
    if(startTime0 - endTime0 < 10000) {
      console.log(startTime0 - endTime0);
      console.log("Keep Smoothing");
      smoothingActive = true;
    } else {
      console.log("Smoothing Over");
      smoothingActive = false;
    }
  }
}
