const express = require('express');
const router = express.Router();
const routesController = require('./routesController')

//Routes

router.get('/', routesController.index_GET);
router.get('/login/:id', routesController.login);
router.get('/programar', routesController.programar_GET);
router.post('/programar_cantidad', routesController.programar_cantidad_POST);
router.post('/guardar_embarque', routesController.guardar_embarque_POST);
router.get('/embarques', routesController.embarques_GET);
router.post('/captura', routesController.captura_POST);
router.post('/captura_embarque', routesController.captura_embarque_POST);
router.post('/guardar_captura', routesController.guardar_captura_POST);
router.post('/embarque_info', routesController.embarque_info_POST);
router.post('/captura_info', routesController.captura_info_POST);
router.get('/status', routesController.status_GET);
router.post('/cambiar_embarque', routesController.cambiar_embarque_POST);
router.post('/delete_parte', routesController.delete_parte_POST);
router.post('/delete_embarque', routesController.delete_embarque_POST);
router.post('/cambiar_parte', routesController.cambiar_parte_POST);
router.post('/guardar_cambio', routesController.guardar_cambio_POST);
router.post('/alta_acceso', routesController.alta_acceso_POST);
router.post('/guardar_acceso', routesController.guardar_acceso_POST);
router.post('/delete_acceso', routesController.delete_acceso_POST);
router.post('/alta_notificar', routesController.alta_notificar_POST);
router.post('/guardar_notificar', routesController.guardar_notificar_POST);
router.post('/eliminar_notificar', routesController.eliminar_notificar_POST);
router.post('/cerrar_embarque', routesController.cerrar_embarque_POST);
router.post('/revisar_cierre', routesController.revisar_cierre_POST);
router.post('/cierre_directo', routesController.cierre_directo_POST);
router.get('/consulta_serial/:id', routesController.consulta_serial_GET);


router.get('*', (req, res) => {
  res.send('404 Page not found');
});
module.exports = router;