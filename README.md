<img width="1700" height="800" alt="capa" src="https://github.com/user-attachments/assets/add7b540-9507-43f0-aaa1-fe1fb5f165ff" />

# Sistema Meu Cadastro
Sistema web para cadastro e visualização de dados de pessoas com base no CPF, desenvolvido em Node.js com interface moderna utilizando a biblioteca Bulma CSS.

## Funcionalidades


- **Login**: Acesso ao sistema através do CPF
- **Cadastro**: Registro de novos usuários com nome e CPF
- **Validação de CPF**: Validação em tempo real do CPF inserido
- **Visualização**: Lista de todas as pessoas cadastradas no sistema
- **Busca**: Filtro de pesquisa por nome ou CPF na tabela
- **Interface responsiva**: Design moderno com componentes Bulma CSS

## Como executar a aplicação

### Pré-requisitos

- Node.js instalado (versão 12 ou superior)
- NPM ou Yarn

### Passo a passo

1. **Clone o repositório**
```bash
   git clone https://github.com/wendersonline/Meu_Cadastro.git
   cd Meu_Cadastro
```

2. **Instale o npm e execute a aplicação**
```bash
   npm install && node server.js
```

3. **Acesse o sistema**
   * Abra seu navegador e acesse: http://localhost:3000
   * A aplicação será iniciada automaticamente na página de login

4. **Rodar os testes unitários**
```bash
   npm test
```

## Como usar o sistema:

### 1. **Primeiro acesso - Cadastro**
- Acesse a página inicial (será redirecionado para login)
- Clique em "ou Cadastre-se agora!"
- Preencha seu nome completo e CPF
- O sistema validará o CPF e o nome em tempo real
- Clique em "Cadastrar"

### 2. **Login**
- Na página de login, digite seu CPF cadastrado na plataforma
- O sistema validará automaticamente
- Clique em "Entrar"

### 3. **Página inicial**
- Visualize todos os usuários cadastrados (OS CPFs CADASTRADOS SÃO TODOS FICTÍCIOS E GERADOS AUTOMÁTICAMENTE)
- Use a barra de pesquisa para filtrar por nome ou CPF
- Clique em "Sair" para fazer logout

## Tecnologias utilizadas

- **Backend**: Node.js
- **Frontend**: HTML5, CSS3, JavaScript
- **Componentes Css**: Bulma
- **Armazenamento**: JSON (arquivo local)
- **Validações**: Algoritmo de validação de CPF
- **Testes**: Jest

## Observações importantes:

- Os dados são armazenados localmente no arquivo `pessoas.json`
- **OS CPFs CADASTRADOS SÃO TODOS FICTÍCIOS E GERADOS AUTOMÁTICAMENTE**
- O sistema não requer banco de dados externo
- A validação de CPF segue o algoritmo oficial da Receita Federal
- A interface é totalmente responsiva e acessível
- Não é necessário instalar dependências adicionais além do Node.js

## Recursos técnicos:

- **Validação em tempo real**: CPF é validado conforme o usuário digita
- **Formatação automática**: CPF é formatado automaticamente (000.000.000-00)
- **Feedback visual**: Campos ganham cores indicativas (verde/vermelho)
- **Persistência de dados**: Dados salvos automaticamente em JSON
- **Busca dinâmica**: Filtragem em tempo real na tabela
- **Gerenciamento de sessão**: Uso do localStorage para manter login

## Interface:

O sistema utiliza a biblioteca Bulma CSS para uma interface moderna e clean, com:
- Design responsivo
- Componentes estilizados (botões, inputs, tabelas)
- Paleta de cores verde e azul (Seguindo a ideia de ser um sistema com dados brasileiros)
- Tipografia moderna com fonte Poppins
