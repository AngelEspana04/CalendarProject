<?php
// PostgreSQL database connection parameters
$host = 'Localhost';
$port = '5432'; // Default PostgreSQL port
$dbname = 'Calendar';
$user = 'postgres';
$password = 'Imthebest29';

try {
    // Connect to the PostgreSQL database using PDO
    $pdo = new PDO("pgsql:host=Localhost;port=5432;dbname=Calendar", postgres, Imthebest29);
    
    // Set PDO to throw exceptions on error
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Retrieve form data
        $eventName = $_POST['eventName'];
        $eventDate = $_POST['eventDate'];
        $eventDescription = $_POST['eventDescription'];

        // Prepare and execute the query to insert the event into the database
        $stmt = $pdo->prepare("INSERT INTO events (event_name, event_date, event_description) VALUES (:eventName, :eventDate, :eventDescription)");
        $stmt->execute(['eventName' => $eventName, 'eventDate' => $eventDate, 'eventDescription' => $eventDescription]);

        // Return success message or any relevant data
        echo json_encode(['success' => true]);
    } else {
        // Return error message if form data was not submitted
        echo json_encode(['error' => 'No form data submitted']);
    }
} catch(PDOException $e) {
    // Handle database connection errors or SQL errors
    echo json_encode(['error' => $e->getMessage()]);
}
?>
