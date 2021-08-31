//-----CLASE PARA CONSTRUIR PRODUCTOS-----
class Producto {
    constructor (nombre, precio, descripcion, stock){
        this.nombre= nombre;
        this.precio= parseInt(precio);
        this.descripcion = descripcion;
        this.stock= stock;
    }

    actualizarStock(x){
        this.stock= this.stock - x;
    }
}


//-----VARIABLES GLOBALES-----
const arrayProductos = [];
let total = 0;
let arrayCarrito = [];


//---------PRODUCTOS----------
//Obtengo el array de productos desde el archivo JSON
$.getJSON("../json/productos.json", function (productos) {
    for (const producto of productos){
        arrayProductos.push(new Producto (producto.nombre, producto.precio, producto.descripcion, producto.stock));
        mostrarLista(producto);
    }
})

//Genero las cards en el HTML a partir del array
function mostrarLista(producto){
    $("#grillaProductos").append(`<div class="col-sm-6 col-md-4 col-lg-3" id="${producto.nombre}Card">
                                    <div class="card mb-2 text-center">
                                        <img src="images/${producto.nombre}.png" class="card-img-top">    
                                        <div class="card-body">
                                            <h5 class="card-title text-capitalize fw-bolder">${producto.nombre}</h5>
                                            <p class="card-text">${producto.descripcion}</p>
                                            <h3>$${producto.precio}</h3>
                                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" id="${producto.nombre}Agregar">
                                            Agregar al carrito
                                            </button>
                                        </div>
                                    </div>
                                </div>`);
    
    $(`#${producto.nombre}Agregar`).click(agregarAlCarrito);

    $("#grillaProductos div").first().fadeIn("fast",function showNext() {
        $(this).next("div").fadeIn("fast", showNext);
    });
}


//-----FUNCIONES PARA ORDENAR LOS PRODUCTOS DE LA TIENDA-------
//Precio: Menor a Mayor
$("#menorPrimero").click(ordenarMenorMayor);
function ordenarMenorMayor(){
    arrayProductos.sort((a,b)=> a.precio - b.precio);
    $("#grillaProductos").empty();
    for (const producto of arrayProductos){
        mostrarLista(producto);
    }
}

//Precio: Mayor a menor
$("#mayorPrimero").click(ordenarMayorMenor);
function ordenarMayorMenor(){
    arrayProductos.sort((a,b)=> b.precio - a.precio);
    $("#grillaProductos").empty();
    for (const producto of arrayProductos){
        mostrarLista(producto);
    }
}


//-----FUNCIONES PARA FILTRAR LOS PRODUCTOS DE LA TIENDA-------
$(".checkbox").change(filtrar);
function filtrar(){
    $("#grillaProductos>div").hide();
    let arrayTemp=[];
    for (i=0; i<$(".checkbox").length; i++ ){
        if($(".checkbox")[i].checked){
            switch (i){
                case 0:
                    arrayTemp= arrayTemp.concat(arrayProductos.filter(el=>el.nombre=="shampoo"));
                    break;
                case 1:
                    arrayTemp= arrayTemp.concat(arrayProductos.filter(el=>el.nombre=="acondicionador"));
                    break;
                case 2:
                    arrayTemp= arrayTemp.concat(arrayProductos.filter(el=>el.nombre=="combo"));
                    break;
            }
        }
    }

    if (arrayTemp.length === 0){
        $("#grillaProductos>div").show();
    }else{
        arrayTemp.forEach(element => {
            $(`#${element.nombre}Card`).show();  
        });
    }
}


//-----FUNCIONES PARA AGREGAR PRODUCTOS AL CARRITO-------
function agregarAlCarrito(e) {
    if ($("#finalizar").hasClass("disabled")){
        $("#finalizar").removeClass("disabled")
        $("#productosCarrito").empty();
    }
    
    let producto = arrayProductos.find(elemento=>elemento.nombre == e.target.id.split("A")[0]);
    producto.actualizarStock(1);
   
    if(producto.stock>=0){
        total = total + producto.precio;
        arrayCarrito.push(producto.nombre);
        mostrarTotal();
        mostrarProductoEnCarrito(producto);

    }else if($("#formularioEnvio").length===0 && $(".mensaje").length===0 && $("formularioCuotas").length===0) {
            mostrarMensaje("Lo sentimos. No tenemos stock en este momento");
            producto.stock = 0;
            total = total;
        }
    return total;
}

