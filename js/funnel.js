

let yearstart = new Date().getFullYear()
let yearend = new Date().getFullYear()

let infoyearstart = new Date().getFullYear()
let infoyearend = new Date().getFullYear()


let selid, selname

let sortType = "ASC"
let sortTableField = "data";
let sortFields = ["data", "percent", "percentrange", "result"]
let sortTableFields = ["Время", "Наценка", "Диапазон", "Результат"]
let total = 0
let optimizedpercent = 0
let maxmul = 0
let prop = 0
let mouseX = 0;
let mouseY = 0;
let mouseXprev = 0;
let mouseYprev = 0;
let interval = 0;
let movingID = -1;
let _currentStep = 0
let tolltipdisplayed = false
let globalcallback = null;
let posweight = "";
let totaltasks = 0
let lookingfor = 1;
let addingTask = false;
let taskdata = null
let taskaction = ""
let selectedtask = 0
let buildscroll = false


///////////////pagintion vars
let itemsperpage = 10
let startpage = 1
let endpage = 1
let pagespergoup = 5

let paginationstart, paginationend


//////////////////////////////


/////////////////tooltip//////
let suceedprices
let failedprices
let pricetypesdata = []





//////////////////////////////
let waiting = false

let mindquantity = true

let globalindex = 0
let globalcount = 0

let oddcolor = "#ffffff"
let evencolor = "#e9eaf0"

let NomIDS = null;

let request = "";


function copyToClipboard(str) {


    var area = document.createElement('textarea');

    document.body.appendChild(area);
    area.value = str;
    area.select();
    document.execCommand("copy");
    document.body.removeChild(area);
}



$(function () {
    debugger
    $(".overpricecontainer").html("")
    $(".overpricecontainer").css("display", "flex")
    $(".overpricecontainer").css("align-items", "center")
    $(".overpricecontainer").css("justify-content", "center")
    $(".overpricecontainer").css("height", (window.innerHeight-200)+"px")

    buildWait(".overpricecontainer", 50, "Обработка данных")

    //buildWait(".overpricecontainer", 50, "Тут ничего нет и не будет- это тест")

    getTasks()

    if (typeof getproductids != "undefined") {
        //debugger
        NomIDS = getproductids;
        buildallData2()
    }
    else {
        getNomIDS()

        buildSearchdate(new Date().getFullYear() - 2)

        buildSlider(".quantity__inputcontainer", 0, 100, null, 10, "", { valuestyle: "searchslider__value", callback: searchslidercallback, margintop: 5 })
        //prepareDiag()

    }
    $(".dropdown__button").click(function () {


        let pos = { left: $(".liquid__input").position().left, top: $(".liquid__input").position().top + 43, width: $(".liquid__input").width() + 38 }
        $(".liquiddrop__content").css(pos)
        $(".liquiddrop__content").fadeIn(1000)
    })



    $(".dropcontent").click(function () {

        $(".liquid__input").val($(this).html())
        $(".liquiddrop__content").fadeOut(1000)

    })




    $(".yearbutton").click(function () {
        console.log("prev", yearstart, yearend)
        $(this).parent().children(".yearbutton_selected").removeClass("yearbutton_selected").addClass("yearbutton")
        $(this).removeClass("yearbutton").addClass("yearbutton_selected")
        if ($(this).parent().attr("class") == "datestart") {

            yearstart = $(this).html()

        }
        if ($(this).parent().attr("class") == "dateend") {
            yearend = $(this).html()

        }
        console.log(yearstart, yearend)
    })

    $(".searchbutton").click(function () {

        //  prepareDiag(yearstart, yearend, $(".liquid__input").val(), $(".quantity__input").val(), $(".searchcontainer__input").val(), $(".groupping__input").prop('checked'), posweight)
        globalindex = 0
        waiting = true;

        $(".overpricecontainer").html("")
        $(".overpricecontainer").css("display", "flex")
        $(".overpricecontainer").css("align-items", "center")
        $(".overpricecontainer").css("justify-content", "center")
        $(".overpricecontainer").css("height", "calc(100% - 100px)")
        buildWait(".overpricecontainer", 50, "Поиск данных")

        getNomIDS(yearstart, yearend, $(".liquid__input").val(), $(".quantity__input").val(), $(".searchcontainer__input").val(), $(".groupping__input").prop('checked'), posweight, $(".firstsale__checkbox").is(":checked"), $(".firstsale__input").val())

    })

    $("html").mousemove(function (pos) {



        mouseX = pos.pageX;
        mouseY = pos.pageY;


    });

    $("html").click(function (pos) {



        mouseX = pos.pageX;
        mouseY = pos.pageY;
        let p1 = pos.target.id.substr(0, 2)

        /*
            if ((pos.target.id.substr(0, 2) != 'f_') && (pos.target.id.substr(0, 2) != 's_')) {
                $("#tooltip").fadeOut()
                tolltipdisplayed = false
    
            }
    */

    });


    $("html").mouseup(function () {
        if (interval != 0) {

            clearInterval(interval)
            interval = 0
            if (globalcallback) { globalcallback(movingID) } else {
                rebuildDiag(movingID, _currentStep)
            }

        }


    })
    /*
        $(".overpricecontainer").scroll(function () {
    
            $("#tooltip").fadeOut()
    
            let t = document.querySelector('.overpricecontainer').scrollHeight - $(".overpricecontainer").innerHeight()
            let t3 = $(".overpricecontainer").scrollTop() - 50
            console.log(t)
            console.log(t3)
            if (document.querySelector('.overpricecontainer').scrollHeight - $(".overpricecontainer").innerHeight() <= ($(".overpricecontainer").scrollTop() + 50)) {
              
    
                if (!buildscroll) {
                    buildDatanew(globalindex, itemsperpage, request)
    
    
                    endpage++
    
    
    
                    buildpagination(paginationstart, paginationend, pagespergoup)
                    buildscroll = true
                }
            }
        })
    
    */
    $("#taskbutton").click(function () {
        taskaction == ""
        getTasks()
        $(".taskswindow ").fadeIn()
    })



    $(".taskswindow__close").click(function () {

        $(".taskswindow ").fadeOut()

        $(".overpricecontainer").html("")


        globalcount = 0;
        buildData(globalindex, 10)


    })


    $(".taskwindow__add").click(function () {
        taskaction = "addtask"
        newTask()
    })

    $(".taskwindow__del").click(function () {
        taskaction = "deltask"
        delDBTask()
    })

    $(".searchbar").mousemove(function (r) { console.log(r.pageX, r.pageY) })

})



///////////////////////////////////////////////////////////
let buildWait = function (obj, size, text) {
    waiting = true;
    $(obj).append("<div class='wait'><div class='wait__spinner' style='width:" + size + "px;height:" + size + "px'></div><div class='wait__text'>" + text + "</div></div>")

}

let buildSearchdate = function (start) {
    $(".datestart").html('<div class="yearheader">Начало периода</div>')
    $(".dateend").html('<div class="yearheader">Конецпериода</div>')
    for (t = start; t <= new Date().getFullYear(); t++) {
        $(".datestart").append('<div class="' + (t == yearstart ? "yearbutton_selected" : "yearbutton") + '">' + t + '</div>')
        $(".dateend").append('<div class="' + (t == yearend ? "yearbutton_selected" : "yearbutton") + '">' + t + '</div>')
    }

}


let getNomIDS = (startYear = "", endYear = "", liquid = '', quantity = "", productname = "", groupping = "", minweight = "", firstsale = "", firstsaledays = "") => {


    let requestvars = ""
    requestvars = requestvars + "&" + (startYear !== "" ? "startYear=" + startYear : "")
    if (requestvars == "&") { requestvars = '' }
    requestvars = requestvars + "&" + (endYear !== "" ? "endYear=" + endYear : "")
    if (requestvars == "&") { requestvars = '' }
    requestvars = requestvars + "&" + (liquid !== "" ? "liquid=" + liquid : "")
    if (requestvars == "&") { requestvars = '' }
    requestvars = requestvars + "&" + (quantity !== "" ? "quantity=" + quantity : "")
    if (requestvars == "&") { requestvars = '' }
    requestvars = requestvars + "&" + (productname !== "" ? "productname=" + productname : "")
    if (requestvars == "&") { requestvars = '' }
    requestvars = requestvars + "&" + (groupping !== "" ? "groupping=" + groupping : "")
    if (requestvars == "&") { requestvars = '' }
    requestvars = requestvars + "&" + (minweight !== "" ? "minweight=" + minweight : "")

    if (requestvars == "&") { requestvars = '' }
    requestvars = requestvars + "&" + (firstsale !== "" ? "firstsale=" + firstsale : "")

    if (requestvars == "&") { requestvars = '' }
    requestvars = requestvars + "&" + (firstsaledays !== "" ? "firstsaledays=" + firstsaledays : "")

    if (requestvars == "&") { requestvars = '' }
    else { requestvars = '&' + requestvars }


    request = requestvars;


    fetch("actions.php?action=getNomIDS" + requestvars).then(res => res.json()).then(res => {

        paginationstart = 1
        paginationend = Math.round(res.length / itemsperpage) + (res.length % itemsperpage == 0 ? 0 : 1)

        buildpagination(1, Math.round(res.length / itemsperpage) + (res.length % itemsperpage == 0 ? 0 : 1), pagespergoup)
        NomIDS = res
        $(".overpricecontainer").html("")
        buildDatanew(globalindex, itemsperpage, requestvars)
    })
        , err => { console.log(err) }

}


