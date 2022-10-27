it('testa a página da política de privavidade de forma independente', function(){
    cy.visit('./src/privacy.html')
    
    cy.contains('CAC TAT - Política de privacidade').should('be.visible')
 })

 Cypress._.times(3, function(){//Cypress._.times(3,x) = executa função X vezes o primeiro argumento
    it('testa a página da política de privavidade de forma independente', function(){
        cy.visit('./src/privacy.html')
        
        cy.contains('CAC TAT - Política de privacidade').should('be.visible')
     })
 })