//-----CLASE PARA CONSTRUIR PRODUCTOS-----
export class Producto {
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
