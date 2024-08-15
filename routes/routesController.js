//Conexion a base de datos
const db = require('../public/db/conn');
const controller = {};
//Require Funciones
const funcion = require('../public/js/controllerFunctions');
const funcionE = require('../public/js/empleadosFunctions');
const fileUpload = require('express-fileupload');
const axios = require('axios');

// Index GET
controller.index_GET = (req, res) => {
    let user = req.connection.user
    res.render('index.ejs', {
        user: user
    });

};

controller.crear_equipo_GET = (req, res) => {
    res.render('login.ejs');
};

//Login
controller.login = (req, res) => {
    //let user = req.connection.user
    loginId = req.params.id
    if (loginId == 'captura') {
        funcionE.empleadosAccessAll(1, '>=', (err, result) => {

            res.render('login.ejs', {
                 data: loginId, data2: result
            });
        });
    } else

        if (loginId == 'alta_notificar') {
            funcionE.empleadosAccessAll(3, '>=', (err, result) => {

                res.render('login.ejs', {
                    user: user, data: loginId, data2: result
                });
            });
        } else
            if (loginId == 'alta_acceso') {
                funcionE.empleadosAccessAll(3, '>=', (err, result) => {

                    res.render('login.ejs', {
                        user: user, data: loginId, data2: result
                    });
                });
            }
}


controller.programar_GET = (req, res) => {
    let user = req.connection.user
    let access= false

    for (let i = 0; i < req.connection.userGroups.length; i++) {


        if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Embarques_Admin' ) {

            access = true;
            break;
        }
    }

    if (access == true) {

        funcion.controllerClientes((err, result) => {
            if (err) throw err;
            funcion.controllerEmbarques((err, result2) => {
                if (err) throw err;
                res.render('programar.ejs', {
                    user: user, data: result, data2: result2
                });
            });
        });

    } else {
        res.render('acceso_denegado.ejs', {
            user: user
        });
    }
};


controller.programar_cantidad_POST = (req, res) => {

    cliente = req.body.cliente;
    fecha = req.body.fecha_embarque;
    embarque = req.body.embarque;
    let user = req.connection.user
    let access= false;



    for (let i = 0; i < req.connection.userGroups.length; i++) {
        if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Embarques_Admin') {
            access = true;
            break;
        }
    }

    if (access == true) {

        funcion.controllerClientes((err, result) => {
            if (err) throw err;
            res.render('programar_cantidad.ejs', {
                user: user, cliente: cliente, fecha: fecha, embarque: embarque
            });
        });


    } else {
        res.render('acceso_denegado.ejs', {
            user: user
        });
    }
};


controller.guardar_embarque_POST = (req, res) => {

    cliente = req.body.cliente;
    fecha = req.body.fecha_embarque;
    partes = req.body.partes;
    object = JSON.parse(partes)

    let user = req.connection.user
    username = user.substring(4)
    embarque = req.body.embarque
    let access= false;

    for (let i = 0; i < req.connection.userGroups.length; i++) {
        if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Embarques_Admin') {
            access = true;
            break;
        }
    }

    if (access == true) {
        for (let i = 0; i < object.length; i++) {
            funcion.controllerInsertPrograma(embarque, object[i].parte, cliente, object[i].destino, object[i].cantidad, username, fecha, (err, result) => {
                if (err) throw err;
            });

        }

        funcion.controllerInsertCierreInicio(embarque, (err, result2) => {
            if (err) throw err;
        });
        res.render('guardar_embarque.ejs', {
            user: user, data: { embarque, cliente, fecha }
        });



    } else {
        res.render('acceso_denegado.ejs', {
            user: user
        });
    }
};

