import {arrayProductos} from "./index.js";
import {procederPago} from "./pago.js";

//-------DECLARO VARIABLES GLOBALES-------
let total = 0;
let arrayCarrito = [];


//--------FUNCIONES PARA EL CARRITO VACIO--------
function siCarritoVacio () {
    if ($("#productosCarrito").children().length== 0){
        mostrarMensaje("El carrito está vacío");
        desactivarBotones("btn-finalizar");
        total=0;
        mostrarTotal();
    }
}

//Muestro alerts en el carrito
function mostrarMensaje (mensaje){
    $("#productosCarrito").append(`<div class="mensaje">
                                        <div class="text-center mt-4 mb-4">
                                            <strong>${mensaje}</strong>
                                        </div>
                                    </div>`);
}

//Muestro en el modal el total del carrito en el modal
function mostrarTotal (){
    $("#total").html(`Total: $${total}`);
}

function activarBotones(btn){
    $(`#${btn}`).removeClass("disabled");
}

function desactivarBotones(idBoton){
    $(`#${idBoton}`).addClass("disabled");
}


//-----FUNCIONES PARA AGREGAR PRODUCTOS AL CARRITO-------
function agregarAlCarrito(e) {
    if($("#formularioEnvio").length===0){
        let producto;

        if($(e.target).attr("id")!=undefined){
            producto=arrayProductos.find(elemento=>elemento.nombre == $(e.target).attr("id").split("A")[0]);
        }else{
            producto = arrayProductos.find(elemento=>elemento.nombre == $(e.target).children().attr("id").split("A")[0]);
        }
    
        producto.actualizarStock(1);

        if ($("#btn-finalizar").hasClass("disabled") && producto.stock>=0){
            activarBotones("btn-finalizar")
            $("#productosCarrito").empty();
        }

        if(producto.stock>=0){
            total = total + producto.precio;
            arrayCarrito.push(producto.nombre);
            mostrarTotal();
            mostrarProductoEnCarrito(producto);
            if(producto.stock===0){
                $(`#${producto.nombre}CardproductosDestacados`).css("opacity", 0.5)
                $(`#${producto.nombre}CardgrillaProductos`).css("opacity", 0.5)
            }
        }else {
            swal("Lo sentimos. No tenemos stock en este momento");
            producto.stock = 0;
            total = total;
        }
    }
    return total;
}


//Genero en el HMTL las cards del carrito
function mostrarProductoEnCarrito(producto){
    let cantidad=arrayCarrito.filter(el => el === producto.nombre).length;

    if($(`#${producto.nombre}EnCarrito`).length!=0){
        $(`#${producto.nombre}Cantidad`).children().html(`Cantidad: ${cantidad}`)
        $(`#${producto.nombre}Precio`).html(`$${producto.precio*cantidad}`)
    }else{
        $("#productosCarrito").append(`<div class="card mb-1 row g-0 p-2 align-" style="max-width:540px" id="${producto.nombre}EnCarrito">
                                            <div class="row g-0">
                                                <div class="col-3">
                                                    <img src="images/${producto.nombre.toLowerCase()}.png" class="img-fluid rounded-start" alt="...">
                                                </div>
                                                <div class="col-5">
                                                    <div class="card-body">
                                                        <h6 class="card-title">${producto.nombre.split(/(?=[A-Z])/).join(" ").toUpperCase()}</h6>
                                                        <p class="card-text" id="${producto.nombre}Cantidad"><small class="text-muted">Cantidad: ${cantidad}</small></p>
                                                    </div>
                                                </div>
                                                <div class="col-3 card-body mt-4">
                                                    <p class="text-center" id="${producto.nombre}Precio">$${producto.precio*cantidad}</p>
                                                </div>
                                                <div class="col-1 mt-4 pt-1">
                                                    <button type="button" class="btn px-0" id="${producto.nombre}Eliminar"><i class="bi bi-trash tamanoIcono"></i></button>
                                                </div>
                                            </div>
                                        </div>`)
        
        $(`#${producto.nombre}Eliminar`).click(borrarDelCarrito);
    }
    
    $("#numBadge").html(`${arrayCarrito.length}`);
}


