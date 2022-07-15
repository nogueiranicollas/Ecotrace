<h1 align="center"> TRACECOTTON - API </h1>

<p align="center">
  <a href="#tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href="#como-executar">Como executar</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href="#dicas">Dicas</a>
</p>

<br />

## ✨ Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [TypeORM](https://typeorm.io/)

<br />

---

<br />

## 💻 Projeto

A plataforma Tracecotton permite a rastreabilidade única e continuada de dados da indústria, utilizando a tecnologia Blockchain, garantindo o total monitoramento, controle, governança e transparência de ponta a ponta da cadeia de valor de algodão, o que torna o sistema mais seguro e confiável. Através da plataforma, varejistas e parceiros (devidamente autorizados) poderão consultar a rastreabilidade dos produtos.

<br />

---

<br />

## 🚀 Como executar

- Clone o repositório.
- Vá para pasta raiz do projeto.
- Criar o arquivo .env com base no .env.example, "Solicitar dados do .env".
- Configurar ormconfig.json
- Alterar docker-compose.yml se necessário.
- Caso não tenha instalado, instale o `docker-compose`
- Inicie o docker com `docker-compose up -d`.
- Acesse o gerenciador de banco de dados.
- Crie uma nova conexão com os dados de banco já adicionados no seu .env.
- Instale as dependências com `yarn`.
- Inicie o servidor com `yarn dev`.
- Execute as queries em /sql/initialQueries.sql para popular as tabelas apps, user_roles e usuário.
- Execute as queries em /sql/cities.sql para popular as cidades.

O servidor executará em [`localhost:5001`](http://localhost:5001)

Para testar a api use o Insominia e importe o arquivo que esta na raiz `insomnia-workspace.json`

-- usuario ecotrace@ecotrace.info

-- senha 222222

Após logar, crie outro usuário e deletar o usuário ecotrace@ecotrace.info

<br />

---

<br />

## 🔖 Dicas

- [kitematic](https://github.com/docker/kitematic) - para gerenciar dockers.
- [DBeaver](https://dbeaver.io/download/) - para gerenciar bancos de dados.
- [Insomnia](https://insomnia.rest/download) - para testar a api.

<br />

## 🚨 Servidores disponíveis:

- TSI:
  - IP: 192.168.65.35:4334
  - nome: srv-ecotrace-environment-tsi-02
  - URL API: b2b-tracecotton-api.ecotrace.technology
  - URL front: https://b2b-tracecotton.ecotrace.technology/

---

<br />

[Time Ecotrace Solutions](https://ecotrace.info/)
