describe('Mi Primera Prueba E2E', () => {
  it('visita la página principal y comprueba que funciona', () => {
    // Visita la URL de tu aplicación (ajusta el puerto si es necesario)
    cy.visit('http://localhost:5173/'); 

    // Comprueba que el título de la página contiene el texto esperado
    cy.title().should('include', 'Vite App'); 
  });
});