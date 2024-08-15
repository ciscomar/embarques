
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


    if(clientePr==="BMW" || clientePr==="FORD"){
        $('#lblsingle2').hide();
        getDelivery()
    }else{
        
        setTimeout(function () {
            $('#serial').focus()
        }, 500)
    }

    // if(clientePr==="FORD"){
    //     $('#deliveryButton').attr("hidden",false)

    // }

    

})



function sendDelivery(e) {

    e.preventDefault()

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

    soundOk()
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





function Enviar() {

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

            response = result.data
            if(response.error != "N/A")
            {
                setTimeout(function () {
                    $('#modalError').modal({ backdrop: 'static', keyboard: false })
                }, 500);
                errorMessage.innerText=response.error

      
            }else{

                if(clientePr==="BMW" ){
                    setTimeout(function () {
                        $('#modalSuccessDelivery').modal({ backdrop: 'static', keyboard: false })
                    }, 500);
                }else if(clientePr==="FORD"){

                 
                     $('#modalScanDelivery').modal({ backdrop: 'static', keyboard: false })
                    $('#finalizarbtn').attr("hidden",false)

                }

                $('#delivery').val("")
            }

        })
        .catch((err) => {
            console.error(err);
        })

}

// function openDelivery() {
//     var newModal = $(
//         `<div class="modal fade animate__animated animate__zoomInDown" id="modalScanDelivery" tabindex="-1" role="dialog"
//          aria-labelledby="modelTitleId" aria-hidden="true">
//          <div class="modal-dialog">
//            <div class="modal-content">
//              <div class="modal-body text-center">
//                <h5 id="tituloSuccess"><span class="text-info  fas fa-truck"></span> Delivery </h5>
//                <p id="cantidadSuccess" style="font-size: x-large"></p>
//              </div>
    
//              <form id="delivery_form">
//                <div class="col-12 col-lg-12 text-center mb-2">
//                  <input type="text" class="form-control" name="delivery" id="delivery" autocomplete="off">
//                </div>
//              </form>
    
//              <div class="modal-footer" id="finalizarbtn" hidden>
//                  <button type="submit" class="btn btn-success btn-block mr-auto" id="btnModalFinalizar"
//                    onClick="finalizar()" data-dismiss="modal"><span class="text-white fas fa-times-circle"></span>
//                    Finalizar</button>
//              </div>
    
//              <div class="modal-footer">
//                <button type="submit" class="btn btn-primary btn-block mr-auto" id="btnModalTerminar"
//                  onClick="cancel()" data-dismiss="modal"><span class="text-white fas fa-times-circle"></span>
//                  Cancelar</button>
//              </div>
//            </div>
//          </div>
//        </div>`
//     );

//     $('body').append(newModal);
//     $('#delivery').val("")
//     $('#finalizarbtn').attr("hidden",false)

//     $('#modalScanDelivery').modal({ backdrop: 'static', keyboard: false })

// }


function cancel() {

    window.location = `/login/captura`

}