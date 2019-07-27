
function blanco(){
  setTimeout($("h1").switchClass("titulo-amarillo","titulo-blanco"),1000)
  amarillo()
}

function amarillo(){
  setTimeout($("h1").switchClass("titulo-blanco","titulo-amarillo"),1000)
  blanco()
}

$(function(){
//  window.alert('antes')
//  blanco()
//  window.alert('despues')

})
