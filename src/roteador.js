const express = require('express');
const { listarContasBancarias, criarContaBancaria, atualizarUsuario, excluirConta } = require('./controladores/contas');
const {depositar, sacar, transferir, saldo} = require('./controladores/transacoes');
const { validarSenhaAdm } = require('./intermediarios');

const rotas = express();

rotas.get('/contas', validarSenhaAdm, listarContasBancarias)
rotas.post('/contas', criarContaBancaria);
rotas.put('/contas/:numeroConta/usuario', atualizarUsuario);
rotas.delete('/contas/:numeroConta', excluirConta);
rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar );
rotas.post('/transacoes/transferir', transferir);
rotas.get('/contas/saldo', saldo);

//Extrato - Faltando implementar
rotas.get('/contas/extrato');

module.exports = rotas