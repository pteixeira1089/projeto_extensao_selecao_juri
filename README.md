# Sorteio Eletrônico do Júri - Versão 2

Este repositório contém a versão 2 da aplicação de Sorteio Eletrônico do Júri, desenvolvida para auxiliar na gestão e realização de sorteios em sessões do Tribunal do Júri, modernizando procedimentos judiciais através da tecnologia.

## 🚀 Funcionalidades

A aplicação oferece suporte completo para as etapas cruciais da seleção de jurados, alinhada aos preceitos do Código de Processo Penal (CPP):

1.  **Sorteio de Jurados Titulares e Suplentes**:
    *   Importação de lista de cidadãos elegíveis.
    *   Realização do sorteio aleatório.
    *   Possibilidade de substituição imediata de cidadãos sorteados que apresentem impedimentos legais.

2.  **Sorteio do Conselho de Sentença**:
    *   Gestão da fase de apregoamento (chamada) dos jurados presentes.
    *   Sorteio final dos jurados que comporão o conselho.
    *   Registro de recusas imotivadas (peremptórias) pela acusação e defesa, além de impedimentos e dispensas motivadas.

## ⚠️ Aviso Importante: Execução e Dados

**O software executa inteiramente no navegador do usuário (Client-Side) e utiliza memória volátil.**

Isso significa que **não há armazenamento persistente de dados** (banco de dados ou local storage permanente). Se a página for recarregada, o estado atual do sorteio será perdido.

> **Recomendação de Segurança:** Caso a aplicação seja utilizada em sessões reais do júri, especialmente na fase crítica de seleção do Conselho de Sentença, recomenda-se fortemente a manutenção de **urnas físicas com as cédulas dos jurados presentes** ou outra medida de contingência (backup analógico) que o juízo entender cabível, garantindo a segurança jurídica do ato em caso de falhas técnicas.

## 📜 Histórico e Contexto

Este projeto surgiu de uma parceria entre a **1ª Vara Federal do Júri e de Execução Penal de São Paulo** e um estudante de Análise e Desenvolvimento de Sistemas.

As versões iniciais do software foram apresentadas como resultado de um **Projeto de Extensão Universitária**, demonstrando a aplicação prática do conhecimento acadêmico na solução de problemas reais do judiciário.

## 🛠️ Tecnologias e Arquitetura

O projeto foi desenvolvido com foco nos fundamentos da web, utilizando **HTML, CSS e JavaScript Puro (Vanilla)**, com o auxílio do **Vite** para o ambiente de desenvolvimento e build.

### Arquitetura Adotada
Para manter a organização sem o uso de frameworks complexos, foi adotada uma arquitetura personalizada baseada em MVC e gerenciamento de estado:

*   **AppState**: Singleton para gerenciamento centralizado do estado da aplicação (Reatividade via Observer Pattern).
*   **Page Orchestrator**: Gerencia a navegação e o ciclo de vida das telas.
*   **Models**: Representação das entidades de negócio (ex: `Jurado`, `Urna`).
*   **Views**: Responsáveis pela criação dos elementos do DOM.
*   **Renderers**: Gerenciam a atualização visual dos componentes com base nas mudanças do estado.
*   **Controllers**: Intermediam as interações do usuário e atualizam o estado.
*   **Services**: Encapsulam regras de negócio complexas e manipulação lógica.

## 💻 Como Executar

### Desenvolvimento Local
Para rodar a aplicação em ambiente de desenvolvimento:

1.  Instale as dependências:
    ```bash
    npm install
    ```
2.  Inicie o servidor:
    ```bash
    npm run dev
    ```

### Docker
O projeto possui um `Dockerfile` configurado para deploys rápidos:

```bash
docker build -t sorteio-juri .
docker run -p 8080:80 sorteio-juri
```

## 🤝 Contribuições

Este é um projeto de **código aberto** e está aberto a novas contribuições. As principais áreas de interesse para evolução são:

*   **Persistência de Dados**: Implementação de mecanismos para salvar o estado do sorteio, aumentando a robustez da aplicação.
*   **Refatoração**: Melhorias no código para torná-lo ainda mais aderente à arquitetura proposta, visando desacoplamento e manutenibilidade.

---

## 📸 Screenshots

<!-- Adicione aqui imagens ou GIFs da aplicação em funcionamento para enriquecer seu portfólio -->
*(Espaço reservado para screenshots da interface)*

---

*Desenvolvido por Pedro G. Teixeira.*