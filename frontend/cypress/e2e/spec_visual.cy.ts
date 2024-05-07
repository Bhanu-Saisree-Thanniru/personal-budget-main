// describe('My First Test', () => {
//   it('Visits the initial project page', () => {
//     cy.visit('/budget');
//     cy.visit('/login');
//     cy.get('#username').type('thanniru.bhanusaisree@gmail.com');
//     cy.get('#password').type('Nbad123');
//     cy.get('#login').click();
//     cy.url().should('include', '/budget/dashboard');
//     cy.contains('Personal-Budget-app').should('be.visible');
//     cy.get('#addIncome').click();
//     cy.get('#month').click().get('mat-option').contains('May').click();
//     cy.get('#year').click().get('mat-option').contains('2024').click();
//     cy.get('#amount').type('460');
//     cy.get('#ok').click();
//     cy.contains('Earnings').should('be.visible');

//     // Perform visual regression checks
//     cy.matchImageSnapshot();
//   });
// });
