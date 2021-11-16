﻿var debuggingMode = false;
//List of Events:  http://www.w3schools.com/jsref/dom_obj_event.asp
//Helpful for JScript Debugging: fchangeText(currentMatrix);//alert(ElTouched + ElMove + "\n" + dx + "\n" + dy);
var NrClicks = 0;   //Amount of clicks on Provinces
//var TestStringArray = [ "erstes Testelement\n" ]; 
var TestString = "erstes Testelement;闺女\n";
var mouseMoved = false;
var mouseDown = false;
var activeProvince = -1;
var hasmoved = false;
let scale = Math.log(1.0);

// see following for events:  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
//ACHTUNG!  addEventListener can only use functions without a return value!!!
//"load" waits longer than "DOMContentLoaded", otherwise similar behaviour
window.addEventListener("load", finit, false);
// window.addEventListener("DOMContentLoaded", finit, false);

function finit() {
	fAddEventListeners();
	document.getElementById("WholeMap").setAttribute("transform", "matrix(1 0 0 1 0 0)");
	fResizeTextBox(document.getElementById("TaskText"), document.getElementById("TaskBox"));


}

function fAddEventListeners() {
	document.addEventListener("mousedown", function () {
		mouseDown = true;
	}, false);
	document.addEventListener("mouseup", function () {
		mouseDown = false;
		hasmoved = false;
	}, false);
	document.addEventListener("mouseleave", function () {
		activeProvince = -1;
	});
	document.addEventListener("mousemove", fMovement, false);
	document.addEventListener("wheel", fZoom, { passive: false });

	var MapTilePaths = document.getElementById("MapTiles").getElementsByTagName("path");
	var WholeMapPaths = document.getElementById("WholeMap").getElementsByTagName("path");
	var limit1 = MapTilePaths.length;
	for (i = 0; i < limit1; i++) {
		MapTilePaths[i].addEventListener("mousedown", fClickMapTile, false);
		MapTilePaths[i].addEventListener("mouseup", fReleaseMapTile, false);
	}
	var limit2 = WholeMapPaths.length;
	for (i = limit1; i < limit2; i++) {
	}
}

function fZoom(evt) {
	evt.preventDefault();
	let WholeMap = document.getElementById("WholeMap")

	scale += evt.deltaY * -0.001;

	// Restrict scale
	scale = Math.min(Math.max(Math.log(.25), scale), Math.log(4));

	// Apply scale transform
	realscale = Math.E ** (scale);
	WholeMap.setAttribute("transform", `scale(${realscale})`);
	// for looking up the real values (in x and y) from the element:
	// WholeMap.transform.baseVal[0].matrix.a
	// WholeMap.transform.baseVal[0].matrix.d
}

function fMovement(evt) {
	if (mouseDown) {
		if (!hasmoved) {
			fDragMap(evt)
		}
		hasmoved = true;
	}
}

// TODO: realize zooming with transform matrix only on "WholeMap" instead of each path individually. This also needs changing of fZoom()
function fDragMap(evt) {
	//IMPROVEMENT POSSIBLE, TODO
	// Lock MousePointer and make invisible with following functions:
	//  https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API

	//move the map by clicking on any map tile
	document.getElementById('MapCover').setAttribute("visibility", "visible !important");
	selectOtherElement(document.getElementById('MapCover'), document.getElementById('WholeMap').getElementsByTagName('path'), true);
	return false;
}

//mit Rückgabewert
//var fOnMouseOverProvince = function(ThisElement) {
//ohne Rückgabewert
function fOnMouseOverProvince(ThisElement) {
	//ThisElement.setAttribute('fill', '#FFD026');
}

function fClickMapTile(evt) {
	activeProvince = fGetProvinceID(evt.target);
}

function fGetProvinceID(el) {
	classname = el.className.baseVal;
	if (classname != "province") {
		classobject = ffindUpperClass(el, "province");
		if (classobject === null) {
			return null
		}
		else {
			id = classobject.id;
		}
	}
	else {
		id = el.id;
	}
	return id;
}

function fReleaseMapTile(evt) {
	currentprovinceid = fGetProvinceID(evt.target);
	if (activeProvince == currentprovinceid) {
		fRegisterMapTile(currentprovinceid)
		hasmoved = false;
	}
}

function fRegisterMapTile(id) {
	NrClicks = NrClicks + 1;
	fchangeText(fgetProvinceInfo(id, 'ProvinceSIM'));
	return false;
}

function fgetProvinceInfo(id, what) {
	// id   ...  id of SVG element of province
	// what ...  which field to choose (i.e. ID;ProvinceEN;ProvinceSIM;ProvincePIN;CapitalEN;CapitalSIM;CapitalPIN;Abbreviation)
	return provinces[id][what];
}

function fOnMouseOutProvince(ThisElement) {
	//ThisElement.setAttribute('fill', '#FFF6D5');
}

function fchangeText(text) {
	// ATM just TEST
	document.getElementById("TaskText").innerHTML = text;
	fResizeTextBox(document.getElementById("TaskText"), document.getElementById("TaskBox"));
}

function fResizeTextBox(TextID, RectangleID) {
	// Resize rectangle used as a textbox in order to keep text inside the box
	var CurrentTextWidth = TextID.getBoundingClientRect().width;
	var CurrentTextHeight = TextID.getBoundingClientRect().height;

	RectangleID.setAttribute('width', CurrentTextWidth);
	RectangleID.setAttribute('height', CurrentTextHeight);
}

function ffindUpperClass(el, classname) {
	while (el.parentNode) {
		el = el.parentNode;
		if (el.className) {
			if (el.className.baseVal === classname)
				return el;
		}
	}
	return null;
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