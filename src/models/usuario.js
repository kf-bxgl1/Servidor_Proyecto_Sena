const db = require('../config/config');
const Usuario = {};

Usuario.getAllDocumentos = (result) => {
    const sql = 'SELECT * FROM tipos_documentos'
    ;
    db.query(
        sql,
        [],
        (err, res) => {
            if(err) {
                console.log('error: ', err);
                result(err, null);
            }
            else{
                console.log('Documentos encontrados: ', res);
                result(null, res);
            }
        }
    )
};

Usuario.create = (user, result) => {
    const sql = 'SELECT COUNT(*) AS datos_existentes FROM usuarios WHERE correo_electronico = ? OR numero_documento = ?'
    ;
    db.query(
        sql,
        [user.correo_electronico, user.numero_documento],
        (err, res) => {
            if(err) {
                console.log('error: ', err);
                result(err, null);
            }
            else{
                console.log('Datos existentes: ', res[0]);
                if(res[0].datos_existentes > 0) {
                    result(null, {message: 'El usuario ya existe'});
                }
                else {
                    const sql = 'INSERT INTO usuarios(nombre_usuario, id_tipo_documento, numero_documento, correo_electronico, contraseña, id_rol)VALUES (?, ?, ?, ?, ?, ?)' 
                    ;
                    db.query(
                        sql,
                        [
                            user.nombre_usuario,
                            user.tipo_documento,
                            user.numero_documento,
                            user.correo_electronico,
                            user.contraseña,
                            user.id_rol
                        ],
                        (err, res) => {
                            if(err) {
                                console.log('error: ', err);
                                result(err, null);
                            }
                            else{
                                console.log('Id del nuevo usuario: ', res.insertId);
                                result(null, res.insertId, {message: 'Usuario creado'});
                            }
                        }
                    )
                }
            }
        }
    )
};

Usuario.login = (user, result) => {
    const sql = 'SELECT id_usuario, id_rol, correo_electronico, nombre_usuario FROM usuarios WHERE correo_electronico = ? AND contraseña = ?'
    ;
    db.query(
        sql,
        [
            user.correo_electronico,
            user.contraseña,
            user.id_rol
        ],
        (err, res) => {
            if(err) {
                console.log('error: ', err);
                result(err, null);
            }
            else{
                console.log('Usuario encontrado: ', res);
                result(null, res, {message: 'Inicio de sesión exitoso'});
            }
        }
    )
};

Usuario.getAllPerfil = (result) => {
    const sql = `SELECT nombre_usuario, correo_electronico, nombre_rol FROM usuarios 
    JOIN roles ON usuarios.id_rol = roles.id_rol 
    WHERE usuarios.id_rol != 1`
    ;
    db.query(
        sql, 
        [],
        (err, res) =>{
            if(err) {
                console.log('error: ', err);
                result(err, null);
            }
            else{
                console.log('Perfiles encontrados: ', res);
                result(null, res);
            }
        }
    )
}

Usuario.updatePerfil = (user, result) => {
    const sql = 'UPDATE usuarios SET nombre_usuario = ?, id_rol = ? WHERE id_usuario = ?'
    ;
    db.query(
        sql,
        [
            user.nombre_usuario,
            user.id_rol,
            user.id_usuario
        ],
        (err, res) => {
            if(err) {
                console.log('error: ', err);
                result(err, null);
            }
            else{
                console.log('Perfil actualizado: ', res);
                result(null, res, {message: 'Perfil actualizado'});
            }
        }
    )
};

Usuario.deletePerfil = (user, result) => {
    const sql = `UPDATE usuarios SET estado = 0 WHERE id_usuario = ?`
    ;
    db.query(
        sql,
        [user.id_usuario],
        (err, res) => {
            if(err) {
                console.log('error: ', err);
                result(err, null);
            }
            else{
                console.log('Perfil eliminado: ', res);
                result(null, res, {message: 'Perfil eliminado'});
            }
        }
    )
};

Usuario.getUsusario = (user, result) => {
    const sql = `SELECT nombre_usuario, tipo_documento, numero_documento, correo_electronico, contraseña FROM usuarios WHERE id_usuario = ?`
    ;
    db.query(
        sql,
        [user.id_usuario],
        (err, res) => {
            if(err) {
                console.log('error: ', err);
                result(err, null);
            }
            else{
                console.log('Perfil encontrado: ', res);
                result(null, res, {message: 'Perfil encontrado'});
            }
        }
    )
};

Usuario.updateUsuario = (user, result) => {
    const sql = `UPDATE usuarios SET nombre_usuario = ?, tipo_documento = ?, numero_documento = ?,correo_electronico = ?, contraseña = ? WHERE id_usuario = ?`
    ;
    db.query(
        sql,
        [
            user.nombre_usuario,
            user.tipo_documento,
            user.numero_documento,
            user.correo_electronico,
            user.contraseña,
            user.id_usuario
        ],
        (err, res) => {
            if(err) {
                console.log('error: ', err);
                result(err, null);
            }
            else{
                console.log('Usuario actualizado: ', res);
                result(null, res, {message: 'Usuario actualizado'});
            }
        }
    )
};

module.exports = Usuario;

