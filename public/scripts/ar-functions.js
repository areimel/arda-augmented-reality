/*===== Set Position of 3D Object =====*/
function positionSet(){
	//DOM elements
	let objectWrapper = document.querySelector('#objectWrapper');
	let controlsContainer = document.querySelector('.controls');
	let controlButtonWall = document.querySelector('.controlButton[data-control-button="wall"]');
	let controlButtonFlat = document.querySelector('.controlButton[data-control-button="flat"]');

	//Data Variables
	//Wall settings
	let wallRotationSetting = objectWrapper?.getAttribute("data-wall-rotation");
	let wallPositionSetting = objectWrapper?.getAttribute("data-wall-position");
	//Flat settings
	let flatRotationSetting = objectWrapper?.getAttribute("data-flat-rotation");
	let flatPositionSetting = objectWrapper?.getAttribute("data-flat-position");
	//Card settings
	let cardRotationSetting = objectWrapper?.getAttribute("data-card-rotation");
	let cardPositionSetting = objectWrapper?.getAttribute("data-card-position");

	//Updates .objectWrapper element based on element's data-attribute settings
	function updateObjectWrapperSettings(viewType){
		if(viewType == "wall"){
			objectWrapper?.setAttribute("rotation", wallRotationSetting);
			objectWrapper?.setAttribute("position", wallPositionSetting);
			updateButtonVisibility(viewType);
		} else if(viewType == "flat"){
			objectWrapper?.setAttribute("rotation", flatRotationSetting);
			objectWrapper?.setAttribute("position", flatPositionSetting);
			updateButtonVisibility(viewType);
		} else if(viewType == "card"){
			objectWrapper?.setAttribute("rotation", cardRotationSetting);
			objectWrapper?.setAttribute("position", cardPositionSetting);
			updateButtonVisibility(viewType);
		} else{
			console.log("No view type found");
		}
	}

	function updateButtonVisibility(rotationSetting) {
		controlsContainer?.setAttribute('data-current-rotation', rotationSetting);
	}

	controlButtonWall?.addEventListener('click', function() {
		console.log("controlButtonWall click");
		updateObjectWrapperSettings("wall");
	});

	controlButtonFlat?.addEventListener('click', function() {
		console.log("controlButtonFlat click");
		objectWrapper?.setAttribute("data-rotation-setting", "flat");
		updateObjectWrapperSettings("flat");
	});

	// Initialize button visibility based on initial rotation setting
	updateButtonVisibility(objectWrapper?.getAttribute("data-rotation-setting") || "flat");
}

/*===== Check URL for Position Setting =====*/
function checkUrlPosition() {
	const params = new URLSearchParams(window.location.search);
	const position = params.get('position');
	let objectWrapper = document.querySelector('#objectWrapper');
	let controlsContainer = document.querySelector('.controls');

	function updateButtonVisibility(rotationSetting) {
		controlsContainer?.setAttribute('data-current-rotation', rotationSetting);
	}

	if (position === 'wall') {
		console.log("URL position: wall");
		objectWrapper?.setAttribute("data-rotation-setting", "wall");
		objectWrapper?.setAttribute("rotation", "0 0 0");
		updateButtonVisibility("wall");
	} else if (position === 'flat') {
		console.log("URL position: flat"); 
		objectWrapper?.setAttribute("data-rotation-setting", "flat");
		objectWrapper?.setAttribute("rotation", "90 0 0");
		updateButtonVisibility("flat");
	}
}

//Run functions
document.addEventListener('DOMContentLoaded', checkUrlPosition);
document.addEventListener('DOMContentLoaded', positionSet); 