const {contas, saques, depositos, transferencias} = require('../bancodedados/bancodedados')
const { format } = require('date-fns')

const depositar = (req, res) => {
    const { numero_conta, valor} = req.body;

    if(!Number(numero_conta)){
        return res.status(400).json({ mensagem: 'O número de conta informado não é válido'})
    }

    if(!valor){
        return res.status(400).json({ mensagem: 'O valor do depósito deve ser informado'});
    }

    if(!Number(valor)){
        return res.status(400).json({ mensagem: 'O valor deve ser um número'});
    }

    if(valor <= 0){
        return res.status(400).json({ mensagem: 'O valor do depósito precisa ser maior que zero'})
    }    

    const contaParaDeposito = contas.find(conta => conta.numero === Number(req.body.numero_conta));

    if(!contaParaDeposito){
        return res.status(404).json({ mensagem: 'Não existe conta com este número'});
    }

    contaParaDeposito.saldo = contaParaDeposito.saldo + valor

    const novoDeposito = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero: numero_conta,
        valor
    }

    depositos.push(novoDeposito);
    return res.status(200).send()
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;
    const contaParaSaque = contas.find(conta => conta.numero === Number(req.body.numero_conta));
    
    
    if(!contaParaSaque){
        return res.status(404).json({ mensagem: 'Não existe conta com este número'});
    }
    
    if(!Number(numero_conta)){
        return res.status(400).json({ mensagem: 'O número de conta informado não é válido'})
    }
    
    if(!valor){
        return res.status(400).json({ mensagem: 'O valor do saque deve ser informado'});
    }
    
    if(!Number(valor)){
        return res.status(400).json({ mensagem: 'O valor do saque deve ser um número'});
    }
    
    if(valor <= 0){
        return res.status(400).json({ mensagem: 'O valor do saque precisa ser maior que zero'})
    }    
    
    if(senha !== contaParaSaque.usuario.senha){
        return res.status(400).json({ mensagem: 'Senha incorreta'});
    }
        
    if(contaParaSaque.saldo < valor){
        return res.status(400).json({ mensagem: 'Você não tem saldo suficiente para efetuar o saque'});
    }
    
    contaParaSaque.saldo = contaParaSaque.saldo - valor

    const novoSaque = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero: numero_conta,
        valor
    }

    saques.push(novoSaque);
    return res.status(200).send();

}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
    const contaOrigem = contas.find(conta => conta.numero === Number(req.body.numero_conta_origem));
    const contaDestino = contas.find(conta => conta.numero === Number(req.body.numero_conta_destino));

    if(!contaOrigem){
        return res.status(404).json({ mensagem: 'Não existe conta origem com este número'});
    }
    
    if(!Number(numero_conta_origem)){
        return res.status(400).json({ mensagem: 'O número de conta origem informado não é válido'})
    }

    if(!contaDestino){
        return res.status(404).json({ mensagem: 'Não existe conta destino com este número'});
    }
    
    if(!Number(numero_conta_destino)){
        return res.status(400).json({ mensagem: 'O número de conta destino informado não é válido'})
    }

    if(!valor){
        return res.status(400).json({ mensagem: 'O valor da transferência deve ser informado'});
    }
    
    if(!Number(valor)){
        return res.status(400).json({ mensagem: 'O valor da transferência deve ser um número'});
    }
    
    if(valor <= 0){
        return res.status(400).json({ mensagem: 'O valor da transferência precisa ser maior que zero'})
    }
    
    if(senha !== contaOrigem.usuario.senha){
        return res.status(400).json({ mensagem: 'Senha incorreta'});
    }

    if(contaOrigem.saldo < valor){
        return res.status(400).json({ mensagem: 'Você não tem saldo suficiente para efetuar a transferência'});
    }

    contaOrigem.saldo = contaOrigem.saldo - valor
    contaDestino.saldo = contaDestino.saldo + valor


    const novaTransferencia = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta_origem,
        numero_conta_destino,
        valor
    }

    transferencias.push(novaTransferencia);
    return res.status(200).send();

}

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query;
    const contaParaSaldo = contas.find(conta => conta.numero === Number(req.query.numero_conta));

    if(!numero_conta){
        return res.status(400).json({mensagem: "O número da conta é obrigatório"});
    }

    // if(!Number(numero_conta)){
    //     return res.status(400).json({ mensagem: 'O número de conta informado não é válido'})
    // }

    if(Number(numero_conta) !== Number(contaParaSaldo.numero)){
        return res.status(400).json({mensagem: "Não existe conta com o número informado"});
    }

    if(!senha){
        return res.status(400).json({mensagem: "A senha é obrigatória"});
    }

    if(Number(senha) !== Number(contaParaSaldo.usuario.senha)){
        return res.status(400).json({mensagem:"A senha informada está incorreta"});
    }

    return res.status(200).json(contaParaSaldo.saldo)

}

module.exports = {
    depositar,
    sacar,
    transferir,
    saldo
}