

let delivery_form = document.getElementById("delivery_form")
let single_form = document.getElementById("single_form")
let delivery = document.getElementById("delivery")
let tituloEmbarque = document.getElementById("tituloEmbarque")
let errorMessage = document.getElementById("errorMessage")

delivery_form.addEventListener("submit", sendDelivery)
single_form.addEventListener("submit", checkSingle)
let TotalQty
let foundDelivery

$(document).ready(function () {


    if(clientePr==="BMW"){
        $('#lblsingle2').hide();
        getDelivery()
    }else{
        
        setTimeout(function () {
            $('#serial').focus()
        }, 500)
    }

    

})



function sendDelivery(e) {

    e.preventDefault()
    soundOk()

    $('#modalScanDelivery').modal('hide')
    setTimeout(function () {
        $('#modalSpinner').modal({ backdrop: 'static', keyboard: false })
    }, 500);

    let data = { "delivery": `${delivery.value}`, "qty": `${TotalQty}`,"embarque": `${(tituloEmbarque.innerText).substring((tituloEmbarque.innerText).indexOf("#") + 1)}` };
    axios({
        method: 'post',
        url: "/getDelivery",
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((result) => {
            setTimeout(function () {
                $('#modalSpinner').modal('hide')
            }, 1000);

            response = JSON.parse(result.data)
            if(response.error != "N/A")
            {
                setTimeout(function () {
                    $('#modalError').modal({ backdrop: 'static', keyboard: false })
                }, 500);
                errorMessage.innerText=response.error

      
            }else{

                setTimeout(function () {
                    $('#modalSuccessDelivery').modal({ backdrop: 'static', keyboard: false })
                }, 500);

            }

        })
        .catch((err) => {
            console.error(err);
        })

}



function getTotal() {
   

    let data = { "embarque": `${(tituloEmbarque.innerText).substring((tituloEmbarque.innerText).indexOf("#") + 1)}` };
    axios({
        method: 'post',
        url: "/getTotalQty",
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((result) => {

            data = result.data[0]
            TotalQty = data.Total

        })
        .catch((err) => {
            console.error(err);
        })

}




function getDelivery() {


    let data = { "embarque": `${(tituloEmbarque.innerText).substring((tituloEmbarque.innerText).indexOf("#") + 1)}` };
    axios({
        method: 'post',
        url: "/getDeliveryInfo",
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((result) => {

            data = result.data[0]
            foundDelivery = data.found

            if (foundDelivery == 0) {
                $('#modalScanDelivery').modal({ backdrop: 'static', keyboard: false })

              
                setTimeout(function () {
                    $('#delivery').focus()
                }, 500);
                getTotal()
            }else{
            $('#modalScanDelivery').attr("hidden",true)
            $('#modalScanDelivery').remove()

            }


        })
        .catch((err) => {
            console.error(err);
        })

}




function checkSingle(e) {

    e.preventDefault()

    let data = { "master": `${$('#serial').val()}`, "single": `${($('#single').val()).substring(1)}` };
    axios({
        method: 'post',
        url: "/checkSingle",
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((result) => {

            data = result.data[0]
            foundSingle = data.found

            if (foundSingle === 1) {

                $('#single').val("")
                $('#lblsingle2').hide();
                $('#modalSingle').modal('hide')
                $('#parte').focus()
                $('#serial').attr('readonly', true);
            } else {

                $('#lblsingle2').show();
                var msgS = document.getElementById("lblsingle");
                msgS.innerHTML = 'Incorrecto';
                msgS.classList.remove('text-success');
                msgS.classList.add('text-dark');
                $('#single').val("")

            }

        })
        .catch((err) => {
            console.error(err);
        })

}





function cancelSingle() {

    $('#single').val("")
    $('#lblsingle2').hide();
    var msg = document.getElementById("lblserial");
    var seriali = document.getElementById("serial");
    $('#lblserial2').hide();
    $('#btnguardar').prop("disabled", false);
    msg.innerHTML = '';
    seriali.classList.remove('border-success');
    msg.classList.remove('text-success');
    $('#serial').val("")
    $('#btnguardar').prop("disabled", true);
    $('#serial').focus()


}



function closeError() {

    $('#delivery').val("")
    $('#modalScanDelivery').modal({ backdrop: 'static', keyboard: false })


}










function cancel() {

    window.location = `/login/captura`

}