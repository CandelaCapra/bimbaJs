import {arrayProductos} from "./index.js"
import {agregarAlCarrito} from "./carrito.js"

//----------PÁGINA PRODUCTOS-----------
//Genero las cards en el HTML a partir del array
function mostrarCard(producto,ubicacion){
    $(`#${ubicacion}`).append(`<div class="col-sm-6 col-md-4 col-lg-3 m-0" id="${producto.nombre}Card${ubicacion}">
                                    <div class="card mb-2 text-center border-0">
                                        <div class="row align-items-end">    
                                            <img src="images/${producto.nombre.toLowerCase()}.png" class="card-img-top">   
                                            <button type="button" class="btn btn-agregar-carrito" data-bs-toggle="modal" data-bs-target="#carritoModal">
                                                <i class="bi bi-cart4" id="${producto.nombre}Agregar${ubicacion}"></i>
                                            </button>
                                        </div>
                                        <div class="card-body pt-2">
                                            <p class="card-text m-0">${producto.nombre.split(/(?=[A-Z])/).join(" ").toUpperCase()}</p>
                                            <p class="fw-bolder">$${producto.precio}</p>
                                        </div>
                                    </div>
                                </div>`);

    $(`#${producto.nombre}Agregar${ubicacion}`).parent().click(agregarAlCarrito);
    
    //Animación botón agregar al carrito
    $(`#${producto.nombre}Agregar${ubicacion}`).parents().eq(1).hover((e) =>{
            $(`#${producto.nombre}Agregar${ubicacion}`).parent().fadeIn();
        }, (e)=>{
            $(`#${producto.nombre}Agregar${ubicacion}`).parent().hide();
    });

    //Animación cards
    $("#grillaProductos div").first().fadeIn("fast",function showNext() {
        $(this).next("div").fadeIn("fast", showNext);
    });
}

//Muestro la página seleccionada y oculto las otras
function cargarPaginaActual(e) {
    e.preventDefault()
    $(window).scrollTop(0);
    let seccion = $(e.target).html()

    if (seccion === "Bimba biocosmética" || seccion === "Inicio"){
        seccion = "Inicio";
        $("header").removeClass("menuNavegacion");
        $("header i").removeClass("text-dark");
        $(".navbar-toggler").addClass("navbar-dark");
        $("#seccionProductos").addClass("d-none");
        $("#seccionPreguntas").addClass("d-none");
    }else{
        if(seccion === "VER DETALLES" || seccion === "Ver todos los productos" || seccion === "Productos"){
            seccion="Productos";
            $("#seccionInicio").addClass("d-none");
            $("#seccionPreguntas").addClass("d-none");
        }else{
            seccion="Preguntas";
            $("#seccionInicio").addClass("d-none");
            $("#seccionProductos").addClass("d-none");
        }
        $("header").addClass("menuNavegacion");
        $("header i").addClass("text-dark");
        $(".navbar-toggler").removeClass("navbar-dark");
    }

    $('.navbar-collapse').collapse('hide');
    $(`#seccion${seccion}`).removeClass("d-none");
}


//-----FUNCIONES PARA ORDENAR LOS PRODUCTOS DE LA TIENDA-------
function ordenar(e){
    if ($(e.target).attr("id")==="menorPrimero"){
         arrayProductos.sort((a,b)=> a.precio - b.precio);
     }else if($(e.target).attr("id")==="mayorPrimero"){
         arrayProductos.sort((a,b)=> b.precio - a.precio);
     }
     $("#grillaProductos").empty();
     for (const producto of arrayProductos){
         mostrarCard(producto, "grillaProductos");
         if(producto.stock===0){
             $(`#${producto.nombre}CardproductosDestacados`).css("opacity", 0.5)
             $(`#${producto.nombre}CardgrillaProductos`).css("opacity", 0.5)
         }
     }
 }
 
 
 //-----FUNCIONES PARA FILTRAR LOS PRODUCTOS DE LA TIENDA-------
 function filtrar(){
     $("#grillaProductos>div").hide();
     let arrayTemp=[];
     for (let i=0; i<$(".checkbox").length; i++ ){
         if($(".checkbox")[i].checked){
             switch (i){
                 case 0:
                     arrayTemp= arrayTemp.concat(arrayProductos.filter(el=>el.nombre.split(/(?=[A-Z])/)[0]=="shampoo"));
                     break;
                 case 1:
                     arrayTemp= arrayTemp.concat(arrayProductos.filter(el=>el.nombre.split(/(?=[A-Z])/)[0]=="acondicionador"));
                     break;
                 case 2:
                     arrayTemp= arrayTemp.concat(arrayProductos.filter(el=>el.nombre.split(/(?=[A-Z])/)[0]=="combo"));
                     break;
             }
         }
     }
 
     if (arrayTemp.length === 0){
         $("#grillaProductos>div").show();
     }else{
         arrayTemp.forEach(element => {
             $(`#${element.nombre}CardgrillaProductos`).show();  
         });
     }
 }

export {mostrarCard, cargarPaginaActual, ordenar, filtrar};