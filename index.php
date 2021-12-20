<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
</head>

<script>
    <?php


    if (isset($_GET["ids"])) {
        $idstring = "";
        $gidstring = "";
        echo "let getproductids=[";


        $first = true;


        $first2 = true;

        foreach ($_GET["ids"] as $key => $id) {
         
            echo (!$first2 ? "," : "") . "{zodNom:'" . $id . "',zodName:'" . $_GET["names"][$key] . "', zodNomFolder:'" . $_GET["gids"][$key] . "', isgroup:'" . $_GET["isgroup"][$key] . "'}";
            $first2 = false;
   if ($_GET["isgroup"][$key] == '0') {
                $idstring .= (!$first ? "," : "") . $id;
                $first = false;
           }


   
        }



        echo "];\n";
        $first = true;

        $uniquearr = [];
        foreach ($_GET["gids"] as $key => $gid) {
            if ($_GET["isgroup"][$key] == '1') {
                if (!in_array($gid, $uniquearr)) {
                    $uniquearr[] = $gid;

                    $gidstring .= (!$first ? "," : "") . $gid;
                    $first = false;
                }
            }
        
        }
        echo "let idstring='" . $idstring . "';\n";
        echo "let gidstring='" . $gidstring . "';\n";
    }
    ?>
</script>
<link rel="stylesheet" type="text/css" href="css/style.css" />
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="js/funnel.js"></script>


<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/series-label.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script>

<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.0.0/dist/tf.min.js"></script>



<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/data.js"></script>
<script src="https://code.highcharts.com/highcharts-more.js"></script>

<script src="https://code.highcharts.com/modules/export-data.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jstat@latest/dist/jstat.min.js"></script>





<body>



    <div class="liquiddrop__content">
        <div class="dropcontent">Нелеквидные</div>
        <div class="dropcontent">Малоликвидные</div>
        <div class="dropcontent">Ликвидные</div>
        <div class="dropcontent">Заказные</div>
    </div>




    <div class="taskswindow">
        <div class="taskswindow__tittle">
            <div>Редактирование задач</div>
            <div class="taskswindow__close">&#10006;</div>
        </div>
        <div class="taskswindow__toolbar">
            <div class="taskwindow__add"> &#10010;<span class="separator">&nbsp;|&nbsp;</span>Добавить</div>
            <div class="taskwindow__del">&#10008;&nbsp;<span class="separator">&nbsp;|&nbsp;</span>Удалить</div>
        </div>
        <div class="taskswindow__body">
            <div class="taskswindow__content" id="content"></div>
        </div>
        <div class="taskswindow__footer"></div>
    </div>



    <div class="whatisdrop__content">
        <div class="whatisdrop__dropcontent">Наценка</div>
        <div class="whatisdrop__dropcontent">Вероятность</div>

    </div>

    <?php if (!isset($_GET["ids"])) {?>
    <div class="searchbar">
        <div class="datecontainer">
            <div class="datestart"></div>
            <div class="dateend"></div>
        </div>

        <div class="groupping">
            <div class="groupping__header">
                Группировка
            </div>
            <div class="groupping__inputcontainer"><input class="groupping__input" type="checkbox" placeholder="0" value="0">
                <div class="groupping__text">по группам</div>
            </div>
        </div>
        <div class="liquid">
            <div class="liquid__header">Ликвидность</div>
            <div class="liquid__drop dropdown"><input class="liquid__input" type="text" readonly value="Ликвидные">


                <div class="dropdown__button">&#9660;</div>
            </div>
        </div>
        <div class="quantity">
            <div class="quantity__header">
                Значимость от, %
            </div>
            <div class="quantity__inputcontainer">

            </div>
        </div>

        <div class="firstsale">

            <div class="firstsale__header">
                Первые продажи
            </div>
            <div class="firstsale__datacontainer">
                <div class="firstsale__activation">
                    <input class="firstsale__checkbox" type="checkbox" placeholder="0" value="0">
                    <div class="firstsale__text">только первые </div>
                </div>
                <div class="firstsale__days">
                    <input class="firstsale__input" type="text" value="7">
                    <div class="firstsale__text"> дней </div>
                </div>
            </div>
        </div>
        <div></div>
        <div class="searchbutton">Поиск</div>
    </div>
 

    <div class="actionsbar" id="actionsbar">
        <div class="pagination">

        </div>
        <div>
            <input type="text" class="searchcontainer__input" placeholder="Например: Линейка металлическая" />
        </div>
        <div class="tasks">
            <div class="tasks__tittle" id="taskbutton"> &#128736;&nbsp;<span class="separator">|</span>&nbsp;Задачи</div>
            <div class="tasks__actions"></div>
        </div>
    </div>

    <?php }
    else {
    
    ?>
 <div class="topheader">
        
     <?php echo $_GET['header']; ?>
        
    </div>

<?php }?>





    <div class="overpricecontainer" id="overpricecontainer"></div>





</body>

</html>