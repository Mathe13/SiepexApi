const
    bcrypt = require("bcrypt"),
    express = require('express'),
    router = express.Router();
const {
    participante
} = require('../../models');
router.get('/', (req, res) => {
    participante.findAll().then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(String(err))
    });
}); //Listar todos
router.post('/', (req, res) => {
    console.log(req.body)
    participante.findOrCreate({
            where: {
                cpf: req.body.cpf
            },
            defaults: req.body
        })
        .then(([user, created]) => {
            res.json(user.get({
                plain: true
            }))
        })
}); // Criar
router.get('/:id', (req, res) => {
    participante.findByPk(req.params.id).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(String(err))
    });
}); //Buscar
router.put('/:id', (req, res) => {
    participante.update(req.body, {
            where: {
                'id': req.params.id
            }
        })
        .then(function (rowsUpdated) {
            res.json(rowsUpdated)
        })
        .catch((err) => {
            res.json(String(err))
        });

}); //Editar
router.delete('/:id', (req, res) => {
    res.json("not implemented")
}); //Deletar



module.exports = router