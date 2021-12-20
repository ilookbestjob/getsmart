let mistake = {
    checkboxes: ["Товар ликвидный, но рекомендации по нему нет", "Рекомендуемая цена слишком низкая", "Рекомендуемая цена слишком высокая"],
    currentproduct: 0
}



$(function () {
    preparecheckboxdata()
    buildCheckboxes(0)


    $(".products").click(function () {
        buildCheckboxes($(this).attr("id") * 1)
        mistake.currentproduct = $(this).attr("id") * 1
        $(".products").removeClass("selected");
        $(this).addClass("selected");
    })

    $(".buttonok").click(function () {
        console.log(prepareGet())
        fetch("actions.php?action=add" + prepareGet()).then(res => res.json()).then(
            res => { if (res.status == "ok")     buildResponse()
            
        
        
        }

        )

    })

})


let buildCheckboxes = (index) => {
    $(".checksection").html('')
    mistake.checkboxes.forEach((item, index2) => {
        $(".checksection").append("<div class=\"check\"><input class=\"checkinput\" type=\"checkbox\" " + (mistake.checkstates[index][index2] ? "checked" : "") + " data-id=\"" + index2 + "\"/><div class=\"checktext\">" + item + "</div></div>")
        $(".comment").val(mistake.comments[index])


    });

    $(".checkinput").click(function () {
        console.log(mistake)
        mistake.checkstates[mistake.currentproduct][$(this).attr("data-id") * 1] = $(this).is(':checked')

    })


    $(".comment").keyup(function () { mistake.comments[mistake.currentproduct] = $(this).val() })

 
}

let preparecheckboxdata = () => {


    mistake = { checkstates: [], ...mistake }

    mistake = { comments: [], ...mistake }

    $(".products").each(function () {
        mistake.checkstates.push([false, false, false])
        mistake.comments.push("")



    })

}


let prepareGet = () => {
    let returnstring = ''

    $(".products").each(function () {
        if (mistake.checkstates[$(this).attr("id") * 1][0] || mistake.checkstates[$(this).attr("id") * 1][1] || mistake.checkstates[$(this).attr("id") * 1][2]) {


            let id = $(this).find(".hiddenid").val()
            returnstring = returnstring + "&ids[]=" + $(this).find(".hiddenid").val() + "&names[]=" + $(this).find(".name").html() + "&price[]=" + $(this).find(".price").html() + "&ava[]=" + $(this).find(".avaprice").html() +

                "&problems[" + id + "]=" +

                mistake.checkstates[$(this).attr("id") * 1].map((item, index) => {

                    if (item) return index + 1
                    else return null
                        ;


                }).filter(item => { return item != null }).join(",") + "&comment[" + id + "]=" + mistake.comments[$(this).attr("id") * 1]







        }



    }
    )
    return returnstring + "&doc=" + $(".header").html();
}


let buildResponse=()=>{
$("body").append('<div class="message" style="display:none;margin-top:20px;opacity:0"><div class="header">Уведомление</div><div class="content">Сообщение успешно доставлено!</div></div>');
$(".mistakewindow").fadeOut(1000);
$(".message").css({"display":"grid"});
$(".message").animate({"marginTop":"70px","opacity":"1"},700);



}