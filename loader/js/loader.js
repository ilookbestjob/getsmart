let Nom;
let NomInsession = 10
let timer
let timeout = 10
let globalindex = 0
let position = 0
let quantity = 0



/////////////статистика обработки данных
let done = 0
let added = 0
let notadded = 0

/////////////отправка на backend
let sendinfo = []
let sendcounter = 0
let sendvolume = 100
let sendatempt = 0
let globalgroupping = false

///////////Вывод результата
let resultcounter = 0

///////////Количество регрессий
let totalregressions = 2
let currentregression = 1



let updatedays = [1, 2, 3, 4, 5, 6, 7];
let repeataction = 0;
let pnow = new Date()
let pday = pnow.getDay();
let phour = pnow.getHours();
let pminute = pnow.getMinutes();
let lastdate = new Date();



$(function () {
    getCoockies()
    setUpDate()
    setInterval("load()", 1000)
    /*  $(".progresswindow__header").html("Загрузка регрессий")
  
      buildWait(".progresswindow__header", 15)
  
      $(".progresswindow__header").append("   " + currentregression + " из " + totalregressions)
  
      getNomData().then(async function () {
  
          $(".progresswindow__header").html("Загрузка регрессий")
          buildWait(".progresswindow__header", 15)
          currentregression++
          $(".progresswindow__header").append("   " + currentregression + " из " + totalregressions)
  
  
          position = 0
          sendcounter = 0
          sendinfo = []
          sendatempt = 0
          await getNomData(true)
          $(".progresswindow__header").html("Регресии добавлены")
          window.close();
      })
  
  */

    load()

    $(".day").click(function () {

        $(this).children(".check").prop('checked', !($(this).children(".check").is(':checked')))
        $(".daytext").html(makeDays());
        return false;


    })


    $(".daybutton").click(function () {
        $("#dayselect").html(makeDays)
        $(".dayselector").fadeOut(1000);


    })

    $("#dayselect").click(function () {
        $(".dayselector").fadeIn(500);
        $(".dayselector").css("position", "fixed")
        $(".dayselector").css("left", $("#dayselect").offset().left + "px")
        $(".dayselector").css("top", ($("#dayselect").offset().top + 34) + "px")
    })

    $("#sliderleft").click(function () {
        repeataction = 0;
        $("#sliderleft").addClass("sliderbarselected");
        $("#sliderright").removeClass("sliderbarselected");
    })


    $("#sliderright").click(function () {
        repeataction = 1;
        $("#sliderleft").removeClass("sliderbarselected");
        $("#sliderright").addClass("sliderbarselected");

    })


})


let makeDays = () => {
    let days = '';
    updatedays = [];
    $(".day").each(function (item, index) {


        days = days + ($(this).children(".check").is(':checked') ? (days == "" ? "" : ",") + $(this).children(".check").attr("data") : "")
        if ($(this).children(".check").is(':checked')) { updatedays.push($(this).children(".check").attr("id")) }

    })


    if (days == "Пн,Вт,Ср,Чт,Пт,Сб,Вс") days = "Ежедневно"
    if (days == "") days = "Никогда"
    return days;
}



let getNomData = async (groupping = false) => {

    done = 0
    added = 0
    notadded = 0


    globalgroupping = groupping

    await fetch("actions.php?action=getnom&groupping=" + groupping).then(res => res.json()).then(res => {


        Nom = res
        $("#total").html(Nom.length)
        // timer = setInterval("buildData(NomInsession)", timeout);
        while (r = buildData(NomInsession)) {


            $("#done").html("0/" + done)
            $("#succeed").html("0/" + added)
            $("#failed").html("0/" + notadded)

        }
        showResult(".progresswindow__data")
        updateResult(resultcounter, { done, succeed: added, failed: notadded, total: Nom.length, header: (groupping ? "По группам товаров" : "По товарам") })

    })

    await sendData(sendvolume)
    return new Promise(function (resolve, reject) {
        resolve("ok")
    })
}




const buildData = (count) => {

    quantity = 0

    while (quantity < count) {


        let r = buildRegression(Nom, 10)

        if (r.err == "") {
            if (r.regression.k * 1 < 0) {
                added++

                console.log(r)
                sendinfo.push(r)
            }
            else {
                notadded++
            }
            done = done + r.done;

            quantity++
        }

        else {
            console.log(r.err)

            return false

            // clearInterval(timer)
        }




    }

    return true
}




