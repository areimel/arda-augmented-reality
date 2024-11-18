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