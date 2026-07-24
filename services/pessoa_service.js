const fs = require('fs');
const path = require('path');
const Pessoa = require('../models/pessoa');

// Caminho do arquivo JSON
const arquivoJSON = path.join(__dirname, '..', 'banco_de_dados','pessoas.json');

// Função para ler todos os registros do JSON
function lerPessoas() {
    if (!fs.existsSync(arquivoJSON)) 
        return []; // Se não existir, retorna array vazio

    const dados = fs.readFileSync(arquivoJSON, 'utf-8');
    const obj = JSON.parse(dados);

    // Converte cada objeto em instância da classe Pessoa
    return obj.map(p => new Pessoa(p.cpf, p.nome));
}

// Função para salvar array de pessoas no JSON
function salvarPessoas(pessoas) {
    const dados = pessoas.map(p => ({ cpf: p.get_cpf(), nome: p.get_nome() }));
    fs.writeFileSync(arquivoJSON, JSON.stringify(dados, null, 2), 'utf-8');
}

// Função para cadastrar uma pessoa
function cadastrarPessoa(cpf, nome) {
    const pessoas = lerPessoas();
    // Checa se já existe
    if (pessoas.some(p => p.get_cpf() === cpf)) 
        throw new Error('CPF já cadastrado');

    const pessoa = new Pessoa(cpf, nome);
    pessoas.push(pessoa);
    salvarPessoas(pessoas);

    return pessoa;
}

// Buscar pessoa por CPF
function buscarPessoaPorCPF(cpf) {
    const pessoas = lerPessoas();
    return pessoas.find(p => p.get_cpf() === cpf);
}

// Buscar pessoas por nome (retorna array)
function buscarPessoaPorNome(nome) {
    const pessoas = lerPessoas();
    return pessoas.filter(p => p.get_nome().toLowerCase().includes(nome.toLowerCase()));
}

module.exports = { cadastrarPessoa, buscarPessoaPorCPF, buscarPessoaPorNome, lerPessoas };
