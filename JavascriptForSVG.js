﻿var debuggingMode = false;
//List of Events:  http://www.w3schools.com/jsref/dom_obj_event.asp
//Helpful for JScript Debugging: fchangeText(currentMatrix);//alert(ElTouched + ElMove + "\n" + dx + "\n" + dy);
var NrClicks = 0;   //Amount of clicks on Provinces
const provinces = new Provinces();

// see following for events:  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
//ACHTUNG!  addEventListener can only use functions without a return value!!!
//"load" waits longer than "DOMContentLoaded", otherwise similar behaviour
window.addEventListener("load", finit, false);
// window.addEventListener("DOMContentLoaded", finit, false);

function finit() {
	this.mapobject = new MapofChina(receiveMapTileId);
	this.guiobject = new GUI();
}

function receiveMapTileId(id) {
	++NrClicks;
	guiobject.fchangeText(fgetProvinceInfo(id, 'ProvinceSIM'));
	return false;
}

function fgetProvinceInfo(id, what) {
	// id   ...  id of SVG element of province
	// what ...  which field to choose (i.e. ID;ProvinceEN;ProvinceSIM;ProvincePIN;CapitalEN;CapitalSIM;CapitalPIN;Abbreviation)
	return provinces[id][what];
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



class MapofChina {
	mouseMoved = false;
	mouseDown = false;
	activeProvince = -1;
	hasmoved = false;
	scale = Math.log(1.0);

	constructor(mapTileIdReceiverFunction) {
		this.finit();
		this.mapTileIdReceiverFunction = mapTileIdReceiverFunction;
	}

	finit() {
		this.fAddEventListeners();
		this.WholeMap = document.getElementById("WholeMap");
		this.WholeMap.setAttribute("transform", "matrix(1 0 0 1 0 0)");
	}

	fAddEventListeners() {
		// puttin EvenListeners from inside an class onto objects outside the class causes the 'this' keyword to be the event.target and not the class, that initially added the eventhandler
		// see https://stackoverflow.com/questions/43727516/how-adding-event-handler-inside-a-class-with-a-class-method-as-the-callback/43727582#43727582

		document.addEventListener("mousedown", function () {
			this.mouseDown = true;
		}.bind(this), false);
		document.addEventListener("mouseup", function () {
			this.mouseDown = false;
			this.hasmoved = false;
		}.bind(this), false);
		document.addEventListener("mouseleave", function () {
			this.activeProvince = -1;
		}.bind(this));
		document.addEventListener("mousemove", this.fMovement.bind(this), false);
		document.addEventListener("wheel", this.fZoom.bind(this), { passive: false });

		var MapTilePaths = document.getElementById("MapTiles").getElementsByTagName("path");
		var limit1 = MapTilePaths.length;
		for (var i = 0; i < limit1; i++) {
			MapTilePaths[i].addEventListener("mousedown", this.fClickMapTile.bind(this), false);
			MapTilePaths[i].addEventListener("mouseup", this.fReleaseMapTile.bind(this), false);
		}
	}

	fZoom(evt) {
		evt.preventDefault();

		this.scale += evt.deltaY * -0.001;

		// Restrict scale
		this.scale = Math.min(Math.max(Math.log(.25), this.scale), Math.log(4));

		// Apply scale transform
		var realscale = Math.E ** (this.scale);
		this.WholeMap.setAttribute("transform", `scale(${realscale})`);
		// for looking up the real values (in x and y) from the element:
		// WholeMap.transform.baseVal[0].matrix.a
		// WholeMap.transform.baseVal[0].matrix.d
	}

	fMovement(evt) {
		if (this.mouseDown) {
			if (!this.hasmoved) {
				this.fDragMap(evt)
			}
			this.hasmoved = true;
		}
	}

	// TODO: realize zooming with transform matrix only on "WholeMap" instead of each path individually. This also needs changing of fZoom()
	fDragMap(evt) {
		//IMPROVEMENT POSSIBLE, TODO
		// Lock MousePointer and make invisible with following functions:
		//  https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API

		//move the map by clicking on any map tile
		var MapCover = document.getElementById('MapCover');
		MapCover.setAttribute("visibility", "visible !important");
		selectOtherElement(MapCover, this.WholeMap.getElementsByTagName('path'), true);
		return false;
	}

	fOnMouseOverMapTile(ThisElement) {
		//ThisElement.setAttribute('fill', '#FFD026');
	}

	fGetMapTileID(el) {
		var classname = el.className.baseVal;
		var id;
		if (classname != "province") {
			var classobject = ffindUpperClass(el, "province");
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

	fClickMapTile(evt) {
		this.activeProvince = this.fGetMapTileID(evt.target);
	}

	fReleaseMapTile(evt) {
		var currentprovinceid = this.fGetMapTileID(evt.target);
		if (this.activeProvince == currentprovinceid) {
			this.mapTileIdReceiverFunction(currentprovinceid)
			// this.fRegisterMapTile(currentprovinceid)
			this.hasmoved = false;
		}
	}

	fOnMouseOutProvince(ThisElement) {
		//ThisElement.setAttribute('fill', '#FFF6D5');
	}
}



class GUI {
	constructor() {
		this.finit();
	}

	finit() {
		this.TaskText_el = document.getElementById("TaskText");
		this.TaskBox_el = document.getElementById("TaskBox");
		this.fResizeTextBox(this.TaskText_el, this.TaskBox_el);
	}

	fchangeText(text) {
		// ATM just TEST
		this.TaskText_el.innerHTML = text;
		this.fResizeTextBox(this.TaskText_el, this.TaskBox_el);
	}

	fResizeTextBox(TextID, RectangleID) {
		// Resize rectangle used as a textbox in order to keep text inside the box
		var CurrentTextWidth = TextID.getBoundingClientRect().width;
		var CurrentTextHeight = TextID.getBoundingClientRect().height;

		RectangleID.setAttribute('width', CurrentTextWidth);
		RectangleID.setAttribute('height', CurrentTextHeight);
	}
}
