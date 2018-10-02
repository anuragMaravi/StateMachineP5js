var inputStateName, buttonAddState;
var inputFrom, inputCondition, inputTo, buttonAddTrans;


var states = []            // Configuration JSON
var transitions = []
var data = []
var radius = 30;

var eventsJArray = []
var transitionJArray = []
var statesJArray = []



// Drag States ---------------------------------------------------------------------------------------------

function mousePressed()
{
  // Make the state active
  if (states.length > 0) {
    for (var i = 0; i < states.length; i++) {
      var state = states[i],
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
  if (states.length > 0) {
    for (var i = 0; i < states.length; i++) {
      var state = states[i];
      if (state.active) {
        state.x = mouseX;
        state.y = mouseY;

        break;
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
  this.radius = 30;
  
  // On AddState pressed
  this.AddState = function(){
    var name = this.stateName;
    
    states.push({ x: 100, y: 100, color: '#fff', active: false , name: name});
  
     ellipseMode(RADIUS);
      if (states.length > 0) {
        for (var i = 0; i < states.length; i++) {
          var state = states[i];
          drawState(state.x, state.y, name, state.color);
        }
     }
  }
  
  this.AddEvent = function(){
    var eventName = this.eventName;
    var eventObj = new Object();
    eventObj.eventName = eventName;
    eventObj.eventType = "discrete";
    eventsJArray.push(eventsJArray);
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
      } 
    } else alert("Empty parameter");
    console.log(statesJArray);
  }
  
  
  // On save button pressed
  this.Save = function(){
    var obj = new Object();
    obj.stateMachineName = this.stateMachineName;
    obj.initialState = this.initialState;
    obj.events = ['x'];
    obj.states = statesJArray;
    
    // Final data on configuration file
    var configObj = new Object();
    data.push(obj);
    configObj.config = data;
    
    console.log(configObj);
    download('config_direction.json', JSON.stringify(configObj));
    location.reload();
  }
  
};

//Download the configuration JSON file
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
