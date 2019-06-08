const express = require('express'),
    router = express.Router();
const {
    tbl_minicursos
} = require('../../models');

router.get('/', (req, res) => {
    tbl_minicursos.findAll({
        order: [
            ['inicio', 'ASC'],
            // ['id', 'ASC'],
        ],
    }).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(String(err))
    });
}); //Listar todos

router.get('/:id', (req, res) => {
    tbl_visitas.findByPk(req.params.id, ).then((result) => {
        res.json(result)
    }).catch((err) => {
        console.log(err)
        res.json(String(err))
    });
});

module.exports = router