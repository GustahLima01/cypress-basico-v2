// abaixo é o intelicense, que é ao passar o mouse sobre um metodo, parametros e etc
/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function(){

    const THREE_SECONDS_IN_MS = 3000 //variavel de 3000 milessegundos

    beforeEach(function() {
        //visit - visitar o caminho, a url
        cy.visit('./src/index.html')
      })

    //it - teste case
    it('verifica o título da aplicação', function(){
        
        //title - pega o título do navegador
        //should - faz a verificação
        cy.title().should('be.equal','Central de Atendimento ao Cliente TAT')
    })

//it.only = executa somente esse teste

    it('preenche os campos obrigatórios e envia o formulário',function(){
        const longText = 'testeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

        cy.clock() //congela o relogio do navegador

        cy.get('#firstName').type('Gustavo')
        cy.get('#lastName').type('Lima')
        cy.get('#email').type('teste@teste.com.br')
        cy.get('#open-text-area').type(longText, {delay:0}) //objeto delay é o tempo de espera p preenchimento
        cy.contains('button', 'Enviar').click()
        cy.get('.success').should('be.visible')//identifica que o campo está visivel
        //.sucess = . significa que é uma class

        cy.tick(THREE_SECONDS_IN_MS) //tick avança um tempo enviado na variavel, variavel criada é global

        cy.get('.success').should('not.be.visible')//valida que não está visivel
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
        cy.clock()

        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')
    })

    it('valida campo telefone vazio quando preenchido não numerico', function(){
        cy.get('#phone')
            .type('q')
            .should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
        cy.clock()

        cy.get('#firstName').type('Gustavo').should('have.value', 'Gustavo')
        cy.get('#lastName').type('Lima').should('have.value', 'Lima')
        cy.get('#email').type('teste@teste.com.br').should('have.value', 'teste@teste.com.br')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function(){
        cy.get('#firstName').type('Gustavo').should('have.value', 'Gustavo').clear().should('have.value', '')
        cy.get('#lastName').type('Lima').should('have.value', 'Lima').clear().should('have.value', '')
        cy.get('#email').type('teste@teste.com.br').should('have.value', 'teste@teste.com.br').clear().should('have.value', '')
        cy.get('#phone').type('99').should('have.value', '99').clear().should('have.value', '')
    })

    it('envia o formuário com sucesso usando um comando customizado',function(){
        cy.clock()
        
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.success').should('not.be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
        cy.clock()

        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
        
        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')
    })   

    it('seleciona um produto (YouTube) por seu texto', function(){
        cy.get('#product').select('youtube').should('have.value','youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function(){
        cy.get('#product').select('mentoria').should('have.value','mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function(){
        cy.get('#product').select(1).should('have.value','blog')
    })

    it('marca o tipo de atendimento "Feedback"', function(){
        cy.get('input[type="radio"][value="feedback"]').check().should('be.checked')
    })

    it('marca cada tipo de atendimento', function(){
        cy.get('input[type="radio"]') //retorna mais de um elemento
            .should('have.length', 3) //verificação intermediaria da quantia de elementos, EX.: 3
            .each(function($radio){ //each passa por cada elemento...é passado um argumento
                cy.wrap($radio).check() //wrap empacota cada elemento p manda comandos do cypress
                cy.wrap($radio).should('be.checked')
            })
    })

    it('marca ambos checkboxes, depois desmarca o último', function(){
        cy.get('input[type="checkbox"]') //checkbox marca todos juntos
            .check()
            .should('be.checked')
            .last() //pega o último checkbox
            .uncheck() //desmarca
            .should('not.be.checked') //valida check desmarcado
    })

    it('seleciona um arquivo da pasta fixtures', function(){
        cy.get('input[type="file"]')
            .should('not.have.value')//valida que está vazio
            .selectFile('cypress/fixtures/example.json')
            .should(function($input){
                //console.log($input)//console.log ele verifica traz o log no cy.open
                expect($input[0].files[0].name) //expera no primeiro input "0" e files "0" o nome passado no equal
                .to.equal('example.json')
        })
    })

    it('seleciona um arquivo simulando um drag-and-drop', function(){
        cy.get('input[type="file"]')
            .should('not.have.value')//valida que está vazio
            .selectFile('cypress/fixtures/example.json', {action: 'drag-drop'})//simula que está arrastando um arquivo de uma pasta p o campo
            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
        })
     })

     it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){
        cy.fixture('example.json') //fixture = pega um arquivo desta pasta
        .as('sampleFile')//as = renomeia = alias
        cy.get('input[type="file"]')
            .selectFile('@sampleFile') //@+alias acima p selecionar o arquivo
            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
        })
     })

     it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique',function(){
        cy.get('#privacy a') //pegamos o ancora "a" que estava dentro do elemento "privacy"
            .should('have.attr', 'target', '_blank') // essa validação com 3 argumentos
     })

     it('acessa a página da política de privacidade removendo o target e então clicanco no link', function(){
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')//remove elemento target p/ que o link que abre em outra aba, abra na mesma
            .click()

        cy.contains('Talking About Testing').should('be.visible')//validação texto visivel na página
     })

     it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', ()=>{//=> é um outro tipo de função
        cy.get('.success')
            .should('not.be.visible')
            .invoke('show') // show = exibe um elemento escondido
            .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso.')//and = adiciona mais alguma coisa
            .invoke('hide')//hide = esconde elemento
            .should('not.be.visible')
        cy.get('.error')
        .should('not.be.visible')
        .invoke('show')
        .should('be.visible')
        .and('contain', 'Valide os campos obrigatórios!')
        .invoke('hide')
        .should('not.be.visible')
     })

     it('preenche a area de texto usando o comando invoke', function(){
        //Cypress._.repeat = pega o 1º valor e multiplica pelo segundo valor = Ex. 01234567890123456789...
        const longText = Cypress._.repeat('0123456789', 20) 

        cy.get('#open-text-area')
            .invoke('val', longText) //val = seta o valor = ctrl+v
            .should('have.value', longText)
     })

     it('faz uma requisição HTTP', function(){
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
            .should(function(response){
                //console.log(response) //FOI UTILIZADO PARA PEGAR OS DADOS DA REQUISIÇÃO NO CONSOLE DO INSPECIONAR
                const {status, statusText, body} = response //desestrutura os dados do response pega as info
                    expect(status).to.equal(200)
                    expect(statusText).to.equal('OK')
                    expect(body).to.include('CAC TAT')
            })
     })

     it.only('encontre o gato', function(){
        cy.get('#cat')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
        cy.get('#title')
            .invoke('text', 'CAT TAT') //invoke text = altera um texto para o segundo argumento
        cy.get('#subtitle')
            .invoke('text','🚀🚀Voa!!!! 🚀🚀')            
     })

})