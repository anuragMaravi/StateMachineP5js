/// Arrow properties
var arrowThickness = 1.0; //Thickness of the arrow
var arrowColor = (235, 240, 246);


/**
  Draws the state and its label
*/
function drawState(x, y, stateName, stateColor, stateRadius) {
  //fill(255,255,255,120);
  fill(stateColor);
  stroke(235, 240, 246);
  strokeWeight(1);
  ellipse(x, y, 2*stateRadius, 2*stateRadius); // Cricle with diameter
  textSize(16);                                // State label size
  fill(0);                                     // Label color
  strokeWeight(0);
  textAlign(CENTER, CENTER);
  text(stateName, x, y);                       // Add label to the state
}


/**
  Draws the arrow between circles (states) having the points on their edges
*/
function drawArrow(centerX0, centerY0, centerX1, centerY1, stateRadius) {
  var px0, py0, px1, py1;                                             // Points on the circles circumference
  var angle = atan2(centerY1-centerY0, centerX1-centerX0);            // the angle of the line joining centre of circle c0 to c1
  px0 = centerX0 + stateRadius * cos(angle);
  py0 = centerY0 + stateRadius * sin(angle);
  px1 = centerX1 + stateRadius * cos(angle + PI);
  py1 = centerY1 + stateRadius * sin(angle + PI);
  var arrowLength = sqrt((px1-px0)*(px1-px0) +(py1-py0)*(py1-py0));   // Calculate the arrow length and head size
  var arrowSize = 2.5 * arrowThickness;
  strokeWeight(arrowThickness);                                       // Setup arrow thickness
  stroke(arrowColor);                                                 // Setup arrow colors
  fill(arrowColor);
  push();                                                             // Set the drawing matrix at the origin
  translate(px0, py0);                                                // Move the arrow to point at circle0
  rotate(angle);                                                      // Rotate the line towards circle1
  line(0, 0, arrowLength, 0);                                         // Draw the arrow shafte
  beginShape(TRIANGLES);                                              // Draw the arrowhead
  vertex(arrowLength, 0);                   
  vertex(arrowLength - arrowSize, -arrowSize);
  vertex(arrowLength - arrowSize, arrowSize);
  endShape();
  pop();
}
