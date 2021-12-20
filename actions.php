<?php header("Access-Control-Allow-Origin:*");
class Zod
{


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




    function getPotencial($connection)
    {
        $sqlresult = mysqli_query($connection, "select count(*)as quant, zC.name,zodDocType_id  from zodDoc zd  inner join zodCompany zC on zC.id=zd.zodCompany group by zC.name,zd.zodDocType_id limit 20");
        $result = [];
        /*while ($temp = mysqli_fetch_assoc($sqlresult)) {

            $result[] = $temp;

        }*/
        return json_encode($result);
    }



    function getSalepercent($connection)
    {


        $res = mysqli_query($connection, "use zod00");
        $start = (isset($_GET["startYear"]) ? $_GET["startYear"] . "-01-01" : "2021-01-01");
        $end = (isset($_GET["endYear"]) ? $_GET["endYear"] . "-12-31" : "2021-12-31");
        $turnover = (isset($_GET["liquid"]) ? "and (select zodTurnover from zodNom zn where zn.id= zodDocData.zodnom and  zod=1  limit 1)=" . (array_search($_GET["liquid"], $this->producttype) + 1) : "and (select zodTurnover from zodNom zn where zn.id= zodDocData.zodnom and  zod=1  limit 1)=1");
        $posweight = (isset($_GET["minweight"]) ? " and  (zodDocData.sum/zodDoc.sum)*100>=" . $_GET["minweight"] : "");


        $sql = "
    select * from (
    select 
    "
            .
            (isset($_GET['groupping']) ? ($_GET['groupping'] == 'true' ? "(select zf.name from zodNom zn,zodNomFolder zf  where zn.id= zodDocData.zodnom  and  zn.zod=1 and  zf.zod=1   and zn.zodNomFolder=zf.id limit 1) folder," : "(select name from zodNom zn where zn.id=zodDocData.zodnom and  zod=1  limit 1) name,") : "(select name from zodNom zn where zn.id=zodDocData.zodnom and  zod=1  limit 1) name,") . "
    
    
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
            and zd.zodDocMaster=zodDoc.id  
            and ((zd2.sum-zd2.cost*zd2.ratio)/zd2.sum)*100 is not null 
            and ((zd2.sum-zd2.cost*zd2.ratio)/zd2.sum)*100<>0 " . $turnover . "  
            and zodDoc.no not like 'И%' " . $posweight . "
       
    
   union   
       
       select 
              
       " .
            (isset($_GET['groupping']) ? ($_GET['groupping'] == 'true' ? "(select zf.name from zodNom zn,zodNomFolder zf  where zn.id= zodDocData.zodnom and  zn.zod=1 and  zf.zod=1  and zn.zodNomFolder=zf.id limit 1) folder," : "(select name from zodNom zn where zn.id=zodDocData.zodnom and  zod=1  limit 1) name,") : "(select name from zodNom zn where zn.id=zodDocData.zodnom and  zod=1  limit 1) name,") . "
    
  
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
            and not exists 
                (select * from zodDoc as zd, zodDocData as zd2 
                    where zd2.zod=zodDoc.zod 
                    and  zd.zoddoctype_id=2 
                    and zd2.zodNom=zodDocData.zodNom 
                    and zd2.del=0 
                    and zd2.zod=zodDoc.zod 
                    and zd2.zodDoc=zd.id 
                    and zd.prov=1 
                    and zd.zodDocMaster=zodDoc.id 
                    and ((zodDocData.sum-zodDocData.cost*zodDocData.ratio)/zodDocData.sum)*100 is not null 
                    and ((zodDocData.sum-zodDocData.cost*zodDocData.ratio)/zodDocData.sum)*100<>0 " . $turnover . " ) 
                    and zodDoc.no not like 'И%'" . $posweight . "
    ) ss
    where ss.zodTurnover=" . (array_search($_GET["liquid"], $this->producttype) + 1) . " " .
            (isset($_GET['groupping']) ? ($_GET['groupping'] == 'true' ? " order by folder,percent,zodTurnover " : "order by name,percent,zodTurnover ") : " order by name,percent,zodTurnover ");


        //group by folder,percentrange,result order by folder,percentrange,zodTurnover limit 1000";


        //        (select name from zodNom zn where zn.id= zodDocData.zodnom and  zod=1  limit 1) name,
        // (select name from zodNom zn where zn.id= zodDocData.zodnom and  zod=1  limit 1) name,

        $res = mysqli_query($connection, $sql);

        //echo $sql;
        if (mysqli_errno($connection) != 0) {
            return '{"err":' . mysqli_error($connection) . '}';
        }



        $result = [];
        while ($temp = mysqli_fetch_assoc($res)) {


            $result[] = $temp;
        }

        return json_encode($result);
    }




