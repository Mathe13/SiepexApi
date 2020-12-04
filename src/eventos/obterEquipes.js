const express = require('express'),
    router = express.Router();
const {
    equipes_juergs,
    cadastro_juergs,
<<<<<<< HEAD
    participantes_rustica,
=======
>>>>>>> dd5267254da60755bf648081d94b7f622ef2270a
} = require('../../models');

router.put('/', async (req, res) => {
    // decide qual função usar com base no parametro passado em req
    if ('id_modalidade' in req.body) {
        idModalidade = parseInt(req.body['id_modalidade']);
<<<<<<< HEAD
        if('fase_atual' in req.body){
            faseAtual = (req.body['fase_atual'] != 'null') ? (parseInt(req.body['fase_atual'])) : '';
            equipes = await pegarTodasEquipesPorFase(idModalidade, faseAtual);
        }else
            equipes = await pegarTodasEquipesPorModalidade(idModalidade);
=======
        equipes = await pegarTodasEquipesPorModalidade(idModalidade);
>>>>>>> dd5267254da60755bf648081d94b7f622ef2270a
        res.json({
            data: equipes.rows,
            count: equipes.count,
        })
    } else if ('user_cpf' in req.body) {
        equipes = await pegarTodasEquipesPorUsuario(req.body['user_cpf']);
        res.json({
            data: equipes.rows,
            count: equipes.count,
        })
    }
});

<<<<<<< HEAD
router.get('/rustica', async (req, res) => {
    participantes = await participantes_rustica.findAll({
        order: [
            ['id', 'asc'],
        ]
    });
    res.json({
        data: participantes,
    });
});

=======
>>>>>>> dd5267254da60755bf648081d94b7f622ef2270a
async function pegarTodasEquipesPorModalidade(idModalidade) {
    return new Promise(function (resolve, reject) {
        equipes_juergs.findAndCountAll({
            where: {
                id_modalidade: idModalidade,
            },
            order: [
                ['data_cadastro', 'asc']
            ],
        }).then(async (result) => {
            for (var i = 0; i < result.rows.length; i++) { // Repete para cada equipe encontrada.
                userCpfs = result.rows[i]['dataValues']['participantes_cadastrados'].split(';');
                userCpfs = userCpfs.slice(0, userCpfs.length - 1); // Coloca os cpf em uma lista de string
                result.rows[i]['dataValues']['participantes_cadastrados'] = userCpfs; // adiciona os cpfs ao resultado
                result.rows[i]['dataValues']['nomes_participantes'] = [];
<<<<<<< HEAD
                // TODO: Otimizar esta parte. -M
                result.rows[i]['dataValues']['nomes_participantes'] = await pegarNomes(userCpfs);
            }
            resolve(result);
        })
    })
}


async function pegarTodasEquipesPorFase(idModalidade, faseAtual) {
    // Pega as equipes de uma determinada fase e modalidade.
    return new Promise(function (resolve, reject) {
        equipes_juergs.findAndCountAll({
            where: {
                id_modalidade: idModalidade,
                fase_equipe: faseAtual,
            },
            order: [
                ['data_cadastro', 'asc']
            ],
        }).then(async (result) => {
            for (var i = 0; i < result.rows.length; i++) { // Repete para cada equipe encontrada.
                userCpfs = result.rows[i]['dataValues']['participantes_cadastrados'].split(';');
                userCpfs = userCpfs.slice(0, userCpfs.length - 1); // Coloca os cpf em uma lista de string
                result.rows[i]['dataValues']['participantes_cadastrados'] = userCpfs; // adiciona os cpfs ao resultado
                result.rows[i]['dataValues']['nomes_participantes'] = [];
                // TODO: Otimizar esta parte. -M
=======
>>>>>>> dd5267254da60755bf648081d94b7f622ef2270a
                result.rows[i]['dataValues']['nomes_participantes'] = await pegarNomes(userCpfs);
            }
            resolve(result);
        })
    })
}

// Função para pegar todas as equipes de um dado usuario
async function pegarTodasEquipesPorUsuario(userCpf) {
<<<<<<< HEAD
    console.log('Pegando Equipes por usuario');
    return new Promise(function (resolve, reject) {
        // Pega as IDs das minhas equipes
        console.log("CPF: ")
        console.log(userCpf)
=======
    return new Promise(function (resolve, reject) {
        // Pega as IDs das minhas equipes
>>>>>>> dd5267254da60755bf648081d94b7f622ef2270a
        cadastro_juergs.findAll({
            where: {
                cpf: userCpf,
            }
        }).then((user) => {
            equipesIds = user[0]['dataValues']['minhas_equipes'].split(';')
            equipesIds = equipesIds.slice(0, equipesIds.length - 1) // O ultimo elemento é vazio
            equipesIds = equipesIds.map(Number); // Converte um array de String para um array de Numbers
<<<<<<< HEAD
            console.log("IDs: ");
            console.log(equipesIds);
=======

>>>>>>> dd5267254da60755bf648081d94b7f622ef2270a
            equipes_juergs.findAndCountAll({
                where: {
                    id: equipesIds, // Passo todas as IDs
                },
                order: [
                    ['data_cadastro', 'asc']
                ],
            }).then(async (result) => {
                for (var i = 0; i < result.rows.length; i++) { // Repete para cada equipe encontrada.
                    userCpfs = result.rows[i]['dataValues']['participantes_cadastrados'].split(';');
                    userCpfs = userCpfs.slice(0, userCpfs.length - 1); // Coloca os cpf em uma lista de string
                    result.rows[i]['dataValues']['participantes_cadastrados'] = userCpfs; // adiciona os cpfs ao resultado
                    result.rows[i]['dataValues']['nomes_participantes'] = [];
                    result.rows[i]['dataValues']['nomes_participantes'] = await pegarNomes(userCpfs);
                }
                resolve(result)
            })
        })
    })
}

<<<<<<< HEAD
=======
// Dado os cpfs dos users, retorna uma lista com os nomes dos mesmos.
// function pegarNomes(userCpfs) {
//     console.log('CPF dos usurarios: ' + userCpfs.toString())
//     return new Promise(function (resolve, reject) {
//         var nomes_participantes = [];
//         cadastro_juergs.findAll({ // pega os nomes de todos participantes da equipe
//             attributes: ['nome'],
//             where: {
//                 cpf: userCpfs,
//             }
//         }).then((result2) => {
//             for (var j = result2.length - 1; j >= 0; j--) { // adiciona cada nome ao resultado
//                 console.log('Nome do usuario: ' + result2[j]['dataValues']['nome'].toString())
//                 nomes_participantes.push(result2[j]['dataValues']['nome']);
//             }
//             resolve(nomes_participantes);
//         });
//     })
// }

>>>>>>> dd5267254da60755bf648081d94b7f622ef2270a
async function pegarNomes(userCpfs) {
    // Faz desta forma (pega um nome por vez) para que os nomes estejam na mesma ordem dos cpfs.
    //console.log('CPF dos usurarios: ' + userCpfs.toString())
    var nomes_participantes = [];
    return new Promise(async function (resolve, reject) {
        for(var i = 0; i < userCpfs.length; i ++){
            var nome = await pegarNome(userCpfs[i]);
            nomes_participantes.push(nome);
        }
        //console.log('Terminando funcao');
        resolve(nomes_participantes);
    })
}

function pegarNome(cpf){
    return new Promise(function (resolve, reject){
        cadastro_juergs.findByPk(cpf).then((result2) => {
            resolve(result2['dataValues']['nome']);
        });
    });
}

module.exports = router;