<?php
header("Access-Control-Allow-Origin: *");   // Can insert front-end domain; Used * for testing purposes
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    exit;
}
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    //Grab the data from form
    $name = isset($_POST["name"]) ? htmlspecialchars($_POST["name"]) : null;
    $place = isset($_POST["place"]) ? htmlspecialchars($_POST["place"]) : null;
    $description = isset($_POST["description"]) ? htmlspecialchars($_POST["description"]) : null;
    $color = isset($_POST["color"]) ? htmlspecialchars($_POST["color"]) : null;
    $date_start = isset($_POST["date_start"]) ? htmlspecialchars($_POST["date_start"]) : null;
    $date_end = isset($_POST["date_end"]) ? htmlspecialchars($_POST["date_end"]) : null;


    //Instantiate classes for Orders class purposes, and validation,
    include "../classes/dbh.class.php";
    include "../classes/validation.class.php";
    include "../classes/event.class.php";
    include "../classes/eventscontr.class.php";
    include "ValidationException.inc.php";
    try {
        $event = new EventsContr(
            $name,
            $place,
            $description,
            $color,
            $date_start,
            $date_end,
            $formattedDate = null,
            $id = null
        );
        // $order->validateOrder();  // Validate most of the data provided
        $event->createEvent();  // Save to data base if no exceptions thrown by validator
        $response = [
            'message' => 'Wydarzenie dodane pomyślnie.'
        ];  // Set response msg
    } catch (ValidationException $e)  // Validation related exceptions handling
    {
        http_response_code(400);
        $response = $e->errorMessage();
    } catch (PDOException $e)   // PDO related exceptions handling
    {
        $response = ['error' => 'Nie można utworzyć wydarzenia: ' . $e->getMessage()];
    }

    header('Content-Type: application/json');
    echo json_encode($response);
} elseif ($_SERVER["REQUEST_METHOD"] == "GET"){
    $timestamp = isset($_GET["timestamp"]) ? htmlspecialchars($_GET["timestamp"]) : null;
    $formattedDate = date('Y-m-d H:i:s', $timestamp);
    include "../classes/dbh.class.php";
    include "../classes/event.class.php";
    include "../classes/eventscontr.class.php";

    try {
        $event = new EventsContr(
            $name = null,
            $place = null,
            $description = null,
            $color = null,
            $date_start = null,
            $date_end = null,
            $formattedDate,
            $id = null
        );

        $response = $event->selectEvent();
    } catch (PDOException $e)
    {
        $response = ['error' => 'Nie można pobrać wydarzeń: ' . $e->getMessage()];
    }
    header('Content-Type: application/json');
    echo json_encode($response);
    // echo json_encode($response);
} elseif ($_SERVER["REQUEST_METHOD"] == "PUT") {

     // Read the raw input stream
     $putData = file_get_contents("php://input");

     // Parse the JSON data (assuming it's JSON)
     $putDataArray = json_decode($putData, true);
 
     // Grab the data from the parsed input
     $name = isset($putDataArray["name"]) ? htmlspecialchars($putDataArray["name"]) : null;
     $place = isset($putDataArray["place"]) ? htmlspecialchars($putDataArray["place"]) : null;
     $description = isset($putDataArray["description"]) ? htmlspecialchars($putDataArray["description"]) : null;
     $color = isset($putDataArray["color"]) ? htmlspecialchars($putDataArray["color"]) : null;
     $date_start = isset($putDataArray["date_start"]) ? htmlspecialchars($putDataArray["date_start"]) : null;
     $date_end = isset($putDataArray["date_end"]) ? htmlspecialchars($putDataArray["date_end"]) : null;
     $id = isset($_GET["id"]) ? htmlspecialchars($_GET["id"]) : null;


    //Instantiate classes for Orders class purposes, and validation,
    include "../classes/dbh.class.php";
    include "../classes/validation.class.php";
    include "../classes/event.class.php";
    include "../classes/eventscontr.class.php";
    include "ValidationException.inc.php";
    try {
        $event = new EventsContr(
            $name,
            $place,
            $description,
            $color,
            $date_start,
            $date_end,
            $formattedDate = null,
            $id
        );
        // $order->validateOrder();  // Validate most of the data provided
        $event->putEvent();  // Save to data base if no exceptions thrown by validator
        $response = [
            'message' => 'Wydarzenie edytowane pomyślnie.',
            'id' => $id
        ];  // Set response msg
    } catch (ValidationException $e)  // Validation related exceptions handling
    {
        http_response_code(400);
        $response = $e->errorMessage();
    } catch (PDOException $e)   // PDO related exceptions handling
    {
        $response = ['error' => 'Edytowanie wydarzenia nie powiodło się: ' . $e->getMessage()];
    }

    header('Content-Type: application/json');
    echo json_encode($response);
} else {  // This happens if connection method is not set to POST
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Invalid request method']);
}
