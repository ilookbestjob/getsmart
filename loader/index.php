<html>

<head></head>
<link rel="stylesheet" type="text/css" href="css/style.css" />
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="js/loader.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jstat@latest/dist/jstat.min.js"></script>





<body>
    <div class="topheader">
        <div class="control">
            <div class="control__header">Дни недели</div>
            <div class="control__input">
                <div class="select" id="dayselect">Ежедневно</div>
            </div>
        </div>

        <div class="control">
            <div class="control__header">Время</div>
            <div class="control__input">
                <div class="slider">
                    <div class="sliderbar sliderbarselected " id="sliderleft">каждые</div>
                    <div class="sliderbar" id="sliderright">ровно в </div>
                </div>


            </div>
        </div>

        <div class="control">
            <div class="control__header">Часов</div>
            <div class="control__input">

                <input type="text" value="00" class="select_small" id="hour" />
            </div>
        </div>


        <div class="control">
            <div class="control__header">Минут</div>
            <div class="control__input">
                <input type="text" value="00" class="select_small" id="minute" />
            </div>
        </div>

        <div class="info ">
            <div class="lasttime">
                <div class="lasttimeheader">Последнее обновление</div>
                <div class="lasttimedata">29 янв 2021 18:00</div>
            </div>

            <div class="spenttime">
                <div class="spentimeheader">Прошло</div>
                <div class="spenttimedata">4ч</div>
            </div>
        </div>


    </div>




    <div class="dayselector">
        <div class="daytext">


        </div>

        <div class="day" id="d1"><input type="checkbox" class="check" name="1" id="1" data="Пн">Понедельник</div>
        <div class="day" id="d2"><input type="checkbox" class="check" name="2" id="2" data="Вт">Вторник</div>
        <div class="day" id="d3"><input type="checkbox" class="check" name="3" id="3" data="Ср">Среда</div>
        <div class="day" id="d4"><input type="checkbox" class="check" name="4" id="4" data="Чт">Четверг</div>
        <div class="day" id="d5"><input type="checkbox" class="check" name="5" id="5" data="Пт">Пятница</div>
        <div class="day" id="d6"><input type="checkbox" class="check" name="6" id="6" data="Сб">Суббота</div>
        <div class="day" id="d7"><input type="checkbox" class="check" name="7" id="7" data="Вс">Воскресенье</div>

        <div class="daybutton">Подтвердить</div>
    </div>

    <div class="progresswindow">

        <div class="progresswindow__header">Загрузка данных регрессий</div>


        <div class="progresswindow__data">





        </div>
        <div class="status"></div>

    </div>







</body>

</html>