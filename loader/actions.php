<?php header("Access-Control-Allow-Origin:*");
class Zod
{

    private $server = '192.168.0.65';
    private $base = '';
    private $user = '';
    private $bdpassword = '';


    public $ctr = 0;
    public $producttype = ["Ликвидные", "Малоликвидные", "Нелеквидные", "Заказные"];




    //подключение к БД
    function connectDB()
    {
        $connection = mysqli_connect($this->server, $this->user, $this->bdpassword, $this->base);
        mysqli_query($connection, "set names utf8");
        if (!$connection) {
            die("Ошибка подключения к базе");
        }

        return $connection;
    }

    function connectteamDB()
    {
        $connection = mysqli_connect($this->server, $this->user, $this->bdpassword, $this->base);
        mysqli_query($connection, "set names utf8");
        if (!$connection) {
            die("Ошибка подключения к базе");
        }

        return $connection;
    }





    function getNom($connection)
    {


        $res = mysqli_query($connection, "use zod00");
        $start = (isset($_GET["startYear"]) ? $_GET["startYear"] . "-01-01" : "2021-01-01");
        $end = (isset($_GET["endYear"]) ? $_GET["endYear"] . "-12-31" : "2021-12-31");
        $turnover = (isset($_GET["liquid"]) ? "and (select zodTurnoverOPT from zodNom zn where zn.id= zodDocData.zodnom and  zod=1  limit 1)=" . (array_search($_GET["liquid"], $this->producttype) + 1) : "and (select zodTurnoverOPT from zodNom zn where zn.id= zodDocData.zodnom and  zod=1  limit 1)=1");
        $posweight = (isset($_GET["minweight"]) ? " and  (zodDocData.sum/zodDoc.sum)*100>=" . $_GET["minweight"] : "");


        $sql = "
    select * from (
    select 
    "
            .
            (isset($_GET['groupping']) ? ($_GET['groupping'] == 'true' ? "(select zf.name from zodNom zn,zodNomFolder zf  where zn.id= zodDocData.zodnom  and  zn.zod=1 and  zf.zod=1   and zn.zodNomFolder=zf.id limit 1) folder," : "(select name from zodNom zn where zn.id=zodDocData.zodnom and  zod=1  limit 1) name,") : "(select name from zodNom zn where zn.id=zodDocData.zodnom and  zod=1  limit 1) name,") .


            (isset($_GET['groupping']) ? ($_GET['groupping'] == 'true' ? "(select zf.id from zodNom zn,zodNomFolder zf  where zn.id= zodDocData.zodnom  and  zn.zod=1 and  zf.zod=1   and zn.zodNomFolder=zf.id limit 1) id," : "(select id from zodNom zn where zn.id=zodDocData.zodnom and  zod=1  limit 1) id, ") : "(select id from zodNom zn where zn.id=zodDocData.zodnom and  zod=1  limit 1) id, ") . "


            (select zodTurnover from zodNom zn where zn.id= zodDocData.zodnom and  zod=1  limit 1) zodTurnover,
            (( (zodDocData.sum-zodDocData.cost*zodDocData.ratio)/zodDocData.sum)*100) replypercent,
            zodDoc.no nom,    
            zodDoc.data data,    
            (zodDocData.sum/zodDoc.sum)*100 posweight,
            (( (zd2.sum-zd2.cost*zd2.ratio)/zd2.sum)*100) percent , 
            1 result 
    from zodDoc, zodDocData, zodDoc as zd, zodDocData as zd2 
        where 
            zodDoc.zod=1 
            and zodDoc.zoddoctype_id=1 
            and  zd.zoddoctype_id=2 
            and zd.zod=1 and zodDoc.data BETWEEN  '" . $start . "' AND  '" . $end . "'
            and zodDocData.zodDoc=zodDoc.id 
            and zodDocData.del=0 
            and zd2.zod=zodDoc.zod 
            and zd2.zodNom=zodDocData.zodNom 
            and zd2.del=0 
            and zd2.zod=zodDoc.zod 
            and zd2.zodDoc=zd.id 
            and zd.prov=1 
            and zodDocData.zod=zodDoc.zod  
            and zd.zodDocMaster=zodDoc.id  
            and ((zd2.sum-zd2.cost*zd2.ratio)/zd2.sum)*100<70
            and ((zd2.sum-zd2.cost*zd2.ratio)/zd2.sum)*100>0
            and ((zd2.sum-zd2.cost*zd2.ratio)/zd2.sum)*100 is not null 
            and ((zd2.sum-zd2.cost*zd2.ratio)/zd2.sum)*100<>0 " . $turnover . "  
            and zodDoc.no not like 'И%' " . $posweight . "
       
    
   union   
       
       select 
              
       " .
            (isset($_GET['groupping']) ? ($_GET['groupping'] == 'true' ? "(select zf.name from zodNom zn,zodNomFolder zf  where zn.id= zodDocData.zodnom and  zn.zod=1 and  zf.zod=1  and zn.zodNomFolder=zf.id limit 1) folder," : "(select name from zodNom zn where zn.id=zodDocData.zodnom and  zod=1  limit 1) name,") : "(select name from zodNom zn where zn.id=zodDocData.zodnom and  zod=1  limit 1) name,") .

            (isset($_GET['groupping']) ? ($_GET['groupping'] == 'true' ? "(select zf.id from zodNom zn,zodNomFolder zf  where zn.id= zodDocData.zodnom  and  zn.zod=1 and  zf.zod=1   and zn.zodNomFolder=zf.id limit 1) id," : "(select id from zodNom zn where zn.id=zodDocData.zodnom and  zod=1  limit 1) id, ") : "(select id from zodNom zn where zn.id=zodDocData.zodnom and  zod=1  limit 1) id, ") . "

            (select zodTurnover from zodNom zn where zn.id= zodDocData.zodnom and  zod=1  limit 1) zodTurnover,  
            (zodDocData.sum-zodDocData.cost*zodDocData.ratio) overprice, 
            zodDoc.no nom,    
            zodDoc.data data,   
            (zodDocData.sum/zodDoc.sum)*100 posweight, 
            (( (zodDocData.sum-zodDocData.cost*zodDocData.ratio)/zodDocData.sum)*100) percent, 
            0 result 
    from zodDoc, zodDocData 
        where 
            zodDoc.zod=1 
            and zodDoc.zoddoctype_id=1 
            and zodDoc.data BETWEEN  '" . $start . "' AND  '" . $end . "'
            and zodDocData.zodDoc=zodDoc.id 
            and zodDocData.del=0
            and zodDocData.zod=zodDoc.zod  
            and not exists 
                (select * from zodDoc as zd, zodDocData as zd2 
                    where zd2.zod=zodDoc.zod 
                    and  zd.zoddoctype_id=2 
                    and zd2.zodNom=zodDocData.zodNom 
                    and zd2.del=0 
                    and zd2.zod=zodDoc.zod 
                    and zd2.zodDoc=zd.id 
                    and zd.prov=1 
                    and zd.zodDocMaster=zodDoc.id )
                    and ((zodDocData.sum-zodDocData.cost*zodDocData.ratio)/zodDocData.sum)*100>0 
                    and ((zodDocData.sum-zodDocData.cost*zodDocData.ratio)/zodDocData.sum)*100<70 
                    and ((zodDocData.sum-zodDocData.cost*zodDocData.ratio)/zodDocData.sum)*100 is not null 
                    and ((zodDocData.sum-zodDocData.cost*zodDocData.ratio)/zodDocData.sum)*100<>0 " . $turnover . "  
                    and zodDoc.no not like 'И%'" . $posweight . "
    ) ss "
            .
            (isset($_GET['groupping']) ? ($_GET['groupping'] == 'true' ? " order by folder,percent " : "order by name,percent") : " order by name,percent");


        //group by folder,percentrange,result order by folder,percentrange,zodTurnover limit 1000";


        //        (select name from zodNom zn where zn.id= zodDocData.zodnom and  zod=1  limit 1) name,
        // (select name from zodNom zn where zn.id= zodDocData.zodnom and  zod=1  limit 1) name,

        $res = mysqli_query($connection, $sql);

        // echo $sql;
        if (mysqli_errno($connection) != 0) {
            return '{"err":' . mysqli_error($connection) . '}';
        }



        $result = [];
        while ($temp = mysqli_fetch_assoc($res)) {


            $result[] = $temp;
        }

        return json_encode($result);
    }



