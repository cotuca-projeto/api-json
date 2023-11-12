# Documentação

Essa documentação está sendo desenvolvido apenas para ser forneciada as informações de cada rota necessaria

## Instalação

Para instalar as dependências do projeto, basta executar o comando abaixo:

```sh
npm install
```

## Execução

Para executar o projeto, basta executar o comando abaixo:

```sh
npm start
```

Será enviado uma mensagem no console, informando que o servidor está rodando porta que você configurou no arquivo .env, caso não tenha configurado ficara na porta 3000.

O Acesso é simples basta entrar no navegador e digitar o endereço abaixo:

http://localhost:3000

## Rotas

O roteamento está funcionado HTTP Methods, então está sematicamente correto, além disso iremos separar por categorias e tabelas, para melhor entendimento.

### Users

A Rota de usuários é responsável por todas as requisições que envolvem o usuário, como cadastro, login, atualização de dados, etc.

A sua rota base é:

http://localhost:3000/api/users

Na tabela abaixo, você pode ver todas as rotas que envolvem o usuário.

| Método | Rota            | Descrição                    | Parametros                                       |
| ------ | --------------- | ---------------------------- | ------------------------------------------------ |
| POST   | /register       | Cadastra um novo usuário     | first_name, last_name, email, password, username |
| POST   | /login          | Realiza o login do usuário   | email, password                                  |
| DELETE | /delete         | Deleta um usuário específico | id                                               |
| PUT    | /forgotpassword | Atualiza a senha do usuario  | email, password                                  |
| PUT    | /update         | Atualiza a foto do usuario   | email, password, photo                           |
| GET    | /all            | Busca todos os usuários      | -                                                |
| GET    | /find           | Busca o usuário pelo id      | id                                               |
| GET    | /getimage       | Busca a foto do usuário      | email                                            |

Um exemplo bem simples de como cadastrar um usuário:

```sh
curl --location --request POST 'http://localhost:3000/api/users/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "first_name": "Teste",
    "last_name": "Teste",
    "email": "teste@gmail.com",
    "password": "caSA1234&*",
    "username": "teste"
}'
```

### Tasks

A Rota de tarefas é responsável por todas as requisições que envolvem as tarefas, como cadastro, atualização, exclusão, etc.

A sua rota base é:

http://localhost:3000/api/tasks

Na tabela abaixo, você pode ver todas as rotas que envolvem as tarefas.

| Método | Rota    | Descrição                    | Parametros               |
| ------ | ------- | ---------------------------- | ------------------------ |
| POST   | /create | Cadastra uma nova tarefa     | title, description, user |
| DELETE | /delete | Deleta uma tarefa específica | id: Id da tarefa         |

Um exemplo bem simples de como cadastrar uma tarefa:

```sh
curl --location --request POST 'http://localhost:3000/api/tasks/create' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Teste",
    "description": "Teste",
    "user": "1"
}'
```

## Contribuidores

- [Rafael Moreira](https://github.com/RMCSa)
- [Gabriel Oliveira](https://github.com/Polabiel)
