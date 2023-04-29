/*
    ruta : api/todo/:busqueda
*/
const { Router } = require('express');
// const { check } = require('express-validator');
// const { validarCampos } = require('../middlewares/validar-campos')

const { getTodo,getDocumentoColeccion } = require('../controllers/busquedas');
//const req = require('express/lib/request');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

router.get('/:busqueda', validarJWT, getTodo );
router.get('/coleccion/:tabla/:busqueda', validarJWT, getDocumentoColeccion );


module.exports = router;