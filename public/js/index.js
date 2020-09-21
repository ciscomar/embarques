
// A $( document ).ready() block.
$( document ).ready(function() {
      
          $('#myTable').dataTable( {
			"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]

          } );

// Ocultar boton de atenter si ya esta atendida
          if($('#status_cerrar2').text()=='Atendida'){
          $('#atender').hide()
          }

});

$("#menu-toggle").click(function (e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});

function makeTimer() {
  $('.date_start_time').each(function() {
	    //var endTime = new Date("29 April 2018 9:56:00 GMT+01:00");	
		  var endTime = new Date( $(this).attr('data-date-time') );			
			endTime = (Date.parse(endTime) / 1000);

			var now = new Date();
			now = (Date.parse(now) / 1000);

			var timeLeft = endTime - now;

			var days = Math.floor(timeLeft / 86400); 
			var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
			var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600 )) / 60);
			var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));
  
			if (hours < "10") { hours = "0" + hours; }
			if (minutes < "10") { minutes = "0" + minutes; }
      if (seconds < "10") { seconds = "0" + seconds; }
      
      $(this).parent().find("div.time-elapsed").html(days + " dia(s), " + hours + ":" + minutes + ":" + seconds);

    });
	}

	setInterval(function() { makeTimer(); }, 1000);

$('#escalamientoButton').click(function() {
  $("alert").show();
})







