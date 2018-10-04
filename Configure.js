var inputStateName, buttonAddState;
var inputFrom, inputCondition, inputTo, buttonAddTrans;


var transitions = [];
var data = [];
var radius = 30;
var eventsJArray = [];
var transitionJArray = [];
var statesJArray = [];


//New Array
var stateConfigArray = [];

var x = 100;               // x, position of first state



// Drag States ---------------------------------------------------------------------------------------------

function mousePressed()
{
  // Make the state active
  if (stateConfigArray.length > 0) {
    for (var i = 0; i < stateConfigArray.length; i++) {
      var state = stateConfigArray[i];
      distance = dist(mouseX, mouseY, state.x, state.y);
      if (distance < 60) {
        state.active = true;
        state.color = '#fff';
      } else {
        state.active = false;
        state.color = '#fff';
      }
    }
  }
}

// Run when the mouse/touch is dragging.
// Update the poisition of the state dragged
function mouseDragged() {
  if (stateConfigArray.length > 0) {
    for (var i = 0; i < stateConfigArray.length; i++) {
      var state = stateConfigArray[i];
      if (state.active) {
        state.x = mouseX;
        state.y = mouseY;
        break;
      }
      
      //Testing@@@@@@@@@@@@@@@@@@@@
      distance = dist(mouseX, mouseY, state.x, state.y);
      if (distance < 60) {
        console.log("Found Source: " + state.stateName);
        
      }
    }
  }
  // Prevent default functionality.
  return false;
}


// When configure button is pressed
function configureEnvironment() {
  
  console.log("Opened Configure Environment");  
  // Change the environment to configure  
  stateMachine = false;
  configure = true; 
}



// Configure Palette ------------------------------------------------------------------------------//---------------

/**
  All the functions from the pallete is managed here
  Go through the dat.gui examples
*/
var ConfigurePalette = function() {
  this.stateMachineName = '';
  this.initialState = '';
  this.eventName = '';
  this.stateName = '';
  this.x = '';
  this.y = '';
  this.fromState = '';
  this.condition = '';
  this.toState = '';
  //this.radius = 30;
  
  // On AddState pressed
  this.AddState = function(){
    var name = this.stateName;
    var statesObj = new Object();
    statesObj.stateName = this.stateName;
    statesObj.x = x;
    statesObj.y = 200;
    statesObj.color = '#fff';
    statesObj.active = false;
    statesObj.transition = [];
    stateConfigArray.push(statesObj);
    x = x+radius*3;
  }
  
  
  // On AddEvent Pressed
  this.AddEvent = function(){
    var eventName = this.eventName;
    var eventObj = new Object();
    eventObj.eventName = eventName;
    eventObj.eventType = "discrete";
    eventsJArray.push(eventObj);
    
    
  }
  
  
  // On AddTransition pressed
  this.addTransition = function(){
    var duplicate = false;
    var stateName = this.fromState;
    var eventName = this.condition;
    var nextState = this.toState;
    var direction = "N";
    // For dragging states
    transitions.push({fromState: stateName, event: eventName, toState: nextState});
    // In case of duplicate
    if(statesJArray.length > 0) {
      for(var i = 0; i < statesJArray.length; i++) {
          var obj = statesJArray[i];
          if(obj.stateName == stateName) {
            console.log("Same State found");
            var tArray = obj.transition;
            for(var i = 0; i < tArray.length; i++) {
              var tObj = tArray[i];
              if(tObj.event != eventName) {
                var transitionObj = new Object();
                transitionJArray = [];
                transitionObj.event = eventName;
                transitionObj.nextState = nextState;
                transitionObj.direction = direction;
                tArray.push(transitionObj);
            } }
           duplicate = true;
          } 
      }
    }
    // In case of non duplicate
    if(stateName != "" || eventName != "" || nextState != "" || direction != ""){  
      if(!duplicate) {
        var transitionObj = new Object();
        transitionJArray = [];
        transitionObj.event = eventName;
        transitionObj.nextState = nextState;
        transitionObj.direction = direction;
        transitionJArray.push(transitionObj);
        var statesObj = new Object();
        statesObj.stateName = stateName;
        statesObj.transition = transitionJArray;
        statesJArray.push(statesObj);
        if (stateConfigArray.length > 0) {
          for (var i = 0; i < stateConfigArray.length; i++) {
            var state = stateConfigArray[i];
            if (state.stateName == stateName) {
              state.transition = transitionJArray;
              break;
            }
          }
        }
      } 
    } else alert("Empty parameter");
    console.log(statesJArray);
  }
  
  
  // On save button pressed
  this.Save = function(){
    var obj = new Object();
    obj.stateMachineName = this.stateMachineName;
    obj.initialState = this.initialState;
    obj.events = eventsJArray;
    obj.states = stateConfigArray;
    data.push(obj);
    // Final data on configuration file
    var configObj = new Object();
    configObj.config = data;       // configObj: Final Json created
    saveJSON(configObj, 'config_direction.json');
    location.reload();
  } 
  
};
