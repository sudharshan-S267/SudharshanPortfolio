<?php
header('Content-Type: application/json');
require_once 'config.php';

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Response array
$response = array(
    'success' => false,
    'message' => ''
);

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Invalid request method';
    echo json_encode($response);
    exit;
}

// Honeypot check (spam protection)
if (!empty($_POST[HONEYPOT_FIELD])) {
    $response['message'] = 'Spam detected';
    echo json_encode($response);
    exit;
}

// Get and sanitize input
$firstName = isset($_POST['firstName']) ? trim(strip_tags($_POST['firstName'])) : '';
$lastName = isset($_POST['lastName']) ? trim(strip_tags($_POST['lastName'])) : '';
$email = isset($_POST['email']) ? trim(strip_tags($_POST['email'])) : '';
$phone = isset($_POST['phone']) ? trim(strip_tags($_POST['phone'])) : '';
$subject = isset($_POST['subject']) ? trim(strip_tags($_POST['subject'])) : '';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

// Validation
$errors = array();

// Validate first name
if (empty($firstName) || !preg_match('/^[a-zA-Z\s]{2,50}$/', $firstName)) {
    $errors[] = 'Invalid first name';
}

// Validate last name
if (empty($lastName) || !preg_match('/^[a-zA-Z\s]{2,50}$/', $lastName)) {
    $errors[] = 'Invalid last name';
}

// Validate email
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email address';
}

// Validate subject
if (empty($subject)) {
    $errors[] = 'Please select a subject';
}

// Validate message
if (empty($message) || strlen($message) < 10 || strlen($message) > 1000) {
    $errors[] = 'Message must be between 10 and 1000 characters';
}

// If there are validation errors
if (!empty($errors)) {
    $response['message'] = implode(', ', $errors);
    echo json_encode($response);
    exit;
}

// Check rate limiting (prevent spam)
$conn = getDBConnection();
if ($conn === null) {
    $response['message'] = 'Database connection error. Please try again later.';
    echo json_encode($response);
    exit;
}

$ip_address = $_SERVER['REMOTE_ADDR'];
$one_hour_ago = date('Y-m-d H:i:s', strtotime('-1 hour'));

$stmt = $conn->prepare("SELECT COUNT(*) as count FROM contact_submissions WHERE ip_address = ? AND created_at > ?");
$stmt->bind_param("ss", $ip_address, $one_hour_ago);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if ($row['count'] >= MAX_SUBMISSIONS_PER_IP) {
    $response['message'] = 'Too many submissions. Please try again later.';
    $stmt->close();
    $conn->close();
    echo json_encode($response);
    exit;
}
$stmt->close();

// Insert into database
$stmt = $conn->prepare("INSERT INTO contact_submissions (first_name, last_name, email, phone, subject, message, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssss", $firstName, $lastName, $email, $phone, $subject, $message, $ip_address);

if ($stmt->execute()) {
    // Send email notification
    $to = ADMIN_EMAIL;
    $email_subject = "[" . SITE_NAME . "] New Contact Form Submission: " . $subject;
    
    $email_body = "You have received a new message from your portfolio website.\n\n";
    $email_body .= "Name: " . $firstName . " " . $lastName . "\n";
    $email_body .= "Email: " . $email . "\n";
    $email_body .= "Phone: " . ($phone ? $phone : 'Not provided') . "\n";
    $email_body .= "Subject: " . $subject . "\n\n";
    $email_body .= "Message:\n" . $message . "\n\n";
    $email_body .= "---\n";
    $email_body .= "Sent from: " . $ip_address . "\n";
    $email_body .= "Date: " . date('Y-m-d H:i:s') . "\n";
    
    $headers = "From: noreply@" . $_SERVER['HTTP_HOST'] . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Send email
    $email_sent = mail($to, $email_subject, $email_body, $headers);
    
    // Send auto-reply to user
    $user_subject = "Thank you for contacting me!";
    $user_body = "Hi " . $firstName . ",\n\n";
    $user_body .= "Thank you for reaching out! I've received your message and will get back to you as soon as possible.\n\n";
    $user_body .= "Here's a copy of your message:\n";
    $user_body .= "Subject: " . $subject . "\n";
    $user_body .= "Message: " . $message . "\n\n";
    $user_body .= "Best regards,\n";
    $user_body .= "Sudharshan S\n";
    $user_body .= ADMIN_EMAIL;
    
    $user_headers = "From: " . ADMIN_EMAIL . "\r\n";
    $user_headers .= "X-Mailer: PHP/" . phpversion();
    
    mail($email, $user_subject, $user_body, $user_headers);
    
    $response['success'] = true;
    $response['message'] = 'Thank you! Your message has been sent successfully. I\'ll get back to you soon!';
} else {
    error_log("Database insert error: " . $stmt->error);
    $response['message'] = 'Error saving your message. Please try again.';
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>