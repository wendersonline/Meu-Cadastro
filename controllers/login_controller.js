const { buscarPessoaPorCPF } = require('../services/pessoa_service');

function login(cpf) {
    const pessoa = buscarPessoaPorCPF(cpf);

    // Se a pessoa está cadastrada, retorna o objeto
    if (pessoa) 
        return pessoa;
    
    return "Cidadão não encontrado no sistema";
}

module.exports = { login };