const expandSales = (id, Nname, startYear = "", endYear = "", liquid = '', quantity = "", productn = "", sortfield = "data", sorttype = "ASC") => {
    selid = id
    selname = Nname





    $("#info" + id).html('');
    $("#info" + id).fadeIn();
    buildWait("#info" + id, 50, "Обработка данных")
    $("#info" + id).css("align-items", "center")
    $("#info" + id).css("justify-content", "center")

    let requestvars = ""
    requestvars = requestvars + "&" + (startYear !== "" ? "startYear=" + startYear : "")
    if (requestvars == "&") { requestvars = '' }
    requestvars = requestvars + "&" + (endYear !== "" ? "endYear=" + endYear : "")
    if (requestvars == "&") { requestvars = '' }
    requestvars = requestvars + "&" + (liquid !== "" ? "liquid=" + liquid : "")
    if (requestvars == "&") { requestvars = '' }
    requestvars = requestvars + "&" + (quantity !== "" ? "quantity=" + quantity : "")
    if (requestvars == "&") { requestvars = '' }
    requestvars = requestvars + "&" + (productn !== "" ? "productname=" + productn : "")
    if (requestvars == "&") { requestvars = '' }
    requestvars = requestvars + "&" + (sortfield !== "" ? "sortfield=" + sortfield : "")
    if (requestvars == "&") { requestvars = '' }
    requestvars = requestvars + "&" + (sorttype !== "" ? "sorttype=" + sorttype : "")
    if (requestvars == "&") { requestvars = '' }
    else { requestvars = '&' + requestvars }
    console.log(requestvars)

    fetch("actions.php?action=getSaleDetails&productname=" + Nname + requestvars).then(res => res.json()).then(res => {

        $("#info" + id).css("justify-content", "flex-start")
        $("#info" + id).html("")
        $("#info" + id).append('<div class="info__header" id="' + id + '" data-value="' + Nname + '"><div class="header__text">Время</div><div class="header__arrow">' + (sortfield == "data" ? (sorttype == "ASC" ? " &uarr;" : " &darr;") : "") + '</div></div><div class="info__header" id="' + id + '" data-value="' + Nname + '"><div class="header__text">Номер</div></div><div class="info__header"><img src=\"copy.png\" height=\"20px\" ></div><div class="info__header id="' + id + '" data-value="' + Nname + '"><div class="header__text">Наценка</div><div class="header__arrow">' + (sortfield == "percent" ? (sorttype == "ASC" ? " &uarr;" : " &darr;") : "") + '</div></div><div class="info__header" id="' + id + '" data-value="' + Nname + '"><div class="header__text">Диапазон</div><div class="header__arrow">' + (sortfield == "percentrange" ? (sorttype == "ASC" ? " &uarr;" : " &darr;") : "") + '</div></div></div><div class="info__header" id="' + id + '" data-value="' + Nname + '"><div class="header__text">Результат</div><div class="header__arrow">' + (sortfield == "result" ? (sorttype == "ASC" ? " &uarr;" : " &darr;") : "") + '</div></div>');


        $(".info__header").click(function () {
            console.log("OK")

            let hdr = $(this).children(".header__text").html()
            let lid = $(this).attr("id")
            let lname = $(this).attr("data-value")

            if (sortTableFields.findIndex(item => hdr == item) != -1) {
                if (sortFields[sortTableFields.findIndex(item => hdr == item)] == sortTableField) {
                    if (sortType == "ASC") {
                        sortType = "DESC"
                    }
                    else {
                        sortType = "ASC"
                    }

                }
                else {
                    sortTableField = sortFields[sortTableFields.findIndex(item => hdr == item)]
                }

            }
            expandSales(lid, lname, infoyearstart, infoyearend, "", "", "", sortTableField, sortType)

        })



        res.forEach((element, index, arr) => {
            $("#info" + id).append('<div>' + element.data + '</div><div class="docno">' + element.docnumber + '</div><div>&nbsp;<img src=\"copy.png\" height=\"20px\" onclick="copyToClipboard(\'' + element.docnumber + '\')"></div><div>' + Math.round(element.percent) + '</div><div>' + Math.round(element.percentrange) + '</div><div>' + (element.result == 1 ? "<div style='color:forestgreen;display:inline-block;font-size:18px;'>&#10004;</div>Успешно" : "<div style='color:red;display:inline-block;font-size:18px;'>&#10006;</div>Неуспешно") + '</div>');

        })

        $(".docno").click(function () {
            w = window.open("getsmart://" + $(this).html())
            w.close()
        })
    })






}

const buildScale = (width = 180, height = 20) => {

    let grid = ''

    let span = 100

    let blockstep = width / span * 10
    let margin = 70;

    //grid = grid + "<div style=\"font-size:14px;position:absolute;top:" + (20 + margin) + "px;padding:0;height:20px;left:-160px;\" >Неудачных счетов</div><div style=\"font-size:14px;position:absolute;top:" + (40 + margin) + "px;padding:0;height:20px;left:-160px\" >Удачных счетов</div><div style=\"font-size:14px;position:absolute;top:" + (70 + margin) + "px;padding:0;height:20px;left:-160px\" >Вероятность в интервале,% </div><div style=\"font-size:14px;position:absolute;top:" + (90 + margin) + "px;padding:0;height:20px;left:-160px\" >Вероятность интервала,% </div><div style=\"font-size:16px;position:absolute;top:" + (140 + margin) + "px;padding:0;height:20px;left:-160px\" ></div>"


    for (t = 0; t <= span / 10; t++) {





        grid = grid + (t % 5 == 0 ? "<div style=\"opacity:0.4;font-size:14px;position:absolute;top:" + (0 + margin) + "px;padding:0;height:20px;left:" + (blockstep * t) + "px;width:" + blockstep + "px;\" >" + ((t) * 10) + "</div>" : "") + "<div style=\"opacity:0.4;font-size:14px;position:absolute;border:solid #01395e 1px;top:" + (20 + margin) + "px;padding:0;height:20px;left:" + (t == 0 ? blockstep * t : blockstep * t) + "px;width:" + blockstep + "px;" + (t < span / 10 ? "border-right:none" : "") + ";background-color:#FFA07A\" ></div><div style=\"opacity:0.4;font-size:14px;position:absolute;border:solid #01395e 1px;top:" + (40 + margin) + "px;padding:0;height:20px;left:" + (t == 0 ? blockstep * t : blockstep * t) + "px;width:" + blockstep + "px;" + (t < span / 10 ? "border-right:none" : "") + ";border-top:none;background-color:#98FB98\" ></div>";
    }
    return grid


}

const buildDiag = (name, range, succeed, failed, width, id) => {

    let span = 200
    let spanvalue = width / span
    let blockstep = width / span * 10
    let margin = 10;

    failcolor = makegradient("#FFD700", "#ff0000", 0, 15, failed)
    succeedcolor = makegradient("#FFD700", "#228B22", 0, 15, succeed)

    let failpart = ''
    let suceedpart = ''
    if (failed != 0) {
        failpart = "<div style=\"display:flex;justify-content:center;font-size:14px;position:absolute;background-color:" + failcolor + ";top:" + (20 + margin) + "px;padding:0;height:20px;left:" + blockstep * range + "px;width:" + blockstep + "px\" data-name=" + name + "  data-range=" + range + " data-value=" + failed + ">" + failed + "</div>";
    }

    if (succeed != 0) { suceedpart = "<div style=\"display:flex;justify-content:center;font-size:14px;position:absolute;background-color:" + succeedcolor + ";padding:0;top:" + (40 + margin) + "px;height:20px;left:" + blockstep * range + "px;width:" + blockstep + "px\" data-name=" + name + "  data-range=" + range + " data-value=" + succeed + ">" + succeed + "</div>"; }
    info = "";

    let probability = '';
    let density = '';
    let benchmark = '';

    if (succeed != 0) {

        probability = "<div style=\"display:flex;justify-content:center;font-size:14px;position:absolute;padding:0;top:" + (70 + margin) + "px;height:20px;left:" + blockstep * range + "px;width:" + blockstep + "px\" data-name=" + name + "  data-range=" + range + " data-value=" + succeed + ">" + Math.round((succeed * 1 / (succeed * 1 + failed * 1)) * 100) + "</div>";

        density = "<div style=\"display:flex;justify-content:center;font-size:14px;position:absolute;padding:0;top:" + (90 + margin) + "px;height:20px;left:" + blockstep * range + "px;width:" + blockstep + "px\" data-name=" + name + "  data-range=" + range + " data-value=" + succeed + ">" + Math.round(((succeed * 1 + failed * 0) / total) * 100) + "</div>";

        //benchmark = "<div style=\"display:flex;justify-content:center;font-size:14px;position:absolute;padding:0;top:" + (110 + margin) + "px;height:20px;left:" + blockstep * range + "px;width:" + blockstep + "px\" data-name=" + name + "  data-range=" + range + " data-value=" + succeed + ">" + Math.round(((succeed * 1 + failed * 0) / total) * ((succeed * 1 / (succeed * 1 + failed * 1))) * 100) + "</div>";

        if (maxmul <= Math.round(((succeed * 1 + failed * 0) / total) * ((succeed * 1 / (succeed * 1 + failed * 1))) * 100)) {
            maxmul = Math.round(((succeed * 1 + failed * 0) / total) * ((succeed * 1 / (succeed * 1 + failed * 1))) * 100)
            prop = Math.round((succeed * 1 / (succeed * 1 + failed * 1)) * 100)
            optimizedpercent = range
        }

    }


    if ((succeed >= $(".quantity__input").val() * 1) || (failed >= $(".quantity__input").val() * 1)) return failpart + suceedpart + probability + density + benchmark

    else return ""

}

const getSum = (itemsArray, start) => {
    let Name = itemsArray[start].name
    let Group = itemsArray[start].folder
    let position = start
    let sum = 0

    while ((position < itemsArray.length) && (Name == itemsArray[position].name) && (Group == itemsArray[position].folder)) {
        sum = sum + 1

        //itemsArray[position].quantity * 1

        position++

    }

    return sum

}


