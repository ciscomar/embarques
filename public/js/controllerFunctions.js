const funcion = {};
const express = require('express');
const app = express();
mail_config = require('../email/conn.js');
var mailer = require('express-mailer');
mailer.extend(app, mail_config);
var schedule = require('node-schedule');

const db = require('../db/conn');
const dbP = require('../db/connP');

// funcion.sendEmail = (dataEmail) => {

//     //Enviar Correos
//     app.mailer.send('email.ejs', {

//         //Info General
//         to: dataEmail.to,
//         cc: dataEmail.cc,
//         subject: dataEmail.subject,
//         seriales: dataEmail.seriales,
//         empleado: dataEmail.empleado,
//         empleadoCaptura: dataEmail.empleadoCaptura,
//         cliente: dataEmail.cliente,
//         caja: dataEmail.caja,
//         comentario: dataEmail.comentario,

//     }, function (err) {
//         if (err) {
//             console.log(err)
//             return;
//         }
//         console.log('mail sent')
//     });

// }


funcion.controllerClientes = (callback) => {
    db.query(`SELECT * FROM embarque_cliente`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })

}

funcion.controllerInsertPrograma = (embarque, parte, cliente, destino, cantidad, empleado, fecha, callback) => {
    db.query(`
    INSERT INTO embarque_programa (programa_embarque, programa_parte, programa_cliente, programa_destino, programa_cant, programa_emp, programa_fecha,programa_status)
    VALUES( '${embarque}',TRIM('${parte}'), '${cliente}','${destino}','${cantidad}','${empleado}','${fecha}', 'Activo')`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerLastEmbarque = (cliente, callback) => {
    db.query(`SELECT programa_embarque FROM embarque_programa WHERE programa_cliente= '${cliente}' ORDER BY programa_id DESC LIMIT 1`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result[0]);
        }
    })

}

