var debuggingMode = false;
//List of Events:  http://www.w3schools.com/jsref/dom_obj_event.asp
//Helpful for JScript Debugging: document.getElementById("TaskText").innerHTML = currentMatrix;//alert(ElTouched + ElMove + "\n" + dx + "\n" + dy);
var NrClicks = 0;   //Amount of clicks on Provinces
//var TestStringArray = [ "erstes Testelement\n" ]; 
var TestString = "erstes Testelement;闺女\n";

// see following for events:  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
//ACHTUNG!  addEventListener can only use functions without a return value!!!
//"load" waits longer than "DOMContentLoaded", otherwise similar behaviour
// that why load is disabled
//window.addEventListener("load", fAddEventListeners, false);
window.addEventListener("DOMContentLoaded", fAddEventListeners, false);

function fAddEventListeners() {
	var MapTilePaths = document.getElementById("MapTiles").getElementsByTagName("path");
	var WholeMapPaths = document.getElementById("WholeMap").getElementsByTagName("path");
	var limit1 = MapTilePaths.length;
	for (i = 0; i < limit1; i++) {
		MapTilePaths[i].addEventListener("mousedown",fClickMapTile,false);
		WholeMapPaths[i].addEventListener("mousedown",fDragMap,false);
	}
	var limit2 = WholeMapPaths.length;
	for (i = limit1; i < limit2; i++) {
		WholeMapPaths[i].addEventListener("mousedown",fDragMap,false);
	}
	document.getElementById("MapUnderlayer").addEventListener("mousedown",fDragMap,false);
}

function fDragMap(evt) {
	//move the map by clicking on any map tile
	document.getElementById('MapCover').setAttributeNS(null, "visibility", "visible");
	//selectOtherElement(evt.target, document.getElementById('WholeMap').getElementsByTagName('path'),true);
	selectOtherElement(document.getElementById('MapCover'), document.getElementById('WholeMap').getElementsByTagName('path'),true);
	return false;
}

//mit Rückgabewert
//var fOnMouseOverProvince = function(ThisElement) {
//ohne Rückgabewert
function fOnMouseOverProvince(ThisElement) {
	//ThisElement.setAttribute('fill', '#FFD026');
}

function fClickMapTile(evt) {
	//Testing the TextBox
	fchangeText();
	fResizeTextBox(document.getElementById("TaskText"), document.getElementById("TaskBox"));
	return false;
}

function fOnMouseOutProvince(ThisElement) {
	//ThisElement.setAttribute('fill', '#FFF6D5');
}

function fchangeText() {
// ATM just TEST
	NrClicks = NrClicks + 1;
	document.getElementById("TaskText").innerHTML = NrClicks;
}

function fResizeTextBox(TextID, RectangleID) {
// Resize rectangle used as a textbox in order to keep text inside the box
	var CurrentTextWidth = TextID.getBoundingClientRect().width;
	var CurrentTextHeight = TextID.getBoundingClientRect().height;
    
	RectangleID.setAttributeNS(null,'width', CurrentTextWidth);
	RectangleID.setAttributeNS(null,'height', CurrentTextHeight);
}

//ATM unused
function onTextfileClick() {
//gets an <a> Tag by ID and asigns a link to a created textfile
    var link = document.getElementById('ID_FROM_<a>_TAG');
    //the <a> Tag already has to have the xlink:href="#" Attribute, otherwise it won't work
    //IMPROVEMENT POSSIBLE
    //should use setAttributeNS instead of setAttribute inside SVG but can't get it to work
		link.setAttribute('xlink:href', makeTextFile(TestString));
  }

//ATM unused
/*
makeTextFile = function (text) {
//creates a link to a textfile, which has been created from a string variable
	var textFile = null
	//charset=utf-8 works only in firefox so far
	var data = new Blob([text], {type: 'text/plain; charset=utf-8'});

	// If we are replacing a previously generated file we need to
	// manually revoke the object URL to avoid memory leaks.
	if (textFile !== null) {
		window.URL.revokeObjectURL(textFile);
	}

	textFile = window.URL.createObjectURL(data);

	// returns a URL you can use as a href
	return textFile;
};
*/