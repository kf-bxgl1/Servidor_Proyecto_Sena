const Movimiento = require('../models/movimiento');
module.exports = {
    
    getEntradasSalidas(req, res) {
        const fecha = req.query.fecha || null;
        if(!fecha) {
            return res.status(400).json({
                success: false,
                message: 'Falta la fecha y hora de la operación'
            });
        }
        const operation = {
            fecha: fecha
        };
        Movimiento.getEntradasSalidas(operation, (err, data) => {
            if(err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al obtener los movimientos',
                    error: err
                });
            }
            if(data.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No se encontraron movimientos'
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Movimientos obtenidos',
                data: data //Datos del movimiento
            });
        });
    },

    createEntrada(req, res) {
        const operation = req.body;
        Movimiento.createEntrada(operation, (err, data) => {
            if(err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al crear la entrada',
                    error: err
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Entrada creada',
                data: data //Datos de la entrada
            });
        });
    },

    createSalida(req, res) {
        const operation = req.body;
        Movimiento.createSalida(operation, (err, data) => {
            if(err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al crear la salida',
                    error: err
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Salida creada',
                data: data //Datos de la salida
            });
        });
    }
    
}