/* global cy, it, describe */

describe('My First Test', () => {
    it('Check dataset and page interactions', () => {
      cy.visit('http://localhost:5502/index.html')
  
      // Try to get an element on the screen and checks its value
      cy.get('#root').should('contain','Got 73 episode(s)')
  
      cy.wait(1000)
      // Click the button and see if page interacts correctly
      cy.get('button').click();
      cy.get('#episodeInfo').should('contain','Winter is Coming')
    })
  })