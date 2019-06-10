const express = require('express'),
    router = express.Router();
const {
    tbl_visitas,
    tbl_locais_visitas,
    tbl_contato_visitas,
    participante,
    cadastro_visita,
} = require('../../models');

participante.belongsToMany(tbl_visitas, {
    through: {
        model: cadastro_visita,
        unique: false,
    },
    foreignKey: 'id_participante',
    constraints: false
});
tbl_visitas.belongsToMany(participante, {
    through: {
        model: cadastro_visita,
        unique: false,
    },
    foreignKey: 'id_visita',
    constraints: false
});
tbl_visitas.hasMany(tbl_contato_visitas, {
    foreignKey: 'id_visitas',
});
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
    tbl_visitas.findAll({
        include: [tbl_contato_visitas, tbl_locais_visitas],
        order: [
            ['saida', 'ASC'],
        ],
    }).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(String(err))
    });
}); //Listar todos

router.put('/:id/cadastrar', (req, res) => {
    tbl_visitas.findByPk(req.params.id).then((visita) => {
        console.log(visita);
        participante.findByPk(req.body.id_participante, {
            include: [{
                model: tbl_visitas,
                order: ['retorno', 'DESC']
            }]
        }).then((participante) => {
            if (participante['tbl_visitas'].length == 0 || visita['retorno'] < participante['tbl_visitas'][0]['saida']) {
                // res.json(visita);
                cadastro_visita.findOrCreate({
                    where: {
                        id_visita: visita['id_visitas'],
                        id_participante: participante['id']
                    },
                    defaults: {
                        id_visita: visita['id'],
                        id_participante: participante['id']
                    }
                }).then(() => {
                    res.json({
                        status: "sucesso"
                    })
                })
            } else {
                res.json({
                    status: "falha, já ocupado"
                })
            }

        })
    }).catch((err) => {
        console.log(err)
        res.json(String(err))
    });
});
router.get('/:id', (req, res) => {
    tbl_visitas.findByPk(req.params.id, {
        include: [tbl_contato_visitas, tbl_locais_visitas, participante]
    }).then((result) => {
        res.json(result)
    }).catch((err) => {
        console.log(err)
        res.json(String(err))
    });
});

module.exports = router