const buildRegression = (itemsArray, step) => {




    if (position < itemsArray.length) {
        localposition = position
        let Name = itemsArray[position].name
        let Group = itemsArray[position].folder
        let id = itemsArray[position].id
        let succeedsum = 0
        let failedsum = 0
        let currentstep = 0
        let first = true

        let failpart = ''
        let suceedpart = ''
        let failedtip = ""
        let succeedtip = ""
        let data = [];
        let Xtrain = [];
        let Ytrain = [];


        let succeedposweight = 0
        let failedposweight = 0

        suceedprices = []
        failedprices = []

        while ((position < itemsArray.length) && (Name == itemsArray[position].name) && (Group == itemsArray[position].folder)) {
            itemsArray[position].name

            if (first) {
                first = false;
                currentstep = (itemsArray[position].percent * 1 - itemsArray[position].percent % step) / step
            }

            if (position + 1 < itemsArray.length) {
                if (currentstep < (itemsArray[position + 1].percent * 1 - itemsArray[position + 1].percent % step) / step) {

                    failpart = ''
                    suceedpart = ''


                    if (itemsArray[position].result * 1 == 1) {

                        succeedsum = succeedsum * 1 + 1
                        succeedposweight = succeedposweight + itemsArray[position].posweight * 1

                        //  addsuceedPrice(itemsArray[position].typeprice)

                    }
                    else {
                        failedsum = failedsum * 1 + 1
                        failedposweight = failedposweight + itemsArray[position].posweight * 1
                        //addfailedPrice(itemsArray[position].typeprice);

                    }



                    //data.push([currentstep * step, succeedsum / (failedsum + succeedsum) * 100])
                    //pushPoints(suceedprices, failedprices, currentstep * step)
                    {

                        Xtrain.push(currentstep * step)
                        Ytrain.push(succeedsum / (failedsum + succeedsum) * 100);
                    }

                    currentstep = (itemsArray[position + 1].percent * 1 - itemsArray[position + 1].percent % step) / step
                    succeedsum = 0
                    failedsum = 0

                    failedposweight = 0
                    succeedposweight = 0
                    suceedprices = []
                    failedprices = []

                    failedtip = ""
                    succeedtip = ""
                }
                else {
                    if (itemsArray[position].result * 1 == 1) {
                        succeedsum = succeedsum * 1 + 1
                        succeedposweight = succeedposweight + itemsArray[position].posweight * 1
                        //  addsuceedPrice(itemsArray[position].typeprice);
                    }
                    else {
                        failedsum = failedsum * 1 + 1// itemsArray[position].quantity * 1
                        failedposweight = failedposweight + itemsArray[position].posweight * 1
                        //addfailedPrice(itemsArray[position].typeprice);
                    }
                }


            }
            position++

        }



        failpart = ''
        suceedpart = ''

        ///////////////////////////////////////
        currentstep = (itemsArray[position - 1].percent * 1 - itemsArray[position - 1].percent % step) / step

        ///////////////////////////////////////


        //data.push([currentstep * step, succeedsum / (failedsum + succeedsum) * 100])
        //pushPoints(suceedprices, failedprices, currentstep * step)



        {

            Xtrain.push(currentstep * step)
            Ytrain.push(succeedsum / (failedsum + succeedsum) * 100);
        }


        return { regression: regressionCoef(Ytrain, Xtrain), name: Name, folder: Group, done: (position - localposition), id: id, err: "" }
    }
    else {
        return { err: "Достигнут предел данных" }
    }

}


const sendData = async (fsendvolume) => {
    let lsendvolume = fsendvolume



    let GetData = prepareSenddata(fsendvolume)

    sendatempt++
    if (GetData.ids != "") {
        await fetch("actions.php?action=addnomregression&atempt=" + sendatempt + "&ids=" + GetData.ids + "&k=" + GetData.k + "&b=" + GetData.b + "&groupping=" + globalgroupping).then(async function () {


            console.log("Отправлено: " + GetData.count)
            await sendData(lsendvolume)
        })




    }


    return new Promise(function (resolve, reject) {
        resolve("777")
    })


}


const prepareSenddata = (fsendvolume) => {
    let lcounter = 0
    let ids = ""
    let k = ""
    let b = ""
    while ((lcounter < fsendvolume) && (sendcounter < sendinfo.length)) {

        ids = ids + (ids == "" ? "" : ",") + sendinfo[sendcounter].id
        k = k + (k == "" ? "" : ",") + sendinfo[sendcounter].regression.k
        b = b + (b == "" ? "" : ",") + sendinfo[sendcounter].regression.b

        sendcounter++
        lcounter++
    }
    return { ids: ids, k: k, b: b, count: lcounter }

}



const regressionCoef = (arrWeight, arrHeight) => {

    let r, sy, sx, b, a, meanX, meanY;
    r = jStat.corrcoeff(arrHeight, arrWeight);
    sy = jStat.stdev(arrWeight);
    sx = jStat.stdev(arrHeight);
    meanY = jStat(arrWeight).mean();
    meanX = jStat(arrHeight).mean();
    b = r * (sy / sx);
    a = meanY - meanX * b;

    return { k: b, b: a }
}



