function getJson(url, callback) {
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "json";

	request.onload = function() {
		//var json = JSON.decode(request.response);
		var json = request.response;
		callback(json);
	};

	request.send();
}
