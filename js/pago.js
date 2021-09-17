import {siCarritoVacio, activarBotones, mostrarMensaje, modificarBotones, mostrarTotal, total} from "./carrito.js";
import {filtrar} from "./productos.js";

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
                                                <option value="3">3 cuotas de $${((total+calcularIntereses(3))/3).toFixed(2)}</option>
                                                <option value="6">6 cuotas de $${((total+calcularIntereses(6))/6).toFixed(2)}</option>
                                                <option value="12">12 cuotas de $${((total+calcularIntereses(12))/12).toFixed(2)}</option>
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
        let tasa = cuotas*0.12;
        return tasa*total;
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
}

export {formularioPago, procederPago};