const showResult = (obj, data = null) => {
    resultcounter++
    $(obj).append(`   
<div class="statistics" id="statistics`+ resultcounter + `" style="margin-left:200px;opacity:0">
<div class="statistics__header" id="statistics__header`+ resultcounter + `">` + (data != null ? data.header : "Заголовок") + `</div>
<div class="total">
    <div class="header">Всего данных</div>
    <div class="data" id="total`+ resultcounter + `">` + (data != null ? data.total : "0") + `</div>
</div>
<div class="done">
    <div class="header">Обработано данных</div>
    <div class="data" id="done`+ resultcounter + `">` + (data != null ? data.done : "0") + `</div>
</div>
<div class="suceed">
    <div class="header">Добавлено товаров</div>
    <div class="data" id="succeed`+ resultcounter + `">` + (data != null ? data.succeed : "0") + `</div>
</div>
<div class="failed">
    <div class="header">Не добавлено товаров</div>
    <div class="data" id="failed`+ resultcounter + `">` + (data != null ? data.failed : "0") + `</div>
</div>

</div>
`);

    $("#statistics" + resultcounter).animate({ "margin-left": "0px", "opacity": "1" }, 1000)

}


const updateResult = (id, data = null) => {
    $("#statistics__header" + id).html((data != null ? data.header : "Заголовок"))


    $("#total" + id).html((data != null ? data.total : "0"))
    $("#done" + id).html((data != null ? data.done : "0"))
    $("#succeed" + id).html((data != null ? data.succeed : "0"))
    $("#failed" + id).html((data != null ? data.failed : "0"))




}



const clearResult = (obj) => {
    $(obj, data = null).html("");

}


let buildWait = (obj, size) => {
    waiting = true;
    $(obj).html("<div class='wait'><div class='wait__spinner' style='width:" + size + "px;height:" + size + "px'></div></div>" + $(obj).html())

}

let checkUpdatetime = () => {

    let now = new Date()
    let day = now.getDay();
    let hour = now.getHours();
    let minute = now.getMinutes();

    if ((pday != day) || (phour != hour) || (pminute != minute)) {

        debugger

        pday = day
        phour = hour
        pminute = minute
        if (updatedays.findIndex(item => { return item == day }) !== -1) {
            switch (repeataction) {

                case 0:
                    if (($("#hour").val() * 60 + $("#minute").val() * 1) != 0) {
                        return (1440 % ($("#hour").val() * 60 + $("#minute").val() * 1) == 0 ? true : false)
                    }
                    else return false;
                    break;
                case 1:

                    return ((($("#hour").val() * 1 == hour) && ($("#minute").val() * 1 == minute)) ? true : false)
                    break;
            }

        }
        else {
            return false;

        }



    }
    else return false





}


let load = () => {

    $(".spenttimedata").html(prepareSpenttime(new Date() - lastdate))
    if (checkUpdatetime()) {

        lastdate = new Date();
        $(".progresswindow__header").html("Загрузка регрессий")

        buildWait(".progresswindow__header", 15)

        $(".progresswindow__header").append("   " + currentregression + " из " + totalregressions)

        getNomData().then(async function () {

            $(".progresswindow__header").html("Загрузка регрессий")
            buildWait(".progresswindow__header", 15)
            currentregression++
            $(".progresswindow__header").append("   " + currentregression + " из " + totalregressions)


            position = 0
            sendcounter = 0
            sendinfo = []
            sendatempt = 0
            await getNomData(true)
            await setUpDate()
            $(".progresswindow__header").html("Регресии добавлены")
            window.close();
        })
    }
}

let setUpDate = () => {
    now = new Date();
    let fDate = now.getDate();
    let fMonth = now.getMonth();
    let fYear = now.getFullYear();
    let fHour = now.getHours();
    let fMinute = now.getMinutes();

    $(".lasttimedata").html(fDate + " " +

        (new Array(
            "января",
            "февраля",
            "марта",
            "апреля",
            "мая",
            "июня",
            "июля",
            "августа",
            "сентября",
            "октября",
            "ноября",
            "декабря")
        [fMonth])


        + " " + fYear + " " + fHour + ":" + fMinute);

}

let getCoockies = () => {

    let cookie = document.cookie.split(';')

    updatedays = (
        typeof cookie.find(item => item.split('=')[0] == "days") == "undefined" ?
            [1, 2, 3, 4, 5, 6, 7]
            :
            cookie.find(item => item.split('=')[0] == "days").split("=")[1].split(",")
    )



    repeataction =
        (
            typeof cookie.find(item => item.split('=')[0] == "repeataction") == "undefined" ?
                0
                :
                cookie.find(item => item.split('=')[0] == "repeataction").split("=")[1]
        )

    let hour =
        (typeof cookie.find(item => item.split('=')[0] == "hour") == "undefined" ?
            0
            :
            cookie.find(item => item.split('=')[0] == "hour").split("=")[1]
        )


    let minute =
        (typeof cookie.find(item => item.split('=')[0] == "minute") == "undefined" ?
            5
            :
            cookie.find(item => item.split('=')[0] == "minute").split("=")[1]
        )

    //  $(".select").html(makeDays())
    $("#hour").val(hour)
    $("#minute").val(minute)

}


let saveCoockies = () => {




}



let prepareSpenttime = (time) => {

    if (time / 1000 < 60) {
        return Math.round(time / 1000)+" сек."
    }
    else {

        if (time / 60000 < 60) {
            return Math.round(time / 1000)+" мин."
        }
        else {
    
    
        }

    }





}