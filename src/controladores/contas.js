const { contas } = require('../bancodedados/bancodedados')
const { format } = require('date-fns')

let numeroProximaConta = 1
let saldoInicial = 0

const listarContasBancarias = (req, res) => {
    res.status(200).send(contas)
}

const criarContaBancaria = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha} = req.body

    if(!nome){
        return res.status(400).json({ mensagem: 'O nome deve ser informado'});
    }

    if(!cpf){
        return res.status(400).json({ mensagem: 'O CPF deve ser informado'});
    }

    if(!data_nascimento){
        return res.status(400).json({ mensagem: 'A data de nascimento deve ser informada'});
    }

    if(!telefone){
        return res.status(400).json({ mensagem: 'O telefone deve ser informado'});
    }

    if(!email){
        return res.status(400).json({ mensagem: 'O email deve ser informado'});
    }

    if(!senha){
        return res.status(400).json({ mensagem: 'A senha deve ser informado'});
    }

    const cpfExistente = contas.find(conta => {
        return conta.usuario.cpf === cpf         
    })
   
    if(cpfExistente){
        return res.status(400).json({mensagem: "CPF já existente"})
    }

    const emailExistente = contas.find(conta => {
        return conta.usuario.email === email         
    })

    if(emailExistente){
        return res.status(400).json({mensagem: "Email já existente"})
    }

    const novaConta = {
        numero: numeroProximaConta,
        saldo: saldoInicial,
        usuario: {nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha}
    }

    contas.push(novaConta);

    numeroProximaConta++

    return res.status(201).send()
}

const atualizarUsuario = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
    const numeroConta = Number(req.params.numeroConta)

    if(!Number(numeroConta)){
        return res.status(400).json({ mensagem: 'O valor informado não é um número válido'})
    }

    if(!nome){
        return res.status(400).json({ mensagem: 'O nome deve ser informado'});
    }

    if(!cpf){
        return res.status(400).json({ mensagem: 'O CPF deve ser informado'});
    }

    if(!data_nascimento){
        return res.status(400).json({ mensagem: 'A data de nascimento deve ser informada'});
    }

    if(!telefone){
        return res.status(400).json({ mensagem: 'O telefone deve ser informado'});
    }

    if(!email){
        return res.status(400).json({ mensagem: 'O email deve ser informado'});
    }

    if(!senha){
        return res.status(400).json({ mensagem: 'A senha deve ser informado'});
    }

    const contaASerEditada = contas.find(conta => conta.numero === Number(req.params.numeroConta));

    if(!contaASerEditada){
        return res.status(404).json({ mensagem: 'Não existe conta com este número'});
    }
    
    const cpfExistente = contas.find(conta => {
        return conta.usuario.cpf === cpf         
    })
   
    if(cpfExistente.usuario.cpf === cpf && numeroConta !== contaASerEditada.numero && cpfExistente.numero !== contaASerEditada.numero){
        return res.status(400).json({mensagem: "CPF já existente"})
    }

    const emailExistente = contas.find(conta => {
        return conta.usuario.email === email         
    })

    if(emailExistente.usuario.email === email && numeroConta !== contaASerEditada.numero ){
        return res.status(400).json({mensagem: "Email já existente"})
    }

    contaASerEditada.usuario = {
        nome: nome,
        cpf: cpf,
        data_nascimento: data_nascimento,
        telefone: telefone,
        email: email,
        senha: senha
    }

    return res.status(200).send()
}

const excluirConta = (req, res) => {
    const numeroConta = Number(req.params.numeroConta)
  
    if(!Number(numeroConta)){
        return res.status(400).json({ mensagem: 'O valor informado não é um número válido'})
    }

    const contaAExcluir = contas.find(conta => conta.numero === Number(req.params.numeroConta));

    if(!contaAExcluir){
        return res.status(404).json({ mensagem: 'Não existe conta com este número'});
    }

    if(contaAExcluir.saldo !== 0){
        return res.status(400).json({ mensagem: 'A conta só pode ser encerrada se o saldo for zero'});
    }

    const index = contas.findIndex(conta => conta.numero === Number(req.params.numeroConta))

    if(index === -1){
        return res.status(404).json({ mensagem: 'Conta não encontrada, favor verificar o número'})
    }


    contas.splice(index, 1)

    return res.status(204).send();
}

module.exports = {
    listarContasBancarias,
    criarContaBancaria,
    atualizarUsuario,
    excluirConta,
}