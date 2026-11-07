<?php
// Serves the site's own 404 page with a real 404 status.
// The host ignores ErrorDocument in .htaccess, so .htaccess rewrites
// missing URLs here instead (see rule 9 in public/.htaccess).
http_response_code(404);
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store');
readfile(__DIR__ . '/404.html');
