<?php
use \Jacwright\RestServer\RestException;

class SSLExpiry {
	private static $ports = [
		443 => 'https',
		6667 => 'irc'
	];

	private static $servers = [
		['host' => 'example.com', 'port' => 443, 'name' => 'Example'],
	];

	/**
	 * @name ExpireDate
	 * @description Returns the expiration date of the server ID
	 *
	 * @url GET /expiredate/$server_id
	 */
	public function expireDate($server_id) {
		if (!array_key_exists($server_id, self::$servers)) {
			throw new RestException(404, 'Server not found');
		}

		$host = self::$servers[$server_id]['host'];
		$port = self::$servers[$server_id]['port'];

		$ssl_ctx = stream_context_create([
			"ssl" => [
				"capture_peer_cert" => true,
				"verify_peer" => false,
				"verify_peer_name" => false,
			]
		]);

		$client = stream_socket_client(
			"ssl://{$host}:{$port}",
			$errno,
			$errstr,
			5,
			STREAM_CLIENT_CONNECT,
			$ssl_ctx
		);

		if ($client === false) {
			throw new RestException(503, "Could not connect to {$host}: {$errstr} ({$errno})");
		}

		$req_info = stream_context_get_params($client);
		$cert = $req_info["options"]["ssl"]["peer_certificate"];
		$cert_info = openssl_x509_parse($cert);

		$cn_match = $cert_info['subject']['CN'] === $host;
		if (!$cn_match) {
			foreach (explode(', ', $cert_info['extensions']['subjectAltName']) as $altcn) {
				if (substr($altcn, 0, 4) === "DNS:") {
					if (substr($altcn, 4) === $host) {
						$cn_match = true;
						break;
					}
				}
			}
		}

		return [
			"cert" => [
				"CNMatch"  => $cn_match,
				"validFrom"  => date("c", $cert_info['validFrom_time_t']),
				"validUntil" => date("c", $cert_info['validTo_time_t']),
			]
		];
	}

	/**
	 * @name Servers
	 * @description Returns a list of servers
	 *
	 * @url GET /servers
	 */
	public function servers() {
		$servers = [];
		foreach (self::$servers as $server_id => $server) {
			if (!empty(self::$ports[$server['port']]))
				$server['port'] = self::$ports[$server['port']] . ' (' . $server['port'] . ')';

			$servers[] = ['id' => $server_id] + $server;
		}

		return ["servers" => $servers];
	}
};
