
function updateTime() {
	const now = new Date();
	const hours = now.getHours().toString().padStart(2, '0');
	const minutes = now.getMinutes().toString().padStart(2, '0');
	const seconds = now.getSeconds().toString().padStart(2, '0');
	const timeString = `${hours}:${minutes}:${seconds}`;
	const clockText = document.getElementById('LiveClock').getAttribute('text');

	//console.log("==clock tick==");
	document.getElementById('LiveClock').setAttribute('value', timeString);
	//document.getElementById('LiveClock').flushToDom(true);
	return false;
}

document.addEventListener("DOMContentLoaded", function(){
  //runs code after DOM load
  // Initial call
	updateTime();
	// Update time every second
	setInterval(updateTime, 1000);
});

document.addEventListener("DOMContentLoaded", function(){
	function toggleColor(element){
		if(element.getAttribute("data-active") == "true"){
			element.setAttribute("data-active", "false");
			element.setAttribute("color", "#FF0000");
		}else{
			element.setAttribute("data-active", "true");
			element.setAttribute("color", "#00FF00");
		}
	}
	
	let element = document.querySelector('#ClickTestCube');
	element.addEventListener('click', function() {
		toggleColor(element);
	});
});



function cursorEvents(){
	let element = document.querySelector('#cursor');
	element.addEventListener('fusing', function() {
		//what happens on fusing
		console.log("EVENT | cursor state: fusing");
	});
	element.addEventListener('click', function() {
		//what happens on click
		console.log("EVENT | cursor state: click");
	});
}

function updateTextOnClick(){
	let element = document.querySelector('#ClickEventTester');
	let textElement = element.querySelector('.updatableText');
	
	function resetText(){
		element.setAttribute("material", "color: #0000FF; side: double;");
		textElement.setAttribute(`value`, `Aim Reticule to Fuse-Click (1.5s)`);
	}
	
	element.addEventListener('fusing', function() {
		//what happens on fusing
		element.setAttribute("material", "color: #00FF00; side: double;");
		textElement.setAttribute(`value`, `fusing`);
	});

	element.addEventListener('click', function() {
		//what happens on click
		element.setAttribute("material", "color: #0000FF; side: double;");
		textElement.setAttribute(`value`, `click`);
	});

	element.addEventListener('mouseenter', function() {
		//what happens on click
		element.setAttribute("material", "color: #0000FF; side: double;");
		textElement.setAttribute(`value`, `mouseenter`);
	});

	element.addEventListener('mouseleave', function() {
		//what happens on click
		element.setAttribute("material", "color: #0000FF; side: double;");
		textElement.setAttribute(`value`, `mouseleave, resetting...`);

		//reset
		setTimeout(() => {
			resetText();
		}, 3000); //time in ms
	});
}

document.addEventListener("DOMContentLoaded", function(){	
	cursorEvents();
	updateTextOnClick();
});


function WakeLock(){
	const canWakeLock = () => 'wakeLock' in navigator;
	console.log(canWakeLock());
	let wakelock;
	async function lockWakeState() {
		if(!canWakeLock()) return;
		try {
			wakelock = await navigator.wakeLock.request();
			wakelock.addEventListener('release', () => {
			console.log('Screen Wake State Locked:', !wakelock.released);
			});
			console.log('Screen Wake State Locked:', !wakelock.released);
		} catch(e) {
			console.error('Failed to lock wake state with reason:', e.message);
		}
	}

	function releaseWakeState() {
		if(wakelock) wakelock.release();
		wakelock = null;
	}

	lockWakeState();
	//setTimeout(releaseWakeState, 5000); // release wake state after 5 seconds
}


document.addEventListener("DOMContentLoaded", function(){	
	WakeLock();
});