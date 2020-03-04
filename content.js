document.onreadystatechange = function () {
	startPeriodicScan();
}

window.addEventListener("yt-navigate-finish", startPeriodicScan)

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
			var endMinute = endDate.getMinutes();
			if (endMinute < 10) {
				endMinute = "0" + endMinute;
			}
			var endHour = endDate.getHours();
			if (endHour < 10) {
				endHour = "0" + endHour;
			}
			
			var endString = endHour + ":" + endMinute;
			
			videoTimes[i].innerHTML = durationString + " | end: " + endString;
		}
	}
}

function startPeriodicScan() {
	if(!interval) {
		var interval = setInterval(showEndTimes, 2000);
	}
}