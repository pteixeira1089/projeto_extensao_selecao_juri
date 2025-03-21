# Projeto de Extensão: Sorteio digital do Júri
Este repositório consiste em um projeto de software web portátil que pode ser utilizado para sortio e seleção de jurados para atuarem no tribunal do Júri, nos termos dos artigos 425 a 432 do Código de Processo Penal.

O software foi feito no contexto de um Projeto de Extensão do curso de Análise e Desenvolvimento de Sistemas da Faculdade Descomplica, tendo sido construído sob a licença de software livre, para que possa ser utilizado e adaptado/melhorado por qualquer Tribunal do país. O relatório final do projeto pode ser encontrado em https://1drv.ms/b/s!Alud3X2uB6gEnPlMiwlDFs8Mv2B21g?e=JMIFHI.

## Qual problema foi resolvido?
Os artigos do Código Penal que regem o tema preveem um procedimento manual de sorteio do júri, com uso de fichas de papel e urnas de sorteio. Em Municípios muito populosos, o número de fichas a serem confeccionadas para o sorteio pode chegar a 800. Além disso, o proecedimento manual de sorteio do júri (incluindo a sua preparação) demanda muito tempo e recursos para ser feito.

Nesse sentido, o presente software se propõe a digitalizar o procedimento de sorteio e seleção, eliminando a necessidade do uso de fichas de papel e de urnas físicas. O fluxo de operações do software (experiência do usuário) foi pensado de forma a se manter alinhado às regras fixadas no CPP. Nesse sentido, a adoção do procedimento digital de sorteio mantém a isonomia e a transparência do procedimento, ao mesmo tempo em que se alinha a uma abordagem mais moderna, eficiente e sustentável de administração pública. Sua adoção na unidade judicial pode facilitar os procedimentos de gestão de jurados alistados, facilitando a sua renovação anual, bem como facilitar também o procedimento de seleção do Conselho de Sentença. Em sua versão 'analógica', tais procedimentos demandam muito tempo de trabalho e recursos para atualização e substituição de fichas de papel, bem como movimentação de urnas físicas.

## O que foi entregue na primeira versão?
O primeiro ciclo de desenvolvimento entregou um Minimum Viable Product (Produto Viável Mínimo, ou MVP), que consiste em uma versão mais simples e funcional de um produto que pode ser utilizado e testado pela unidade judicial.

Nesse sentido, o software:
- fornece modelo de planilha de dados a ser utilizada como entrada de dados para o programa;
- recebe, como entrada de dados, uma planilha com dados de jurados alistados;
- permite a configuração da forma como os nomes serão sorteados;
- elabora uma listagem final de jurados sorteados

## O que ainda pode ser melhorado (pull requests são bem vindos)
Após a apresentação do MVP, foram levantados novos requisitos, como:
- Inserção de campo para justificar eventual substituição de jurado sorteado (por exemplo, em casos de impedimento);
- Inclusão de campos para apontar presenças de representantes de outros órgãos (Ministério Público, Defensoria Pública, OAB e outros);
- Geração de relatório final que pode ser utilizado como ata de audiência;
- Melhoramento do código, com uso, por exemplo, de Programação Orientada a Objeto para a criação dinâmica dos elementos html.

## Persistência de dados
Nesta primeira versão, optou-se por não utilizar bancos de dados, uma vez que o software lida com informações sensíveis (dados de jurados), que devem ser mantidos sob a guarda do magistrado (CPP, art. 426, §3º). Nesse sentido, a guarda dos dados dos jurados alistados em formato digital pode ser feita por meio da guarda de uma planilha de dados protegida por senha (que é utilizada como entrada de dados no software) pelo magistrado em um dispositivo pessoal seguro (como armazenamento em nuvem, homologado pelo órgão, ou dispositivo de memória removível).

A juízo do(a) magistrado(a) responsável pela unidade judicial, contudo, a equipe de TI do órgão pode implementar o software com suporte a persistência de dados em meio seguro, caso seja necessário.

## Identidade visual
Os logos, cores e fontes adotados no projeto foram aplicados em conformidade com o Manual de Identidade Visual da Justiça Federal, disponível em https://www.cjf.jus.br/cjf/identidade-visual-1/ManualdeIdentidadeJustiaFederal.pdf

## Conhecimentos utilizados para desenvolvimento do projeto:
- Noções de Experiência do Usuário (UX/UI);
  - Desenvolvimento simples, minimalista, com instruções claras e adoção de padrão de cores e de elementos de identidade visual;
  - Design responsivo, que se ajusta a dispositivos com telas menores.
- Planejamento de projeto de software;
  - Uso do método Design Thinking para levantamento de requisitos, desenvolvimento de protótipo e sua validação pela equipe;
  - Uso da ferramenta Figma;
  - Uso da ferramenta Canva;
- Conceitos de engenharia de software: levantamento de requisitos e desenvolvimento incremental/iterativo.
- Ferramentas de desenvolvimento web (HTML, CSS e JavaScript).

## Recomendações
O CNJ já vem reconhecendo como boa prática a adoção de soluções digitais de sorteio e seleção do júri (vide https://boaspraticas.cnj.jus.br/pratica/478). Nesse sentido, a fim de fortaelecer a adoção de soluções digitais para escolha e seleção do júri mantendo a lisura e transparência máxima do procedimento, entendo ser de vital importância a *homologação do código fonte do software* por unidades técnicas de Tecnologia da Informação da unidade judicial que implementa a solução e também de terceiros que fiscalizam o procedimento, como Ministério Público, Defensoria Pública e Ordem dos Advogados do Brasil.

O código que realiza o sorteio utiliza uma função nativa do JavaScript (Math.random()), e foi implementada, nesta primeira versão, da seguinte forma:
```javascript
 let jurado;
            do {
                const randomIndex = Math.floor(Math.random() * totalJuradosAlistados);
                jurado = Object.entries(jurados)[randomIndex];
            } while (sortedJurados.includes(jurado[0]));
```


## Como utilizar
1. Clone ou baixe o repositório;
2. Abra o arquivo index.html;
3. Utilize o arquivo 'jurados_mock_data.xlsx' como entrada de dados no software, para testes. Para uso em um cenário real, pode-se salvar um novo arquivo xlsx com dados reais dos jurados a serem selecionados (arquivo mantido em guarda do magistrado, conforme citado acima).

## Sobre modularização do código
Esta primeira versão foi construída de forma a permitir a execução do software de forma portátil e local, ou seja, em qualquer dispositivo com navegador de internet atualizado. Para tanto, todo o código javascript foi adicionado em um único arquivo (script.js). Em que pese tal adoção permitir a execução local do software, a legibilidade e manutenibilidade do código pode ser prejudicada (principalmente em implementações que adicionem novos recursos).

Sendoa assim, caso a unidade judicial decida por implementar o projeto de forma portátil e local, ou não deseje adicionar novos recursos e funcionalidades à sua implementação, o software pode ser executado na forma como eestá, seguindo as instruções da seção "Como utilizar".

Por outro lado, caso a unidade judicial opte por implemente o projeto em um servidor, adicionando especificações próprias e outras melhorias, a equipe de TI pode modularizar o código javascript em vários outros arquivos .js, a fim de obter melhor legibilidade e manutenibilidade do software.