controller.embarques_GET = (req, res) => {

    let user = req.connection.user
    empleado = 'embarque'
    let access= false;

    for (let i = 0; i < req.connection.userGroups.length; i++) {
        if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Embarques' || 'TFT\\TFT.DEL.PAGES_Embarques_Admin') {
            access = true;
            break;
        }
    }

    if (access == true) {

        funcion.controllerTablaEmbarques((err, result) => {
            if (err) throw err;
            funcion.controllerCountActivoStatusAll((err, result2) => {
                if (err) throw err;
                res.render('embarques.ejs', {
                    user: user, data: result, empleado: empleado, data2: result2
                });
            });
        });


    } else {
        res.render('acceso_denegado.ejs', {
            user: user
        });
    }
};

controller.captura_POST = (req, res) => {

   // let user = req.connection.user
    empleado = req.body.user
   // let access= false;

    // for (let i = 0; i < req.connection.userGroups.length; i++) {
    //     if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Embarques' || 'TFT\\TFT.DEL.PAGES_Embarques_Admin') {
    //         access = true;
    //         break;
    //     }
    // }

    // if (access == true) {

        funcion.controllerTablaEmbarquesActivo((err, result) => {
            if (err) throw err;
            funcion.controllerCountActivoStatusAll((err, result2) => {
                if (err) throw err;
                res.render('embarques.ejs', {
                     data: result, empleado: empleado, data2: result2
                });
            });
        });


    // } else {
    //     res.render('acceso_denegado.ejs', {
    //         user: user
    //     });
    // }
};

controller.captura_embarque_POST = (req, res) => {

   // let user = req.connection.user
    idembarque = req.body.idembarque
    empleado = req.body.idempleado
    existente = 'false'
   // let access= false;

    // for (let i = 0; i < req.connection.userGroups.length; i++) {
    //     if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Embarques' || 'TFT\\TFT.DEL.PAGES_Embarques_Admin') {
    //         access = true;
    //         break;
    //     }
    // }

    //if (access == true) {

        funcionE.empleadosNombre(empleado, (err, resultE) => {
            if (err) throw err;
            funcion.controllerCapturaEmbarque(idembarque, (err, result) => {
                if (err) throw err;
                funcion.controllerCountCierre(idembarque, (err, result3) => {
                    if (err) throw err;
                    funcion.controllerSerialCapturadoAll((err, result2) => {
                        if (err) throw err;

                        res.render('capturar_embarque.ejs', {
                            data: result, data2: resultE, data3: result2, data7: existente, empleadoId: empleado, activos: result3
                        });
                    });
                });
            });
        });



    // } else {
    //     res.render('acceso_denegado.ejs', {
    //         user: user
    //     });
    // }
};

