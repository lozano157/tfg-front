describe('Flujo de Gestión de Favoritos', () => {

  it('debería cargar los favoritos, permitir añadir uno y borrarlo', () => {
    
    // --- 1. PREPARAMOS EL ESTADO Y LOS MOCKS ---
    // Esto se ejecuta todo antes de que la página se cargue.

    // Primero, preparamos la "trampa" para la llamada a la API.
    cy.intercept('POST', '**/tpsValencia/favourite/getFavouritesByUser', { 
      fixture: 'favoritos_iniciales.json' 
    }).as('getFavoritos');

    // ... (aquí irían los otros cy.intercept para añadir y borrar) ...

    // Ahora, simulamos el inicio de sesión.
    cy.login(); 

    // --- 2. ACTUAMOS ---
    // Solo ahora, con todo preparado, visitamos la página.
    cy.visit('/favoritos');

    // --- 3. ESPERAMOS Y VERIFICAMOS ---
    
    // El 'mounted()' de Vue se ejecutará, pero la trampa ya está lista.
    cy.wait('@getFavoritos');

    // Verificamos que la tabla muestra el contenido del fixture.
    cy.get('[data-cy=tabla-favoritos]').contains('Colón').should('be.visible');

    // ... aquí continúa el resto de tu test ...
  });
});