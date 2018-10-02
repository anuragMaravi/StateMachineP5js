var message = ""

//RabbitMQ Configuration
var exchangeName = "master_exchange";
var userName = "";
var password = "";
var virtualHost = "/";                                   
var hostName = "128.237.158.26";                           // Hostname/Ip of the host
var routingKey = "80ee9a0e-e420-4263-9629-46ce4c3f7ae4";   // Sensor Id is used as the routing key
var port = 5672;

function getDataStream() {
  var ws = new WebSocket('ws://127.0.0.1:15674/ws');         // Create a websocket object
  var client = Stomp.over(ws);                               // Use the stomp to make the client object
  
  
  /**
      Stream from the broker 
      When a new message arrives, the message object gets updated
  */
  var on_connect = function(x) {
    id = client.subscribe('/exchange/'+ exchangeName +'/' + routingKey, function(d) {
      message = d.body;
      redraw();    
    });
  };
  
  
  // Error connecting to the broker
  var on_error = function() {
    console.log('Error connecting to the broker');
  };
  
  
  client.connect('guest', 'guest', on_connect, on_error, '/'); // Callbacks for the connection and error
}
