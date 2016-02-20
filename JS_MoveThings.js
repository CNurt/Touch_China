//from here: http://www.petercollingridge.co.uk/book/export/html/437
var pt   = svg.createSVGPoint();

var selectedElement = 0;
var currentX = 0;
var currentY = 0;
var currentMatrix = 0;

function selectElement(evt) {
  selectedElement = evt.target;
	//function cursorPoint(evt) could be used here, but didn't get it to work yet
  //pt.x = evt.clientX; pt.y = evt.clientY;
  currentX = evt.clientX;
  currentY = evt.clientY;
  currentMatrix = selectedElement.getAttributeNS(null, "transform").slice(7,-1).split(' ');

  for(var i=0; i<currentMatrix.length; i++) {
	currentMatrix[i] = parseFloat(currentMatrix[i]);
  }
  
  selectedElement.setAttributeNS(null, "onmousemove", "moveElement(evt)");
  selectedElement.setAttributeNS(null, "onmouseout", "deselectElement(evt)");
  selectedElement.setAttributeNS(null, "onmouseup", "deselectElement(evt)");
}
	
function moveElement(evt) {
  var dx = evt.clientX - currentX;
  var dy = evt.clientY - currentY;
  currentMatrix[4] += dx;
  currentMatrix[5] += dy;
  
  selectedElement.setAttributeNS(null, "transform", "matrix(" + currentMatrix.join(' ') + ")");
  currentX = evt.clientX;
  currentY = evt.clientY;
}
	
function deselectElement(evt) {
  if(selectedElement != 0){
	  selectedElement.removeAttributeNS(null, "onmousemove");
	  selectedElement.removeAttributeNS(null, "onmouseout");
	  selectedElement.removeAttributeNS(null, "onmouseup");
	  selectedElement = 0;
	  }
	}


//IMPROVEMENT POSSIBLE
//http://phrogz.net/svg/rotate-to-point-at-cursor.svg
//http://stackoverflow.com/questions/10298658/mouse-position-inside-autoscaled-svg
// Get point in global SVG space
/*
function cursorPoint(evt){
	//HIER ist der Fehler, irgenwie funktioniert das mit der Variable pt.x nicht
	pt.x = evt.clientX; pt.y = evt.clientY;
	return pt.matrixTransform(svg.getScreenCTM().inverse());
}
*/