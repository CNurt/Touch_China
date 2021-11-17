var debuggingMode = false;
//List of Events:  http://www.w3schools.com/jsref/dom_obj_event.asp
//Helpful for JScript Debugging: fchangeText(currentMatrix);//alert(ElTouched + ElMove + "\n" + dx + "\n" + dy);
var NrClicks = 0;   //Amount of clicks on Provinces
//var TestStringArray = [ "erstes Testelement\n" ]; 
var TestString = "erstes Testelement;闺女\n";
var mouseMoved = false;
var mouseDown = false;
var activeProvince = -1;
var hasmoved = false;
var scale = Math.log(1.0);
const provinces = new Provinces();

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
	activeProvince = fGetMapTileID(evt.target);
}

function fGetMapTileID(el) {
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
	currentprovinceid = fGetMapTileID(evt.target);
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
