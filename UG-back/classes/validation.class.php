<?php
class Validation
{
    public static function validateName($name)
    {
        if (empty($name)) {
            throw new ValidationException("Event name is required.");
        }

        // Ensure string contains only letters, spaces, numbers, and hyphens
        if (!preg_match('/^[A-Za-z\d\-\'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+$/u', $name)) {
            throw new ValidationException("Event name should only contain letters, spaces, and hyphens.");
        }

        // Ensure string is between 2 and 50 characters long
        $nameLength = strlen($name);
        if ($nameLength < 1 || $nameLength >= 55) {
            throw new ValidationException("Name should be between 1 and 55 characters long.");
        }
    }
    public static function validatePlace($place)
    {
        // Ensure string contains only letters, spaces, numbers, and hyphens or is null
        if (!preg_match('/^[A-Za-z\d\-\'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]*$/u', $place)) {
            throw new ValidationException("Event place should only contain letters, spaces, and hyphens.");
        }

        // Ensure string is between 2 and 50 characters long
        $placeLength = strlen($place);
        if ($placeLength >= 255) {
            throw new ValidationException("Place should be at most 255 characters long.");
        }
    }

    public static function validateDescription($description)
    {
        // Ensure string contains only letters, spaces, numbers, and hyphens or is null
        if (!preg_match('/^[A-Za-z\d\-\'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]*$/u', $description)) {
            throw new ValidationException("Description should only contain letters, spaces, and hyphens.");
        }

        // Ensure string at most 255 characters long.
        $descriptionLength = strlen($description);
        if ($descriptionLength >= 255) {
            throw new ValidationException("Description should be at most 255 characters long.");
        }
    }

    public static function validateDates($date_start, $date_end)
    {
        $timestampStart = strtotime($date_start);
        $timestampEnd = strtotime($date_end);
        // Ensure that event duration isnt negative
        if ($timestampStart >= $timestampEnd) {
            throw new ValidationException("Event duration cannot be negative or 0");
        }
    }

    public static function validateColor($color)
{
    // Ensure $color is a valid hex color
    if (!preg_match('/^#[0-9a-fA-F]{6}$/', $color)) {
        throw new ValidationException("Invalid hex color format. Please use a valid hex color code.");
    }
}

}