//-----CLASE PARA CONSTRUIR PRODUCTOS-----
class Producto {
    constructor (nombre, precio, descripcion, stock, destacado){
        this.nombre= nombre;
        this.precio= parseInt(precio);
        this.descripcion = descripcion;
        this.stock= stock;
        this.destacado=destacado;
    }

    actualizarStock(x){
        this.stock= this.stock - x;
    }
}

//-----DECLARO VARIABLES GLOBALES-----
const arrayProductos = [];
let total = 0;
let arrayCarrito = [];

cargarSitio();

function cargarSitio () {
    //Cargo los elementos del según el layout asignado a cada tamaño de pantalla
    cargarSitioSegunMediaQueries();

    //---------CARGO LOS PRODUCTOS----------
    //Obtengo el array de productos desde el archivo JSON
    $.getJSON("../json/productos.json", function (productos) {
        for (const producto of productos){
            arrayProductos.push(new Producto (producto.nombre, producto.precio, producto.descripcion, producto.stock, producto.destacado));
            mostrarCard(producto, "grillaProductos");
            if (producto.destacado===true){
                mostrarCard(producto, "productosDestacados");
            }
        }
    });

    //------ANIMACIONES Y EVENTOS--------
    //Cargo animaciones del header
    $(window).scroll(()=>{
        if($("#seccionInicio").hasClass("d-none")===false){
            $("header").toggleClass("menuNavegacion", $(window).scrollTop()>0);
            $("header i").toggleClass("text-dark", $(window).scrollTop()>0);
            $(".navbar-toggler").toggleClass("navbar-dark",$(window).scrollTop()===0);
        }
    });

    //Eventos para los botones de la página 
    $(".btn-seccion").click(cargarPagina);
    $("#menorPrimero").click(ordenar);
    $("#mayorPrimero").click(ordenar);
    $(".checkbox").change(filtrar);

    //Eventos del modal
    $("#btn-finalizar").click(finalizarCompra);
    $(`#btn-volver`).click(volverCarrito);
    $(`#btn-pagar`).click(formularioPago);
} 

//Media queries para que el sitio sea responsive
function cargarSitioSegunMediaQueries (){
    if ($(window).width()>=992){
        $("#navbarSupportedContent ul").append(`<li class="nav-item carrito">  
                                                    <button type="button" class="btn position-relative p-0" data-bs-toggle="modal" data-bs-target="#carritoModal" id="btn-carrito">
                                                        <i class="bi bi-cart4 tamanoIcono text-light"></i>
                                                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger mt-1" id="numBadge">0</span>
                                                    </button>
                                                </li>`);

        $(`#btn-carrito`).click(siCarritoVacio);

    }else{
        $("main").append(`<!--Botón flotante para mobile-->
                        <div class="position-fixed" style="bottom:10vh; right:10vh">
                            <button type="button" class="btn position-relative p-0" data-bs-toggle="modal" data-bs-target="#carritoModal" id="btn-flotante-carrito">
                                <i class="bi bi-cart4 tamanoIcono"></i>
                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger mt-1" id="numBadge">0</span>
                            </button>
                        </div>`)
        
        $(`#btn-flotante-carrito`).click(siCarritoVacio);

        $("#btn-filtros").addClass("mb-3 col-12")
                        .removeClass("col-2");
        $("#btn-filtros h5").remove();
        $("#btn-filtros ul").addClass("flex-row justify-content-center");
        $("#btn-filtros li").removeClass("ps-0 pe-0");
        $("footer .contacto").addClass("text-center");
    }
}

