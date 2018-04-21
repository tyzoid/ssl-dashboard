<?php
require __DIR__ . '/../../vendor/autoload.php';

require '../../controllers/SSLExpiry.php';

$server = new \Jacwright\RestServer\RestServer('debug');
$server->addClass('SSLExpiry');
$server->handle();
