const db = require( '../config/config' ); // Traer la configuracion de la base de datos
const productosController = require('../controllers/productosController');
const Producto = {}; // Crear el objeto Producto

Producto.create = ( producto, result ) => {
    const sql = `
        SELECT COUNT(*) AS datos_existentes FROM productos
        WHERE nombre_producto = ? OR referencia_producto = ?
    `; // Consulta para verificar si el producto ya existe
    db.query( // Ejecutar la consulta
        sql,
        [
            producto.nombre_producto,
            producto.referencia_producto,
            producto.id_almacen
        ],
        ( err, res ) => {
            if( err ) {
                console.log( 'error: ', err );
                result( err, null );
            }
            else{
                console.log( 'Datos existentes: ', res[0] );
                if( res[0].datos_existentes > 0 ) {
                    result(null, { message: 'El producto ya existe' });
                }
                else {
                    const sql = `
                    INSERT INTO productos(nombre_producto,  referencia_producto, stock_minimo, promedio_costo, precio_venta, imagen, id_categoria) 
                    VALUES (?,?,?,?,?,?,?)
                    `; // Consulta para insertar un producto
                    db.query(
                        sql,
                        [
                            producto.nombre_producto,
                            producto.referencia_producto,
                            producto.stock_minimo,
                            producto.promedio_costo,
                            producto.precio_venta,
                            producto.imagen, 
                            producto.id_categoria
                        ],
                        ( err, res ) => {
                            if( err ) {
                                console.log( 'error: ', err );
                                result( err, null );
                            }
                            else{
                                let id_producto = res.insertId;
                                const sql = `
                                INSERT INTO almacenes_productos(id_almacen, id_producto, cantidad_producto_almacen)
                                VALUES (?,?,?)
                                `;
                                db.query(
                                    sql,
                                    [
                                        producto.id_almacen,
                                        id_producto,
                                        producto.cantidad_producto_almacen
                                    ],
                                    ( err, res ) => {
                                        if( err ) {
                                            console.log( 'error: ', err );
                                            result( err, null );
                                        }
                                        else{
                                            console.log( 'Id del nuevo producto: ', id_producto );
                                            result( null, {id_producto, message: 'Producto creado' } );
                                        }
                                    }
                                )
                            }
                        }
                    )
                }
            }
        }
    )
}

Producto.assign = ( producto, result ) => {
    const sql = 
    `
    INSERT INTO almacenes_productos(id_almacen, id_producto, cantidad_producto_almacen)
    VALUES (?,?,?)
    `;
    db.query(
        sql,
        [
            producto.id_almacen,
            producto.id_producto,
            producto.cantidad_producto_almacen
        ],
        ( err, res ) => {
            if( err ) {
                console.log( 'error: ', err );
                result( err, null );
            }
            else{
                console.log( 'Datos del producto: ', res );
                result( null, res );
            }
        }
    )
}

Producto.getAllProductByStore = (producto, result ) => {
    const sql = `
    SELECT productos.id_producto, nombre_producto, referencia_producto, nombre_categoria, cantidad_producto_almacen AS cantidad_disponible
    FROM Productos
    JOIN categorias ON productos.id_categoria = categorias.id_categoria
    JOIN almacenes_productos ON productos.id_producto = almacenes_productos.id_producto
    WHERE almacenes_productos.id_almacen = ? AND cantidad_producto_almacen > 0
    `; // Consulta para leer todos los productos
    db.query(
        sql,
        [
            producto.id_almacen
        ],
        ( err, res ) => {
            if( err ) {
                console.log( 'error: ', err );
                result( err, null );
            }
            else{
                console.log( 'Datos del producto: ', res );
                result( null, res );
            }
        }
    )
}

Producto.getAllProduct = (result) => {
    const sql = `
    SELECT * FROM productos
    `; //Consulta para leer todos los productos
    db.query(
        sql,
        [],
        ( err, res ) => {
            if(err) {
                console.log( 'error: ', err );
                result( err, null );
            }
            else{
                console.log( 'Datos de los productos: ', res );
                result( null, res );
            }
        }
    )
}

Producto.delete = ( producto, result ) => {
    const sql = `
    UPDATE almacenes_productos
    SET estado_producto_almacen = 0
    WHERE id_producto = ? AND id_almacen = ?
`;
    db.query(
        sql,
        [
            producto.id_producto,
            producto.id_almacen
        ],
        ( err, res ) => {
            if( err ) {
                console.log( 'error: ', err );
                result( err, null );
            }
            else{
                console.log( 'Id del producto eliminado: ', res );
                result( null, res, { message: 'Producto eliminado' } );
            }
        }
    )
}

