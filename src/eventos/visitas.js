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
router.delete("/:id/liberar/:id_participante", (req, res) => {
    cadastro_visita.destroy({
        where: {
            id_visita: req.params.id,
            id_participante: req.params.id_participante
        }
    }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
            console.log('Deleted successfully');
            res.json({
                status: "sucesso"
            })
        } else {
            res.json({
                status: "sucesso, nada mudou"
            })
        }
    }, function (err) {
        console.log(err);
        res.json({
            status: "falha"
        })
    });
})
router.put('/:id/cadastrar', (req, res) => {
    if (req.params.id == 2) {
        res.json({
            status: "Inscrições encerradas"
        });
    }
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
                    status: "Parece que voce está ocupado"
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