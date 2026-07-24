class Pessoa {
    // Variáveis do tipo privado
    #cpf;
    #nome;

    // Construtor do objeto
    constructor(cpf, nome) {
        this.#cpf = cpf;
        this.#nome = nome;
    }

    // Retorna o nome do objeto
    get_nome() {
        return this.#nome;
    }

    // Retorna o cpf do objeto
    get_cpf() {
        return this.#cpf;
    }
}

module.exports = Pessoa;