//Muestra un mensaje si el carrito está vacío
function siCarritoVacio () {
    if ($("#productosCarrito").children().length== 0){
        mostrarMensaje("El carrito está vacío");
        desactivarBotones("btn-finalizar");
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

function desactivarBotones(idBoton){
    $(`#${idBoton}`).addClass("disabled");
}

//Genero las cards en el HTML a partir del array
function mostrarCard(producto,ubicacion){
    $(`#${ubicacion}`).append(`<div class="col-sm-6 col-md-4 col-lg-3" id="${producto.nombre}Card${ubicacion}">
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
    
    //Animación botón agregar al carrito y cards
    $(`#${producto.nombre}Agregar${ubicacion}`).parents().eq(1).hover((e) =>{
            $(`#${producto.nombre}Agregar${ubicacion}`).parent().fadeIn();
        }, (e)=>{
            $(`#${producto.nombre}Agregar${ubicacion}`).parent().hide();
    });

    $("#grillaProductos div").first().fadeIn("fast",function showNext() {
        $(this).next("div").fadeIn("fast", showNext);
    });
}

//Muestro la sección seleccionada y oculto las otras
function cargarPagina(e) {
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
    for (i=0; i<$(".checkbox").length; i++ ){
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

function activarBotones(btn){
    $(`#${btn}`).removeClass("disabled");
}

//Genero las cards del carrito
function mostrarProductoEnCarrito(producto){
    let cantidad=arrayCarrito.filter(el => el === producto.nombre).length;

    if($(`#${producto.nombre}EnCarrito`).length!=0){
        $(`#${producto.nombre}Cantidad`).children().html(`Cantidad: ${cantidad}`)
        $(`#${producto.nombre}Precio`).html(`$${producto.precio*cantidad}`)
    }else{
        $("#productosCarrito").append(`<div class="card mb-1 row g-0 p-2 align-" style="max-width:540px" id="${producto.nombre}EnCarrito">
                                            <div class="row g-0">
                                                <div class="col-md-3">
                                                    <img src="images/${producto.nombre.toLowerCase()}.png" class="img-fluid rounded-start" alt="...">
                                                </div>
                                                <div class="col-md-5">
                                                    <div class="card-body">
                                                        <h6 class="card-title">${producto.nombre.split(/(?=[A-Z])/).join(" ").toUpperCase()}</h6>
                                                        <p class="card-text" id="${producto.nombre}Cantidad"><small class="text-muted">Cantidad: ${cantidad}</small></p>
                                                    </div>
                                                </div>
                                                <div class="col-md-3 card-body mt-4">
                                                    <p class="text-center" id="${producto.nombre}Precio">$${producto.precio*cantidad}</p>
                                                </div>
                                                <div class="col-md-1 mt-4 pt-1">
                                                    <button type="button" class="btn" id="${producto.nombre}Eliminar"><i class="bi bi-trash tamanoIcono"></i></button>
                                                </div>
                                            </div>
                                        </div>`)
        
        $(`#${producto.nombre}Eliminar`).click(borrarDelCarrito);
    }
    
    $("#numBadge").html(`${arrayCarrito.length}`);
}

//Muestro en el HTML el total del carrito
function mostrarTotal (){
    $("#total").html(`Total: $${total}`);
}


//--------ELIMINAR PRODUCTOS DEL CARRITO----------
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
        $("#productosCarrito").empty();
        modificarBotones("volver", "pagar", "seguir-comprando", "finalizar");
        total = descuento(total);
        mostrarTotal();
        preguntarEnvío();
} 

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
        modificarBotones("seguir-comprando", "finalizar", "volver", "pagar");
    }
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


//-------FUNCIONES PARA EL PAGO DE LA COMPRA---------
function procederPago(){
    activarBotones("btn-pagar");
    $("#productosCarrito").empty();
    mostrarMensaje(`El total a pagar es $${total}`);
}


function formularioPago () {
    $("#carritoModal").modal("hide");
    $("#seccionProductos").addClass("d-none");
    $("#seccionInicio").addClass("d-none");
    $("header").addClass("d-none");
    $("footer").addClass("d-none");
    $("#btn-flotante-carrito").addClass("d-none")
    mostrarFormularioPago();
}

function mostrarFormularioPago () {
    $(window).scrollTop(0);
    $("#seccionPago").removeClass("d-none");
    $("#seccionPago").append( `<h1 class="text-center">Formulario de pago</h1>
                                <form id="formularioPago" onsubmit="return false">
                                    <div class="row g-3 mt-4" >
                                        <h3>Datos personales</h3>
                                        <div class="col-md-6">
                                            <label for="inputName" class="form-label">Nombre</label>
                                            <input type="text" class="form-control" id="inputName" value="María" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="inputSurname" class="form-label">Apellido</label>
                                            <input type="text" class="form-control" id="inputSurname" value="Martinez" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="inputID" class="form-label">Número de documento</label>
                                            <input type="number" class="form-control" id="inputID" value="12123123" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="inputEmail4" class="form-label">Email</label>
                                            <input type="email" class="form-control" id="inputEmail4" value="maria.martinez@gmail.com" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="inputPhone" class="form-label">Teléfono</label>
                                            <input type="number" class="form-control" id="inputPhone" value="12341234" required>
                                        </div>
                                    </div>  

                                    <div class="row g-3 mt-4">
                                        <h3>Datos de envío</h3>
                                        <div class="col-12">
                                            <label for="inputAddress" class="form-label">Dirección</label>
                                            <input type="text" class="form-control" id="inputAddress" placeholder="Paraná 1234" value="Calle 1234" required>
                                        </div>
                                        <div class="col-md-4">
                                            <label for="inputState" class="form-label">Provincia</label>
                                            <input type="text" class="form-control" id="inputState" value="Buenos Aires" required>
                                        </div>
                                        <div class="col-md-4">
                                            <label for="inputCity" class="form-label">Localidad</label>
                                            <input type="text" class="form-control" id="inputCity" value="C.A.B.A." required>
                                        </div>
                                        <div class="col-md-2">
                                            <label for="inputZip" class="form-label">Código postal</label>
                                            <input type="text" class="form-control" id="inputZip" value="1234" required>
                                        </div>
                                    </div>

                                    <div class="row g-3 mt-4">
                                        <h3>Pago</h3>
                                        <div class="col-md-6">
                                            <label for="inputCardNumber" class="form-label">Número de tarjeta</label>
                                            <input type="number" class="form-control" id="inputCardNumber" value="1234123412341234" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="inputCardName" class="form-label">Nombre en la tarjeta</label>
                                            <input type="text" class="form-control" id="inputCardName" value="Maria Martinez" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="inputExpirationDate" class="form-label">Fecha de vencimiento</label>
                                            <input type="text" class="form-control" id="inputExpirationDate" placeholder="mm/aa" value="12/22" required>
                                        </div>
                                        <div class="col-md-2">
                                            <label for="inputCode" class="form-label">CVV</label>
                                            <input type="text" class="form-control" id="inputCode" value="123" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label" for="formSelecCuotas">Cuotas</label>
                                            <select class="form-select btn-outline-success" id="formSelecCuotas">
                                                <option selected>Elegí la cantidad de cuotas</option>
                                                <option value="1">1 cuota de $${total+calcularIntereses(1)}</option>
                                                <option value="3">3 cuotas de $${total+calcularIntereses(3)}</option>
                                                <option value="6">6 cuotas de $${total+calcularIntereses(6)}</option>
                                                <option value="12">12 cuotas de $${total+calcularIntereses(12)}</option>
                                            </select>
                                        </div>
                                        <div class="col-12 pt-5">
                                            <button type="submit" class="btn btn-success">Confirmar</button>
                                        </div>
                                    </div>
                                </form>`)
    
    $("#formularioPago").submit((e)=>{
        e.preventDefault()

        if ($("#formSelecCuotas").val()==="Elegí la cantidad de cuotas"){
            swal("¡Ups!","Parece que no elegiste en cuántas cuotas querés pagar")
        }else{
            swal(`¡Felicitaciones, ${$(e.target[0]).val()}!`, "El pago se realizó con éxito", "success");
            $(".swal-button--confirm").click(reiniciarPagina);
        }
    });
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

//Vuelvo a generar la página principal y limpio los filtros y el carrito
function reiniciarPagina () {
    $(window).scrollTop(0);
    $("#numBadge").html("0");
    $("#btn-flotante-carrito").removeClass("d-none")
    resetearCarrito();
    $(`.checkbox:checked`).prop("checked", false);
    filtrar();
    $("#seccionPago").empty()
                    .addClass("d-none");
    $("header").removeClass("d-none");
    $("#seccionInicio").removeClass("d-none");
    $("footer").removeClass("d-none");}


//Limpio el carrito para realizar una nueva compra
function resetearCarrito (){
    $("#productosCarrito").empty();
    modificarBotones("seguir-comprando", "finalizar", "volver", "pagar"); 
    siCarritoVacio();
    localStorage.clear();
    total=0;
    mostrarTotal();
    arrayCarrito = [];
}