    function clearReaegression($connection)
    {

        $groupping = '';
        if (isset($_GET['groupping'])) {

            $groupping = $_GET['groupping'];
        } else {
            $groupping = "false";
        }
        ////названия таблиц и полей в зависимости от того есть группировка или нет

        $grouppingarr = ["true" => "zodNomFolderRegression", "false" => "zodNomRegression"];
        mysqli_query($connection, "use zod00");



        mysqli_query($connection, "delete from " . $grouppingarr[$groupping] . " where zod=1");

        $actresult = "";

        if (mysqli_errno($connection) != 0) {
            $actresult .= ($actresult == "" ? "" : ",") . '{"err":' . mysqli_error($connection) . '}';
        } else {
            $actresult .= ($actresult == "" ? "" : ",") . '{"err":"0"}';
        }
    }

    function addRegression($connection)
    {

        $groupping = '';
        if (isset($_GET['groupping'])) {

            $groupping = $_GET['groupping'];
        } else {
            $groupping = "false";
        }
        ////названия таблиц и полей в зависимости от того есть группировка или нет
        $grouppingarr = ["true" => "zodNomFolderRegression", "false" => "zodNomRegression"];
        $idnamearr = ["true" => "zodNomFolder", "false" => "zodNom"];

        $idarr = explode(",", $_GET['ids']);
        $karr = explode(",", $_GET['k']);
        $barr = explode(",", $_GET['b']);
        $res = mysqli_query($connection, "use zod00");
        $actresult = "";

        for ($t = 0; $t < count($idarr); $t++) {
            $res = mysqli_query($connection, "select count(*) as ctr  from " . $grouppingarr[$groupping] . " where " . $idnamearr[$groupping] . "=" . $idarr[$t] . " and zod=1");
            $row = mysqli_fetch_array($res);
            if ($row["ctr"] == 0) {

                mysqli_query($connection, "insert into  " . $grouppingarr[$groupping] . " set " . $idnamearr[$groupping] . "=" . $idarr[$t] . ", k=" . $karr[$t] . ", b=" . $barr[$t] . ", dataupd='" . date("Y-m-d H:i:s") . "', zod=1");
                if (mysqli_errno($connection) != 0) {
                    $actresult .= ($actresult == "" ? "" : ",") . '{"err":' . mysqli_error($connection) . '}';
                } else {
                    $actresult .= ($actresult == "" ? "" : ",") . '{"err":"0", "id":"' . $idarr[$t] . '","status":"added"}';
                }
            } else {

                mysqli_query($connection, "update  " . $grouppingarr[$groupping] . " set  k=" . $karr[$t] . ", b=" . $barr[$t] . ", dataupd='" . date("Y-m-d H:i:s") . "' where " . $idnamearr[$groupping] . "=" . $idarr[$t] . " and zod=1");

                if (mysqli_errno($connection) != 0) {
                    $actresult .= ($actresult == "" ? "" : ",") . '{"err":' . mysqli_error($connection) . '}';
                } else {
                    $actresult .= ($actresult == "" ? "" : ",") . '{"err":"0", "id":"' . $idarr[$t] . '","status":"updated"}';
                }
            }
        }
        return $actresult;
    }
}


////////////////////////процент продаж
if ($_GET['action'] == 'getnom') {

    $zodlink = new Zod();

    $connection = $zodlink->connectDB();

    if ($connection) {
    }
    echo ($zodlink->getNom($connection));
}


///////////////парсинг


//"actions.php?action=addregression&atempt="+sendatempt+"&ids=" + GetData.ids + "&k=" + GetData.k + "&b=" + GetData.b + ""



if ($_GET['action'] == 'addnomregression') {

    $zodlink = new Zod();

    $connection = $zodlink->connectDB();

    if ($connection) {
    }
    echo "[" . ($zodlink->addRegression($connection)) . "]";
}



if ($_GET['action'] == 'clearressions') {

    $zodlink = new Zod();

    $connection = $zodlink->connectDB();

    if ($connection) {
    }
    echo "[" . ($zodlink->addRegression($connection)) . "]";
}