    function getNom($connection, $zodNom, $groupping = false)
    {
        $result = [];
        if ($zodNom != "") {
            $res = mysqli_query($connection, "use zod00");
            $start = (isset($_GET["startYear"]) ? $_GET["startYear"] . "-01-01" : "2021-01-01");
            $end = (isset($_GET["endYear"]) ? $_GET["endYear"] . "-12-31" : "2021-12-31");
            $turnover = (isset($_GET["liquid"]) ? "and (select zodTurnoverOPT from zodNom zn where zn.id= zodDocData.zodnom and  zod=1  limit 1)=" . (array_search($_GET["liquid"], $this->producttype) + 1) : "and (select zodTurnoverOPT from zodNom zn where zn.id= zodDocData.zodnom and  zod=1  limit 1)=1");

            $turnoverOPT = (isset($_GET["liquid"]) ? "ss.zodTurnoverOPT=" . (array_search($_GET["liquid"], $this->producttype) + 1) . " " : "ss.zodTurnoverOPT=1 ");



            $posweight = (isset($_GET["minweight"]) ? " and  (zodDocData.sum/zodDoc.sum)*100>=" . $_GET["minweight"] : "");



            $ids = ($groupping ? " and (select zf.id from zodNom zn,zodNomFolder zf  where zn.id= zodDocData.zodnom and  zn.zod=1 and  zf.zod=1  and zn.zodNomFolder=zf.id limit 1)  in (" . $zodNom . ")" : " and zodDocData.zodNom in (" . $zodNom . ")");
            $firstsale = "";
            if (isset($_GET["firstsale"])) {
                if ($_GET["firstsale"] == 'true') {

                    $firstsale = (isset($_GET["firstsaledays"]) ? ("AND zodDoc.data<( SELECT DATE_ADD(MIN(zd5.data),interval " . $_GET["firstsaledays"] . " day )FROM zodDoc AS zd5  WHERE zd5.zod=zodDoc.zod AND zd5.zodCompany=zodDoc.zodCompany  AND zd5.zodDocType_id=1)") : "");
                }
            }


            $sql = "SELECT *
            FROM
            (
            
            SELECT "
                .
                ($groupping ? "(select zf.name from zodNom zn,zodNomFolder zf  where zn.id= zodDocData.zodnom and  zn.zod=1 and  zf.zod=1  and zn.zodNomFolder=zf.id limit 1) folder, (select zf.id from zodNom zn,zodNomFolder zf  where zn.id= zodDocData.zodnom and  zn.zod=1 and  zf.zod=1  and zn.zodNomFolder=zf.id limit 1) folderid," : " name,")  . "
    
    
       
             zodNom.zodTurnover, zodNom.zodTurnoverOPT
            , (((zodDocData.sum-zodDocData.cost*zodDocData.ratio)/(zodDocData.cost*zodDocData.ratio))*100)  replypercent
            , zodDoc.no nom, zodDoc.data data ,  zd.no rnom, zd.data rdata
            , (zodDocData.sum/zodDoc.sum)*100 posweight, (( (zd2.sum-zd2.cost*zd2.ratio)/(zd2.cost*zd2.ratio))*100) percent , 1 result,
            zodDocData.zodNom zodNom,
            
            zodDocData.sum replysummary,
            zodDocData.cost replycost,
            zodDocData.ratio replyratio,

            zd2.sum summary,
            zd2.cost cost,
            zd2.ratio ratio,
            zodDoc.sum docsummary
            
            , (
                SELECT  zodFieldData.name
                FROM zodDocFields, zodFieldData
                WHERE zodDocFields.zod=zodDoc.zod
                AND zodDocFields.zodDoc=zodDoc.id
                AND zodDocFields.zodField_id=5
                AND zodDocFields.val=zodFieldData.id
                AND zodFieldData.zodField_id=zodDocFields.zodField_id
                AND zodFieldData.zod=zodDoc.zod
                LIMIT 1) AS typeprice


            FROM zodDoc, zodDocData, zodNom, zodDoc AS zd, zodDocData AS zd2
            WHERE zodDoc.zod=1
            AND zodDoc.zoddoctype_id=1
            AND zd.zoddoctype_id=2
            AND zd.zod=1
            and zodDoc.data BETWEEN  '" . $start . "' AND  '" . $end  . "' " . $firstsale . " 


            AND zodDocData.zodDoc=zodDoc.id
            AND zodDocData.zod=zodDoc.zod
            AND zodDocData.del=0
            AND zd2.zod=zodDoc.zod
            AND zd2.zodNom=zodDocData.zodNom
            AND zd2.del=0
            AND zd2.zod=zodDoc.zod
            AND zd2.zodDoc=zd.id
            AND zd.prov=1
            and zodNom.zod=zodDoc.zod
            and zodNom.id=zodDocData.zodNom
            AND zd.zodDocMaster=zodDoc.id
            AND ((zd2.sum-zd2.cost*zd2.ratio)/zd2.cost*zd2.ratio)*100 is not null
        
            and ((zd2.sum-zd2.cost*zd2.ratio)/(zd2.cost*zd2.ratio))*100>0 
            and ((zd2.sum-zd2.cost*zd2.ratio)/(zd2.cost*zd2.ratio))*100<100 
            and zodDocData.sum>0
            and zodDocData.cost>0
            and zodDocData.ratio>0

            and zodDoc.no not like 'И%' " . $posweight . $ids . "
       

            union

            select 
            "   .
                ($groupping ? "(select zf.name from zodNom zn,zodNomFolder zf  where zn.id= zodDocData.zodnom and  zn.zod=1 and  zf.zod=1  and zn.zodNomFolder=zf.id limit 1) folder, (select zf.id from zodNom zn,zodNomFolder zf  where zn.id= zodDocData.zodnom and  zn.zod=1 and  zf.zod=1  and zn.zodNomFolder=zf.id limit 1) folderid," : " name,") . "
    
  
             zodNom.zodTurnover, zodNom.zodTurnoverOPT
            , (zodDocData.sum-zodDocData.cost*zodDocData.ratio) overprice
            , zodDoc.no nom, zodDoc.data data,    0 rnom, 0 rdata,
            
            (zodDocData.sum/zodDoc.sum)*100 posweight
            ,  (((zodDocData.sum-zodDocData.cost*zodDocData.ratio)/(zodDocData.cost*zodDocData.ratio))*100)  percent
            , 0 result,
            zodDocData.zodNom zodNom,
            0 replysummary,
            0 replycost,
            0 replyratio,

            zodDocData.sum summary,
            zodDocData.cost cost,
            zodDocData.ratio ratio,
            zodDoc.sum docsummary

            , (
                SELECT  zodFieldData.name
                FROM zodDocFields, zodFieldData
                WHERE zodDocFields.zod=zodDoc.zod
                AND zodDocFields.zodDoc=zodDoc.id
                AND zodDocFields.zodField_id=5
                AND zodDocFields.val=zodFieldData.id
                AND zodFieldData.zodField_id=zodDocFields.zodField_id
                AND zodFieldData.zod=zodDoc.zod
                LIMIT 1) AS typeprice


            FROM zodDoc, zodDocData, zodNom
            WHERE zodDoc.zod=1
            AND zodDoc.zoddoctype_id=1
            and zodNom.id=zodDocData.zodNom
            and zodNom.zod=zodDoc.zod
            and zodDoc.data BETWEEN  '" . $start . "' AND  '" . $end  . "' " . $firstsale . " 


            AND zodDocData.zod=zodDoc.zod
            AND zodDocData.zodDoc=zodDoc.id
            AND zodDocData.del=0
            AND not exists (
            SELECT *
            FROM zodDoc AS zd, zodDocData AS zd2
            WHERE zd2.zod=zodDoc.zod
            AND zd.zoddoctype_id=2
            AND zd2.zodNom=zodDocData.zodNom
            AND zd2.del=0
            AND zd2.zod=zodDoc.zod
            AND zd2.zodDoc=zd.id
            AND zd.prov=1
            AND zd.zodDocMaster=zodDoc.id
           )

           AND  (((zodDocData.sum-zodDocData.cost*zodDocData.ratio)/(zodDocData.cost*zodDocData.ratio))*100) is not null
           AND  (((zodDocData.sum-zodDocData.cost*zodDocData.ratio)/(zodDocData.cost*zodDocData.ratio))*100)>0 
           AND  (((zodDocData.sum-zodDocData.cost*zodDocData.ratio)/(zodDocData.cost*zodDocData.ratio))*100)<100 
           and zodDocData.sum>0
           and zodDocData.cost>0
           and zodDocData.ratio>0

           and zodDoc.no not like 'И%' " . $posweight . $ids . "


            
       
            ) ss
            where " . $turnoverOPT .
                ($groupping ? " order by folder,folderid,percent,zodTurnover " : "order by name,percent,zodTurnover ");


          //  echo $sql;
           //echo "\n\n\n_______________________\n\n\n";
            $res = mysqli_query($connection, $sql);

            if (mysqli_errno($connection) != 0) {
                echo '{"err":' . mysqli_error($connection) . '}';
                echo $sql;
            }



            $result = [];
            while ($temp = mysqli_fetch_assoc($res)) {


                $result[] = $temp;
            }
        }
        return $result;
    }




