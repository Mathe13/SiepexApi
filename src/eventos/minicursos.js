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
    tbl_minicursos.findByPk(req.params.id, ).then((result) => {
        res.json(result)
    }).catch((err) => {
        console.log(err)
        res.json(String(err))
    });
});
router.put('/:id/cadastrar', (req, res) => {
    tbl_minicursos.findByPk(req.params.id).then((minicurso) => {
        console.log(minicurso);
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
        res.json({
            status: "erro",
            erro: String(err)
        })
    });
});
module.exports = router