const prepareDiag = (startYear = "", endYear = "", liquid = '', quantity = "", productname = "", groupping = "", minweight = "") => {
    let t = 0;
    let oddcolor = "#ffffff"
    let evencolor = "#e9eaf0"
    let header = false;
    let succeed, failed;
    $(".overpricecontainer").html("")
    $(".overpricecontainer").css("display", "flex")
    $(".overpricecontainer").css("align-items", "center")
    $(".overpricecontainer").css("justify-content", "center")
    $(".overpricecontainer").css("height", "calc(100% - 100px)")

    buildWait(".overpricecontainer", 50, "Обработка данных")
    let requestvars = ""
    requestvars = requestvars + "&" + (startYear !== "" ? "startYear=" + startYear : "")
    if (requestvars == "&") { requestvars = '' }
    requestvars = requestvars + "&" + (endYear !== "" ? "endYear=" + endYear : "")
    if (requestvars == "&") { requestvars = '' }
    requestvars = requestvars + "&" + (liquid !== "" ? "liquid=" + liquid : "")
    if (requestvars == "&") { requestvars = '' }
    requestvars = requestvars + "&" + (quantity !== "" ? "quantity=" + quantity : "")
    if (requestvars == "&") { requestvars = '' }
    requestvars = requestvars + "&" + (productname !== "" ? "productname=" + productname : "")
    if (requestvars == "&") { requestvars = '' }
    requestvars = requestvars + "&" + (groupping !== "" ? "groupping=" + groupping : "")
    if (requestvars == "&") { requestvars = '' }
    requestvars = requestvars + "&" + (minweight !== "" ? "minweight=" + minweight : "")

    if (requestvars == "&") { requestvars = '' }
    else { requestvars = '&' + requestvars }




    fetch("actions.php?action=getsalepercent" + requestvars).then(res => res.json()).then(res => {

        infoyearstart = yearstart
        infoyearstart = yearend
        $(".overpricecontainer").html("")
        $(".overpricecontainer").css("display", "grid")
        data = res


        buildData(globalcount, 10)

    })

}

const makegradient = (startcolor, endcolor, minvalue, maxvalue, value) => {


    Rstart = parseInt(startcolor.substr(1, 2), 16)
    Gstart = parseInt(startcolor.substr(3, 2), 16)
    Bstart = parseInt(startcolor.substr(5, 2), 16)


    Rend = parseInt(endcolor.substr(1, 2), 16)
    Gend = parseInt(endcolor.substr(3, 2), 16)
    Bend = parseInt(endcolor.substr(5, 2), 16)


    Rstep = (Rend - Rstart) / (maxvalue - minvalue)
    Gstep = (Gend - Gstart) / (maxvalue - minvalue)
    Bstep = (Bend - Bstart) / (maxvalue - minvalue)

    R = (Math.round(Rstart + Rstep * value)).toString(16)
    G = (Math.round(Gstart + Gstep * value)).toString(16)
    B = (Math.round(Bstart + Bstep * value)).toString(16)


    if (R.length == 1) { R = "0" + R }
    if (G.length == 1) { G = "0" + G }
    if (B.length == 1) { B = "0" + B }


    color = "#" + R + G + B

    if (maxvalue <= value) { color = endcolor }
    if (minvalue >= value) { color = startcolor }
    return color




}
const buildDetailsButton = (id = "", Nname = "") => {
    console.log("ttt" + Nname)
    let button = "<div id=\"" + id + "\" class=\"detailbutton\" data-value=\"" + Nname + "\" onClick=\"expandSales(" + id + "," + Nname + "," + yearstart + "," + yearend + ")\">&#9660;</div>"

    return button;
}

const buildSlider = (id, min = 0, max = 25, sticky = null, value = 10, header = '', params = { valuestyle: null, callback: null, margintop: null }) => {

    let placement
    let idd = '' + id;
    id = '' + id;
    if ((id.substr(0, 1) == ".") || (id.substr(0, 1) == "#")) {
        placement = id
        id = id.substr(1)
    }
    else {
        placement = "#diag" + id
    }

    $(placement).append('<div class="slider" ' + (params.margintop ? 'style="margin-top:' + params.margintop + 'px"' : "") + '>   <div class="slider__title"><strong>' + header + '</strong></div>    <div class="slider__titlemin">' + min + '</div> <div class="slider__titlemax" id="slider__titlemax' + id + '">' + max + '</div>    <div class="slider__bg" id="slider__bg' + id + '"></div>    <div class="slider__tag" id="slider__tag' + id + '"></div>    <div class="' + (params.valuestyle != null ? params.valuestyle : "slider__value") + '" id="slider__value' + id + '">0</div>  <div class="slider__text"></div>  </div>')



    if ((idd.substr(0, 1) == ".") || (idd.substr(0, 1) == "#")) {
        $("#slider__tag" + id).mousedown(function () {
            if (interval) {
                clearInterval(interval)
            }
            mouseXprev = 0
            mouseYprev = 0
            interval = setInterval("moveslider('" + id + "')", 100)
            movingID = id
            globalcallback = params.callback
            return false;


        })
    }
    else {
        $("#slider__tag" + id).mousedown(function () {
            if (interval) {
                clearInterval(interval)
            }
            mouseXprev = 0
            mouseYprev = 0
            interval = setInterval("moveslider(" + id + ")", 100)
            movingID = id * 1
            return false;

        })
    }




    let w = $("#slider__bg" + id).width()
    let r = (w / max) * value
    let o = $("#slider__tag" + id).offset().left
    let tt = "#slider__titlemax" + id
    $("#slider__titlemax" + id).offset({ left: $("#slider__bg" + id).offset().left + w })


    $("#slider__tag" + id).offset({ left: $("#slider__bg" + id).offset().left + r })

    $("#slider__value" + id).offset({ left: $("#slider__tag" + id).offset().left })

    $("#slider__value" + id).html(value + "%")

}

const moveslider = (id) => {

    console.log(mouseX)
    console.log(mouseX - mouseXprev)

    let css = $("#slider__bg" + id).offset().left
    //$("#slider__tag"+id).css({left:($("#slider__tag"+id).css("left")+(mouseX-mouseXprev))})
    if (($("#slider__tag" + id).offset().left + (mouseXprev == 0 ? 0 : (mouseX - mouseXprev)) >= $("#slider__bg" + id).offset().left) && ($("#slider__tag" + id).offset().left + (mouseXprev == 0 ? 0 : (mouseX - mouseXprev)) <= $("#slider__bg" + id).offset().left + $("#slider__bg" + id).width())) {
        $("#slider__tag" + id).offset({ left: ($("#slider__tag" + id).offset().left + (mouseXprev == 0 ? 0 : (mouseX - mouseXprev))) })
    }
    $("#slider__value" + id).offset({ left: $("#slider__tag" + id).offset().left })
    $("#slider__value" + id).html(Math.round(($("#slider__titlemax" + id).html() * 1 / $("#slider__bg" + id).width()) * ($("#slider__tag" + id).offset().left - $("#slider__bg" + id).offset().left)) + "%")
    _currentStep = Math.round(($("#slider__titlemax" + id).html() * 1 / $("#slider__bg" + id).width()) * ($("#slider__tag" + id).offset().left - $("#slider__bg" + id).offset().left)) * 1
    mouseXprev = mouseX
    mouseYprev = mouseY

}


const buildPrices = (prices, quantity = 1, name = "") => {


    return prices.map((price, index) => "<div class=\\'percent\\'><div>" + price.type + "</div ><div class=\\'percent_data\\'><div class=\\'percent_diag\\' style=\\'width:" + (((Math.round((price.price / quantity) * 10000) / 100))) + "%;background-color:forestgreen;height:6px\\'></div><div class=\\'percent_digits\\'>" + (Math.round((price.price / quantity) * 10000) / 100) + "% (" + quantity + ")</div></div></div>").join("")


}


const addsuceedPrice = (type, price = 1) => {
    /// debugger

    let index = suceedprices.findIndex(price => price.type == type)
    if (index == -1) {
        suceedprices.push({ type: type, price: price })
    }
    else {
        suceedprices[index].price = suceedprices[index].price + price;
    }




}


const addfailedPrice = (type, price = 1) => {






    let index = failedprices.findIndex(price => price.type == type)
    if (index == -1) {
        failedprices.push({ type: type, price: price })
    }
    else {
        failedprices[index].price = failedprices[index].price + price;
    }




}



