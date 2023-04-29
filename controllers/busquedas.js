const { response } = require('express');
const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

const getTodo = async (req,res = response) =>{
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda,'i');

    // const usuarios = await Usuario.find({ nombre : regex});
    // const hospitales = await Hospital.find({ nombre : regex});
    // const medicos = await Medico.find({ nombre : regex});

    const [usuarios,hospitales,medicos] = await Promise.all([
        Usuario.find({ nombre : regex}),
        Hospital.find({ nombre : regex}),
        Medico.find({ nombre : regex}),
    ])

    res.json({
        ok:true,
        msg:"getTodo",
        busqueda,
        usuarios,
        hospitales,
        medicos
    })
}
const getDocumentoColeccion = async (req,res = response) =>{
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda,'i');

    let data = [];
    switch (tabla) {
        case 'medicos':
            data = await Medico.find({ nombre : regex})
                                .populate('usuario','nombre img')
                                .populate('hospital','nombre img')
            break;
        case 'hospitales':
            data = await Hospital.find({ nombre : regex})
                                .populate('usuario','nombre img')
            break;
        case 'usuarios':
            data = await Usuario.find({nombre: regex});            
            break;    
        default:
            return res.status(400).json({
                ok:false,
                msg:'La tabla tiene que ser usuarios/medicos/hospitales'
            })
            break;
    }
    res.json({
        ok:true,
        resultados:data
    });

}


module.exports = {
    getTodo,
    getDocumentoColeccion,
}