    ///////////////////////////////////////


    function getAll($connection)
    {


        
        return json_encode(


            
            array_merge(
                $this->getNom($connection, $_GET['ids'], false),
               $this->getNom($connection, $_GET['gids'], true)
              
            )
        );
    }





    ///////////////////////////////////////












    function getNomIDs($connection)
    {


        $res = mysqli_query($connection, "use zod00");
        $start = (isset($_GET["startYear"]) ? $_GET["startYear"] . "-01-01" : "2021-01-01");
        $end = (isset($_GET["endYear"]) ? $_GET["endYear"] . "-12-31" : "2021-12-31");
        $turnover = (isset($_GET["liquid"]) ? "and (select zodTurnover from zodNom zn where zn.id= zodDocData.zodnom and  zod=1  limit 1)=" . (array_search($_GET["liquid"], $this->producttype) + 1) : "and (select zodTurnover from zodNom zn where zn.id= zodDocData.zodnom and  zod=1  limit 1)=1");
        $posweight = (isset($_GET["minweight"]) ? " and  (zodDocData.sum/zodDoc.sum)*100>=" . $_GET["minweight"] : "");


        $turnoverOPT = (isset($_GET["liquid"]) ? "ss.zodTurnoverOPT=" . (array_search($_GET["liquid"], $this->producttype) + 1) . " " : "ss.zodTurnoverOPT=1 ");


        $firstsale = "";
        if (isset($_GET["firstsale"])) {
            if ($_GET["firstsale"] == 'true') {
                $firstsale = (isset($_GET["firstsaledays"]) ? "AND zodDoc.data<(SELECT DATE_ADD(MIN(zd5.data),interval " . $_GET["firstsaledays"] . " day)
            FROM zodDoc AS zd5 WHERE zd5.zod=zodDoc.zod AND zd5.zodCompany=zodDoc.zodCompany AND zd5.zodDocType_id=1)" : "");
            }
        }

        if ($_GET['groupping'] == 'true') {



            $sql = "SELECT zodNom.zodNomFolder zodNom
            ,COUNT(*) AS q
            FROM zodDoc, zodDocData, zodNom
            WHERE zodDoc.zod=1
            AND zodNom.id=zodDocData.zodNom
            AND zodDoc.zoddoctype_id=1
            AND zodDocData.zodDoc=zodDoc.id
            AND zodDocData.del=0
            and zodNom.zod=zodDoc.zod
            AND zodDocData.zod=zodDoc.zod
            AND zodDoc.zodCompany not IN (135, 15789, 5972)
            and ((zodDocData.sum-zodDocData.cost*zodDocData.ratio)/zodDocData.sum)*100 is not null
            and ((zodDocData.sum-zodDocData.cost*zodDocData.ratio)/zodDocData.sum)*100<>0 " . $turnoverOPT . " 
            
            
            
            and zodDoc.no not like 'И%'" . $posweight . "
            and zodDoc.data BETWEEN  '" . $start . "' AND  '" . $end . "' " . $firstsale . " 
            
            GROUP BY zodNom.zodNomFolder
            ORDER BY 2 desc";
        } else {
            $sql = "select zodDocData.zodNom, count(*) as q
        from zodDoc, zodDocData, zodNom
        where
        zodDoc.zod=1
        and zodNom.id=zodDocData.zodNom
        and zodDoc.zoddoctype_id=1
        and zodDocData.zodDoc=zodDoc.id
        and zodDocData.del=0
        and zodDocData.zod=zodDoc.zod
        and zodDoc.zodCompany not in (135,15789,5972)
        and zodDocData.zodNom not in (16914)
        and ((zodDocData.sum-zodDocData.cost*zodDocData.ratio)/zodDocData.sum)*100 is not null
        and ((zodDocData.sum-zodDocData.cost*zodDocData.ratio)/zodDocData.sum)*100<>0 " . $turnover . " 
        
        
        
        and zodDoc.no not like 'И%'" . $posweight . "
        and zodDoc.data BETWEEN  '" . $start . "' AND  '" . $end . "' " . $firstsale . " 

        group by zodDocData.zodNom
        order by 2 desc";
        }







        $res = mysqli_query($connection, $sql);

        if (mysqli_errno($connection) != 0) {
            return '{"err":' . mysqli_error($connection) . '}';
        }


        $result = [];
        while ($temp = mysqli_fetch_assoc($res)) {


            $result[] = $temp;
        }

        return json_encode($result);
    }



