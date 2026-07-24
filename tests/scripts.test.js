/**
 * @jest-environment jsdom
 */

const { formatCPF, apenasTexto, aplicarValidacaoCPF, carregarTabela } = require('../public/script.js');


// formatCPF
describe('formatCPF', () => {
    test('string vazia permanece vazia', () => {
        expect(formatCPF('')).toBe('');
    });

    test('remove caracteres não numéricos antes de formatar', () => {
        expect(formatCPF('abc123.456-789')).toBe('123.456.789');
    });

    test('até 3 dígitos: não formata (retorna como está)', () => {
        expect(formatCPF('1')).toBe('1');
        expect(formatCPF('123')).toBe('123');
    });

    test('entre 4 e 6 dígitos: formata "000.000"', () => {
        expect(formatCPF('1234')).toBe('123.4');
        expect(formatCPF('123456')).toBe('123.456');
    });

    test('entre 7 e 9 dígitos: formata "000.000.000"', () => {
        expect(formatCPF('1234567')).toBe('123.456.7');
        expect(formatCPF('123456789')).toBe('123.456.789');
    });

    test('CPF completo (11 dígitos): formata "000.000.000-00"', () => {
        expect(formatCPF('12345678900')).toBe('123.456.789-00');
    });

    test('dígitos excedentes além de 11 ficam anexados ao final (regex não ancora no fim)', () => {
        expect(formatCPF('123456789001234')).toBe('123.456.789-001234');
    });

    test('já formatado continua correto (idempotente)', () => {
        expect(formatCPF('123.456.789-00')).toBe('123.456.789-00');
    });
});


// apenasTexto
describe('apenasTexto', () => {
    test('remove números de uma string', () => {
        expect(apenasTexto('João123')).toBe('João');
    });

    test('remove símbolos e pontuação', () => {
        expect(apenasTexto('Maria!@# Silva$%')).toBe('Maria Silva');
    });

    test('mantém letras acentuadas', () => {
        expect(apenasTexto('José Ãÿ Ântônio')).toBe('José Ãÿ Ântônio');
    });

    test('mantém espaços em branco', () => {
        expect(apenasTexto('Ana Paula')).toBe('Ana Paula');
    });

    test('string só com números/símbolos vira string vazia', () => {
        expect(apenasTexto('12345!@#$%')).toBe('');
    });

    test('string vazia permanece vazia', () => {
        expect(apenasTexto('')).toBe('');
    });

    test('não altera string já válida', () => {
        expect(apenasTexto('Carlos Eduardo')).toBe('Carlos Eduardo');
    });
});


// aplicarValidacaoCPF
describe('aplicarValidacaoCPF', () => {
    let cpfInput, cpfFeedback;

    beforeEach(() => {
        document.body.innerHTML = `
            <input id="cpf_input" />
            <span id="cpf_feedback"></span>
        `;
        cpfInput = document.getElementById('cpf_input');
        cpfFeedback = document.getElementById('cpf_feedback');
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('não faz nada se os elementos não existirem', () => {
        expect(() => aplicarValidacaoCPF('nao_existe', 'tambem_nao')).not.toThrow();
    });

    test('formata o CPF conforme o usuário digita', () => {
        aplicarValidacaoCPF('cpf_input', 'cpf_feedback');
        cpfInput.value = '12345678900';
        cpfInput.dispatchEvent(new Event('input'));
        expect(cpfInput.value).toBe('123.456.789-00');
    });

    test('campo vazio limpa classes e feedback', () => {
        aplicarValidacaoCPF('cpf_input', 'cpf_feedback');
        cpfInput.classList.add('is-danger');
        cpfInput.value = '';
        cpfInput.dispatchEvent(new Event('input'));
        expect(cpfInput.classList.contains('is-danger')).toBe(false);
        expect(cpfInput.classList.contains('is-success')).toBe(false);
    });

    test('CPF válido (11 dígitos): adiciona classe is-success', async () => {
        global.fetch.mockResolvedValue({
            json: async () => ({ valido: true })
        });
        aplicarValidacaoCPF('cpf_input', 'cpf_feedback');
        cpfInput.value = '12345678900';
        cpfInput.dispatchEvent(new Event('input'));

        // aguarda a Promise interna do listener resolver
        await new Promise(process.nextTick);

        expect(fetch).toHaveBeenCalledWith('/validar-cpf', expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ cpf: '12345678900' })
        }));
        expect(cpfInput.classList.contains('is-success')).toBe(true);
        expect(cpfInput.classList.contains('is-danger')).toBe(false);
    });

    test('CPF inválido (11 dígitos): adiciona classe is-danger', async () => {
        global.fetch.mockResolvedValue({
            json: async () => ({ valido: false })
        });
        aplicarValidacaoCPF('cpf_input', 'cpf_feedback');
        cpfInput.value = '11111111111';
        cpfInput.dispatchEvent(new Event('input'));

        await new Promise(process.nextTick);

        expect(cpfInput.classList.contains('is-danger')).toBe(true);
        expect(cpfInput.classList.contains('is-success')).toBe(false);
    });

    test('erro de rede na validação é tratado sem lançar exceção', async () => {
        global.fetch.mockRejectedValue(new Error('falha de rede'));
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        aplicarValidacaoCPF('cpf_input', 'cpf_feedback');
        cpfInput.value = '12345678900';
        cpfInput.dispatchEvent(new Event('input'));

        await new Promise(process.nextTick);

        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });
});


// carregarTabela
describe('carregarTabela', () => {
    beforeEach(() => {
        // Importante: <tbody> precisa estar dentro de <table>, senão o
        // parser HTML descarta a tag órfã (regras de parsing de tabelas).
        document.body.innerHTML = `<table><tbody id="tabela-corpo"></tbody></table>`;
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('não faz nada se a tabela não existir no DOM', async () => {
        document.body.innerHTML = '';
        await expect(carregarTabela()).resolves.toBeUndefined();
        expect(fetch).not.toHaveBeenCalled();
    });

    test('preenche a tabela com nome e CPF formatado', async () => {
        global.fetch.mockResolvedValue({
            json: async () => ([
                { nome: 'Ana Souza', cpf: '12345678900' },
                { nome: 'Bruno Lima', cpf: '98765432100' }
            ])
        });

        await carregarTabela();

        const linhas = document.querySelectorAll('#tabela-corpo tr');
        expect(linhas.length).toBe(2);
        expect(linhas[0].cells[0].textContent).toBe('Ana Souza');
        expect(linhas[0].cells[1].textContent).toBe('123.456.789-00');
        expect(linhas[1].cells[1].textContent).toBe('987.654.321-00');
    });

    test('lista vazia resulta em tabela vazia', async () => {
        global.fetch.mockResolvedValue({ json: async () => [] });
        await carregarTabela();
        expect(document.querySelectorAll('#tabela-corpo tr').length).toBe(0);
    });

    test('erro no fetch é tratado sem lançar exceção', async () => {
        global.fetch.mockRejectedValue(new Error('erro de servidor'));
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await expect(carregarTabela()).resolves.toBeUndefined();
        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });
});