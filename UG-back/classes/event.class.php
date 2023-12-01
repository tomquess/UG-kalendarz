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
            VALUES (?, ?, ?, ?, ?, ?);";  // The query that will be executed in sql
        $stmt = $this->connect()->prepare($sql);  // Prepare the query

        if (!$stmt->execute([   // Execute the query, if fails echo a response with http code
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
    protected function delEvent($id)
    {
        $sql = "DELETE FROM wydarzenia WHERE id=:id";
        $stmt = $this->connect()->prepare($sql);

        $stmt->bindParam(':id', $id);

        if (!$stmt->execute()) {
            $stmt = null;
            http_response_code(400);
            echo json_encode(['error' => 'Sql error']);
            exit();
        }
        $stmt = null;
    }

    protected function validation(
        $name,
        $place,
        $description,
        $color,
        $date_start,
        $date_end
    ) {
        Validation::validateName($name);
        Validation::validatePlace($place);
        Validation::validateDescription($description);
        Validation::validateDates(
            $date_start,
            $date_end
        );
    }
}
