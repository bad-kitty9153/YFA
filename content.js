document.onreadystatechange = function () {
	startPeriodicScan();
}

window.addEventListener("yt-navigate-finish", startPeriodicScan);

var addZeroPadding = function(n) {
	
	return n < 10 ? "0" + n : n;
	
};

function showEndTimes() {
	if (document.readyState === 'complete') {
		var videoTimes = document.querySelectorAll("span.ytd-thumbnail-overlay-time-status-renderer");
		//console.log(videoTimes);
		for(var i = 0; i < videoTimes.length; i++) {
			var durationString = videoTimes[i].innerHTML.split(" | ")[0];
			var durationSplit = durationString.split(":");
			if (durationSplit.length > 2) {
				var durationHours = durationSplit[0]
				var durationMinutes = durationSplit[1];
				var durationSeconds = durationSplit[2];
			} else {
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
}

function startPeriodicScan() {
	if(!interval) {
		var interval = setInterval(showEndTimes, 2000);
	}
}