controller.guardar_captura_POST = (req, res) => {



   // let user = req.connection.user
   // let access= false;
    if (req.body.mparte == undefined){
    parte = req.body.parte
    serial = req.body.serial
    cantidad = req.body.cantidad
    empleado = req.body.empleado
    embarque = req.body.embarque2
    empleadoId = req.body.idempleado

    }else{

    parte = req.body.mparte
    serial = req.body.mserial
    cantidad = req.body.mcantidad
    empleado = req.body.mempleado
    embarque = req.body.membarque2
    empleadoId = req.body.midempleado

    }




    // for (let i = 0; i < req.connection.userGroups.length; i++) {
    //     if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Embarques' || 'TFT\\TFT.DEL.PAGES_Embarques_Admin') {
    //         access = true;
    //         break;
    //     }
    // }

    //if (access == true) {

        funcion.controllerSearchSerial(serial, (err, result6) => {
            if (err) throw err;

            if (result6[0].serial >= 1) {
                existente = 'true'

                funcion.controllerCapturaEmbarque(idembarque, (err, result) => {
                    if (err) throw err;
                    funcion.controllerSerialCapturadoAll((err, result2) => {
                        if (err) throw err;
                        funcion.controllerCountCierre(idembarque, (err, result3) => {
                            if (err) throw err;
                            res.render('capturar_embarque.ejs', {
                                 data: result, data2: empleado, data3: result2, data7: existente, empleadoId: empleadoId, activos: result3
                            });
                        });
                    });
                });


            } else {

                if (parte.includes(",")) {

                    var parteArray = parte.split(',');
                    var cantArray = cantidad.split(',');

                    for (let x = 0; x < parteArray.length; x++) {

                        funcion.controllerInsertCaptura(embarque, parteArray[x], cantArray[x], serial, empleado, (err, result2) => {
                            if (err) throw err;

                            funcion.controllerUpdateCapturado(embarque, parteArray[x], cantArray[x], (err, result3) => {
                                if (err) throw err;

                                funcion.controllerComparar(embarque, parteArray[x], (err, result10) => {
                                    if (err) throw err;

                                    if (result10[0].programa_cant == result10[0].programa_capt) {

                                        funcion.controllerUpdateActivo(embarque, parteArray[x], (err, result11) => {

                                        });
                                    }
                                });
                            });
                        });
                    }



                    var delayInMilliseconds = 500;

                    setTimeout(function () {
                        funcion.controllerCapturaEmbarque(embarque, (err, result) => {
                            if (err) throw err;

                            funcion.controllerSerialCapturadoAll((err, result2) => {
                                if (err) throw err;

                                funcion.controllerCountActivo(embarque, (err, result4) => {
                                    if (err) throw err;

                                    if (result4[0].Activos == 0) {

                                        res.render('cerrar_embarque.ejs', {
                                             empleadoId: empleadoId, embarque: embarque
                                        });

                                    } else {

                                        funcion.controllerCountCierre(idembarque, (err, result33) => {
                                            if (err) throw err;
                                            res.render('capturar_embarque.ejs', {
                                                 data: result, data2: empleado, data3: result2, data7: 'false', empleadoId: empleadoId, activos: result33
                                            });
                                        });
                                    }
                                });
                            });
                        });
                    }, delayInMilliseconds);




                } else {

                    funcion.controllerInsertCaptura(embarque, parte, cantidad, serial, empleado, (err, result2) => {
                        if (err) throw err;

                        funcion.controllerUpdateCapturado(embarque, parte, cantidad, (err, result3) => {
                            if (err) throw err;

                            funcion.controllerComparar(embarque, parte, (err, result10) => {
                                if (err) throw err;

                                if (result10[0].programa_cant == result10[0].programa_capt) {

                                    funcion.controllerUpdateActivo(embarque, parte, (err, result11) => {
                                        if (err) throw err;

                                    });

                                }

                                funcion.controllerCapturaEmbarque(embarque, (err, result) => {
                                    if (err) throw err;

                                    funcion.controllerSerialCapturadoAll((err, result2) => {
                                        if (err) throw err;

                                        funcion.controllerCountActivo(embarque, (err, result4) => {
                                            if (err) throw err;

                                            if (result4[0].Activos == 0) {

                                                res.render('cerrar_embarque.ejs', {
                                                     empleadoId: empleadoId, embarque: embarque
                                                });

                                            } else {

                                                funcion.controllerCountCierre(idembarque, (err, result33) => {
                                                    if (err) throw err;
                                                    res.render('capturar_embarque.ejs', {
                                                       data: result, data2: empleado, data3: result2, data7: 'false', empleadoId: empleadoId, activos: result33
                                                    });
                                                });
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                }
            }
        });


    // } else {
    //     res.render('acceso_denegado.ejs', {
    //         user: user
    //     });
    // }
};

controller.embarque_info_POST = (req, res) => {

    let user = req.connection.user
    idembarque = req.body.idEmbarqueInfo
    empleado = req.body.idempleado
    let access= false;

    for (let i = 0; i < req.connection.userGroups.length; i++) {
        if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Embarques' || 'TFT\\TFT.DEL.PAGES_Embarques_Admin') {
            access = true;
            break;
        }
    }

    if (access == true) {


        funcion.controllerCapturaEmbarque(idembarque[0], (err, result) => {
            if (err) throw err;
            funcion.controllerSerialCapturado(idembarque[0], (err, result2) => {
                if (err) throw err;

                res.render('embarque_info.ejs', {
                    user: user, data: result, data3: result2, idembarque: idembarque[0]
                });
            });
        });



    } else {
        res.render('acceso_denegado.ejs', {
            user: user
        });
    }
};

controller.captura_info_POST = (req, res) => {

    let user = req.connection.user
    idembarque = req.body.idEmbarqueInfo
    let access= false;

    for (let i = 0; i < req.connection.userGroups.length; i++) {
        if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Embarques' || 'TFT\\TFT.DEL.PAGES_Embarques_Admin') {
            access = true;
            break;
        }
    }

    if (access == true) {


        funcion.controllerSerialCapturado(idembarque[0], (err, result) => {
            if (err) throw err;

            res.render('captura_info.ejs', {
                user: user, idembarque: idembarque[0], data: result
            });

        });



    } else {
        res.render('acceso_denegado.ejs', {
            user: user
        });
    }
};

controller.status_GET = (req, res) => {

    let user = req.connection.user
    username = user.substring(4)
    let access= false;

    for (let i = 0; i < req.connection.userGroups.length; i++) {
        if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Embarques_Admin') {
            access = true;
            break;
        }
    }

    if (access == true) {

        funcion.controllerTablaEmbarquesStatus(username, (err, result) => {
            if (err) throw err;
            funcion.controllerCountActivoStatus(username, (err, result2) => {
                if (err) throw err;

                res.render('embarques_status.ejs', {
                    user: user, data: result, data2: result2
                });
            });
        });


    } else {
        res.render('acceso_denegado.ejs', {
            user: user
        });
    }
};

controller.cambiar_embarque_POST = (req, res) => {

    let user = req.connection.user
    idembarque = req.body.idEmbarqueInfo
    empleado = req.body.idempleado
    let access= false;

    for (let i = 0; i < req.connection.userGroups.length; i++) {
        if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Embarques_Admin') {
            access = true;
            break;
        }
    }

    if (access == true) {


        funcion.controllerCapturaEmbarque(idembarque, (err, result) => {
            if (err) throw err;
            funcion.controllerSerialCapturado(idembarque, (err, result2) => {
                if (err) throw err;

                res.render('cambiar_embarque.ejs', {
                    user: user, data: result, data3: result2, idembarque: idembarque
                });
            });
        });



    } else {
        res.render('acceso_denegado.ejs', {
            user: user
        });
    }
};


controller.delete_parte_POST = (req, res) => {

    let user = req.connection.user
    idembarque = req.body.idEmbarque
    idparte = req.body.idParte
    empleado = req.body.idempleado
    let access= false;

    for (let i = 0; i < req.connection.userGroups.length; i++) {
        if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Embarques_Admin') {
            access = true;
            break;
        }
    }

    if (access == true) {

        funcion.controllerDeleteParte(idembarque, idparte, (err, result) => {
            if (err) throw err;
            funcion.controllerCapturaEmbarque(idembarque, (err, result) => {
                if (err) throw err;
                funcion.controllerSerialCapturado(idembarque, (err, result2) => {
                    if (err) throw err;

                    res.render('cambiar_embarque.ejs', {
                        user: user, data: result, data3: result2, idembarque: idembarque
                    });
                });
            });
        });



    } else {
        res.render('acceso_denegado.ejs', {
            user: user
        });
    }
};

controller.delete_embarque_POST = (req, res) => {

    let user = req.connection.user
    username = user.substring(4)
    let access= false;

    idembarque = req.body.idEmbarqueDelete
    for (let i = 0; i < req.connection.userGroups.length; i++) {
        if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Embarques_Admin') {
            access = true;
            break;
        }
    }

    if (access == true) {

        funcion.controllerDeleteEmbarque(idembarque, (err, result2) => {
            if (err) throw err;
            funcion.controllerDeleteCaptura(idembarque, (err, result3) => {
                if (err) throw err;
                funcion.controllerDeleteCierre(idembarque, (err, result3) => {
                    if (err) throw err;
                    funcion.controllerTablaEmbarquesStatus(username, (err, result) => {
                        if (err) throw err;
                        funcion.controllerCountActivoStatus(username, (err, result2) => {
                            if (err) throw err;
                            res.render('embarques_status.ejs', {
                                user: user, data: result, data2: result2
                            });
                        });
                    });
                });
            });
        });


    } else {
        res.render('acceso_denegado.ejs', {
            user: user
        });
    }
};

controller.cambiar_parte_POST = (req, res) => {

    let user = req.connection.user
    username = user.substring(4)
    idembarque = req.body.id_embarquec
    idparte = req.body.id_partec
    cant = req.body.id_cantc
    destino = req.body.id_destc
    let access= false;

    for (let i = 0; i < req.connection.userGroups.length; i++) {
        if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Embarques_Admin') {
            access = true;
            break;
        }
    }

    if (access == true) {


        funcion.controllerTablaEmbarquesStatus(username, (err, result) => {
            if (err) throw err;
            res.render('cambiar_parte.ejs', {
                data: { idembarque, idparte, cant, destino }, user: user
            });
        });



    } else {
        res.render('acceso_denegado.ejs', {
            user: user
        });
    }
};

controller.guardar_cambio_POST = (req, res) => {

    let user = req.connection.user
    idembarque = req.body.embarque
    idparte = req.body.parte
    cantidad = req.body.cantidad
    destino = req.body.destino
    let access= false;

    for (let i = 0; i < req.connection.userGroups.length; i++) {
        if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Embarques_Admin') {
            access = true;
            break;
        }
    }

    if (access == true) {

        funcion.controllerUpdateParte(idembarque, idparte, cantidad, destino, (err, result3) => {
            if (err) throw err;
            funcion.controllerCapturaEmbarque(idembarque, (err, result) => {
                if (err) throw err;
                funcion.controllerSerialCapturado(idembarque, (err, result2) => {
                    if (err) throw err;

                    res.render('cambiar_embarque.ejs', {
                        user: user, data: result, data3: result2, idembarque: idembarque
                    });
                });
            });
        });



    } else {
        res.render('acceso_denegado.ejs', {
            user: user
        });
    }
};

controller.alta_acceso_POST = (req, res) => {
    let user = req.connection.user
    numeroEmpleado = req.body.user;

    funcionE.empleadosTodosId((err, result) => {
        if (err) throw err;

        funcionE.empleadosAccesos((err, result2) => {
            if (err) throw err;

            funcionE.empleadosAll((err, result3) => {
                if (err) throw err;

                res.render('alta_acceso.ejs', {
                    user: user, data: result, data2: result2, data3: result3
                });
            });
        });
    });

};

controller.guardar_acceso_POST = (req, res) => {
    gaffete = req.body.gaffete;
    acceso = req.body.acceso;
    let user = req.connection.user

    if (acceso == 'Captura') {
        acceso = 1;
    }

    funcionE.empleadosInsertAcceso(gaffete, acceso, (err, result4) => {
        if (err) throw err;
        funcionE.empleadosTodosId((err, result) => {
            if (err) throw err;

            funcionE.empleadosAccesos((err, result2) => {
                if (err) throw err;

                funcionE.empleadosAll((err, result3) => {
                    if (err) throw err;

                    res.render('alta_acceso.ejs', {
                        user: user, data: result, data2: result2, data3: result3
                    });
                });
            });
        });
    });
};

controller.delete_acceso_POST = (req, res) => {
    gaffete = req.body.gaffete2;
    let user = req.connection.user

    funcionE.empleadosDeleteAcceso(gaffete, (err, result3) => {
        if (err) throw err;
        funcionE.empleadosTodosId((err, result) => {
            if (err) throw err;

            funcionE.empleadosAccesos((err, result2) => {
                if (err) throw err;
                funcionE.empleadosAll((err, result4) => {
                    if (err) throw err;

                    res.render('alta_acceso.ejs', {
                        user: user, data: result, data2: result2, data3: result4
                    });
                });
            });
        });
    });
};

controller.alta_notificar_POST = (req, res) => {
    numeroEmpleado = req.body.user;
    let user = req.connection.user

    funcion.controllerClientes((err, result2) => {
        if (err) throw err;

        funcion.controllerTablaNotificar((err, result3) => {
            if (err) throw err;

            funcionE.empleadosTodos((err, result) => {
                if (err) throw err;



                res.render('alta_notificar.ejs', {
                    user: user, data: result, data2: result3, data3: result2
                });
            });
        });
    });
};

controller.guardar_notificar_POST = (req, res) => {

    correo = req.body.correo;
    cliente = req.body.cliente;
    let user = req.connection.user

    funcion.controllerClientes((err, result2) => {
        if (err) throw err;
        funcion.controllerInsertNotificar(correo, cliente, (err, result20) => {
            if (err) throw err;
            funcion.controllerTablaNotificar((err, result3) => {
                if (err) throw err;

                funcionE.empleadosTodos((err, result) => {
                    if (err) throw err;

                    res.render('alta_notificar.ejs', {
                        user: user, data: result, data2: result3, data3: result2
                    });
                });
            });
        });
    });
};

controller.eliminar_notificar_POST = (req, res) => {

    let user = req.connection.user
    id = req.body.idnot

    funcion.controllerDeleteNotificar(id, (err, result2) => {
        if (err) throw err;
        funcion.controllerTablaNotificar((err, result3) => {
            if (err) throw err;

            funcionE.empleadosTodos((err, result) => {
                if (err) throw err;
                funcion.controllerClientes((err, result2) => {
                    if (err) throw err;

                    res.render('alta_notificar.ejs', {
                        user: user, data: result, data2: result3, data3: result2
                    });
                });
            });
        });
    });
};

controller.cerrar_embarque_POST = (req, res) => {

    //let user = req.connection.user
    empleado = req.body.idempleado
    embarque = req.body.embarque
    caja = req.body.caja
    comentario = req.body.comentario
    inputfile = req.body.fileUploader

    //Upload image to folder upload-temp
    let fileUploader = req.files.fileUploader;
    fileUploader.mv('D:/DEL/embarques/' + embarque + '.jpg', function (err) {
        if (err)
            return res.status(500).send(err);
    });

    // funcion.Compress((err, res) => {
    // });




    funcion.controllerInsertCierre(embarque, caja, comentario, (err, result6) => {
        if (err) throw err;
        funcion.controllerTablaEmbarquesActivo((err, result5) => {
            if (err) throw err;
            funcion.controllerCountActivoStatusAll((err, result2) => {
                if (err) throw err;
                res.render('embarques.ejs', {
                     data: result5, empleado: empleadoId, data2: result2
                });
            });
        });
    });

    //Correo
    funcion.controllerGetCaptura(embarque, (err, seriales) => {
        if (err) throw err;
        funcion.controllerGetEmbarque(embarque, (err, embarqueInfo) => {
            if (err) throw err;
            funcion.controllerGetNotificar(embarqueInfo[0].programa_cliente, (err, correo) => {
                if (err) throw err;

                for (x = 0; x < correo.length; x++) {

                    to = correo[x].not_correo;
                    cc = '';
                    subject = 'Embarque Capturado #' + embarque;
                    empleado = embarqueInfo[0].programa_emp
                    empleadoCaptura = seriales[0].captura_emp
                    cliente = embarqueInfo[0].programa_cliente

                    dataEmail = {
                        to, cc, subject, seriales, empleado, empleadoCaptura, cliente, caja, comentario
                    }

                    // funcion.sendEmail(dataEmail);
                    // console.log(dataEmail)
                }

            });
        });
    });




};


controller.revisar_cierre_POST = (req, res) => {


    let user = req.connection.user
    embarque = req.body.idembarque
    let emb;

    /*
    if(embString.includes("#")){
         emb=embString.replace("#","")
      }else{
         emb=embarque;
      }
      */


    funcion.controllerGetCierre(embarque, (err, result) => {
        if (err) throw err;

        res.render('revisar_cierre.ejs', {
            user: user, embarque: embarque, data: result
        });

    });

}

controller.cierre_directo_POST = (req, res) => {


   // let user = req.connection.user
    embarque = req.body.embarque
    empleadoId = req.body.idempleado


    res.render('cerrar_embarque.ejs', {
        empleadoId: empleadoId, embarque: embarque
    });

}


controller.consulta_serial_GET = (req, res) => {


    serial = req.params.id;

    funcion.getSerial(serial)
        .then((result) => {

            if(result.length>0){res.send("found")}else{res.send("notfound")}

            })
        .catch((err) => { console.log(err) })

};











////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// let amqp = require('amqplib/callback_api');
// const { v4: uuidv4 } = require('uuid');
// let estacion = uuidv4();


controller.getDelivery_POST = (req, res) => {
    let delivery = req.body.delivery
    let qty= req.body.qty
    let embarque= req.body.embarque


    
    // let send = `{
    //     "delivery":"${delivery}",
    //     "qty": "${qty}",
    //     "embarque":"${embarque}",
    // }`

    let send = `{
        "delivery":"${delivery}",
        "stock":"${qty}",
        "embarque":"${embarque}"
    }`

    
    axios({
        method: 'post',
        url: `http://${process.env.API_ADDRESS}:5000/shipment_multiple_delivery`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: send
    })
        .then(result => { res.send(result.data) })
        .catch(err => { res.json(JSON.stringify(err)) })




    // async function waitForPromise() {

    //     let process = "shipment_delivery"
    //     let send = `{"station":"${estacion}","serial_num":"","delivery":"${delivery}","cantidad":"${qty}","process":"${process}", "material":"","embarque":"${embarque}"}`
    //     amqpRequest(send)
    //         .then(result => {
    //             res.json(result)
    //         })
    //         .catch(err => {
    //             console.error(err);
    //         })

    // }
    // waitForPromise()
}





// function amqpRequest(data) {
//     return new Promise((resolve, reject) => {
//         let send = data
//         let args = process.argv.slice(2);
//         let estacion = data.station
//         if (args.length == 0) {
//             // console.info("Usage: rpc_client.js num");
//             // process.exit(1);
//         }

//         console.log(process.env.RMQ_USER);
//         amqp.connect(`amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASS}@${process.env.RMQ_SERVER}`, function (error0, connection) {
//             if (error0) {
//                 // throw error0;
//                 reject(error0)
//             }
//             connection.createChannel(function (error1, channel) {
//                 if (error1) {
//                     // throw error1;
//                     reject(error1)
//                 }
//                 channel.assertQueue('', {
//                     exclusive: true
//                 }, function (error2, q) {
//                     if (error2) {
//                         // throw error2;
//                         reject(error2)
//                     }
//                     let correlationId = estacion;
//                     console.info(' [x] Requesting: ', send);

//                     channel.consume(q.queue, function (msg) {
//                         if (msg.properties.correlationId == correlationId) {
//                             console.info(' [x] Response:   ', msg.content.toString());
//                             resolve(msg.content.toString())
//                             setTimeout(function () {
//                                 connection.close();
//                                 // process.exit(0)
//                             }, 500);

//                         }
//                     }, {
//                         noAck: true
//                     });

//                     channel.sendToQueue('rpc_ship',
//                         Buffer.from(send.toString()), {
//                         correlationId: correlationId,
//                         replyTo: q.queue
//                     });
//                 });
//             });
//         });
//     })
// }




controller.getTotalQty_POST = (req, res) => {

    let embarque = req.body.embarque

    funcion.getTotalQty(embarque)
        .then((result) => {
            res.json(result) })
        .catch((err) => { console.error(err) })
}




controller.getDeliveryInfo_POST = (req, res) => {

    let embarque = req.body.embarque

    funcion.getDelivery(embarque)
        .then((result) => {
            res.json(result) })
        .catch((err) => { console.error(err) })
}


controller.checkSingle_POST = (req, res) => {

    let master = req.body.master
    let single = req.body.single

    funcion.checkSingle(master,single)
        .then((result) => {
            res.json(result) })
        .catch((err) => { console.error(err) })
}












module.exports = controller;