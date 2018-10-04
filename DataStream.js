var message = ""
var eventStatus, eventLabel, eventTime;

//RabbitMQ Configuration
var exchangeName = "master_exchange";
var userName = "test";
var password = "TeSt";
var virtualHost = "/";                                   
var hostName = "128.237.158.26";                           // Hostname/Ip of the host
var routingKey = "80ee9a0e-e420-4263-9629-46ce4c3f7ae4";   // Sensor Id is used as the routing key
var port = 5672;

function getDataStream() {
  var ws = new WebSocket('ws://128.237.158.26:15674/ws');         // Create a websocket object
  var client = Stomp.over(ws);                               // Use the stomp to make the client object  
  /**
      Stream from the broker 
      When a new message arrives, the message object gets updated
  */
  var on_connect = function(x) {
    id = client.subscribe('/exchange/'+ exchangeName +'/' + routingKey, function(d) {
      message = d.body;
      message = message.replace(/'/g,'\"');                     // Convert the unicode string to java compatible string
       message = message.replace(/u\"/g,'\"');                    // This message updates when a new message arrives
      var msgObj = JSON.parse(message);
      var fieldsObj = msgObj.fields;
      var eventMsg = fieldsObj.value;
      var eventMessage = eventMsg.split(":");
      
      setEventStatus(eventMessage[0]);
      setEventLabel(eventMessage[1]);
      setEventTime(new Date(fieldsObj.inserted_at).getTime());
      
      //redraw();    
    });
  };
  // Error connecting to the broker
  var on_error = function() {
    console.log('Error connecting to the broker');
  };
  client.connect(userName, password, on_connect, on_error, '/'); // Callbacks for the connection and error
}



function setEventStatus(es) {
  eventStatus = es;
}

function setEventLabel(el) {
  eventLabel = el;
}

function setEventTime(et) {
  eventTime = et;
}

function getEventStatus() {
  return eventStatus;
}

function getEventLabel() {
  return eventLabel;
}

function getEventTime() {
  return eventTime;
}
