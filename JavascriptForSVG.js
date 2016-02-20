//List of Events:  http://www.w3schools.com/jsref/dom_obj_event.asp
//Helpful for JScript Debugging: document.getElementById("TaskText").innerHTML = currentMatrix;//alert(ElTouched + ElMove + "\n" + dx + "\n" + dy);
var NrClicks = 0;   //Amount of clicks on Provinces
//var TestStringArray = [ "erstes Testelement\n" ]; 
var TestString = "erstes Testelement;闺女\n"

//It would be better to use .addEventListener but I didn't get it to work
//so I'll stick with the  onclick=" function" in the SVG
// see following for events:  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener


//mit Rückgabewert
var fOnMouseOverProvince = function(ThisElement) {
//ohne Rückgabewert
//function fOnMouseOverProvince(ThisElement) {
	//ThisElement.setAttribute('fill', '#FFD026');
}

var fOnClickProvince = function(ThisElement) {
	//Testing the TextBox
	changeText();
	ResizeTextBox(document.getElementById("TaskText"), document.getElementById("TaskBox"));
	
}

var fOnMouseOutProvince = function(ThisElement) {
	//ThisElement.setAttribute('fill', '#FFF6D5');
}

function changeText() {
// ATM just TEST
	NrClicks = NrClicks + 1;
	document.getElementById("TaskText").innerHTML = NrClicks;
}

function ResizeTextBox(TextID, RectangleID) {
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