<html>
<header>
    <link rel="stylesheet" href="css/style.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <script src="js/mistake.js"></script>
</header>

<body>
    <div class="mistakewindow">
        <div class="header"><?php
                            echo (isset($_GET['header']) ? $_GET['header'] : "Документ неопределен")

                            ?>
        </div>

        <div class="content">

            <div class="leftside">
                <?php

                if (isset($_GET['names'])) {


                    echo '<div class="productsheader"><div class="nameheader">Наименование</div><div class="priceheader">Цена</div>
                    <div class="avapriceheader">Цена Ава</div></div>';
                    foreach ($_GET['names'] as $index => $item) {

                        echo '<div class="products ' . ($index % 2 == 1 ? "even" : "") . '' .($index  == 0 ? "selected" : "") .  '" id="'.$index.'"><div class="name">' . $item . '</div><div class="price">' . $_GET['price'][$index] . ' </div>
                            <div class="avaprice">' . $_GET['avaprice'][$index] . '</div><input class="hiddenid" type="hidden" value="'.$_GET['ids'][$index].'"/></div>';
                    }
                }


                ?>




            </div>


            <div class="rightside">

                <div class="checksection">


                </div>

            </div>

        </div>
        <div class="textsection">Коментарий<textarea class="comment" name="" id="" cols="30" rows="10"></textarea></div>

        <div class="footer">
            <div class="buttonok">отправить</div>
        </div>



    </div>

</body>


</html>