# Sistema de Gerenciamento de Motores Elétricos (Dismotor)

Portal de cadastro, listagem, edição e remoção de motores elétricos industriais e fabricantes. 
Projeto desenvolvido como teste técnico.

## Tecnologias Utilizadas ##

- **Frontend:** Angular 18+ (Standalone Components, Reactive Forms, Services dedicados, Nginx).
- **Backend:** Node.js, Express, driver `mysql2` com *Prepared Statements*.
- **Banco de Dados:** MySQL 8.0.
- **Orquestração:** Docker & Docker Compose.

##  Como Executar a Aplicação ##

## Pré-requisitos ##
Apenas o Docker e o Docker Compose instalados.

## Passo Único de Execução ##
Clone o repositório e rode o comando abaixo na raiz do projeto:

bash
- git clone <https://github.com/lkzalves/projeto-dismotor>
- cd projeto-dismotor
- docker compose up -d --build

