<?php

require "server_class.php";
require "regression_class.php";
require "Task_class.php";

class watch
{

    public $data = [];
    public $servers = [];
    public $tasks = [];
    private $connection;
    public $sql;
    public $idsarr = [];
    public $pricessarr = [];
    public $costsarr = [];
    public $percentsarr = [];


    function __construct($cids, $cprices = [], $ccosts = [])

    {
        $this->servers = [

            new Server('192.168.0.65', "", '', '', '', "ЦОД-0"),
        ];
        $this->connection = $this->connectDB(0);

        $this->idsarr = $cids;
        $this->pricessarr = $cprices;

        $this->costsarr = $ccosts;

        $ids = implode(",", $cids);
        $this->getData($this->connection, $ids);
        $this->getTasks($this->connection);
    }

    function connectDB($server)
    {


        $connection = mysqli_connect($this->servers[$server]->server, $this->servers[$server]->user, $this->servers[$server]->bdpassword, $this->servers[$server]->base, $this->servers[$server]->port);
        mysqli_query($connection, "set names utf8");
        if (!$connection) {
            die("Ошибка подключения к базе");
        }

        return $connection;
    }


    function getData($connection, $ids)

    {

        mysqli_query($connection,  "use zod00");

        $this->sql = "select (select name from zodNom zn where zn.id=zr.zodnom and  zod=1  limit 1) as name,zodNom as id ,k,b from zod00.zodNomRegression zr where zodNom in($ids)";
        $res = mysqli_query($connection,  $this->sql);
        $this->data = [];
        while ($row = mysqli_fetch_array($res)) {

            $this->data[] = new Regr($row['name'], $row['id'], $row['k'], $row['b']);
        }
    }

    function getTasks($connection)

    {
        $res = mysqli_query($connection, "use zod00");
        $res = mysqli_query($connection, "select * from getsmart_tasks");
        $this->tasks = [];
        while ($temp = mysqli_fetch_array($res)) {


            $this->tasks[] = new Task($temp['name'], $temp['lookingfor'], $temp['from'], $temp['to']);
        }
    }




    function build1CData()
    {
        $res = "";
        $this->percentsarr = [];
        $res .= "<div class=\"datarowheader\"><div class=\"datarowheader__name\">Наименование</div><div class=\"datarowheader__price\">Цена</div><div class=\"datarowheader__tasks\">Рекомендации</div></div>";
        foreach ($this->data as $datarow) {
            $this->percentsarr[$datarow->id] = ($this->costsarr[$datarow->id] != 0 ? ( $this->pricessarr[$datarow->id]-$this->costsarr[$datarow->id]) / $this->costsarr[$datarow->id] : 0);
            $res .= "<div class=\"datarow\"><div class=\"datarow__name\">" . $datarow->name . "</div><div class=\"datarow__price\">" . (isset($this->pricessarr[$datarow->id]) ? $this->pricessarr[$datarow->id] : "0") . "(" . round($this->percentsarr[$datarow->id] * 100) . "%)</div><div class=\"datarow__tasks\">" . $this->buildTasks($datarow) . "</div></div>";
        }
        return $res;
    }
    function buildTasks($ldatarow)
    {
        $tasksstr = "";

        $percentfrom = 0;
        $possibilityfrom = 0;
        $pricefrom = 0;

        $percentto = 100;
        $possibilityto = 100;
        $priceto = 0;
        foreach ($this->tasks as $task) {
            //наценка x=(y-b)/k
            if ($task->lookingfor * 1 == 2) {
                $percentfrom = ($task->from - $ldatarow->b) / $ldatarow->k;
                $percentto = ($task->to - $ldatarow->b) / $ldatarow->k;
                $possibilityfrom = $task->from;
                $possibilityto = $task->to;
            }

            //вероятность y=kx+b
            if ($task->lookingfor * 1 == 1) {
                $possibilityfrom = $ldatarow->k * $task->from + $ldatarow->b;
                $possibilityto = $ldatarow->k * $task->to + $ldatarow->b;

                $percentfrom = $task->from;
                $percentto = $task->to;
            }


            $tempercent=min($percentfrom,$percentto);
            $percentto=max($percentfrom,$percentto);
            $percentfrom=$tempercent;

            $temppossibility = min($possibilityfrom,$possibilityto);
            $possibilityto=max($possibilityto,$possibilityfrom);
            $possibilityfrom=$temppossibility;



            $pricefrom =round($this->costsarr[$ldatarow->id]+$this->costsarr[$ldatarow->id] * $percentfrom/100);
            $priceto = round($this->costsarr[$ldatarow->id]+$this->costsarr[$ldatarow->id] * $percentto/100);


            $percentfrom=round($percentfrom);
            $percentto=round($percentto);


            $possibilityfrom=round($possibilityfrom);
            $possibilityto=round($possibilityto);





           // $tasksstr .= "<div class=\"recommend\"><div class=\"recommend__name\">" . $task->name . "</div><div class=\"recommend__data\"><div class=\"recommend__addprice " . ($task->lookingfor * 1 == 2 ? " hightlight" : "") . "\">Наценка  от $percentfrom до $percentto%</div><div class=\"recommend__price" . ($task->lookingfor * 1 == 2 ? " hightlight" : "") . "\">Цена от $pricefrom до $priceto </div><div class=\"recommend__possibility" . ($task->lookingfor * 1 == 1 ? " hightlight" : "") . "\">Вероятность от $possibilityfrom до $possibilityto %</div></div></div>";


           $tasksstr .= "<div class=\"recommend\"><div class=\"recommend__name\">" . $task->name . "</div><div class=\"recommend__data\"><div class=\"recommend__price" . (($this->pricessarr[$ldatarow->id]>$priceto)||($this->pricessarr[$ldatarow->id]<$pricefrom)== 2 ? " hightlightbad" : " hightlightok") . "\">Цена от $pricefrom до $priceto &#8381;</div></div></div>";
        }


        return $tasksstr;
    }

