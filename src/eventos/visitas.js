const express = require('express'),
    router = express.Router();
const {
    tbl_visitas,
    tbl_locais_visitas,
    tbl_contato_visitas
} = require('../../models');


tbl_visitas.hasMany(tbl_contato_visitas, {
    foreignKey: 'id_visitas',
});
tbl_contato_visitas.belongsTo(tbl_visitas, {
    foreignKey: 'id_visitas',
    targetKey: 'id_visitas'
});
tbl_visitas.hasMany(tbl_locais_visitas, {
    foreignKey: 'id_visitas',
});
tbl_locais_visitas.belongsTo(tbl_visitas, {
    foreignKey: 'id_visitas',
    targetKey: 'id_visitas'
});
router.get('/', (req, res) => {
    tbl_visitas.findAll().then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(String(err))
    });
}); //Listar todos

router.get('/:id', (req, res) => {
    tbl_visitas.findByPk(req.params.id, {
        include: [tbl_contato_visitas, tbl_locais_visitas]
    }).then((result) => {
        res.json(result)
    }).catch((err) => {
        console.log(err)
        res.json(String(err))
    });
});

module.exports = router