function validarCPF(cpf) {
    // Remove os pontos e caracteres não desejados do CPF
    cpf = cpf.replace(/[^\d]+/g, '');

    // Se não tem todos os dígitos de um CPF, já não é válido.
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) 
        return false;

    // Variáveis temporárias para a validação
    let soma = 0;
    let resto;

    // Faz a multipicação dos dígitos
    for (let i = 1; i <= 9; i++) 
        soma += parseInt(cpf[i - 1]) * (11 - i);

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) 
        resto = 0;
    if (resto !== parseInt(cpf[9])) 
        return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) 
        soma += parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) 
        resto = 0;
    if (resto !== parseInt(cpf[10])) 
        return false;

    // Se passou a validação completa, o CPF é válido.
    return true;
}

module.exports = { validarCPF };