Producto.getDetails = ( producto, result ) => {
    const sql = `
    SELECT
        productos.id_producto, 
        nombre_producto, 
        referencia_producto, 
        nombre_categoria, 
        nombre_almacen AS 'Ubicacion', 
        cantidad_producto_almacen AS 'Cantidad', 
        stock_minimo, 
        promedio_costo AS 'Costo', 
        precio_venta 'Precio', 
        imagen 
    FROM Productos 
    JOIN Almacenes_Productos ON Productos.id_producto = Almacenes_Productos.id_producto
    JOIN Almacenes ON Almacenes_Productos.id_almacen = Almacenes.id_almacen
    JOIN categorias ON Productos.id_categoria = categorias.id_categoria
    WHERE productos.id_producto = ? AND Almacenes.id_almacen = ?
    `; // Consulta para leer los detalles de un producto
    db.query(
        sql,
        [
            producto.id_producto,
            producto.id_almacen
        ],
        ( err, res ) => {
            if( err ) {
                console.log( 'error: ', err );
                result( err, null );
            }
            else{
                console.log( 'Datos del producto: ', res );
                result( null, res );
            }
        }
    )
}

Producto.updateDetails = ( producto, result ) => {
    const sql = `
    SELECT COUNT(*) AS datos_existentes FROM productos
    WHERE referencia_producto = ? AND id_producto != ?
    `;
    db.query(
        sql,
        [
            producto.referencia_producto,
            producto.id_producto,
        ],
        ( err, res ) => { 
            if( err ) {
                console.log( 'error: ', err );
                result( err, null );
            }
            else{
                console.log( 'Datos existentes: ', res[0] );
                if( res[0].datos_existentes > 0 ) {
                    result(null, { message: 'La referencia ya existe' })
                }else{
                    console.log("Ingrese 2 consulta");
                    const sql = `
                    UPDATE productos
                    SET 
                        referencia_producto = ?,
                        nombre_producto = ?,
                        stock_minimo = ?,
                        precio_venta = ?,
                        imagen = ?,
                        id_categoria = ?
                    WHERE id_producto = ?
                    `;
                    db.query(
                        sql, 
                        [
                            producto.referencia_producto,
                            producto.nombre_producto,
                            producto.stock_minimo,
                            producto.precio_venta,
                            producto.imagen,
                            producto.id_categoria,
                            producto.id_producto
                        ],
                        (err, res) => {
                            if( err ) {
                                console.log( 'error: ', err );
                                result( err, null );
                            }
                            else{
                                console.log( 'Id del producto actualizado: ', res );
                                result( null, res, { message: 'Producto actualizado' } );
                            }
                        }
                    )
                }
            }
        }
    )
}

Producto.getTransactions = ( producto, result ) => {
    const sql = `
    SELECT CONCAT('ENT ', entradas.id_entrada) AS 'Referencia',
		DATE_FORMAT(fecha, '%Y-%m-%d') AS 'Fecha',
        origen_entrada AS 'Origen_Destino',
        CONCAT('+',cantidad_entrada) AS 'Cantidad'
    FROM entradas
    JOIN productos_entradas ON entradas.id_entrada = productos_entradas.id_entrada
    JOIN almacenes_productos ON entradas.id_almacen = almacenes_productos.id_almacen
    WHERE productos_entradas.id_producto = ? AND entradas.id_almacen = ?
    UNION
    SELECT CONCAT('SAL ', salidas.id_salida) AS 'Referencia',
        DATE_FORMAT(fecha, '%Y-%m-%d') AS 'FECHA',
        destino_salida AS 'Origen_Destino',
        CONCAT('-',cantidad_salida) AS 'Cantidad'
    FROM salidas
    JOIN productos_salidas ON salidas.id_salida = productos_salidas.id_salida
    JOIN almacenes_productos ON salidas.id_almacen = almacenes_productos.id_almacen
    WHERE productos_salidas.id_producto = ? AND salidas.id_almacen = ?;
    `; // Consulta para leer los movimientos de un producto
    db.query(
        sql,
        [
            producto.id_producto,
            producto.id_almacen,
            producto.id_producto,
            producto.id_almacen
        ],
        ( err, res ) => {
            if( err ) {
                console.log( 'error: ', err );
                result( err, null );
            }
            else{
                console.log( 'Datos del producto: ', res );
                result( null, res );
            }
        }
    )
}

Producto.getProvision = (producto, result ) => {
    const sql = `
    SELECT nombre_producto,
        referencia_producto,
        stock_minimo,
        cantidad_producto_almacen,
        nombre_categoria
    FROM productos
    JOIN almacenes_productos ON productos.id_producto = almacenes_productos.id_producto
    JOIN categorias ON productos.id_categoria = categorias.id_categoria
    WHERE cantidad_producto_almacen <= stock_minimo AND id_almacen = ?;
    `; // Consulta para leer los productos que necesitan abastecimiento
    db.query(
        sql,
        [
            producto.id_almacen
        ],
        ( err, res ) => {
            if( err ) {
                console.log( 'error: ', err );
                result( err, null );
            }
            else{
                console.log( 'Datos del producto: ', res );
                result( null, res );
            }
        }
    )
}

module.exports = Producto;