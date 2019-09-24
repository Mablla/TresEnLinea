"use strict";
//VARIABLES globales
var filaInicio=0, filaFin=6; // inicializo filas
var columnaInicio=1, columnaFin=7 //Inicializo columnas
var puntos = 0, movimientos = 0;
var control;

function tituloPrincipal(elemento){
    var titulo = true; // var comutador para cambio de color titulo
    var control = setInterval(function(){
    if (titulo){
      $(elemento).attr("style","color:#fff");
      titulo = false;
    } else {
      $(elemento).attr("style","color:#DCFF0E");
      titulo = true;
    }
  },1000);
};

function temporizador(t,visualizado){
  var minutos=0;
  var segundos=0;
  var control;
  control = setInterval(function(){
    minutos = parseInt(t/60,10);
    segundos = parseInt(t%60,10);
    if (minutos < 10) { minutos="0"+ minutos };
    if (segundos< 10) { segundos="0"+ segundos};
    $(visualizado).text(minutos+":"+segundos);
    t--;
    if (t<0){
      $("body").trigger("terminoElTiempo");
      clearInterval(control);
    };

  },1000);
};

function finJuego(){
  clearTimeout(control);
  $(".time").hide();
  $(".panel-score").prepend("<h2 class='titulo-over'>Fin de la Partida</h2>")
  $(".panel-tablero").hide(1000);
  $(".titulo-over").animate({width:'100%'},1000);
  $(".panel-score").animate({width:'100%'},1000);
  $(".moves").animate({width:'100%'},1000);

}


function borraRellena(){
  var i=0,j=0,k=0;
  var col="";
  $("img:hidden").each(function(index){
        $(this).remove();
    });
    for (let i=columnaInicio; i<=columnaFin;i++){
      col=".col-"+(i);
      k=filaFin-($(col).find('img').length)
      for (let j=0; j<=k;j++){
        inserte(col,"p");
      };
    };
};


function mayorCero(columna){
  if ($(columna).find("img").length>0) {return true} else {return false};
};

function recorreTresEnLinea() {
  //VARIABLES SCOPE recorreTresEnLineaa()
  var elemento; //define objeto del DOM
  var ant = "", ctral ="", pos =""; // anterior, central y posterior auxiliares
  var filAnt = 0, filCtral = 0, filPos=0; //filas anterior, central y posterior
  var colAnt="", colCtral="", colPos =""; //columnas anterior, central y posterior
    function recorre(i,j){ // filas, columnas
      function repite(){
        if (mayorCero(colAnt) && mayorCero(colCtral) && mayorCero(colPos)) {
          elemento = $(colAnt).find("img")[filAnt], ant = $(elemento).attr('src');
          elemento = $(colCtral).find("img")[filCtral], ctral = $(elemento).attr('src');
          elemento = $(colPos).find("img")[filPos], pos= $(elemento).attr('src');
          if ((ant==ctral)&&(ctral==pos)) {
            elemento = $(colAnt).find("img")[filAnt];
             $(elemento).hide('pulsate', 2000);
            elemento = $(colCtral).find("img")[filCtral];
             $(elemento).hide('pulsate', 2000);
            elemento = $(colPos).find("img")[filPos];
             $(elemento).hide('pulsate', 2000);
            puntos = puntos + 10;
            $("#score-text").text(puntos);
          };
        };
      };
      // Supervisa tres en linea horizontal
      colAnt = ".col-"+(j-1);
      colCtral = ".col-"+(j);
      colPos = ".col-"+(j+1);
      filAnt = filCtral = filPos=i;
      repite();
      // Supervisa tres en linea vertical
      colAnt = colCtral = colPos = ".col-"+j;
      filAnt=i-1;
      filCtral=i;
      filPos=i+1;
      repite();
    };
  //PRINCIPAL DE recorreTresEnLineaa
  for (let i=filaInicio; i<=filaFin;i++){// filas, columnas
    for (let j=columnaInicio;j<=columnaFin;j++){
      recorre(i,j);
    };
  };
  borraRellena();
  control = setTimeout(recorreTresEnLinea,3000)
  // encadena autollamadas con retardo
};


