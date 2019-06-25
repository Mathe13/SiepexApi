const express = require('express'),
    router = express.Router();
const {
    tbl_minicursos,
    participante,
    cadastro_minicurso
} = require('../../models');
participante.belongsToMany(tbl_minicursos, {
    through: {
        model: cadastro_minicurso,
        unique: false,
    },
    foreignKey: 'id_participante',
    constraints: false
});
tbl_minicursos.belongsToMany(participante, {
    through: {
        model: cadastro_minicurso,
        unique: false,
    },
    foreignKey: 'id_minicurso',
    constraints: false
});
router.get('/', (req, res) => {
    tbl_minicursos.findAll({
        order: [
            ['inicio', 'ASC'],
        ],
    }).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(String(err))
    });
}); //Listar todos

router.get('/:id', (req, res) => {
    tbl_minicursos.findByPk(req.params.id, {
        include: [participante]
    }).then((result) => {
        res.json(result)
    }).catch((err) => {
        console.log(err)
        res.json(String(err))
    });
});
router.get('/:id/participantes', (req, res) => {
    tbl_minicursos.findByPk(req.params.id, {
        attributes: [],
        include: [{
            model: participante, attributes: ['nome', 'cpf'], through: {
                attributes: []
            }
        }]
    }).then((result) => {
        res.json(result)
    }).catch((err) => {
        console.log(err)
        res.json(String(err))
    });
});
router.delete("/:id/liberar/:id_participante", (req, res) => {
    cadastro_minicurso.destroy({
        where: {
            id_minicurso: req.params.id,
            id_participante: req.params.id_participante
        }
    }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {
            console.log('Deleted successfully');
            tbl_minicursos.findByPk(req.params.id).then((minicurso) => {
                tbl_minicursos.update({
                    "vagas": minicurso.vagas + 1
                }, {
                        where: {
                            'id': req.params.id
                        }
                    }).then(() => {
                        res.json({
                            status: "sucesso"
                        })
                    })
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
    //encerrado
    res.json({
        status: "Inscrições encerradas"
    });
    return;
    tbl_minicursos.findByPk(req.params.id).then((minicurso) => {
        console.log(minicurso);
        if (minicurso.vagas < 1) {
            res.json({
                status: "falha, vagas esgotadas"
            })
            return;
        }
        participante.findByPk(req.body.id_participante, {
            include: [{
                model: tbl_minicursos,
                order: ['fim', 'DESC']
            }]
        }).then((participante) => {
            if (participante['tbl_minicursos'].length == 0 || minicurso['fim'] < participante['tbl_minicursos'][0]['inicio']) {
                // res.json(minicurso);
                cadastro_minicurso.findOrCreate({
                    where: {
                        id_minicurso: minicurso['id'],
                        id_participante: participante['id']
                    },
                    defaults: {
                        id_minicurso: minicurso['id'],
                        id_participante: participante['id']
                    }
                }).then(() => {
                    minicurso.update({
                        "vagas": minicurso.vagas - 1
                    }, {
                            where: {
                                'id': minicurso.id
                            }
                        }).then(() => {
                            res.json({
                                status: "sucesso"
                            })
                        })
                })
            } else {
                console.log("ocupado");
                res.json({
                    status: "Parece que você já está ocupado"
                })
            }

        })
    }).catch((err) => {
        console.log(err)
        res.json({
            status: "erro",
            erro: String(err)
        })
    });
});
module.exports = router