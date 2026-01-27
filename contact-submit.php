<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ===============================
// Load PHPMailer (manual install)
// ===============================
require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';
require __DIR__ . '/phpmailer/Exception.php';

// ===============================
// Only allow POST
// ===============================
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

// ===============================
// Collect + validate input
// ===============================
$name         = trim($_POST['name'] ?? '');
$email        = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
$organisation = trim($_POST['organisation'] ?? 'N/A');
$message      = trim($_POST['message'] ?? '');

if (!$email || $message === '') {
    http_response_code(400);
    exit('Invalid input');
}

// ===============================
// Create mailer
// ===============================
$mail = new PHPMailer(true);

try {
    // ===============================
    // SMTP CONFIG — LOCKED
    // ===============================
    $mail->isSMTP();
    $mail->Host       = 'mail.thepunditplace.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'consult.thepunditplace';
    $mail->Password   = 'Pundit@101'; // current mailbox password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // ===============================
    // Headers
    // ===============================
    $mail->setFrom('consult@thepunditplace.com', 'The Pundit Place');
    $mail->addAddress('consult@thepunditplace.com');
    $mail->addReplyTo($email, $name);

    // ===============================
    // Email content
    // ===============================
    $mail->isHTML(true);
    $mail->Subject = 'New Contact Form Submission';
    $mail->Body = "
        <strong>Name:</strong> {$name}<br>
        <strong>Email:</strong> {$email}<br>
        <strong>Organisation:</strong> {$organisation}<br><br>
        <strong>Message:</strong><br>
        " . nl2br(htmlspecialchars($message)) . "
    ";

    // ===============================
    // Send
    // ===============================
    $mail->send();

    http_response_code(200);
    echo 'OK';

} catch (Exception $e) {
    error_log('Mailer Error: ' . $mail->ErrorInfo);
    http_response_code(500);
    echo 'Email failed';
}
