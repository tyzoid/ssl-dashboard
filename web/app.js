(function(){
	getJson("/api/servers", function(data) {
		var serverlist = document.createElement('table');

		var headerrow = document.createElement('tr');

		var header_name = document.createElement('th');
		header_name.append(document.createTextNode("Service Name"));

		var header_host = document.createElement('th');
		header_host.append(document.createTextNode("Host Name"));

		var header_port = document.createElement('th');
		header_port.append(document.createTextNode("Port"));

		var header_valid = document.createElement('th');
		header_valid.append(document.createTextNode("Valid Until"));

		headerrow.append(header_name);
		headerrow.append(header_host);
		headerrow.append(header_port);
		headerrow.append(header_valid);

		serverlist.append(headerrow);

		var servers = data.servers;
		for (var i = 0; i < servers.length; i++) {
			var server_row = document.createElement('tr');
			server_row.id = servers[i].id;

			var server_name = document.createElement('td');
			server_name.append(document.createTextNode(servers[i].name));

			var server_host = document.createElement('td');
			server_host.append(document.createTextNode(servers[i].host));

			var server_port = document.createElement('td');
			server_port.append(document.createTextNode(servers[i].port));

			var server_valid = document.createElement('td');

			server_row.append(server_name);
			server_row.append(server_host);
			server_row.append(server_port);
			server_row.append(server_valid);

			serverlist.append(server_row);

			(function(valid_cell) {
				getJson("/api/expiredate/" + servers[i].id, function(data) {
					if (!data.error) {
						if (!data.cert.CNMatch) {
							valid_cell.append(document.createTextNode("Certificate CN Does Not Match"));
							valid_cell.className = "cert-error";
						} else if ((new Date()).getTime() < (new Date(data.cert.validFrom)).getTime()) {
							valid_cell.append(document.createTextNode("Certificate Not Yet Valid"));
							valid_cell.className = "cert-error";
						} else if ((new Date()).getTime() > (new Date(data.cert.validUntil)).getTime()) {
							valid_cell.append(document.createTextNode("Certificate Expired"));
							valid_cell.className = "cert-error";
						} else {
							valid_cell.append(document.createTextNode("Valid Until: " + (new Date(data.cert.validUntil).toDateString())));
							valid_cell.className = "cert-valid";

							var tag = document.createElement('span');
							tag.className = "tag";
							if ((new Date()).getTime() + (1000 * 60 * 60 * 24 * 30) > (new Date(data.cert.validUntil)).getTime()) {
								tag.append(document.createTextNode(Math.floor(((new Date(data.cert.validUntil)).getTime() - (new Date()).getTime())/(1000*60*60*24)) + " Days"));
								tag.className += " warn-tag";
							} else {
								tag.append("Valid");
								tag.className += " valid-tag";
							}

							valid_cell.append(tag);
						}
					} else {
						valid_cell.append(document.createTextNode(data.error.message));
						valid_cell.className = "cert-unknown";
					}

					valid_cell.className += " cert-status";
				});
			})(server_valid);
		}

		document.body.append(serverlist);
	});
})();
