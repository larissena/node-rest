const moment = require('moment');
const conexao = require('../infra/conexao');

class Atendimento {
    adiciona(atendimento, res) {
        const dataCriacao = moment().format('YYYY-MM-DD hh:mm:ss');
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD hh:mm:ss');

        // validações
        const dataValida = moment(data).isSameOrAfter(dataCriacao);
        const clienteValido = atendimento.cliente.length >= 3;
        const validacao = [
            {
                nome: 'data',
                valido: dataValida,
                mensagem: 'Data deve ser igual ou posterior à data atual'
            },
            {
                nome: 'cliente',
                valido: clienteValido,
                mansagem: 'Cliente deve ter pelo menos 3 caracteres'
            }
        ];
        const erros = validacao.filter(campo => !campo.valido);
        const existemErros = erros.length;

        if (existemErros) {
            res.status(400).json(erros);
        } else {
            const atendimentoDatado = {...atendimento, dataCriacao, data};
            const sql = 'INSERT INTO Atendimentos SET ?';

            conexao.query(sql, atendimentoDatado, (erro, resultados) => {
                if (erro) {
                    res.status(400).json(erro);
                } else {
                    res.status(201).json(resultados);
                }
            });
        }
    }
}

module.exports = new Atendimento;