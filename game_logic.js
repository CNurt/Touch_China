
var debuggingMode = false;
//List of Events:  http://www.w3schools.com/jsref/dom_obj_event.asp
//Helpful for JScript Debugging: fchangeQuestText(currentMatrix);//alert(ElTouched + ElMove + "\n" + dx + "\n" + dy);
var NrClicks = 0;   //Amount of clicks on Provinces
// questionType ...  which field to choose (i.e. ID;ProvinceEN;ProvinceSIM;ProvincePIN;CapitalEN;CapitalSIM;CapitalPIN;Abbreviation)
var questionType = null;
var gamestarted = false;
var setOfQuestions = null;
var currentQuestion = null;
const provinces = new Provinces();

// see following for events:  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
//ACHTUNG!  addEventListener can only use functions without a return value!!!
//"load" waits longer than "DOMContentLoaded", otherwise similar behaviour
window.addEventListener("load", finit, false);
// window.addEventListener("DOMContentLoaded", finit, false);

function finit() {
	this.mapobject = new MapofChina(MapClickReceiver);
	this.guiobject = new GUI();
	questionType = 'ProvinceSIM';
	document.getElementById('startGameButton').addEventListener("mousedown", startGame, false);
}

function MapClickReceiver(id) {
	++NrClicks;
	if (gamestarted) {
		if (currentQuestion == id) {
			deleteQuestion(id);
			if (setOfQuestions.size <= 0) {
				finishGame();
			}
			else {
				pickRandomQuestion();
			}
		}
	}
}

function fgetProvinceInfo(id) {
	// id   ...  id of SVG element of province
	return provinces.dict[id][questionType];
}

function startGame() {
	console.log('startGame start');
	setOfQuestions = createSetOfQuestions();
	pickRandomQuestion();
	gamestarted = true;
}

function pickRandomQuestion() {
	var array = Array.from(setOfQuestions);
	max = array.length;
	randNum = getRandomInt(max);
	currentQuestion = array[randNum];
	guiobject.fchangeQuestText(fgetProvinceInfo(currentQuestion));
}

function createSetOfQuestions() {
	var keys = Object.keys(provinces.dict);
	return new Set(keys);
}

function deleteQuestion(id) {
	setOfQuestions.delete(id);
}

function finishGame() {
	console.log('Game finished!');
	alert('Congratulation! You finished the game successful.');
}

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
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

function isTouchDevice() {
	return (('ontouchstart' in window) ||
		(navigator.maxTouchPoints > 0) ||
		(navigator.msMaxTouchPoints > 0));
}
