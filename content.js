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
	var videoTimes = document.querySelectorAll("span.ytd-thumbnail-overlay-time-status-renderer");
	
	for(var i = 0; i < videoTimes.length; i++) {
		var durationString = videoTimes[i].innerHTML.split(" | ")[0]; // prevent appending endlessly
		var durationSplit = durationString.split(":");
		if (durationSplit.length > 2) { // duration format xx:xx:xx
			var durationHours = durationSplit[0]
			var durationMinutes = durationSplit[1];
			var durationSeconds = durationSplit[2];
		} else { // duration format xx:xx
			var durationHours = 0;
			var durationMinutes = durationSplit[0];
			var durationSeconds = durationSplit[1];
		}
		
		var totalMinutes = parseInt(durationHours * 60) + parseInt(durationMinutes) + parseInt(Math.ceil(durationSeconds / 60));
		var curDate = new Date();
		var endDate = new Date();
		endDate.setMinutes(curDate.getMinutes() + totalMinutes);
		
		var endMinute = addZeroPadding(endDate.getMinutes());
		var endHour = addZeroPadding(endDate.getHours());
		
		var endString = endHour + ":" + endMinute;
		videoTimes[i].textContent = durationString + " | end: " + endString;
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
