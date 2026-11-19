<?php
// Square Construction — quote form handler.
// Sends quote requests to Dima's inbox via PHPMailer + Hostinger SMTP using
// the info@squareconstruction.ca mailbox (same approach as localaigeeks.ca
// and honeycombsandmore.com). Replaces the never-wired EmailJS send
// (Nov 19, 2026). An optional job photo is attached to the email.
//
// SMTP credentials live in mail-config.php next to this file on the server.
// That file is NOT in the git repo — create it in hPanel File Manager with:
//   <?php
//   $smtpUser = 'info@squareconstruction.ca';
//   $smtpPass = 'YOUR-MAILBOX-PASSWORD';
//   $smtpHost = 'smtp.hostinger.com';
//   $smtpPort = 587;
// (587 + STARTTLS; 465 + SMTPS also works.)
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';
require __DIR__ . '/phpmailer/Exception.php';

$to = 'sergeyalyosh@gmail.com';
$fromName = 'Square Construction';
$fromAddr = 'info@squareconstruction.ca';
$maxPhotoBytes = 2 * 1024 * 1024;

function clean_field($v, int $max = 500): string {
    $v = trim((string) $v);
    $v = str_replace(["\r", "\n"], ' ', $v); // block header injection
    return mb_substr($v, 0, $max);
}

function wants_json(): bool {
    return str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json')
        || ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'XMLHttpRequest';
}

function respond(bool $ok, string $message, int $status = 200): void {
    http_response_code($status);
    if (wants_json()) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'error' => $ok ? null : $message]);
        return;
    }
    // No-JS fallback: a plain thank-you / error page.
    $title = $ok ? 'Thanks — quote request sent' : 'Something went wrong';
    $body = $ok
        ? 'Thanks — your quote request is on its way. We usually reply within one business day.'
        : 'Sorry — your request could not be sent. ' . htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
        . '<title>' . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . ' — Square Construction</title>'
        . '<style>body{font-family:system-ui,sans-serif;max-width:560px;margin:96px auto;padding:0 20px;color:#111}h1{font-size:28px}a{color:#1c69d4}</style></head>'
        . '<body><h1>' . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . '</h1><p>' . $body . '</p>'
        . '<p><a href="/">Back to the site</a></p></body></html>';
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(false, 'Please submit the form.', 405);
    exit;
}

// Honeypot: humans leave "company" empty; bots usually fill it. Pretend
// success so the bot learns nothing.
if (trim((string) ($_POST['company'] ?? '')) !== '') {
    respond(true, '');
    exit;
}

$name    = clean_field($_POST['name'] ?? '', 120);
$phone   = clean_field($_POST['phone'] ?? '', 60);
$email   = clean_field($_POST['email'] ?? '', 160);
$type    = clean_field($_POST['project-type'] ?? '', 120);
$details = trim((string) ($_POST['details'] ?? ''));
$details = mb_substr($details, 0, 4000);

// Same rules as the browser-side validation in quote-form.js.
if (mb_strlen($name) <= 1 || preg_match_all('/\d/', $phone) < 10
    || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || $type === '' || mb_strlen($details) <= 10) {
    respond(false, 'A couple of fields need attention — please check the form and try again.', 422);
    exit;
}

// Optional job photo: must be an image, max 2 MB.
$photoTmp = null;
$photoName = null;
if (!empty($_FILES['photo']) && $_FILES['photo']['error'] !== UPLOAD_ERR_NO_FILE) {
    $photo = $_FILES['photo'];
    if ($photo['error'] !== UPLOAD_ERR_OK || $photo['size'] > $maxPhotoBytes
        || !is_uploaded_file($photo['tmp_name'])
        || getimagesize($photo['tmp_name']) === false) {
        respond(false, 'That photo could not be used — it must be an image under 2 MB.', 422);
        exit;
    }
    $photoTmp = $photo['tmp_name'];
    $photoName = preg_replace('/[^A-Za-z0-9._-]/', '_', basename((string) $photo['name']));
    if ($photoName === '' || $photoName === '.' || $photoName === '..') {
        $photoName = 'job-photo.jpg';
    }
}

// SMTP credentials (not in git — see header comment).
$configFile = __DIR__ . '/mail-config.php';
if (!is_file($configFile)) {
    error_log('Square quote form: mail-config.php is missing');
    respond(false, 'The quote form is not set up yet. Please try again later.', 500);
    exit;
}
require $configFile;
if (empty($smtpUser) || empty($smtpPass) || str_contains((string) $smtpPass, 'YOUR-MAILBOX-PASSWORD')) {
    error_log('Square quote form: SMTP credentials are not configured');
    respond(false, 'The quote form is not set up yet. Please try again later.', 500);
    exit;
}
$smtpHost = $smtpHost ?? 'smtp.hostinger.com';
$smtpPort = (int) ($smtpPort ?? 587);

$mailSubject = 'Quote request — ' . $type . ' — ' . $name;
$body = "Square Construction quote request\n\n"
    . "Name: $name\n"
    . "Phone: $phone\n"
    . "Email: $email\n"
    . "Project type: $type\n\n"
    . "Project details:\n"
    . $details . "\n";

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = $smtpHost;
    $mail->Port = $smtpPort;
    $mail->SMTPSecure = $smtpPort === 465 ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->SMTPAuth = true;
    $mail->Username = $smtpUser;
    $mail->Password = $smtpPass;
    $mail->setFrom($fromAddr, $fromName);
    $mail->addAddress($to);
    $mail->addReplyTo($email); // replying goes straight to the customer
    if ($photoTmp !== null) {
        $mail->addAttachment($photoTmp, $photoName);
    }
    $mail->Subject = $mailSubject;
    $mail->Body = $body;
    $mail->send();
    respond(true, '');
} catch (Exception $e) {
    error_log('Square quote form: SMTP send failed: ' . $e->getMessage());
    respond(false, 'The mail server did not accept the message. Please try again later.', 500);
}
