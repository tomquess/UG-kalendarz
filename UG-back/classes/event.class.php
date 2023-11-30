<?php

class Event extends Dbh
{
    protected function setEvent(
        $name,
        $place,
        $description,
        $color,
        $date_start,
        $date_end
    ) {
        $sql = "INSERT INTO wydarzenia (
            name,
            place,
            description,
            color,
            date_start,
            date_end) 
            VALUES (?, ?, ?, ?, ?, ?);";
        $stmt = $this->connect()->prepare($sql);

        if (!$stmt->execute([
            $name,
            $place,
            $description,
            $color,
            $date_start,
            $date_end
        ])) {
            $stmt = null;
            http_response_code(400);
            echo json_encode(['error' => 'Sql error']);
            exit();
        }

        $stmt = null;
    }

    protected function editEvent(
        $name,
        $place,
        $description,
        $color,
        $date_start,
        $date_end,
        $id
    ) {
        $sql = "UPDATE wydarzenia SET name = :name, place = :place, description = :description, color = :color, date_start = :date_start, date_end = :date_end WHERE id = :id;";   
        $stmt = $this->connect()->prepare($sql);
        
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':place', $place);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':color', $color);
        $stmt->bindParam(':date_start', $date_start);
        $stmt->bindParam(':date_end', $date_end);
        $stmt->bindParam(':id', $id);
        if (!$stmt->execute()) {
            $stmt = null;
            http_response_code(400);
            echo json_encode(['error' => 'Sql error']);
            exit();
        }

        $stmt = null;
    }

    protected function getEvent($formattedDate)
    {
        $sql = "SELECT * FROM wydarzenia WHERE WEEK(:formattedDate) BETWEEN WEEK(date_start) AND WEEK(date_end) ORDER BY date_start ASC";
        $stmt = $this->connect()->prepare($sql);

        $stmt->bindParam(':formattedDate', $formattedDate);

        if (!$stmt->execute()) {
            $stmt = null;
            http_response_code(400);
            echo json_encode(['error' => 'Sql error']);
            exit();
        }
        return $stmt->fetchAll();
    }

    // protected function validation(
    //     $name,
    //     $surname,
    //     $nation,
    //     $address,
    //     $postcode,
    //     $city,
    //     $phonenumber,
    //     $alt_delivery,
    //     $alt_address,
    //     $alt_postcode,
    //     $alt_city,
    //     $delivery_type,
    //     $payment_type,
    //     $newsletter,
    //     $law
    // ) {
    //     Validation::validateName($name);
    //     Validation::validateSurname($surname);
    //     Validation::validateNation($nation);
    //     Validation::validateAddress($address);
    //     Validation::validatePostcode($postcode);
    //     Validation::validateCity($city);
    //     Validation::validatePhonenumber($phonenumber);
    //     Validation::validateAltAddress($alt_delivery, $alt_address, $alt_postcode, $alt_city);
    //     Validation::validateDeliverytype($delivery_type);
    //     Validation::validatePaymenttype($payment_type, $delivery_type);
    //     Validation::validateChecks($newsletter, $law);
    // }
}
