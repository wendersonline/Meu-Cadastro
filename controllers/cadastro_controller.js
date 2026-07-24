const { cadastrarPessoa } = require('../services/pessoa_service');
const { validarCPF } = require('../services/cpf_service');

function cadastrar(cpf, nome) {
    // Se o CPF não for válido, solte uma exceção.
    if (!validarCPF(cpf)) 
        throw new Error('CPF inválido');

    return cadastrarPessoa(cpf, nome); // Salva no JSON
}

module.exports = { cadastrar };