funcion.controllerTablaEmbarques = (callback) => {
    db.query(`SELECT programa_embarque, programa_cliente, programa_fecha, programa_emp FROM embarque_programa GROUP BY(programa_embarque)`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerTablaEmbarquesActivo = (callback) => {
    db.query(`SELECT programa_embarque, programa_cliente, programa_fecha, programa_emp FROM embarque_programa, embarque_cierre 
    WHERE embarque_programa.programa_embarque= embarque_cierre.embarque AND(embarque_programa.programa_fecha> "2024-01-01")
    AND (embarque_programa.programa_status='Activo'
    || embarque_cierre.caja='Sin Registro')
     GROUP BY(embarque_programa.programa_embarque)`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerEmbarques = (callback) => {
    db.query(`SELECT DISTINCT programa_embarque FROM embarque_programa`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerCapturaEmbarque = (idembarque, callback) => {
    db.query(`SELECT * FROM embarque_programa WHERE programa_embarque='${idembarque}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerInsertCaptura = (embarque, parte, cantidad, serial, empleado, callback) => {
    db.query(`INSERT INTO embarque_captura (captura_embarque, captura_parte, captura_cant, captura_serial, captura_emp, captura_fecha)
    VALUES( '${embarque}',TRIM('${parte}'), ${cantidad},'${serial}','${empleado}', NOW())`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerSerialCapturado = (idembarque, callback) => {
    db.query(`SELECT * FROM embarque_captura WHERE captura_embarque='${idembarque}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerSerialCapturadoAll = (callback) => {
    db.query(`SELECT * FROM embarque_captura ORDER BY captura_id DESC LIMIT 200`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
           
        }
    })

}

funcion.controllerUpdateCapturado = (embarque, parte, cantidad, callback) => {
    db.query(`UPDATE embarque_programa SET programa_capt = programa_capt + ${cantidad} 
    WHERE programa_embarque='${embarque}'
    AND programa_parte='${parte}'`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerTablaEmbarquesStatus = (empleado, callback) => {
    db.query(`SELECT programa_embarque, programa_cliente, programa_fecha, programa_emp FROM embarque_programa WHERE programa_emp='${empleado}' GROUP BY(programa_embarque)`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerCountActivoStatus = (empleado, callback) => {
    db.query(`SELECT programa_embarque, COUNT (programa_status) AS Activo FROM embarque_programa WHERE programa_emp='${empleado}' AND programa_status='Activo' GROUP BY(programa_embarque)`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerCountActivoStatusAll = (callback) => {
    db.query(`SELECT programa_embarque, COUNT (programa_status) AS Activo FROM embarque_programa WHERE programa_status='Activo' GROUP BY(programa_embarque)`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerDeleteParte = (idembarque, idparte, callback) => {
    db.query(`DELETE FROM embarque_programa WHERE programa_embarque='${idembarque}' AND programa_parte='${idparte}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })

}

funcion.controllerDeleteEmbarque = (idembarque, callback) => {
    db.query(`DELETE FROM embarque_programa WHERE programa_embarque='${idembarque}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })

}

funcion.controllerDeleteCaptura = (idembarque, callback) => {
    db.query(`DELETE FROM embarque_captura WHERE captura_embarque='${idembarque}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })

}

funcion.controllerUpdateParte = (embarque, parte, cantidad, destino, callback) => {
    db.query(`UPDATE embarque_programa 
    SET programa_cant = ${cantidad},
    programa_destino = '${destino}'
    WHERE programa_embarque='${embarque}'
    AND programa_parte='${parte}'`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerUpdateActivo = (embarque, parte, callback) => {
    db.query(`UPDATE embarque_programa SET
    programa_status= 'Completo'
    WHERE programa_embarque='${embarque}'
    AND programa_parte='${parte}'`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerComparar = (embarque, parte, callback) => {
    db.query(`SELECT programa_cant, programa_capt FROM embarque_programa WHERE programa_embarque='${embarque}' AND programa_parte= '${parte}' `, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerCountActivo = (idembarque, callback) => {
    db.query(`SELECT COUNT (*) AS Activos FROM embarque_programa WHERE programa_embarque='${idembarque}' AND programa_status='Activo'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerSearchSerial = (serial, callback) => {
    db.query(`SELECT COUNT (*) AS serial FROM embarque_captura WHERE captura_serial='${serial}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerGetCaptura = (embarque, callback) => {
    db.query(`SELECT * FROM embarque_captura WHERE captura_embarque='${embarque}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerGetEmbarque = (embarque, callback) => {
    db.query(`SELECT * FROM embarque_programa WHERE programa_embarque='${embarque}' LIMIT 1`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerTablaNotificar = (callback) => {

    db.query(`SELECT * FROM embarque_notificar`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerInsertNotificar = (correo, cliente, callback) => {
    db.query(`
    INSERT INTO embarque_notificar (not_correo, not_cliente)
    VALUES( '${correo}','${cliente}')`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerDeleteNotificar = (id, callback) => {
    db.query(`
    DELETE FROM embarque_notificar WHERE not_id = ${id}`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerGetNotificar = (cliente, callback) => {

    db.query(`SELECT * FROM embarque_notificar WHERE not_cliente='${cliente}' || not_cliente='TODOS'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })

}

funcion.controllerInsertCierre = (embarque, caja, comentario, callback) => {
    db.query(`UPDATE embarque_cierre
    SET caja = '${caja}',
    comentario = '${comentario}'
    WHERE embarque='${embarque}'`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerGetCierre = (embarque, callback) => {

    db.query(`SELECT * FROM embarque_cierre WHERE embarque='${embarque}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })

}

funcion.controllerInsertCierreInicio = (embarque, callback) => {

    db.query(`INSERT INTO embarque_cierre(embarque, caja, comentario)
    VALUES( '${embarque}','Sin Registro','Sin Registro')`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })

}


funcion.controllerDeleteCierre = (embarque, callback) => {

    db.query(`DELETE FROM embarque_cierre WHERE embarque='${idembarque}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })

}

funcion.controllerCountCierre = (embarque, callback) => {
    db.query(`SELECT COUNT (*) AS activos FROM embarque_programa WHERE programa_embarque='${embarque}' AND programa_cant != programa_capt`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result[0]);
        }
    })

}

funcion.Compress = (callback) => {
    
    var compress_images = require('compress-images'), INPUT_path_to_your_images, OUTPUT_path;

    INPUT_path_to_your_images = 'public/temp/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}';
    OUTPUT_path = 'public/uploads/';

    compress_images(INPUT_path_to_your_images, OUTPUT_path, { compress_force: false, statistic: true, autoupdate: true }, false,
        { jpg: { engine: 'mozjpeg', command: ['-quality', '60'] } },
        { png: { engine: 'pngquant', command: ['--quality=20-50'] } },
        { svg: { engine: 'svgo', command: '--multipass' } },
        { gif: { engine: 'gifsicle', command: ['--colors', '64', '--use-col=web'] } }, function (error, completed, statistic) {

            if (completed === true) {
                const fs = require('fs');
                const path = require('path');

                const directory = 'public/temp/';

                fs.readdir(directory, (err, files) => {
                    if (err) throw err;

                    for (const file of files) {
                        fs.unlink(path.join(directory, file), err => {
                            if (err) throw err;
                        });
                    }
                });
            }
        });

}



funcion.getSerial = (serial) => {
    return new Promise((resolve, reject) => {
        dbP(`SELECT captura_serial FROM embarque_captura WHERE captura_serial='${serial}' `)
            .then((result) => { resolve(result) })
            .catch((error) => { reject(error) })
    })
}



funcion.getTotalQty = (embarque) => {
    return new Promise((resolve, reject) => {

        dbP(`SELECT SUM(programa_cant) AS Total
        FROM 
            embarque_programa 
        WHERE 
            programa_embarque= '${embarque}'
            
            `)
            .then((result) => { resolve(result) })
            .catch((error) => { reject(error) })
    })
}



funcion.getDelivery = (embarque) => {
    return new Promise((resolve, reject) => {

        dbP(`SELECT COUNT(id) AS found
        FROM 
            embarque_delivery
        WHERE 
            delivery_embarque= '${embarque}'
            
            `)
            .then((result) => { resolve(result) })
            .catch((error) => { reject(error) })
    })
}



funcion.checkSingle = (master,single) => {
    return new Promise((resolve, reject) => {

        dbP(`SELECT COUNT(id) AS found
        FROM 
            embarque_delivery
        WHERE 
            delivery_master LIKE '%${master}' AND  delivery_single= '${single}'
            
            `)
            .then((result) => { resolve(result) })
            .catch((error) => { reject(error) })
    })
}



module.exports = funcion;