function AzarSrc(){
  return "image/"+(Math.floor((Math.random() * 4) + 1))+".png";
}

function Puntos(){
  puntos = puntos +10;
  $("#score-text").text(puntos);
};

function sumarMovimientos() {
  movimientos++;
  $("#movimientos-text").text(movimientos);
};

function inserte(columna,insercion){
  // incio del PROCEDIMIENTO
  var elemento = document.createElement("img");
  $(elemento)
    .attr("src", AzarSrc())
    .attr("alt",111)
    .addClass("elemento")
    .draggable({
      grid: [120,90],
      revert: "valid"
  })
  .droppable({
    accept: ".elemento",
    drop: function(event, ui){
      var srcFrom = $(this).attr("src");
      var srcTo = $(ui.draggable).attr("src");
      $(this).attr("src", srcTo);
      $(ui.draggable).attr("src", srcFrom);
      //sumarPuntos();
      sumarMovimientos();
    }

  })
  if (insercion ="p") {
  $(columna).prepend(elemento);
} else {
  $(columna).append(elemento);
}
  // fin del PROCEDIMIENTO
};

function ponerEfectoLluvia(){
  $("div[class^='col']").removeAttr("style");
  $("div[class^='col']").attr("style","display: flex;flex-flow:column-reverse wrap;");
};

function sacarEfectoLluvia(){
  $("div[class^='col']").removeAttr("style");
  $("div[class^='col']").attr("style","display: flex;flex-flow:column wrap;");
  // las siguientes líneas dan vuelta las columnas para que no cambie la
  //disposición visualizada al restaurar => flex-flow:column wrap
  var lista = new Array(7);
  for (let i=columnaInicio; i<=columnaFin;i++){
    lista[i-1]=$('.col-'+(i));
  }
  for (let i=columnaInicio; i<=columnaFin;i++){
    var listaItems = lista[i-1].children();
    lista[i-1].append(listaItems.get().reverse());
  };
};


//ciclos repetitivos "PARA" construido con retardos setTimeout() para producir
//efecto lluvia de caramelos
function llenarTresEnLinea(){
  var col = columnaInicio, colFin =columnaFin;
  var fil = filaInicio, filFin = filaFin
  var columna = "";
  function llenar(){
    if (fil<=filFin){
      if (col<=colFin){
        // inicio procedimiento
        columna = ".col-"+col;
        inserte(columna,"a"); //segundo argumento si es "a": ejecutar append(); si es "p"
                              //ejecuta prepend()
        // finalizo procedimiento
        col++;
      }else{
            col=columnaInicio;
            fil++;
      };
      control=setTimeout(llenar); //Repite ciclo
    }else{
        clearTimeout(control); // limpia variable
        sacarEfectoLluvia();

        control = setTimeout(recorreTresEnLinea,3000);
        //procedimiento encargado de recorrer Tres en linea marcar y borrar

    };
  };
    // PRINCIPAL lluviaDulces
    ponerEfectoLluvia();
    llenar();

};






function inicioTresEnLiena(){
  if(($(".btn-reinicio").text()) == "Reiniciar") {
    location.reload();
  } else{
    $(".btn-reinicio").text("Reiniciar");
    llenarTresEnLinea();
    temporizador(60*2,$("#timer"));
  };
};



$(function(){
  tituloPrincipal($("h1"));
  $("body").on('terminoElTiempo',finJuego);
  $(".btn-reinicio").on('click',inicioTresEnLiena);

});



// if (c.fil<=c.finFila){
//
//       if (c.col<=c.ColFin){
//
//       c.col++;
//     }else{
//           c.col=columnaInicio;
//           c.fil++;
//     };
//   control=setTimeout(llenar);
// }else{
//     clearTimeout(control);
//     //control = setTimeout(recorreTresEnLineaa,2200); // encadena llamadas de ida y vuelta
// };
