const express = require('express'),
      Usuario = require('../models/usuario'),
      bcrypt = require('bcrypt'),
      _ = require('underscore'),
      router = express.Router();

    router.get('/', (req,res) => {

        let desde = req.query.desde || 0;
        desde = Number(desde);

        let limite = req.query.limite || 5;
        limite = Number(limite);

        Usuario.find({ estado: true })
                .skip(desde)
                .limit(limite)
                .exec((err, usuarios) => {
                    
                    if (err) {
                       return res.status(400).json({
                            ok : false,
                            err
                        });
                    }; 

                    Usuario.countDocuments({ estado: true }, (err, conteo) =>{
                        res.json({
                            ok : true,
                            usuarios,
                            conteo
                        }); 
                    }); 
                });
    
    });
    
    router.get('/:id', (req,res) => {
        
        let id = req.params.id;
        
        Usuario.findOne({_id:id}, (err, usuario) => {
            if (err) {
                return res.status(400).json({
                    ok : false,
                    err
                });                
            };
            res.json({
                ok : true,
                usuario
            });
        });
    });
    
    router.post('/', (req, res) => {
    
        let body = req.body;
        let usuario = new Usuario ({
            nombre: body.nombre,
            email: body.email,
            password : bcrypt.hashSync(body.password, 10),
            role: body.role
        });
    
        usuario.save( (err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({        
                    ok : false,
                    err
                });
            };
            res.json({
                ok : true,
                usuarioGuardado

            });

        });
    
    });
    
    router.put('/:id', (req,res) => {
    
        let id = req.params.id,
            body = _.pick(req.body, ['nombre','img', 'role', 'estado']);

        Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioAct) => {

            if (err) {
                return res.status(400).json({
                    ok : false,
                    err
                });
                
            };
            res.json({
                ok : true,
                usuarioAct
            });
        });    
    
    });
    
    router.delete('/:id', (req, res) => {
    
        let id = req.params.id;
            cambiarEstado = {
                estado : false
            };
        Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true }, ( err, usuarioBorrado ) => {
            if (err) {
                return res.status(400).json({
                    ok : false,
                    err
                });
            }
            res.json({
                ok : true,
                usuarioBorrado
            });
        });
    });

module.exports = router;