//Genero las cards del carrito
function mostrarProductoEnCarrito(producto){
    let cantidad=arrayCarrito.filter(el => el === producto.nombre).length;

    if($(`#${producto.nombre}EnCarrito`).length!=0){
        $(`#${producto.nombre}Cantidad`).html(`<small class="text-muted">Cantidad: ${cantidad}</small>`)
        $(`#${producto.nombre}Precio`).html(`$${producto.precio*cantidad}`)
    }else{
        $("#productosCarrito").append(`<div class="card mb-3 row g-0 p-2" style="max-width:540px" id="${producto.nombre}EnCarrito">
                                            <div class="row g-0">
                                                <div class="col-md-3">
                                                    <img src="images/${producto.nombre}.png" class="img-fluid rounded-start" alt="...">
                                                </div>
                                                <div class="col-md-5">
                                                    <div class="card-body">
                                                        <h6 class="card-title">${producto.nombre.toUpperCase()}</h6>
                                                        <p class="card-text" id="${producto.nombre}Cantidad"><small class="text-muted">Cantidad: ${cantidad}</small></p>
                                                    </div>
                                                </div>
                                                <div class="col-md-3 card-body mt-4">
                                                    <p class="text-center" id="${producto.nombre}Precio">$${producto.precio*cantidad}</p>
                                                </div>
                                                <div class="col-md-1">
                                                    <button type="button" class="btn" id="${producto.nombre}Eliminar"><img src="images/eliminar.png" alt="..." class="eliminarImg"></button>
                                                </div>
                                            </div>
                                        </div>`)
    $(`#${producto.nombre}Eliminar`).click(borrarDelCarrito);
    }

    $("#numBadge").html(`${arrayCarrito.length}`)
}

//Muestro en el HTML el total del carrito
function mostrarTotal (){
    $("#total").html(`Total: $${total}`);
}

//Muestro alerts en el carrito
function mostrarMensaje (mensaje){
    if (mensaje == "Lo sentimos. No tenemos stock en este momento"){
        $("#productosCarrito").append(`<div class="mensaje">
                                            <div class="alert alert-primary alert-dismissible" role="alert">
                                                <strong>${mensaje}</strong>
                                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                            </div>
                                        </div>`);
    }else{
        $("#productosCarrito").append(`<div class="mensaje">
                                            <div class="text-center mt-4 mb-4">
                                                <strong>${mensaje}</strong>
                                            </div>
                                        </div>`);
    }
    $(".mensaje").slideDown();
}


//--------ELIMINAR PRODUCTOS DEL CARRITO----------
function borrarDelCarrito (e){
    console.log($(e.target).parent().attr("id"))
    let producto = arrayProductos.find(elemento => elemento.nombre==$(e.target).parent().attr("id").split("Eli")[0]);
    let cantidad = arrayCarrito.filter(el => el === producto.nombre).length;
    
    producto.stock= producto.stock + cantidad;
    total = total - producto.precio*cantidad;
    arrayCarrito = arrayCarrito.filter(el => el != producto.nombre);
    $("#numBadge").html(`${arrayCarrito.length}`);
    mostrarTotal();
   
    $(`#${producto.nombre}EnCarrito`).css({"background-color": "#E8F5E9", "border-color": " #335145"})
                    .animate(({width: '110%', margin: '-1.25rem'}));
    $(`#${producto.nombre}EnCarrito`).slideUp("slow", function () {
        $(`#${producto.nombre}EnCarrito`).remove();
        siCarritoVacio();
    })
}

function siCarritoVacio () {
    if ($("#productosCarrito").children().length== 0){
        mostrarMensaje("El carrito está vacío");
        desactivarBotones("finalizar");
    }
}

function desactivarBotones(nombre){
    $(`#${nombre}`).addClass("disabled");
}


//-----FUNCIONES PARA CONFIRMAR CARRITO-------
$("#finalizar").click(finalizarCompra);
function finalizarCompra(e){
    if(e.target.innerHTML==="Finalizar"){
        localStorage.setItem("compra", JSON.stringify(arrayCarrito));
        $("#productosCarrito").empty();
        modificarBotonesModal();
        total = descuento(total);
        mostrarTotal();
        preguntarEnvío();
    }  
}

function modificarBotonesModal() {
    $("#seguirComprando").html(`Volver`);
    $("#seguirComprando").attr("id","volver");
    $("#volver").removeAttr("data-bs-dismiss");
    $(`#volver`).click(volverCarrito);

    $("#finalizar").html(`Pagar`);
    $("#finalizar").attr("id","pagar");
    desactivarBotones("pagar");
    $(`#pagar`).click(formularioPago);
}