const buildgridData = (id, itemsArray, start, step, width = 200) => {


    let Name = itemsArray[start].name
    let Group = itemsArray[start].folder
    let position = start
    let succeedsum = 0
    let failedsum = 0
    let currentstep = 0
    let first = true


    let span = 200
    //let blockstep = width / span * 10
    let blockstep = width / (100 / step)
    let margin = 70;

    let failcolor
    let succeedcolor

    let failpart = ''
    let suceedpart = ''
    let grid = '';
    let failedtip = ""
    let succeedtip = ""
    let data = [];
    let Xtrain = [];
    let Ytrain = [];

    let Xtrainall = [];
    let Ytrainall = [];

    let succeedposweight = 0
    let failedposweight = 0

    suceedprices = []
    failedprices = []


    $("#diag" + id).append('<div id="diagcontainer' + id + '" style="width:100%"></div>')
    $("#diag" + id).append('<div id="graphcontainer' + id + '" style="width:100%"></div>')

    for (ctr = 0; ctr * step <= 100; ctr++) {

        grid = grid + "<div style=\"display:flex;justify-content:center;font-size:14px;position:absolute;;top:" + (20 + margin) + "px;padding:0;height:40px;left:" + blockstep * ctr + "px;width:" + blockstep + "px;border-right:solid 1px #ccc\" class=\"gridbar\"></div>";


    }


    $("#diagcontainer" + id).append(grid)

    $("#graphcontainer" + id).append('<figure class="highcharts-figure"><div id="hight_container' + id + '"></div></figure>')




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

                    addsuceedPrice(itemsArray[position].typeprice)

                    let salesdoc = (itemsArray[position].rnom != '0' ? `<div><span class=\\'outdoc\\'>&#129093;реализация </span>&nbsp;<br>&nbsp;&nbsp;&nbsp;<span class=\\'doccontainer\\' data-nom=\\'` + itemsArray[position].rnom + `\\'>№ ` + itemsArray[position].rnom.replace(/[0]*/i, "") + " от " + itemsArray[position].rdata.substr(0, 10) + "</span></div>" : "")

                    succeedtip = succeedtip + `<div class=\\'docdata\\'><div class=\\'docdata__coll\\' ><div><strong>Документ </strong><br><br>  <div><span class=\\'indoc\\'>&#129095; счет </span>&nbsp;<br>&nbsp;&nbsp;&nbsp;<span class=\\'doccontainer\\' data-nom=\\'` + itemsArray[position].nom + `\\'>№ ` + itemsArray[position].nom.replace(/[0]*/i, "") + " от " + itemsArray[position].data.substr(0, 10) + "</span></div>" + salesdoc + "</div><div><strong>Тип цены </strong>" + itemsArray[position].typeprice + "</div></div>         <div class=\\'docdata__coll\\'><div><strong>Процент </strong><br><br><span class=\\'sign\\'><br>=</span><span class=\\'bracket\\'>(</span>сумма<span class=\\'sign\\'>-</span>себестоимость<span class=\\'sign\\'>*</span>коэффициент<span class=\\'bracket\\'>)</span><span class=\\'sign\\'>/</span><span class=\\'bracket\\'>(</span>себестоимость<span class=\\'sign\\'>*</span>коэффициент<span class=\\'bracket\\'>)</span><span class=\\'sign\\'><br>=</span><span class=\\'bracket\\'>(</span>" + itemsArray[position].summary + "<span class=\\'sign\\'>-</span>" + itemsArray[position].cost + "<span class=\\'sign\\'>*</span>" + itemsArray[position].ratio + "<span class=\\'bracket\\'>)</span><span class=\\'sign\\'>/</span><span class=\\'bracket\\'>(</span>" + itemsArray[position].cost + "<span class=\\'sign\\'>*</span>" + itemsArray[position].ratio + "<span class=\\'bracket\\'>)</span><span class=\\'sign\\'><br>=</span>" + Math.round((itemsArray[position].summary - itemsArray[position].cost * itemsArray[position].ratio) * 100) / 100 + "<span class=\\'sign\\'>/</span>" + Math.round((itemsArray[position].cost * itemsArray[position].ratio) * 100) / 100 + "</div><div class=\\'result\\'>" + Math.round(itemsArray[position].percent * 100) / 100 + "%</div></div><div class=\\'docdata__coll\\'><div><strong>Значимость </strong><br><br><span class=\\'sign\\'><br>=</span>стоимость позиции<span class=\\'sign\\'>/</span>cумма документа<span class=\\'sign\\'><br>=</span>" + Math.round(itemsArray[position].summary) + "<span class=\\'sign\\'>/</span>" + Math.round(itemsArray[position].docsummary) + "</div><div class=\\'result\\'>" + Math.round(itemsArray[position].posweight * 100) / 100 + "%</div></div></div>"
                }
                else {
                    failedsum = failedsum * 1 + 1
                    failedposweight = failedposweight + itemsArray[position].posweight * 1
                    addfailedPrice(itemsArray[position].typeprice);

                    let salesdoc = (itemsArray[position].rnom != '0' ? `<div><span class=\\'outdoc\\'>&#129093;реализация </span>&nbsp;<br>&nbsp;&nbsp;&nbsp;<span class=\\'doccontainer\\' data-nom=\\'` + itemsArray[position].rnom + `\\'>№ ` + itemsArray[position].rnom.replace(/[0]*/i, "") + " от " + itemsArray[position].rdata.substr(0, 10) + "</span></div>" : "")
                    //itemsArray[position].quantity * 1
                    failedtip = failedtip + `<div class=\\'docdata\\'><div class=\\'docdata__coll\\' ><div><strong>Документ </strong><br><br>  <div><span class=\\'indoc\\'>&#129095; счет </span>&nbsp;<br>&nbsp;&nbsp;&nbsp;<span class=\\'doccontainer\\' data-nom=\\'` + itemsArray[position].nom + `\\'>№ ` + itemsArray[position].nom.replace(/[0]*/i, "") + " от " + itemsArray[position].data.substr(0, 10) + "</span></div>" + salesdoc + "</div><div><strong>Тип цены </strong>" + itemsArray[position].typeprice + "</div></div>         <div class=\\'docdata__coll\\'><div><strong>Процент </strong><br><br><span class=\\'sign\\'><br>=</span><span class=\\'bracket\\'>(</span>сумма<span class=\\'sign\\'>-</span>себестоимость<span class=\\'sign\\'>*</span>коэффициент<span class=\\'bracket\\'>)</span><span class=\\'sign\\'>/</span><span class=\\'bracket\\'>(</span>себестоимость<span class=\\'sign\\'>*</span>коэффициент<span class=\\'bracket\\'>)</span><span class=\\'sign\\'><br>=</span><span class=\\'bracket\\'>(</span>" + itemsArray[position].summary + "<span class=\\'sign\\'>-</span>" + itemsArray[position].cost + "<span class=\\'sign\\'>*</span>" + itemsArray[position].ratio + "<span class=\\'bracket\\'>)</span><span class=\\'sign\\'>/</span><span class=\\'bracket\\'>(</span>" + itemsArray[position].cost + "<span class=\\'sign\\'>*</span>" + itemsArray[position].ratio + "<span class=\\'bracket\\'>)</span><span class=\\'sign\\'><br>=</span>" + Math.round((itemsArray[position].summary - itemsArray[position].cost * itemsArray[position].ratio) * 100) / 100 + "<span class=\\'sign\\'>/</span>" + Math.round((itemsArray[position].cost * itemsArray[position].ratio) * 100) / 100 + "</div><div class=\\'result\\'>" + Math.round(itemsArray[position].percent * 100) / 100 + "%</div></div><div class=\\'docdata__coll\\'><div><strong>Значимость </strong><br><br><span class=\\'sign\\'><br>=</span>стоимость позиции<span class=\\'sign\\'>/</span>cумма документа<span class=\\'sign\\'><br>=</span>" + Math.round(itemsArray[position].summary) + "<span class=\\'sign\\'>/</span>" + Math.round(itemsArray[position].docsummary) + "</div><div class=\\'result\\'>" + Math.round(itemsArray[position].posweight * 100) / 100 + "%</div></div></div>"
                }

                ///////////////////////////////////////
                failcolor = makegradient("#FFD700", "#ff0000", 0, 15, failedsum)
                succeedcolor = makegradient("#FFD700", "#228B22", 0, 15, succeedsum)

                if (failedsum != 0) {
                    failpart = "<div style=\"cursor:pointer;display:flex;justify-content:center;font-size:14px;position:absolute;background-color:" + failcolor + ";top:" + (20 + margin) + "px;padding:0;height:20px;left:" + blockstep * currentstep + "px;width:" + blockstep + "px\" id=\"f_" + id + "_" + currentstep + "\" onclick=\"displayTooltip('" + failedtip + "', {name:'" + (itemsArray[position].folder ? itemsArray[position].folder.replace(/\"/g, "") : itemsArray[position].name.replace(/\"/g, "")) + "',percentRange:'" + (currentstep * step + "-" + (currentstep + 1) * step) + "%',quantity:'" + failedsum + "',avgPower:'" + Math.round((failedposweight / failedsum) * 100) / 100 + "',pricetypes:'" + buildPrices(failedprices, failedsum, (itemsArray[position].folder ? itemsArray[position].folder.replace(/\"/g, "") : itemsArray[position].name.replace(/\"/g, ""))) + "',color:'" + failcolor + "'})\">" + failedsum + "</div>";
                }

                if (succeedsum != 0) { suceedpart = "<div style=\"cursor:pointer;display:flex;justify-content:center;font-size:14px;position:absolute;background-color:" + succeedcolor + ";padding:0;top:" + (40 + margin) + "px;height:20px;left:" + blockstep * currentstep + "px;width:" + blockstep + "px\" id=\"s_" + id + "_" + currentstep + "\"  onclick=\"displayTooltip('" + succeedtip + "', {name:'" + (itemsArray[position].folder ? itemsArray[position].folder.replace(/\"/g, "") : itemsArray[position].name.replace(/\"/g, "")) + "',percentRange:'" + (currentstep * step + "-" + (currentstep + 1) * step) + "%',quantity:'" + succeedsum + "',avgPower:'" + Math.round((succeedposweight / succeedsum) * 100) / 100 + "',pricetypes:'" + buildPrices(suceedprices, succeedsum, (itemsArray[position].folder ? itemsArray[position].folder.replace(/\"/g, "") : itemsArray[position].name.replace(/\"/g, ""))) + "',color:'" + succeedcolor + "'})\">" + succeedsum + "</div>"; }

                ///////////////////////////////////////

                data.push([currentstep * step, succeedsum / (failedsum + succeedsum) * 100])
                pushPoints(suceedprices, failedprices, currentstep * step)


                /*if (mindquantity) {
                    for (t = 1; t <= (failedsum + succeedsum); t++) {
                        Xtrainall.push(currentstep * step)
                        Ytrainall.push(succeedsum / (failedsum + succeedsum) * 100);
                    }
                }*/


                //    else 
                {

                    Xtrain.push(currentstep * step)
                    Ytrain.push(succeedsum / (failedsum + succeedsum) * 100);
                }


                $("#diagcontainer" + id).append(failpart + suceedpart)



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
                    addsuceedPrice(itemsArray[position].typeprice);
                    let salesdoc = (itemsArray[position].rnom != '0' ? `<div><span class=\\'outdoc\\'>&#129093;реализация </span>&nbsp;<br>&nbsp;&nbsp;&nbsp;<span class=\\'doccontainer\\' data-nom=\\'` + itemsArray[position].rnom + `\\'>№ ` + itemsArray[position].rnom.replace(/[0]*/i, "") + " от " + itemsArray[position].rdata.substr(0, 10) + "</span></div>" : "")

                    succeedtip = succeedtip + `<div class=\\'docdata\\'><div class=\\'docdata__coll\\' ><div><strong>Документ </strong><br><br>  <div><span class=\\'indoc\\'>&#129095; счет </span>&nbsp;<br>&nbsp;&nbsp;&nbsp;<span class=\\'doccontainer\\' data-nom=\\'` + itemsArray[position].nom + `\\'>№ ` + itemsArray[position].nom.replace(/[0]*/i, "") + " от " + itemsArray[position].data.substr(0, 10) + "</span></div>" + salesdoc + "</div><div><strong>Тип цены </strong>" + itemsArray[position].typeprice + "</div></div>         <div class=\\'docdata__coll\\'><div><strong>Процент </strong><br><br><span class=\\'sign\\'><br>=</span><span class=\\'bracket\\'>(</span>сумма<span class=\\'sign\\'>-</span>себестоимость<span class=\\'sign\\'>*</span>коэффициент<span class=\\'bracket\\'>)</span><span class=\\'sign\\'>/</span><span class=\\'bracket\\'>(</span>себестоимость<span class=\\'sign\\'>*</span>коэффициент<span class=\\'bracket\\'>)</span><span class=\\'sign\\'><br>=</span><span class=\\'bracket\\'>(</span>" + itemsArray[position].summary + "<span class=\\'sign\\'>-</span>" + itemsArray[position].cost + "<span class=\\'sign\\'>*</span>" + itemsArray[position].ratio + "<span class=\\'bracket\\'>)</span><span class=\\'sign\\'>/</span><span class=\\'bracket\\'>(</span>" + itemsArray[position].cost + "<span class=\\'sign\\'>*</span>" + itemsArray[position].ratio + "<span class=\\'bracket\\'>)</span><span class=\\'sign\\'><br>=</span>" + Math.round((itemsArray[position].summary - itemsArray[position].cost * itemsArray[position].ratio) * 100) / 100 + "<span class=\\'sign\\'>/</span>" + Math.round((itemsArray[position].cost * itemsArray[position].ratio) * 100) / 100 + "</div><div class=\\'result\\'>" + Math.round(itemsArray[position].percent * 100) / 100 + "%</div></div><div class=\\'docdata__coll\\'><div><strong>Значимость </strong><br><br><span class=\\'sign\\'><br>=</span>стоимость позиции<span class=\\'sign\\'>/</span>cумма документа<span class=\\'sign\\'><br>=</span>" + Math.round(itemsArray[position].summary) + "<span class=\\'sign\\'>/</span>" + Math.round(itemsArray[position].docsummary) + "</div><div class=\\'result\\'>" + Math.round(itemsArray[position].posweight * 100) / 100 + "%</div></div></div>"






                }
                else {
                    failedsum = failedsum * 1 + 1// itemsArray[position].quantity * 1
                    failedposweight = failedposweight + itemsArray[position].posweight * 1

                    addfailedPrice(itemsArray[position].typeprice);

                    let salesdoc = (itemsArray[position].rnom != '0' ? `<div><span class=\\'outdoc\\'>&#129093;реализация </span>&nbsp;<br>&nbsp;&nbsp;&nbsp;<span class=\\'doccontainer\\' data-nom=\\'` + itemsArray[position].rnom + `\\'>№ ` + itemsArray[position].rnom.replace(/[0]*/i, "") + " от " + itemsArray[position].rdata.substr(0, 10) + "</span></div>" : "")

                    failedtip = failedtip + `<div class=\\'docdata\\'><div class=\\'docdata__coll\\' ><div><strong>Документ </strong><br><br>  <div><span class=\\'indoc\\'>&#129095; счет </span>&nbsp;<br>&nbsp;&nbsp;&nbsp;<span class=\\'doccontainer\\' data-nom=\\'` + itemsArray[position].nom + `\\'>№ ` + itemsArray[position].nom.replace(/[0]*/i, "") + " от " + itemsArray[position].data.substr(0, 10) + "</span></div>" + salesdoc + "</div><div><strong>Тип цены </strong><br>" + itemsArray[position].typeprice + "</div></div>         <div class=\\'docdata__coll\\'><div><strong>Процент </strong><br><br><span class=\\'sign\\'><br>=</span><span class=\\'bracket\\'>(</span>сумма<span class=\\'sign\\'>-</span>себестоимость<span class=\\'sign\\'>*</span>коэффициент<span class=\\'bracket\\'>)</span><span class=\\'sign\\'>/</span><span class=\\'bracket\\'>(</span>себестоимость<span class=\\'sign\\'>*</span>коэффициент<span class=\\'bracket\\'>)</span><span class=\\'sign\\'><br>=</span><span class=\\'bracket\\'>(</span>" + itemsArray[position].summary + "<span class=\\'sign\\'>-</span>" + itemsArray[position].cost + "<span class=\\'sign\\'>*</span>" + itemsArray[position].ratio + "<span class=\\'bracket\\'>)</span><span class=\\'sign\\'>/</span><span class=\\'bracket\\'>(</span>" + itemsArray[position].cost + "<span class=\\'sign\\'>*</span>" + itemsArray[position].ratio + "<span class=\\'bracket\\'>)</span><span class=\\'sign\\'><br>=</span>" + Math.round((itemsArray[position].summary - itemsArray[position].cost * itemsArray[position].ratio) * 100) / 100 + "<span class=\\'sign\\'>/</span>" + Math.round((itemsArray[position].cost * itemsArray[position].ratio) * 100) / 100 + "</div><div class=\\'result\\'>" + Math.round(itemsArray[position].percent * 100) / 100 + "%</div></div><div class=\\'docdata__coll\\'><div><strong>Значимость </strong><br><br><span class=\\'sign\\'><br>=</span>стоимость позиции<span class=\\'sign\\'>/</span>cумма документа<span class=\\'sign\\'><br>=</span>" + Math.round(itemsArray[position].summary) + "<span class=\\'sign\\'>/</span>" + Math.round(itemsArray[position].docsummary) + "</div><div class=\\'result\\'>" + Math.round(itemsArray[position].posweight * 100) / 100 + "%</div></div></div>"
                }
            }


        }
        position++

    }

    ////////////////...................
    if (position < itemsArray.length) {
        failpart = ''
        suceedpart = ''

        ///////////////////////////////////////
        failcolor = makegradient("#FFD700", "#ff0000", 0, 15, failedsum)
        succeedcolor = makegradient("#FFD700", "#228B22", 0, 15, succeedsum)
        currentstep = (itemsArray[position - 1].percent * 1 - itemsArray[position - 1].percent % step) / step

        // debugger;
        if (failedsum != 0) {
            failpart = "<div style=\"cursor:pointer;display:flex;justify-content:center;font-size:14px;position:absolute;background-color:" + failcolor + ";top:" + (20 + margin) + "px;padding:0;height:20px;left:" + blockstep * currentstep + "px;width:" + blockstep + "px\" id=\"f_" + id + "_" + currentstep + "\" onclick=\"displayTooltip('" + failedtip + "', {name:'" + (typeof itemsArray[position].folder != "undefined" ? itemsArray[position].folder.replace(/\"/g, "") : itemsArray[position].name.replace(/\"/g, "")) + "',percentRange:'" + (currentstep * step + "-" + (currentstep + 1) * step) + "%',quantity:'" + failedsum + "',avgPower:'" + Math.round((failedposweight / failedsum) * 100) / 100 + "',pricetypes:'" + buildPrices(failedprices, failedsum, (itemsArray[position].folder ? itemsArray[position].folder.replace(/\"/g, "") : itemsArray[position].name.replace(/\"/g, ""))) + "',color:'" + failcolor + "'})\">" + failedsum + "</div>";
        }

        if (succeedsum != 0) { suceedpart = "<div style=\"cursor:pointer;display:flex;justify-content:center;font-size:14px;position:absolute;background-color:" + succeedcolor + ";padding:0;top:" + (40 + margin) + "px;height:20px;left:" + blockstep * currentstep + "px;width:" + blockstep + "px\" id=\"s_" + id + "_" + currentstep + "\" onclick=\"displayTooltip('" + succeedtip + "', {name:'" + (itemsArray[position].folder ? itemsArray[position].folder.replace(/\"/g, "") : itemsArray[position].name.replace(/\"/g, "")) + "',percentRange:'" + (currentstep * step + "-" + (currentstep + 1) * step) + "%',quantity:'" + succeedsum + "',avgPower:'" + Math.round((succeedposweight / succeedsum) * 100) / 100 + "',pricetypes:'" + buildPrices(suceedprices, succeedsum, (itemsArray[position].folder ? itemsArray[position].folder.replace(/\"/g, "") : itemsArray[position].name.replace(/\"/g, ""))) + "',color:'" + succeedcolor + "'})\">" + succeedsum + "</div>"; }

        ///////////////////////////////////////

    }

    ////////////////...................

    $("#diagcontainer" + id).append(failpart + suceedpart)
    data.push([currentstep * step, succeedsum / (failedsum + succeedsum) * 100])
    pushPoints(suceedprices, failedprices, currentstep * step)


    /*if (mindquantity) {
        for (t = 1; t <= (failedsum + succeedsum); t++) {
            Xtrainall.push(currentstep * step)
            Ytrainall.push(succeedsum / (failedsum + succeedsum) * 100);
        }
    }*/


    //    else 
    {

        Xtrain.push(currentstep * step)
        Ytrain.push(succeedsum / (failedsum + succeedsum) * 100);
    }




    //Xtrain.push(currentstep * step)
    //Ytrain.push(succeedsum / (failedsum + succeedsum) * 100);


    /*
        $("#f_" + id + "_" + currentstep).click(function (ev) {
     
            displayTooltip(failedtip, ev.pageX, ev.pageY)
        })
     
     
        $("#s_" + id + "_" + currentstep).click(function (ev) {
     
            displayTooltip(succeedtip, ev.pageX, ev.pageY)
        })
     
    */


    ////////////////////////грфик
    //debugger


    let diag = {
        chart: {
            type: 'spline'
        },
        title: {
            text: ''
        },

        legend: {
            accessibility: {
                enabled: false
            }
        },
        subtitle: {
            text: ''
        },
        xAxis: {},
        yAxis: {
            title: {
                text: 'Вероятность, %'
            },
            min: 0
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '<strong>Вероятность: </strong> {point.y} <br><strong>Наценка: </strong> {point.х} '
        },

        plotOptions: {
            series: {
                marker: {
                    enabled: true
                }
            }
        },

        colors: ['forestgreen','red', ],


        series: [{
           
            name: "Вероятность продажи от наценки",
            data: data
        }
    
        , 
        
        {           
           
            name: "Регрессия",
            data: regression(Ytrain, Xtrain)

        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    plotOptions: {
                        series: {
                            marker: {
                                radius: 2.5
                            }
                        }
                    }
                }
            }]
        }
    }

    //debugger
    let diagcolors = ['#219c15', '#15409c', '#159c95', '#6d9c15', '#5b159c', '#9c4015', '#9c159c', '#9c7815']
    /*
        pricetypesdata.forEach((priceItem, index) => {
    
            diag.series.push({
                name: priceItem.type,
                data: priceItem.data
            })
    
    
            diag.colors.push(diagcolors[(index < diagcolors.length ? index : 0)])
            //  diag.colors.push(diagcolors[(index<diagcolors.length?index:0)])
    
            /*diag.series.push({
                name: "Регрессия " + priceItem.type,
                data: regression(priceItem.data.map(item => item[0]), priceItem.data.map(item => item[1]))
            })
    
        })
    */
    let chart = Highcharts.chart('hight_container' + id, diag);

    //debugger
    chart.setSize(200, 150)


    return { Ytrain: Ytrain, Xtrain: Xtrain }

}

const rebuildDiag = (id, step = 10, width = 200) => {

    if (!(typeof id === "string" || id instanceof String || id === -1)) {
        $("#diagcontainer" + id).html("")
        buildgridData(id, data, $("#diag" + id).attr("data-start") * 1, step, width)
    }
}


const displayTooltip = (tip = "Нет Данных", data = { name: "Нет Данных", percentRange: "Нет Данных", quantity: "Нет данных", avgPower: "Нет данных", pricetypes: "Нет данных" }) => {


    let t = $("#tooltip").length > 0
    if (!t) {
        $("html").append(`
        <div class="tooltip" id="tooltip">
            <div class="closecontainer" style="border-left:solid 3px `+ (data.color ? data.color : "transparent") + `;">
                <div class="closecontainer__info">
                    
                     
                            <div class="infomain">
                                <div>
                                    <div>
                                        <div class="info__inlineheader">Наименование</div>
                                        <div class="info__inlinedata" id="name">`+ (data.name ? data.name.replace(/\"/g, "") : "<span class=\"nodata\">Нет Данных</span>") + `</div>
                                    </div>
                                </div>
    

                                <div class="infcols">
                                    <div>
                                        <div class="info__header">Диапазон наценки</div>
                                        <div class="info__data" id="percentRange">`+ (data.percentRange ? data.percentRange : "<span class=\"nodata\">Нет Данных</span>") + `</div>
                                    </div>
    

                                    <div>
                                    <div class="info__header">Средняя значимость</div>
                                    <div class="info__data" id="avgPower">`+ (data.avgPower ? data.avgPower : "<span class=\"nodata\">Нет Данных</span>") + `</div>
                                </div>
                        
                                    <div>
                                        <div class="info__header">Количество</div>
                                        <div class="info__data" id="quantity"></div>
                                    </div>

                                    
                                  

                                </div>
                        
                            
                            </div>
                            
                       


                        <div>
                            <div class="info__header">Типы цен</div>
                            <div class="info__pricetypes" id="pricetypes"></div>
                        </div>
                    
                    

                </div>
                <div class="close" onclick="closetooltip()">&#10006;</div>
            </div>
            <div class="tooltipcontent" id="tooltipcontent"> </div> 
        </div>`)

    }


    $("#tooltipcontent").html(tip);


    $("#name").html((data.name ? data.name.replace(/\"/g, "") : "<span class=\"nodata\">Нет Данных</span>"));

    $("#percentRange").html((data.percentRange ? data.percentRange : "<span class=\"nodata\">Нет Данных</span>"));
    $("#quantity").html((data.quantity ? data.quantity : "<span class=\"nodata\">Нет Данных</span>"));
    $("#posibility").html((data.posibility ? data.posibility : "<span class=\"nodata\">Нет Данных</span>"));
    $("#avgPower").html((data.avgPower ? data.avgPower : "<span class=\"nodata\">Нет Данных</span>"));
    $("#pricetypes").html((data.pricetypes ? data.pricetypes : "<span class=\"nodata\">Нет Данных</span>"));
    $(".closecontainer").css("border-left", "solid 5px " + (data.color ? data.color : "transparent"))







    $(".doccontainer").click(function () {

        let addr = "getsmart://" + $(this).attr("data-nom")
        w = window.open("getsmart://" + $(this).attr("data-nom"))
        // w.close()
    })
    //$("#tooltip").offset({ left: X - 5, top: Y - 5 })

    let d = $("#tooltip").css("display")
    d = $("#tooltip").css("visibility")
    d = $("#tooltip").css("opacity")

    //  $("#tooltip").offset({ left: mouseX - 5, top: mouseY - 5 })
    $("#tooltip").fadeIn()



}

const closetooltip = () => {
    $("#tooltip").fadeOut()

}




const buildData = (startpos, count) => {

    let localcount = startpos
    let localquantity = 0
    let localstartpos = startpos;
    globalindex++

    while ((localcount + 1 < data.length) && (localquantity < count)) {

        if ((data[localcount + 1].name != data[localcount].name) || (data[localcount + 1].folder != data[localcount].folder) || (localcount == startpos)) {


            $(".overpricecontainer").append("<div style=\"background-color:" + (globalindex % 2 == 0 ? oddcolor : evencolor) + ";\"><div class='Namecontainer'  style=\"position:relative;height:170px;\"><div>" + (data[localcount].folder ? "<strong> группа #" + data[localcount].folder.replace(/\"/g, "") + "</strong>" : data[localcount].name.replace(/\"/g, "")) + "</div><div  class='overprice__taskcontainer'><div class='overprice__data' id=\"overprice__data" + globalindex + "\"></div></div></div><div class=\"info\" id=\"info" + globalindex + "\" style='display:none'></div></div><div id=\"diag" + globalindex + "\" style=\"position:relative;height:170px;padding:0 20px;background-color:" + (globalindex % 2 == 0 ? oddcolor : evencolor) + ";\" data-start=\"" + localstartpos + "\">"
                + "</div>")

            buildSlider(globalindex, 0, 25, null, 10, "Шаг наценки")
            let regData = buildgridData(globalindex, data, localstartpos, 10)
            builTaskData(globalindex, regData, taskdata)
            globalindex++
            localquantity++
            localstartpos = localcount + 1;
        }

        localcount++






    }


    globalcount = localcount


}

const makeIDs = (startpos, count) => {
    let tempstr = ""


    for (t = startpos; t <= startpos + count; t++) {
        tempstr = tempstr + (tempstr != "" ? "," : "") + NomIDS[t].zodNom;

    }
    return tempstr
}


const buildDatanew = (startpos, count, requestvars = '') => {
    if (waiting) {
        $(".overpricecontainer").html("")
        waiting = false
    }
    fetch("actions.php?action=getNom&IDs=" + makeIDs(startpos, count) + requestvars).then(res => res.json()).then(res => {


        let localcount = 0
        let localquantity = 0
        let localstartpos = 0;
        data = res


        $(".overpricecontainer").css("display", "grid")
        $(".overpricecontainer").css("height", "calc(100% - 100px)")

        globalindex++

        while (localcount + 1 < data.length) {

            if ((data[localcount + 1].name != data[localcount].name) || (data[localcount + 1].folder != data[localcount].folder) || (localcount == startpos)) {


                $(".overpricecontainer").append("<div style=\"background-color:" + (globalindex % 2 == 0 ? oddcolor : evencolor) + ";\"><div class='Namecontainer'  style=\"position:relative;height:170px;\"><div>" + (data[localcount].folder ? "<strong> группа #" + data[localcount].folder.replace(/\"/g, "") + "</strong>" : data[localcount].name.replace(/\"/g, "")) + "</div><div  class='overprice__taskcontainer'><div class='overprice__data' id=\"overprice__data" + globalindex + "\"></div></div></div><div class=\"info\" id=\"info" + globalindex + "\" style='display:none'></div></div><div id=\"diag" + globalindex + "\" style=\"position:relative;height:170px;padding:0 20px;background-color:" + (globalindex % 2 == 0 ? oddcolor : evencolor) + ";\" data-start=\"" + localstartpos + "\">"
                    + "</div>")

                buildSlider(globalindex, 0, 25, null, 10, "Шаг наценки")

                pricetypesdata = [];
                let regData = buildgridData(globalindex, data, localstartpos, 10)

                builTaskData(globalindex, regData, taskdata)
                globalindex++
                localquantity++
                localstartpos = localcount + 1;
            }

            localcount++






        }


        globalcount = localcount


        buildscroll = false;
    })


}



//////////////////////////


const buildallData = () => {
    if (waiting) {
        $(".overpricecontainer").html("")
        waiting = false
    }
    fetch("actions.php?action=getall&ids=" + idstring + "&gids=" + gidstring).then(res => res.json()).then(res => {


        let localcount = 0
        let localquantity = 0
        let localstartpos = 0;
        data = res


        $(".overpricecontainer").css("display", "grid")
        $(".overpricecontainer").css("height", "calc(100% - 100px)")

        // globalindex++

        let folder = "";
        let name = "";

        while (localcount + 1 < data.length) {

            if ((data[localcount].name != name) || (data[localcount].folder != folder)) {

                debugger;
                $(".overpricecontainer").append("<div style=\"background-color:" + (globalindex % 2 == 0 ? oddcolor : evencolor) + ";\"><div class='Namecontainer'  style=\"position:relative;height:170px;\"><div>" + (data[localcount].folder ? "<strong> группа #" + data[localcount].folder.replace(/\"/g, "") + "</strong>" : data[localcount].name.replace(/\"/g, "")) + "</div><div  class='overprice__taskcontainer'><div class='overprice__data' id=\"overprice__data" + globalindex + "\"></div></div></div><div class=\"info\" id=\"info" + globalindex + "\" style='display:none'></div></div><div id=\"diag" + globalindex + "\" style=\"position:relative;height:170px;padding:0 20px;background-color:" + (globalindex % 2 == 0 ? oddcolor : evencolor) + ";\" data-start=\"" + localstartpos + "\">"
                    + "</div>")

                buildSlider(globalindex, 0, 25, null, 10, "Шаг наценки")

                pricetypesdata = [];
                let regData = buildgridData(globalindex, data, localcount, 10)

                builTaskData(globalindex, regData, taskdata)
                globalindex++
                localquantity++
                localstartpos = localcount + 1;


                folder = data[localcount].folder;
                name = data[localcount].name;
            }

            localcount++






        }


        globalcount = localcount


        buildscroll = false;
    })


}



///////////////////

////////////////////////////2

const buildallData2 = () => {


    localcount = 0;
    fetch("actions.php?action=getall&ids=" + idstring + "&gids=" + gidstring).then(res => res.json()).then(res => {

        if (waiting) {
            $(".overpricecontainer").html("")
            waiting = false
        }

        let localquantity = 0
        let localstartpos = 0;
        data = res


        $(".overpricecontainer").css("display", "grid")
        $(".overpricecontainer").css("height", "calc(100% - 800px)")
        $(".overpricecontainer").css("overflow-y", "scroll")
        // globalindex++

        let folder = "";
        let name = "";

        debugger

        getproductids.forEach((item, index) => {
            debugger
            localcount = data.findIndex(item2 => { return (item.isgroup == 0 ? item.zodNom * 1 == item2.zodNom * 1 : item.zodNomFolder == item2.folderid) })
            if (localcount >= 0 && localcount < data.length) {
                debugger;
                $(".overpricecontainer").append(`
                <div style=\"background-color:` + (globalindex % 2 == 0 ? oddcolor : evencolor) + `;\">
                    
                    <div class='Namecontainer'  style=\"position:relative;height:210px;\">
                        
                    
                        <div style="margin:0px;margin-top:60px;margin-left:20px;">` + item.zodName + `<div class="source"> <strong>` + (data[localcount].folder ? "данные из группы </strong>" + data[localcount].folder.replace(/\"/g, "") : "") + `</div>
                        </div>

                        <div  class='overprice__taskcontainer'>
                            <div class='overprice__data' id=\"overprice__data` + globalindex + `\"></div>
                        </div>
                        
                    </div>

                <div class=\"info\" id=\"info` + globalindex + `\" style='display:none'></div>
                </div>

                <div id=\"diag` + globalindex + `\" style=\"position:relative;height:220px;padding:0 20px;background-color:` + (globalindex % 2 == 0 ? oddcolor : evencolor) + `;\" data-start=\"` + localstartpos + `\"></div>`)

                buildSlider(globalindex, 0, 25, null, 10, "Шаг наценки")

                pricetypesdata = [];
                let regData = buildgridData(globalindex, data, localcount, 10)

                builTaskData(globalindex, regData, taskdata)
                globalindex++
                localquantity++
                localstartpos = localcount + 1;


            }



            globalcount = localcount



        })



        buildscroll = false;
        //  $(".overpricecontainer").css("overflow-y", "hidden");
        $(".overpricecontainer").css("height", (window.innerHeight-200)+"px")
    })


}








///////////////////////////////
const regression = (arrWeight, arrHeight) => {

    let r, sy, sx, b, a, meanX, meanY;
    r = jStat.corrcoeff(arrHeight, arrWeight);
    sy = jStat.stdev(arrWeight);
    sx = jStat.stdev(arrHeight);
    meanY = jStat(arrWeight).mean();
    meanX = jStat(arrHeight).mean();
    b = r * (sy / sx);
    a = meanY - meanX * b;
    //Set up a line
    let y1, y2, x1, x2;
    x1 = jStat.min(arrHeight);
    x2 = jStat.max(arrHeight);
    y1 = a + b * x1;
    y2 = a + b * x2;
    res = [];
    res.push([x1, y1]);
    res.push([x2, y2]);
    return res
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

const regressionX = (arrWeight, arrHeight, arg) => {

    let r, sy, sx, b, a, meanX, meanY;
    r = jStat.corrcoeff(arrHeight, arrWeight);
    sy = jStat.stdev(arrWeight);
    sx = jStat.stdev(arrHeight);
    meanY = jStat(arrWeight).mean();
    meanX = jStat(arrHeight).mean();
    b = r * (sy / sx);
    a = meanY - meanX * b;


    return (arg - a) / b
}


const regressionY = (arrWeight, arrHeight, arg) => {

    let r, sy, sx, b, a, meanX, meanY;
    r = jStat.corrcoeff(arrHeight, arrWeight);
    sy = jStat.stdev(arrWeight);
    sx = jStat.stdev(arrHeight);
    meanY = jStat(arrWeight).mean();
    meanX = jStat(arrHeight).mean();
    b = r * (sy / sx);
    a = meanY - meanX * b;





    return a + b * arg;
}






const searchslidercallback = (id) => {
    posweight = $("#slider__value" + id).html().replace(/%/gi, "")



}




const newTask = (id = "", name = "", looking = "'", from = "", to = "") => {
    if (!addingTask) {
        addingTask = true;
        $("#content").append(`
    
    <div class="taskeditor" id="taskeditor'+totaltasks+'0">
        
        <div>
            <div class="task_tittle">Наиенование</div>
            <input id="taskname" type="text"/ value="`+ name + `">
        </div>

        <div>
        <div class="task_tittle">Что ищем?</div>
        <input id="whatis__input" type="text"/ style="width:150px;margin-right:0" value="`+ (looking == 1 ? "Вероятность" : "Наценка") + `">
        <div class="whatisdropdown__button">&#9660;</div>
        </div>

        <div>
        <div id="task__tittle" class="task_tittle">Вероятность</div>
        от <input type="text"/ style="width:30%;margin-right:0" id="taskfrom" value="`+ from + `">  до <input type="text"/ style="width:30%;margin-right:0" id="taskto" value="` + to + `">
        </div>

        <div class="task__actions">
            <div class="task__add">&#10004;</div>
            <div class="task__cancel">&#10008</div>
        </div>

    </div>
    
    
    `)

        $(".whatisdropdown__button").click(function () {


            let pos = { left: $("#whatis__input").position().left + $(".taskswindow").position().left + 10, top: $("#whatis__input").position().top + $(".taskswindow").position().top + 43, width: $("#whatis__input").width() + 48 }

            $(".whatisdrop__content").css(pos)
            $(".whatisdrop__content").fadeIn(1000)
        })



        $(".whatisdrop__dropcontent").click(function () {

            $("#whatis__input").val($(this).html())
            if ($(this).html() == "Наценка") {
                lookingfor = 1
                $("#task__tittle").html("Вероятность")
            }
            else {
                lookingfor = 2
                $("#task__tittle").html("Наценка")
            }
            $(".whatisdrop__content").fadeOut(1000)

        })


        $(".task__add").click(function () {
            addingTask = false;
            if (taskaction != "edittask") {
                addDBTask()
            }
            else {


                editDBTask()
            }
            taskaction = ""
        }

        )



        $(".task__cancel").click(function () {
            rebuildData()
            addingTask = false;
            taskaction = ""
        })
    }

}





////////////////////////////


const buildTask = (id, name, lookingfor, from, to) => {


    $("#content").append(`
    
    <div class="task zebra" id="task`+ id + `" onclick="selectTask(` + id + `)">
        
        <div>
            <div class="task_tittle">Наиенование</div>
            <div class="task__name">`+ name + `</div>
        </div>

        <div>
        <div class="task_tittle">Что ищем?</div>
        <div class="task__looking">`+ (lookingfor * 1 == 2 ? "Наценка" : "Вероятность") + `</div>
        </div>

        <div>
        <div  class="task_tittle">`+ (lookingfor * 1 == 1 ? "Наценка" : "Вероятность") + `</div>
        <div class="task__condition">от <div class="task__fromvalue">`+ from + `</div> до <div class="task__tovalue">` + to + `</div></div>
        </div>

        <div class="task__actions">
            <div class="task__edit" onclick="rebuildData(`+ id + `)">&#9998;</div>
         
        </div>

    </div>
    
    
    `)





}




//////////////////////////



const getTasks = () => {
    fetch("actions.php?action=getTasks").then(res => res.json()).then(res => {
        taskdata = res
        $("#content").html('')
        res.forEach((item, pos) => {

            buildTask(item.id, item.name, item.lookingfor, item.from, item.to)
        })

    })
}


const rebuildData = (id = null) => {
    if (taskaction == "") {
        $("#content").html('')

        taskaction = "edittask"
        selectedtask = id
        taskdata.forEach((item, pos) => {
            if (item.id != id) {
                buildTask(item.id, item.name, item.lookingfor, item.from, item.to)
            }
            else { newTask(item.id, item.name, item.lookingfor, item.from, item.to) }

        })
    }
}


const addDBTask = () => {
    taskaction == ""
    fetch("actions.php?action=addTask&name=" + $("#taskname").val() + "&lookingfor=" + ($("#whatis__input").val() == "Наценка" ? 2 : 1) + "&from=" + $("#taskfrom").val() + "&to=" + $("#taskto").val()).then(res => res.json()).then(res => {
        taskdata = res
        $("#content").html('')
        res.forEach((item, pos) => {

            buildTask(item.id, item.name, item.lookingfor, item.from, item.to)
        })

    })
}

const delDBTask = () => {

    taskaction == ""
    fetch("actions.php?action=delTask&id=" + selectedtask).then(res => res.json()).then(res => {
        taskdata = res
        $("#content").html('')
        res.forEach((item, pos) => {

            buildTask(item.id, item.name, item.lookingfor, item.from, item.to)
        })

    })
}


const editDBTask = () => {
    taskaction == ""
    fetch("actions.php?action=editTask&id=" + selectedtask + "&name=" + $("#taskname").val() + "&lookingfor=" + ($("#whatis__input").val() == "Наценка" ? 2 : 1) + "&from=" + $("#taskfrom").val() + "&to=" + $("#taskto").val()).then(res => res.json()).then(res => {
        taskdata = res
        $("#content").html('')
        res.forEach((item, pos) => {

            buildTask(item.id, item.name, item.lookingfor, item.from, item.to)
        })

    })
}






const selectTask = (id) => {

    if (taskaction == "") {
        selectedtask = id
        $(".task").removeClass('taskselected')
        $(".task").addClass('zebra')
        $("#task" + id).removeClass('zebra')
        $("#task" + id).addClass('taskselected')
    }

}


const builTaskData = (id, regData, taskdata) => {
    $("#overprice__data" + id).html("")

    taskdata.forEach(item => {
        let resultstring
        let start = ""
        let end = ""

        if (item.lookingfor == 1) {

            if (item.from != "") {
                start = Math.round(regressionY(regData.Ytrain, regData.Xtrain, item.from))
            }
            if (item.to != "") {
                end = Math.round(regressionY(regData.Ytrain, regData.Xtrain, item.to))
            }

            if (start && end) {

                let temp = Math.min(start, end)
                end = Math.max(start, end)
                start = temp
                if (start <= 0) start = 0
                if (end <= 0) end = 0

                resultstring = ""
                if (start * 1 >= 100) {
                    resultstring += "<div class=\"data__tittle\"></div>100%"
                }


                else {
                    if (end * 1 <= 0) { resultstring = "<div class=\"data__tittle\"></div>0%" } else {
                        if (end > 100) { end = 100 }
                        resultstring += "<div class=\"data__tittle\"></div>от " + start + "% до " + end + "%"
                    }
                }
            }

            else {

                resultstring = "Нет данных"
            }
        }


        if (item.lookingfor == 2) {

            if (item.from != "") {
                start = Math.round(regressionX(regData.Ytrain, regData.Xtrain, item.from))
            }
            if (item.to != "") {
                end = Math.round(regressionX(regData.Ytrain, regData.Xtrain, item.to))
            }

            if (start && end) {
                let temp = Math.min(start, end)
                end = Math.max(start, end)
                start = temp
                if (start <= 0) start = 0
                if (end <= 0) end = 0

                resultstring = ""
                if (start * 1 >= 100) {
                    resultstring += "<div class=\"data__tittle\"></div>100%"
                }


                else {
                    if (end * 1 <= 0) { resultstring = "<div class=\"data__tittle\"></div>0%" } else {
                        if (end > 100) { end = 100 }
                        resultstring += "<div class=\"data__tittle\"></div>от " + start + "% до " + end + "%"
                    }
                }
            }

            else {

                resultstring = "Нет данных"
            }

        }


        $("#overprice__data" + id).append('<div class="tasktag"><div class="taskimg"><img src="' + (item.lookingfor == 1 ? "img/dice.png" : "img/money.png") + '"></div><div><div class="tasktag__name"><strong>' + item.name + '</strong></div><div class="tasktag__value">' + resultstring + '</div></div></div>')
    })
}


let buildpagination = (start, end, pergroup) => {

    $(".pagination").html("")
    start
    for (t = start; t <= start + pergroup; t++) {

        $(".pagination").append('<div class="' + (t >= startpage && t <= endpage ? "pagination__selectedpage" : "pagination__page") + '" onclick="displaypage(' + t + ',' + (t == start ? "-1" : (t == start + pergroup ? "1" : "0")) + ')">' + t + '</div>')

    }

    $(".pagination").append('<div class="pagination__spanpage" onclick="displayspan(' + start + ', ' + (((end - start) - (end - start) % 2) / 2 + (pergroup - pergroup % 2) / 2) + ')">...</div>')

    for (t = ((end - start) - (end - start) % 2) / 2 - (pergroup - pergroup % 2) / 2; t <= ((end - start) - (end - start) % 2) / 2 + (pergroup - pergroup % 2) / 2; t++) {

        $(".pagination").append('<div class="' + (t >= startpage && t <= endpage ? "pagination__selectedpage" : "pagination__page") + '" onclick="displaypage(' + (start * 1 + t) + ')">' + (start * 1 + t) + '</div>')

    }

    $(".pagination").append('<div class="pagination__spanpage" onclick="displayspan(' + (((end - start) - (end - start) % 2) / 2 + (pergroup - pergroup % 2) / 2) + ',' + end + ')" >...</div>')

    for (t = end - pergroup; t <= end; t++) {

        $(".pagination").append('<div class="' + (t >= startpage && t <= endpage ? "pagination__selectedpage" : "pagination__page") + '" onclick="displaypage(' + t + ')">' + t + '</div>')

    }

}


const displaypage = (page, nextpage = 0) => {
    $(".overpricecontainer").html("")
    $(".overpricecontainer").css("display", "flex")
    $(".overpricecontainer").css("align-items", "center")
    $(".overpricecontainer").css("justify-content", "center")
    $(".overpricecontainer").css("height", "calc(100% - 100px)")

    buildWait(".overpricecontainer", 50, "Обработка данных")
    globalindex = page * itemsperpage - itemsperpage
    buildDatanew(globalindex, itemsperpage)


    startpage = page
    endpage = page

    paginationstart = paginationstart + nextpage;

    buildpagination(paginationstart, paginationend, pagespergoup)


}


const displayspan = (paginationstart, paginationend) => {
    $(".overpricecontainer").html("")
    $(".overpricecontainer").css("display", "flex")
    $(".overpricecontainer").css("align-items", "center")
    $(".overpricecontainer").css("justify-content", "center")
    $(".overpricecontainer").css("height", "calc(100% - 100px)")

    buildWait(".overpricecontainer", 50, "Обработка данных")




    startpage = paginationstart
    endpage = paginationstart




    globalindex = startpage * itemsperpage - itemsperpage
    buildDatanew(globalindex, itemsperpage)





    buildpagination(paginationstart, paginationend, pagespergoup)


}


const buildTempPricetypes = (array1, array2) => {
    let types = [];

    array1.forEach(item => { types.push(item.type) })
    array2.forEach(item => {

        if (types.findIndex(item2 => item2 == item.type) == -1) {
            types.push(item.type)
        }
    })
    return types
}



let pushPoints = (fsucсeedprices, ffailedprices, fcurrentstep) => {

    //debugger
    let fs = fsucсeedprices
    let ff = ffailedprices
    TempPricetypes = buildTempPricetypes(fsucсeedprices, ffailedprices);

    TempPricetypes.forEach(item => {

        pricetypeindex = pricetypesdata.findIndex(dataitem => dataitem.type == item)

        let faildata = 0
        let succeeddata = 0

        failindex = ffailedprices.findIndex(dataitem => dataitem.type == item)

        if (failindex != -1) { faildata = ff[failindex].price }

        succeedindex = fsucсeedprices.findIndex(dataitem => dataitem.type == item)

        if (succeedindex != -1) { succeeddata = fs[succeedindex].price }


        let posiibility = succeeddata / (succeeddata * 1 + faildata * 1) * 100

        if (pricetypeindex == -1) {


            pricetypesdata.push({ type: item, data: [[fcurrentstep, posiibility]] })

        }
        else {



            pricetypesdata[pricetypeindex].data.push([fcurrentstep, posiibility])

        }


    })
}