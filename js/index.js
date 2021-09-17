import { Producto } from "./Producto.js";
import {mostrarCard, cargarPaginaActual, ordenar, filtrar} from "./productos.js";
import {siCarritoVacio, finalizarCompra, volverCarrito} from "./carrito.js";
import {formularioPago} from "./pago.js";


//------DECLARO VARIABLES GLOBALES-----
const arrayProductos = [];

cargarSitio();

function cargarSitio () {
    //Cargo los elementos del según el layout asignado a cada tamaño de pantalla
    cargarSeccionSegunMediaQueries();

    //Obtengo el array de productos desde el archivo JSON
    $.getJSON("assets/productos.json", function (productos) {
        for (const producto of productos){
            arrayProductos.push(new Producto (producto.nombre, producto.precio, producto.descripcion, producto.stock, producto.destacado));
            mostrarCard(producto, "grillaProductos");
            if (producto.destacado===true){
                mostrarCard(producto, "productosDestacados");
            }
        }
    });

    //------ANIMACIONES Y EVENTOS--------
    //Animación header
    $(window).scroll(()=>{
        if($("#seccionInicio").hasClass("d-none")===false){
            $("header").toggleClass("menuNavegacion", $(window).scrollTop()>0);
            $("header i").toggleClass("text-dark", $(window).scrollTop()>0);
            $(".navbar-toggler").toggleClass("navbar-dark",$(window).scrollTop()===0);
        }
    });

    //Botones
    $(".btn-seccion").click(cargarPaginaActual);
    $("#menorPrimero").click(ordenar);
    $("#mayorPrimero").click(ordenar);
    $(".checkbox").change(filtrar);

    //Modal
    $("#btn-finalizar").click(finalizarCompra);
    $(`#btn-volver`).click(volverCarrito);
    $(`#btn-pagar`).click(formularioPago);
} 

//Media queries para que el sitio sea responsive
function cargarSeccionSegunMediaQueries (){
    if ($(window).width()>=992){
        //Creo el botón del carrito en la barra de navegación (header)
        $("#navbarSupportedContent ul").append(`<li class="nav-item carrito">  
                                                    <button type="button" class="btn position-relative p-0" data-bs-toggle="modal" data-bs-target="#carritoModal" id="btn-carrito">
                                                        <i class="bi bi-cart4 tamanoIcono text-light"></i>
                                                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger mt-1" id="numBadge">0</span>
                                                    </button>
                                                </li>`);

        $(`#btn-carrito`).click(siCarritoVacio);

    }else{
        //Creo un botón flotante para el carrito
        $("main").append(`<!--Botón flotante para mobile-->
                        <div class="position-fixed" style="bottom:10vh; right:10vh">
                            <button type="button" class="btn position-relative p-0" data-bs-toggle="modal" data-bs-target="#carritoModal" id="btn-flotante-carrito">
                                <i class="bi bi-cart4 tamanoIcono"></i>
                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger mt-1" id="numBadge">0</span>
                            </button>
                        </div>`)
        
        $(`#btn-flotante-carrito`).click(siCarritoVacio);

        //Agrego y elimino clases para ajustar el contenido a la pantalla mobile 
        $(".navbar>div").removeClass("mx-5");
        $(".navbar>div").addClass("px-4");        
        $(".seccionInicio-texto").css("padding-top", "30vh")
        $("#btn-ver-detalles").addClass("d-none");
        $("#btn-filtros").addClass("mb-3 col-12")
                        .removeClass("col-2");
        $("#btn-filtros h5").remove();
        $("#btn-filtros ul").addClass("flex-row justify-content-center");
        $("#btn-filtros li").removeClass("ps-0 pe-0");
        $("#grillaProductos").addClass("w-100");
        $("#dropdownMenuButton1").parents().eq(0).addClass("text-center pt-4")
                                            .removeClass("text-end");
        $("#accordionExample").removeClass("px-3");
        $("#seccionPago").removeClass("mx-5");
        $(".contacto").parents().eq(0).removeClass("px-5")
                                    .addClass("px-3");
    }
}

export {arrayProductos};