    function getSaleDetails($connection, $product)
    {

        $res = mysqli_query($connection, "use zod00");


        $res = mysqli_query($connection, "drop TEMPORARY TABLE IF EXISTS tempdoc3");


        $res = mysqli_query($connection, "drop TEMPORARY TABLE IF EXISTS tempresult");




        $start = (isset($_GET["startYear"]) ? $_GET["startYear"] . "-01-01" : "2021-01-01");
        $end = (isset($_GET["endYear"]) ? $_GET["endYear"] . "-12-31" : "2021-12-31");


        $order = (isset($_GET["sortfield"]) ? " order by " . $_GET["sortfield"] . " " . (isset($_GET["sorttype"]) ? $_GET["sorttype"] : "") : "");


        $res = mysqli_query($connection, "CREATE TEMPORARY TABLE `tempdoc3` select *,z2.nmr nmr2 from zod00.zodDoc zd left join  
        ( SELECT no nmr ,zoddocmaster zdmr FROM zod00.zodDoc zzz where zodDocType_id=2 and zzz.zod=1 and zzz.prov=1) z2  
         on zd.id=z2.zdmr where zd.zodDocType_id=1 and zd.zod=1  and zd.data BETWEEN '" . $start . "' AND  '" . $end . "'");



        $res = mysqli_query($connection, "CREATE TEMPORARY TABLE `tempresult` select distinct  zt.data,  zt.no docnumber, zt.nmr2 docnumber2, zdd.price, Case WHEN zt.nmr2 is not null THEN 1 ELSE 0 End result,  zdd.sum, (zdd.sum-zdd.cost*zdd.ratio) overprice, zdd.cost, zdd.ratio, zdd.zodNom  from tempdoc3 zt inner join zodDocData zdd on zt.id=zdd.zoddoc and zdd.zod=1");



        $res = mysqli_query($connection, "select data,(((overprice/sum)*100)-((overprice/sum)*100)%10)/10 percentrange,((overprice/sum)*100) percent,result,docnumber  from tempresult t   where ((overprice/sum)*100) is not null and ((overprice/sum)*100)<>0 and (select name from zodNom zn where zn.id=t.zodnom and  zod=1  limit 1)='" . $product . "'" . $order);



        $result = [];
        while ($temp = mysqli_fetch_assoc($res)) {


            $result[] = $temp;
        }
        // print_r($result);

        return json_encode($result);
        // return "select data,(((overprice/sum)*100)-((overprice/sum)*100)%10)/10 percentrange,((overprice/sum)*100) percent,result  from tempresult t   where ((overprice/sum)*100) is not null and ((overprice/sum)*100)<>0 and name='".$product."' limit 10000";
    }


    function getTasks($connection)
    {
        $res = mysqli_query($connection, "use zod00");
        $res = mysqli_query($connection, "select * from getsmart_tasks");

        $result = [];
        while ($temp = mysqli_fetch_assoc($res)) {


            $result[] = $temp;
        }


        return json_encode($result);
    }


    function delTask($connection, $id)
    {
        $res = mysqli_query($connection, "use zod00");
        $sql = "delete from getsmart_tasks where id=" . $id;

        $res = mysqli_query($connection, $sql);
        if (mysqli_errno($connection) != 0) {
            return '{"err":' . mysqli_error($connection) .  $sql . '}';
        }




        return $this->getTasks($connection);
    }



    function addTask($connection, $name, $looking, $from, $to)
    {
        $res = mysqli_query($connection, "use zod00");
        $sql = "insert into getsmart_tasks set name='" . $name . "',lookingfor='" . $looking . "',getsmart_tasks.from='" . $from . "',getsmart_tasks.to='" . $to . "'";

        $res = mysqli_query($connection, $sql);
        if (mysqli_errno($connection) != 0) {
            return '{"err":' . mysqli_error($connection) .  $sql . '}';
        }

        return $this->getTasks($connection);
    }




    function editTask($connection, $id, $name, $looking, $from, $to)
    {
        $res = mysqli_query($connection, "use zod00");
        $sql = "update getsmart_tasks set name='" . $name . "',lookingfor='" . $looking . "',getsmart_tasks.from='" . $from . "',getsmart_tasks.to='" . $to . "' where id=" . $id;

        $res = mysqli_query($connection, $sql);
        if (mysqli_errno($connection) != 0) {
            return '{"err":' . mysqli_error($connection) .  $sql . '}';
        }

        return $this->getTasks($connection);
    }
}

////////////////////////потенциальные клиенты
if ($_GET['action'] == 'getpotential') {

    $zodlink = new Zod();

    $connection = $zodlink->connectDB();

    if ($connection) {
    }
    echo ($zodlink->getPotencial($connection));
}


////////////////////////процент продаж
if ($_GET['action'] == 'getsalepercent') {

    $zodlink = new Zod();

    $connection = $zodlink->connectDB();

    if ($connection) {
    }
    echo ($zodlink->getSalepercent($connection));
}


if ($_GET['action'] == 'getSaleDetails') {
    $zodlink = new Zod();

    $connection = $zodlink->connectDB();

    if ($connection) {
    }
    echo ($zodlink->getSaleDetails($connection, $_GET['productname']));
}


if ($_GET['action'] == 'getTasks') {
    $zodlink = new Zod();

    $connection = $zodlink->connectDB();

    if ($connection) {
    }
    echo ($zodlink->getTasks($connection));
}




if ($_GET['action'] == 'addTask') {
    $zodlink = new Zod();

    $connection = $zodlink->connectDB();

    if ($connection) {
    }
    echo ($zodlink->addTask($connection, $_GET['name'], $_GET['lookingfor'], $_GET['from'], $_GET['to']));
}



if ($_GET['action'] == 'delTask') {
    $zodlink = new Zod();

    $connection = $zodlink->connectDB();

    if ($connection) {
    }
    echo ($zodlink->delTask($connection, $_GET['id']));
}


if ($_GET['action'] == 'editTask') {
    $zodlink = new Zod();

    $connection = $zodlink->connectDB();

    if ($connection) {
    }
    echo ($zodlink->editTask($connection, $_GET['id'], $_GET['name'], $_GET['lookingfor'], $_GET['from'], $_GET['to']));
}



if ($_GET['action'] == 'getNomIDS') {
    $zodlink = new Zod();

    $connection = $zodlink->connectDB();

    if ($connection) {

        echo $zodlink->getNomIDs($connection);
    }
}



if ($_GET['action'] == 'getNom') {
    $zodlink = new Zod();

    $connection = $zodlink->connectDB();

    if ($connection) {

        echo json_encode($zodlink->getNom($connection, $_GET['IDs'], (isset($_GET['groupping']) ? ($_GET['groupping'] == 'true' ? "true" : "false") : "false")));
    }
}




if ($_GET['action'] == 'getall') {
    $zodlink = new Zod();

    $connection = $zodlink->connectDB();

    if ($connection) {

        echo $zodlink->getAll($connection);
    }
}







///////////////парсинг
