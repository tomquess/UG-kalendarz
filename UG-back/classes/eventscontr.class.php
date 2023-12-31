<?php

class EventsContr extends Event
{
    private $name;
    private $place;
    private $description;
    private $color;
    private $date_start;
    private $date_end;
    private $formattedDate;
    private $id;

    public function __construct(
        $name,
        $place,
        $description,
        $color,
        $date_start,
        $date_end,
        $formattedDate,
        $id
    ) {
        $this->name = $name;
        $this->place = $place;
        $this->description = $description;
        $this->color = $color;
        $this->date_start = $date_start;
        $this->date_end = $date_end;
        $this->formattedDate = $formattedDate;
        $this->id = $id;
    }



    public function createEvent()
    {
        $this->setEvent(
            $this->name,
            $this->place,
            $this->description,
            $this->color,
            $this->date_start,
            $this->date_end
        );
    }

    public function selectEvent()
    {
        return $this->getEvent($this->formattedDate);
    }

    public function putEvent()
    {
        $this->editEvent(
            $this->name,
            $this->place,
            $this->description,
            $this->color,
            $this->date_start,
            $this->date_end,
            $this->id
        );
    }
    public function deleteEvent()
    {
        $this->delEvent(
            $this->id
        );
    }

    public function validateEvent()
    {
        $this->validation(
            $this->name,
            $this->place,
            $this->description,
            $this->color,
            $this->date_start,
            $this->date_end
        );
    }


}