    function buildJSON()
    {
        $res = "";
        $this->percentsarr = [];
        
        foreach ($this->data as $datarow) {
            $this->percentsarr[$datarow->id] = ($this->costsarr[$datarow->id] != 0 ? ( $this->pricessarr[$datarow->id]-$this->costsarr[$datarow->id]) / $this->costsarr[$datarow->id] : 0);
            $res .=  ($res==""?"":",").'{"name": "'. $datarow->name . '","price":"'.(isset($this->pricessarr[$datarow->id]) ? $this->pricessarr[$datarow->id] : "0") . '","percent":"' . round($this->percentsarr[$datarow->id] * 100) . '","results":[' . $this->buildTasksJSON($datarow) . "]}";
        }
        return $res;
    }

    function buildTasksJSON($ldatarow)
    {
        $tasksstr = "";

        $percentfrom = 0;
        $possibilityfrom = 0;
        $pricefrom = 0;

        $percentto = 100;
        $possibilityto = 100;
        $priceto = 0;
        foreach ($this->tasks as $task) {
            //наценка x=(y-b)/k
            if ($task->lookingfor * 1 == 2) {
                $percentfrom = ($task->from - $ldatarow->b) / $ldatarow->k;
                $percentto = ($task->to - $ldatarow->b) / $ldatarow->k;
                $possibilityfrom = $task->from;
                $possibilityto = $task->to;
            }

            //вероятность y=kx+b
            if ($task->lookingfor * 1 == 1) {
                $possibilityfrom = $ldatarow->k * $task->from + $ldatarow->b;
                $possibilityto = $ldatarow->k * $task->to + $ldatarow->b;

                $percentfrom = $task->from;
                $percentto = $task->to;
            }


            $tempercent=min($percentfrom,$percentto);
            $percentto=max($percentfrom,$percentto);
            $percentfrom=$tempercent;

            $temppossibility = min($possibilityfrom,$possibilityto);
            $possibilityto=max($possibilityto,$possibilityfrom);
            $possibilityfrom=$temppossibility;



            $pricefrom =round($this->costsarr[$ldatarow->id]+$this->costsarr[$ldatarow->id] * $percentfrom/100);
            $priceto = round($this->costsarr[$ldatarow->id]+$this->costsarr[$ldatarow->id] * $percentto/100);


            $percentfrom=round($percentfrom);
            $percentto=round($percentto);


            $possibilityfrom=round($possibilityfrom);
            $possibilityto=round($possibilityto);





           // $tasksstr .= "<div class=\"recommend\"><div class=\"recommend__name\">" . $task->name . "</div><div class=\"recommend__data\"><div class=\"recommend__addprice " . ($task->lookingfor * 1 == 2 ? " hightlight" : "") . "\">Наценка  от $percentfrom до $percentto%</div><div class=\"recommend__price" . ($task->lookingfor * 1 == 2 ? " hightlight" : "") . "\">Цена от $pricefrom до $priceto </div><div class=\"recommend__possibility" . ($task->lookingfor * 1 == 1 ? " hightlight" : "") . "\">Вероятность от $possibilityfrom до $possibilityto %</div></div></div>";


           $tasksstr .= ($tasksstr==""?"":",").'{"name":"' . $task->name . '","pricefrom":"'.$pricefrom.'" ,"priceto":"'. $priceto. '","possibilityfrom":"'.$possibilityfrom.'" ,"possibilityto":"'. $possibilityto. '","percentfrom":"'.$percentfrom.'" ,"percentto":"'. $percentto.'"}';
        }


        return $tasksstr;
    }


}
