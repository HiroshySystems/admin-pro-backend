/*
    Ruta: /api/login
*/
const { Router } = require('express');
const { login,googleSigIn} = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/',
    [
        check('email','El email es obligatorio').isEmail(),
        check('password','La clave es obligatorio').not().isEmpty(),
        validarCampos
    ],
    login
)
router.post('/google',
    [        
        check('token','El token de google es obligatorio').not().isEmpty(),
        validarCampos
    ],
    googleSigIn
)

module.exports = router;