<?php

class actions
{

    private $server = '192.168.0.65';
    private $base = '';
    private $user = '';
    private $bdpassword = '';
    private $connection;

    //подключение к БД
    function connectDB()
    {
        $this->connection = mysqli_connect($this->server, $this->user, $this->bdpassword, $this->base);
        mysqli_query($this->connection, "set names utf8");
        if (!$this->connection) {
            die("Ошибка подключения к базе");
        }
    }


    function addError()
    {
        mysqli_query($this->connection, "use zod00");
        foreach ($_GET['ids'] as $key => $id) {


            $sql = "insert into zodRegressionErrors set doc='" . $_GET['doc'] . "', zodnom=" . $id . ", price=" . $_GET['price'][$key] . ", avaprice=" . $_GET['ava'][$key] . ", errtype='" . $_GET['problems'][$id] . "' ,info='".$_GET['comment'][$id]."'";

            mysqli_query($this->connection, $sql);
            echo '{"status":"ok"}';
        }
    }
}
$action = new actions();
$action->connectDB();
$action->addError();
