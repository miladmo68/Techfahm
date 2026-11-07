<?php
/**
 * techfahm.com contact form → email to info@techfahm.com.
 *
 * The only server-side code on the site (with 404.php). No passwords, no database.
 * Called by src/components/sections/contact-form.tsx with a JSON POST.
 *
 * Protection: POST only, same-site Origin check, honeypot, minimum fill time,
 * per-IP rate limit, field length limits, header-injection safe (no visitor
 * data ever goes into a mail header except a validated Reply-To address).
 */

declare(strict_types=1);

const TO_ADDRESS   = 'info@techfahm.com';
const ALLOWED_HOST = 'techfahm.com';
const MAX_PER_HOUR = 5;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function reply(int $code, bool $ok, string $message = ''): void
{
    http_response_code($code);
    echo json_encode(['success' => $ok, 'message' => $message]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    reply(405, false, 'Method not allowed');
}

// Same-site requests only
$origin = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
$originHost = strtolower((string) parse_url($origin, PHP_URL_HOST));
if ($originHost !== ALLOWED_HOST && $originHost !== 'www.' . ALLOWED_HOST) {
    reply(403, false, 'Forbidden');
}

$raw = file_get_contents('php://input', false, null, 0, 20000);
$data = json_decode((string) $raw, true);
if (!is_array($data)) {
    reply(400, false, 'Bad request');
}

function field(array $d, string $key, int $max): string
{
    $v = isset($d[$key]) && is_string($d[$key]) ? $d[$key] : '';
    $v = str_replace("\0", '', $v);
    $v = trim(preg_replace('/[^\P{C}\n\t]/u', '', $v) ?? '');
    return mb_substr($v, 0, $max);
}

// Honeypot: real people never fill it. Pretend success so bots learn nothing.
if (field($data, 'botcheck', 200) !== '') {
    reply(200, true);
}

// People take a few seconds to fill the form in
$elapsed = isset($data['elapsed']) && is_numeric($data['elapsed']) ? (int) $data['elapsed'] : 0;
if ($elapsed < 3000) {
    reply(400, false, 'Please try again');
}

$name    = field($data, 'name', 100);
$email   = field($data, 'email', 200);
$company = field($data, 'company', 150);
$phone   = field($data, 'phone', 40);
$topic   = field($data, 'topic', 120);
$message = field($data, 'message', 5000);

if (mb_strlen($name) < 2 || mb_strlen($message) < 10 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    reply(422, false, 'Please check the form');
}
// One line only for anything that could look like a header
foreach ([$name, $email, $company, $phone, $topic] as $v) {
    if (preg_match('/[\r\n]/', $v)) {
        reply(422, false, 'Please check the form');
    }
}

// Rate limit per IP (hashed, stored outside the web root)
$ip = $_SERVER['REMOTE_ADDR'] ?? '0';
$dir = rtrim(sys_get_temp_dir(), '/') . '/techfahm-contact';
if (!is_dir($dir)) {
    @mkdir($dir, 0700, true);
}
$file = $dir . '/' . hash('sha256', 'tf' . $ip);
$now = time();
$hits = [];
if (is_file($file)) {
    $hits = array_filter(
        array_map('intval', explode(',', (string) file_get_contents($file))),
        fn ($t) => $t > $now - 3600
    );
}
if (count($hits) >= MAX_PER_HOUR) {
    reply(429, false, 'Too many messages. Please email us instead.');
}
$hits[] = $now;
@file_put_contents($file, implode(',', $hits), LOCK_EX);

// Build the email
$subject = 'Website enquiry from ' . $name . ($company !== '' ? ' (' . $company . ')' : '');
$body = "New message from the contact form on techfahm.com\n"
    . str_repeat('-', 48) . "\n"
    . "Name:    {$name}\n"
    . "Email:   {$email}\n"
    . "Company: " . ($company !== '' ? $company : '-') . "\n"
    . "Phone:   " . ($phone !== '' ? $phone : '-') . "\n"
    . "Topic:   " . ($topic !== '' ? $topic : 'Not sure yet') . "\n"
    . str_repeat('-', 48) . "\n\n"
    . $message . "\n\n"
    . str_repeat('-', 48) . "\n"
    . 'Sent ' . gmdate('Y-m-d H:i') . " UTC. Reply to this email to answer {$name} directly.\n";

// Sender: the hosting account's own address. techfahm.com's mail is on
// Microsoft 365 (strict SPF/DMARC), so we must not pretend to be @techfahm.com.
$host = gethostname() ?: 'localhost';
$user = get_current_user() ?: 'website';
$from = $user . '@' . $host;

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$headers = [
    'From: =?UTF-8?B?' . base64_encode('techfahm.com website') . '?= <' . $from . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: techfahm.com',
];

$sent = mail(TO_ADDRESS, $encodedSubject, $body, implode("\r\n", $headers), '-f' . $from);

if (!$sent) {
    reply(500, false, 'The message could not be sent');
}
reply(200, true);
