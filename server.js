const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

const { cadastrar } = require('./controllers/cadastro_controller');
const { login } = require('./controllers/login_controller');
const { validarCPF } = require('./services/cpf_service');

const PORT = 3000;

const CONTENT_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif'
};

function servirArquivo(res, caminho) {
    fs.readFile(caminho, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>404 - Arquivo não encontrado</h1>');
            return;
        }

        const contentType = CONTENT_TYPES[path.extname(caminho).toLowerCase()] || 'text/plain';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

// Lê o corpo bruto da requisição; quem chama decide se faz parse como form ou JSON
function lerCorpo(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', (pedaco) => (body += pedaco));
        req.on('end', () => resolve(body));
    });
}

function enviarJSON(res, status, objeto) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(objeto));
}

// Handlers de GET

function handlePessoas(res) {
    const arquivoPessoas = path.join(__dirname, 'banco_de_dados', 'pessoas.json');

    fs.readFile(arquivoPessoas, 'utf-8', (err, data) => {
        if (err) {
            enviarJSON(res, 500, { erro: 'Não foi possível ler os dados' });
            return;
        }

        const pessoas = JSON.parse(data).map((p) => ({ nome: p.nome, cpf: p.cpf }));
        enviarJSON(res, 200, pessoas);
    });
}

// Mapa das rotas que só servem uma página HTML 
const VIEWS = {
    '/': path.join(__dirname, 'views', 'Login_Page', 'index.html'),
    '/login': path.join(__dirname, 'views', 'Login_Page', 'index.html'),
    '/cadastre-se': path.join(__dirname, 'views', 'Register_Page', 'index.html'),
    '/home': path.join(__dirname, 'views', 'Home_page', 'index.html')
};

function handleGet(req, res, pathname) {
    switch (pathname) {
        case '/':
        case '/login':
        case '/cadastre-se':
        case '/home':
            servirArquivo(res, VIEWS[pathname]);
            break;

        case '/pessoas':
            handlePessoas(res);
            break;

        default:
            if (pathname.startsWith('/public/')) {
                servirArquivo(res, path.join(__dirname, pathname));
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>404 - Página não encontrada</h1>');
            }
            break;
    }
}

// Handlers de POST

async function handleValidarCPF(req, res) {
    const body = await lerCorpo(req);

    let dados;
    try {
        dados = JSON.parse(body);
    } catch (error) {
        enviarJSON(res, 400, { valido: false, erro: 'JSON inválido' });
        return;
    }

    const { cpf } = dados;
    if (!cpf) {
        enviarJSON(res, 200, { valido: false, erro: 'CPF não fornecido' });
        return;
    }

    enviarJSON(res, 200, { valido: validarCPF(cpf), cpf });
}

async function handleLogin(req, res) {
    const body = await lerCorpo(req);
    const { cpf } = querystring.parse(body);

    if (!cpf) {
        enviarJSON(res, 200, { sucesso: false, erro: 'CPF não fornecido' });
        return;
    }

    try {
        const resultado = login(cpf);

        if (resultado === 'Cidadão não encontrado no sistema') {
            enviarJSON(res, 200, { sucesso: false, erro: resultado });
            return;
        }

        enviarJSON(res, 200, {
            sucesso: true,
            mensagem: 'Login realizado com sucesso!',
            pessoa: { nome: resultado.get_nome(), cpf: resultado.get_cpf() }
        });
    } catch (error) {
        console.error('Erro no login:', error.message);
        enviarJSON(res, 500, { sucesso: false, erro: 'Erro no servidor' });
    }
}

async function handleCadastro(req, res) {
    const body = await lerCorpo(req);
    const { nome, cpf } = querystring.parse(body);

    if (!nome || !cpf || nome.trim() === '' || cpf.trim() === '') {
        enviarJSON(res, 200, { sucesso: false, erro: 'Nome e CPF são obrigatórios' });
        return;
    }

    try {
        const pessoa = cadastrar(cpf, nome.trim());

        enviarJSON(res, 200, {
            sucesso: true,
            pessoa: { nome: pessoa.get_nome(), cpf: pessoa.get_cpf() },
            mensagem: `Cadastro realizado com sucesso! Bem-vindo, ${pessoa.get_nome()}`
        });
    } catch (error) {
        console.error('Erro no cadastro:', error.message);
        enviarJSON(res, 200, { sucesso: false, erro: error.message || 'Erro ao cadastrar pessoa' });
    }
}

function handlePost(req, res, pathname) {
    switch (pathname) {
        case '/validar-cpf':
            handleValidarCPF(req, res);
            break;

        case '/login':
            handleLogin(req, res);
            break;

        case '/cadastre-se':
            handleCadastro(req, res);
            break;

        default:
            enviarJSON(res, 404, { erro: 'Rota não encontrada' });
            break;
    }
}

// Servidor

const server = http.createServer((req, res) => {
    const { pathname } = url.parse(req.url, true);

    console.log(req.method, pathname);

    switch (req.method) {
        case 'GET':
            handleGet(req, res, pathname);
            break;

        case 'POST':
            handlePost(req, res, pathname);
            break;

        default:
            enviarJSON(res, 404, { erro: 'Rota não encontrada' });
            break;
    }
});

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = server;