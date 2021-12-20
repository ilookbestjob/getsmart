<?php
class Task{

public $name;
public $lookingfor;
public $from;
public $to;

function __construct($fname, $flookingfor,$ffrom,$fto){
 
    $this->name=$fname;
    $this->lookingfor=$flookingfor;
    $this->from=$ffrom;
    $this->to=$fto;

}

}


?>