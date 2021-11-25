
class TouchEventHandler {
	// array of all touch pointers
	touchEvCache = new Array();
	prevPointerDistance = -1;
	scale = Math.log(1.0);

	constructor(elementForEventhandlers, elementToResize, elementToMove) {
		// alert('constructor');
		this.elementForEventhandlers = elementForEventhandlers;
		this.elementToResize = elementToResize;
		this.elementToMove = elementToMove;
		this.init()
	}

	// window.addEventListener("load", init, false);
	init() {
		// alert('init');
		// Install event handlers for the pointer target
		//   see folowing for full list of events:
		// 		https://w3c.github.io/pointerevents/#extensions-to-the-globaleventhandlers-mixin
		this.elementForEventhandlers.onpointerdown = this.pointerdown_handler.bind(this);
		///////
		this.elementForEventhandlers.onpointerover = this.pointerdown_handler.bind(this);
		this.elementForEventhandlers.onpointerenter = this.pointerdown_handler.bind(this);
		/////////
		this.elementForEventhandlers.onpointermove = this.pointermove_handler.bind(this);

		this.elementForEventhandlers.onpointerup = this.pointerup_handler.bind(this);
		this.elementForEventhandlers.onpointercancel = this.pointerup_handler.bind(this);
		this.elementForEventhandlers.onpointerout = this.pointerup_handler.bind(this);
		this.elementForEventhandlers.onpointerleave = this.pointerup_handler.bind(this);
	}

	pointerdown_handler(ev) {
		var ordinal_nr = this.get_duplicate_event_ordinal(ev);
		if (ordinal_nr < 0) {
			this.touchEvCache.push(ev);
		}
		console.log(this.touchEvCache.length);
	}

	pointermove_handler(ev) {

		// Find this event in the cache and update its record with this event
		for (var i = 0; i < this.touchEvCache.length; i++) {
			if (ev.pointerId == this.touchEvCache[i].pointerId) {
				this.touchEvCache[i] = ev;
				break;
			}
		}

		// If only one pointer is down, move and disable touch event
		if (this.touchEvCache.length == 1) {
			console.log('TODO: touch move map');
			console.log('TODO: integrate JS_MoveThings.js and change to only move map (remove some complexity)');
			// this.elementToMove...
			var MapCover = document.getElementById('MapCover');
			MapCover.setAttribute("visibility", "visible !important");
			// this.WholeMap.
			// selectOtherElement(MapCover, document.getElementById('WholeMap').getElementsByTagName('path'), true);
			selectOtherElement(MapCover, document.getElementById('WholeMap'), false);
			// selectElement(ev);
		}

		// If two pointers are down, check for pinch gestures (zoom)
		if (this.touchEvCache.length == 2) {
			console.log('TODO: adapt zoom to center with simultanious move (according to middle of 2 pointers)');
			// document.getElementById('testh1').textContent = Math.random();
			// Calculate the distance between the two pointers
			var x = [this.touchEvCache[0].clientX, this.touchEvCache[1].clientX];
			var y = [this.touchEvCache[0].clientY, this.touchEvCache[1].clientY];
			var curPointerDistance = Math.sqrt((x[0] - x[1]) ** 2 + (y[0] - y[1]) ** 2);


			if (this.prevPointerDistance > 0) {


				var minZoom = 0.25;
				var maxZoom = 6;

				var zoomDistance = curPointerDistance - this.prevPointerDistance;
				// var currSizeOfElementToResize = this.elementToResize. SIZE;
				// var currSizeOfElementToResize = this.scale;
				// var this.scale = parseFloat(currSizeOfElementToResize) + zoomDistance;
				// Restrict scale
				this.scale += zoomDistance / 500;
				this.scale = Math.min(Math.max(Math.log(minZoom), this.scale), Math.log(maxZoom));
				// Apply scale transform
				var realscale = Math.E ** (this.scale);
				// console.log(realscale);
				// this.WholeMap.setAttribute("transform", `scale(${realscale})`);
				// this.elementToResize. SIZE = this.scale;
				this.elementToResize.setAttribute("transform", `scale(${realscale})`);
			}
			this.prevPointerDistance = curPointerDistance;
		}
	}

	pointerup_handler(ev) {
		this.remove_event(ev);
		if (this.touchEvCache.length < 2) {
			this.prevPointerDistance = -1;
		}
		console.log(this.touchEvCache.length);
	}

	remove_event(ev) {
		// Remove this event from the target's cache
		// for (var i = 0; i < this.touchEvCache.length; i++) {
		// 	if (this.touchEvCache[i].pointerId == ev.pointerId) {
		// 		this.touchEvCache.splice(i, 1);
		// 		break;
		// 	}
		// }
		var ordinal_nr = this.get_duplicate_event_ordinal(ev);
		if (ordinal_nr >= 0) {
			this.touchEvCache.splice(ordinal_nr, 1);
		}
	}

	get_duplicate_event_ordinal(ev) {
		for (var i = 0; i < this.touchEvCache.length; i++) {
			if (this.touchEvCache[i].pointerId == ev.pointerId) {
				return i;
			}
		}
		return -1;
	}
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
		if (isTouchDevice()) {
			this.tmp = new TouchEventHandler(document.getElementsByTagName('svg')[0], this.WholeMap, this.WholeMap);
		}
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

		if (!isTouchDevice()) {
			document.addEventListener("mousemove", this.fMovement.bind(this), false);
		}
		if (isTouchDevice()) {
			document.addEventListener("touchmove", this.fDragMap.bind(this), false);
		}

		document.addEventListener("wheel", this.fZoom.bind(this), { passive: false });

		var MapTilePaths = document.getElementById("MapTiles").getElementsByTagName("path");
		var limit1 = MapTilePaths.length;
		for (var i = 0; i < limit1; i++) {
			MapTilePaths[i].addEventListener("mousedown", this.fClickMapTile.bind(this), false);
			MapTilePaths[i].addEventListener("mouseup", this.fReleaseMapTile.bind(this), false);
		}
	}

	fZoom(evt) {
		var minZoom = 0.25;
		var maxZoom = 6;
		evt.preventDefault();

		this.scale += evt.deltaY * -0.001;

		// Restrict scale
		this.scale = Math.min(Math.max(Math.log(minZoom), this.scale), Math.log(maxZoom));

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

	fDragMap(evt) {
		//IMPROVEMENT POSSIBLE, TODO
		// Lock MousePointer and make invisible with following functions:
		//  https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API

		//move the map by clicking on any map tile
		// document.getElementById('MapCover').setAttribute("visibility", "visible !important");
		selectOtherElement(document.getElementById('MapCover'), this.WholeMap.getElementsByTagName('path'), true);
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
		this.TaskRect_el = document.getElementById("TaskRect");
		this.fResizeTextBox(this.TaskText_el, this.TaskRect_el);
	}

	fchangeQuestText(text) {
		// ATM just TEST
		this.TaskText_el.innerHTML = text;
		this.fResizeTextBox(this.TaskText_el, this.TaskRect_el);
	}

	fResizeTextBox(TextID, RectangleID) {
		// Resize rectangle used as a textbox in order to keep text inside the box
		var CurrentTextWidth = TextID.getBoundingClientRect().width;
		var CurrentTextHeight = TextID.getBoundingClientRect().height;

		RectangleID.setAttribute('width', CurrentTextWidth);
		RectangleID.setAttribute('height', CurrentTextHeight);
	}
}