//Calculo el descuento    
function descuento (total) {
    
    if (total>=5000){
        total = total*0.80;
        mostrarTotal();
        mostrarMensaje("Tenés 20% de descuento");
    }
    return total;
}


//-----FUNCIONES PARA REGENERAR LOS PRODUCTOS DEL CARRITO --------
//Función para regenerar las cards del carrito
function volverCarrito(){
    if (localStorage.length!=0){
        total=0;
        $("#productosCarrito").empty();
        for (i=0; i<JSON.parse(localStorage.getItem("compra")).length; i++){
            let producto = JSON.parse(localStorage.getItem("compra"))[i];
            producto = arrayProductos.find(el => el.nombre === producto);
            mostrarProductoEnCarrito(producto);
            total=total+producto.precio;
        }
        mostrarTotal();
        localStorage.clear();
        revertirBotones();
    }
}

//Modifico los botones del footer del carrito
function revertirBotones() {
    $("#volver").unbind("click", volverCarrito);
    $("#volver").html(`Seguir comprando`);
    $("#volver").attr("id","seguirComprando");
    $("#seguirComprando").attr("data-bs-dismiss", "modal");

    $("#pagar").unbind("click", formularioPago);
    $("#pagar").html(`Finalizar`);
    $("#pagar").attr("id","finalizar");
    $("#finalizar").removeClass("disabled");
    $(`#finalizar`).click(finalizarCompra);
}


//-----FUNCIONES ENVIO-------
function preguntarEnvío(){
    $("#productosCarrito").append(`<div class="card text-center" id="formularioEnvio">
                                    <div class="card-body">
                                        <h5 class="card-title">Envío</h5>
                                        <p class="card-text">¿Querés envío a domicilio?</p>
                                        <a href="#" class="btn btn-primary" id="aceptar">Si</a>
                                        <a href="#" class="btn btn-primary" id="cancelar">No</a>
                                    </div>
                                </div>`);
    $("#aceptar").click(envio);
    $("#cancelar").click(preguntarCuotas);  
    $("#formularioEnvio").slideDown();        
}

//Función para calcular el costo del envío
function envio () {
    if (total>=2000){
        mostrarMensaje(`¡Tenés envío gratis!`);
    }else if (total<2000 && total!=0){
        total=total+700;
        mostrarTotal();
        mostrarMensaje(`El envío cuesta $700`);
    }
    mostrarTotal();
    preguntarCuotas();
}


//-----FUNCIONES CUOTAS-------
function preguntarCuotas(){
    desactivarBotones("aceptar");
    desactivarBotones("cancelar");
    $("#productosCarrito").append(`<div id="formularioCuotas">
                                        <div class="card text-center">
                                            <div class="card-body">
                                                <p class="card-text">¿En cuántas cuotas querés pagar?</p>
                                                <div class="input-group mb-3">
                                                    <input type="number" class="form-control" id="cuotas" placeholder="Ej: 0" aria-label="Recipient's username" aria-describedby="button-addon2">
                                                </div>
                                                <a href="#" class="btn btn-primary" id="confirmar">Aceptar</a>
                                            </div>
                                        </div>
                                    </div>`);
    $("#confirmar").click(totalAPagar); 
    $("#formularioCuotas").slideDown();
}

//Calculo el total de carrito
function totalAPagar () {
    let cuotas = parseInt($("#cuotas").val());
    if(isNaN(cuotas)){
        $("#formularioCuotas").remove();
        preguntarCuotas();
    }else{
        desactivarBotones("confirmar")
        $("#pagar").removeClass("disabled");
        let intereses=calcularIntereses(cuotas);
        total = (total+intereses)
        mostrarTotal();
        if (cuotas===0){
            mostrarMensaje(`El total a pagar es $${total}`);
        }else{
            mostrarMensaje(`El total a pagar es $${total} en ${cuotas} cuotas de $${total/cuotas}`);
        }
    } 
}

//Calculo los intereses de las cuotas
function calcularIntereses (cuotas) {
    if (cuotas==1){
        return 0;
    }else{
        let tasa = 12.3+ cuotas*0.2;
        return tasa*cuotas;
    }
}


//-----FUNCIONES ADICIONALES-----
//Abrir carrito al hacer click en el ícono del carrito (header)
$(`#imgCarrito`).click(siCarritoVacio);

//Función para resetear el localStorage y la propiedad cantidad de los productos del array
function formularioPago() {
    $("#productosCarrito").empty();
    localStorage.clear();
    total=0;
    arrayCarrito = [];
    $("#numBadge").html("0");
    mostrarTotal();
    revertirBotones();
    siCarritoVacio();
}

