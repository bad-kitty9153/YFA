const INTERVAL_TIME = 15000;
const INITIAL_TIMEOUT = 150;
let intervalId = null;
let initialTimeoutId = null;

/* TODO: 
	- Update every whole minute...?
	- Batch updates, showEndTimes() is executed much less now, but still unnecessarily much, particularly on scrolling
	- Hovering over thumbnails causes 2 calls to showEndTimes() on entering and 1 on exiting.
*/

document.addEventListener('DOMContentLoaded', function() {
	// thank you, mdn! https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
	// Select the node that will be observed for mutations
	const targetNode = document.body;

	// Options for the observer (which mutations to observe)
	const config = { attributes: false, childList: true, subtree: true };
	
	let preShowEndTimes = function() {
		if (!intervalId) {
			intervalId = setInterval(showEndTimes, INTERVAL_TIME);
		}
		showEndTimes();
	};

	// Callback function to execute when mutations are observed
	const callback = function(mutationsList, observer) {
		if (initialTimeoutId) {
			clearTimeout(initialTimeoutId);
		}
		
		if (intervalId) {
			clearInterval(intervalId);
		}
		
		initialTimeoutId = setTimeout(preShowEndTimes, INITIAL_TIMEOUT);
	};

	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(callback);

	// Start observing the target node for configured mutations
	observer.observe(targetNode, config);
	
	startPeriodicScan();
}, false);

window.addEventListener("yt-navigate-finish", startPeriodicScan);

function showEndTimes() {
	//console.log("running!");
	let videoTimes = document.querySelectorAll("span.ytd-thumbnail-overlay-time-status-renderer");
	
	for (let i = 0; i < videoTimes.length; i++) {
		
		let durationString = videoTimes[i].innerHTML.split(" | ")[0]; // prevent appending endlessly
		let durationSplit = durationString.split(":");
		
		let totalMinutes = 0;
		
		if (durationSplit.length === 1) { // no colon: probably LIVE. Skip.
			continue;
		} else if (durationSplit.length > 2) { // duration format xx:xx:xx
			totalMinutes = parseInt(durationSplit[0]) * 60 + parseInt(durationSplit[1]) + Math.ceil(parseInt(durationSplit[2]) / 60);
		} else { // duration format xx:xx
			totalMinutes = parseInt(durationSplit[0]) + Math.ceil(parseInt(durationSplit[1]) / 60);
		}
		
		let endDate = new Date();
		
		endDate.setMinutes(endDate.getMinutes() + totalMinutes);
		
		videoTimes[i].textContent = durationString + " | end: " + addZeroPadding(endDate.getHours()) + ":" + addZeroPadding(endDate.getMinutes());
	}
}

function startPeriodicScan() {
	if(!intervalId) {
		intervalId = setInterval(showEndTimes, INTERVAL_TIME);
	}
}

function addZeroPadding(n) {
	return n < 10 ? "0" + n : n;
}
