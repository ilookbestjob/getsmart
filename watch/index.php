<?php if ($_GET['json']!='true'){?><html>

<link rel="stylesheet" type="text/css" href="css/style.css" />
<body>


<?php }?>
    <?php
    require_once "watch_class.php";

    $Nomdata = new Watch((isset($_GET['ids']) ? $_GET['ids'] : "0"),(isset($_GET['price']) ? $_GET['price'] : []),(isset($_GET['cost']) ? $_GET['cost'] : []));
    
    
    if ($_GET['json']=='true'){
        echo $Nomdata->buildJSON();
    }
    else{echo $Nomdata->build1CData();}
    



    ?>

<?php if ($_GET['json']!='true'){?><html>
</body>

</html>
<?php }?>