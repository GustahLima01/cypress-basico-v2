//Add Novocomando ao cypress
Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){
    cy.get('#firstName').type('Gustavo')
    cy.get('#lastName').type('Lima')
    cy.get('#email').type('teste@teste.com.br')
    cy.get('#open-text-area').type('Teste')
    cy.contains('button', 'Enviar').click()
}) 
