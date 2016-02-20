//List of Events:  http://www.w3schools.com/jsref/dom_obj_event.asp
var iTest = 1;
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
	onChangeText(document.getElementById("TaskText"), document.getElementById("TaskBox"));
	
	//Testing fileoutput and stringarray
	TestString = TestString + ThisElement.id + ";" + prompt(ThisElement.id) + ";\n"
}

var fOnMouseOutProvince = function(ThisElement) {
	//ThisElement.setAttribute('fill', '#FFF6D5');
}

function changeText() {
// ATM just TEST
	iTest = iTest * (iTest + 1);
	document.getElementById("TaskText").innerHTML = iTest;
}

function onChangeText(TextID, RectangleID) {
// Resize rectangle used as a textbox in order to keep text inside the box
	var CurrentTextWidth = TextID.getBoundingClientRect().width;
	var CurrentTextHeight = TextID.getBoundingClientRect().height;
	
	RectangleID.setAttribute('width', CurrentTextWidth+20);
	RectangleID.setAttribute('height', CurrentTextHeight+20);
}

function onTextfileClick() {
    var link = document.getElementById('Link_LittleTextBox');
		link.setAttribute('xlink:href', makeTextFile(TestString));
    //link.href = makeTextFile("Ni Hao!");
		//prompt(makeTextFile("Ni Hao!"));
    //link.style.display = 'block';
  }

makeTextFile = function (text) {
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