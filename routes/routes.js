const express = require('express');
const router = express.Router();
const routesController = require('./routesController')

const middleware = require('../public/middleware/middleware.js')

//Routes

router.get('/', routesController.index_GET);
router.get('/login/:id', routesController.login);
router.get('/programar', middleware.sspi, routesController.programar_GET);
router.post('/programar_cantidad', middleware.sspi, routesController.programar_cantidad_POST);
router.post('/guardar_embarque', middleware.sspi, routesController.guardar_embarque_POST);
router.get('/embarques', middleware.sspi, routesController.embarques_GET);
router.post('/captura', routesController.captura_POST);
router.post('/captura_embarque', routesController.captura_embarque_POST);
router.post('/guardar_captura',  routesController.guardar_captura_POST);
router.post('/embarque_info', middleware.sspi, routesController.embarque_info_POST);
router.post('/captura_info', middleware.sspi, routesController.captura_info_POST);
router.get('/status', middleware.sspi, routesController.status_GET);
router.post('/cambiar_embarque', middleware.sspi, routesController.cambiar_embarque_POST);
router.post('/delete_parte', middleware.sspi, routesController.delete_parte_POST);
router.post('/delete_embarque', middleware.sspi, routesController.delete_embarque_POST);
router.post('/cambiar_parte', middleware.sspi, routesController.cambiar_parte_POST);
router.post('/guardar_cambio', middleware.sspi, routesController.guardar_cambio_POST);
router.post('/alta_acceso', middleware.sspi, routesController.alta_acceso_POST);
router.post('/guardar_acceso', middleware.sspi, routesController.guardar_acceso_POST);
router.post('/delete_acceso', middleware.sspi, routesController.delete_acceso_POST);
router.post('/alta_notificar', middleware.sspi, routesController.alta_notificar_POST);
router.post('/guardar_notificar', middleware.sspi, routesController.guardar_notificar_POST);
router.post('/eliminar_notificar', middleware.sspi, routesController.eliminar_notificar_POST);
router.post('/cerrar_embarque',  routesController.cerrar_embarque_POST);
router.post('/revisar_cierre', middleware.sspi, routesController.revisar_cierre_POST);
router.post('/cierre_directo', middleware.sspi, routesController.cierre_directo_POST);
router.get('/consulta_serial/:id', middleware.sspi, routesController.consulta_serial_GET);
router.post('/getDelivery',  routesController.getDelivery_POST);
router.post('/getTotalQty',  routesController.getTotalQty_POST);
router.post('/getDeliveryInfo',  routesController.getDeliveryInfo_POST);
router.post('/checksingle',  routesController.checkSingle_POST);


router.get('*', (req, res) => {
  res.send('404 Page not found');
});
module.exports = router;