//--------FUNCIONES PARA ELIMINAR PRODUCTOS DEL CARRITO----------
function borrarDelCarrito (e){
    let producto = arrayProductos.find(elemento => elemento.nombre==$(e.target).parent().attr("id").split("Eli")[0]);
    let cantidad = arrayCarrito.filter(el => el === producto.nombre).length;
    
    producto.stock= producto.stock + cantidad;
    if (producto.stock>0){
        $(`#${producto.nombre}CardproductosDestacados`).css("opacity", 1);
        $(`#${producto.nombre}CardgrillaProductos`).css("opacity", 1);
    }

    total = total - producto.precio*cantidad;
    arrayCarrito = arrayCarrito.filter(el => el != producto.nombre);
    $("#numBadge").html(`${arrayCarrito.length}`);
    mostrarTotal();
   
    $(`#${producto.nombre}EnCarrito`).css({"background-color": "#E8F5E9", "border-color": " #007E33"})
                                    .animate(({width: '110%', margin: '-1.25rem'}));
    $(`#${producto.nombre}EnCarrito`).slideUp("slow", function () {
        $(`#${producto.nombre}EnCarrito`).remove();
        siCarritoVacio();
    })
}

//-----FUNCIONES PARA CONFIRMAR LA COMPRA-------
function finalizarCompra(e){
    localStorage.setItem("compra", JSON.stringify(arrayCarrito));
    arrayCarrito=[];
    $("#productosCarrito").empty();
    modificarBotones("volver", "pagar", "seguir-comprando", "finalizar");
    total = descuento(total);
    mostrarTotal();
    preguntarEnvío();
} 

//Modifica botones del modal
function modificarBotones (btn1, btn2, btn3, btn4){
    $(`#btn-${btn1}`).removeClass("d-none");
    $(`#btn-${btn2}`).removeClass("d-none");
    $(`#btn-${btn3}`).addClass("d-none");
    $(`#btn-${btn4}`).addClass("d-none");
}

//Calculo el descuento    
function descuento (total) {
    if (total>=5000){
        total = total*0.80;
        mostrarTotal();
        swal("Tenés 20% de descuento", {
            buttons: false,
            timer: 3000,
        });
    }
    return total;
}


//-----FUNCIONES ENVIO-------
function preguntarEnvío(){
    $("#productosCarrito").append(`<div class="card text-center" id="formularioEnvio">
                                    <div class="card-body">
                                        <h5 class="card-title">Envío</h5>
                                        <p class="card-text">¿Querés envío a domicilio?</p>
                                        <button type="button" class="btn btn-success" id="btn-aceptar">Si</button>
                                        <button type="button"class="btn btn-success" id="btn-cancelar">No</button>
                                    </div>
                                </div>`);
    $("#btn-aceptar").click(envio);
    $("#btn-cancelar").click(procederPago);  
    $("#formularioEnvio").slideDown();        
}

//Función para calcular el costo del envío
function envio () {
    if (total>=2000){
        swal(`¡Tenés envío gratis!`);
    }else if (total<2000 && total!=0){
        total=total+700;
        mostrarTotal();
        swal(`El envío cuesta $700`);
    }
    mostrarTotal();
    procederPago();
    return total;
}


//-----FUNCIONES PARA RETROCEDER EN EL CARRITO --------
//Función para regenerar las cards del carrito
function volverCarrito(){
if (localStorage.length!=0){
    total=0;
    arrayCarrito= JSON.parse(localStorage.getItem("compra"));
    $("#productosCarrito").empty();
    for (let i=0; i<arrayCarrito.length; i++){
        let producto = arrayCarrito[i];
        producto = arrayProductos.find(el => el.nombre === producto);
        mostrarProductoEnCarrito(producto);
        total=total+producto.precio;
    }
    mostrarTotal();
    localStorage.clear();
    modificarBotones("seguir-comprando", "finalizar", "volver", "pagar");
}
}

export {total, siCarritoVacio, mostrarMensaje, activarBotones, agregarAlCarrito, modificarBotones, finalizarCompra, volverCarrito, mostrarTotal};
