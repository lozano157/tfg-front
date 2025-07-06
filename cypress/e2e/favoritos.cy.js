describe('Flujo de Gestión de Favoritos', () => {

  // El beforeEach ahora solo se encarga del login, una acción común a todas las pruebas.
  beforeEach(() => {
    cy.login(); 
  });

  // --- PRUEBA 1: Verificar la carga inicial ---
  it('debería cargar y mostrar los favoritos iniciales correctamente', () => {
    // Definimos el intercept específico para ESTA prueba.
    cy.intercept('POST', '**/tpsValencia/favourite/getFavouritesByUser', { 
      fixture: 'favoritos_iniciales.json' 
    }).as('getFavoritos');

    cy.visit('/favoritos');
    cy.wait('@getFavoritos');

    cy.get('[data-cy=tabla-favoritos]').contains('Colón').should('be.visible');
  });

  // --- PRUEBA 2: Verificar la adición de un nuevo favorito ---
  it('debería permitir añadir un nuevo favorito', () => {
    // Definimos TODOS los intercepts que esta prueba necesita.
    cy.intercept('POST', '**/tpsValencia/favourite/getFavouritesByUser', { fixture: 'favoritos_iniciales.json' }).as('getFavoritos');
    cy.intercept('POST', '**/tpsValencia/parada/getParadasEmt', { fixture: 'paradas_emt.json' }).as('getParadasEmt');
    cy.intercept('POST', '**/tpsValencia/favourite/add', { statusCode: 201 }).as('addFavorito');
    
    cy.visit('/favoritos');
    cy.wait('@getFavoritos');

    // Flujo de añadir...
    cy.get('[data-cy=btn-nuevo-favorito]').click();
    cy.get('[data-cy=select-agencia]').click();
    cy.get('.v-list-item-title').contains('EMT').click();
    cy.wait('@getParadasEmt');
    cy.get('[data-cy=autocomplete-parada]').type('Nueva Parada');
    cy.get('.v-list-item-title').contains('Nueva Parada').click();
    cy.get('[data-cy=btn-guardar-favorito]').click();
    cy.wait('@addFavorito');

    // Aquí podrías añadir una verificación de que la lista se recarga, si aplica.
  });

  // --- PRUEBA 3: Verificar el borrado de un favorito ---
  it('debería permitir borrar un favorito existente y refrescar la lista', () => {
    // Definimos TODOS los intercepts que esta prueba necesita, en el orden en que se llamarán.
    cy.intercept('POST', '**/tpsValencia/favourite/getFavouritesByUser', { 
      fixture: 'favoritos_iniciales.json' 
    }).as('getFavoritosInicial');

    
    // Inicio del Test
    cy.visit('/favoritos');
    cy.wait('@getFavoritosInicial');
    cy.get('[data-cy=tabla-favoritos]').contains('Colón').should('be.visible');

    // Acción de borrar
    cy.get('[data-cy=tabla-favoritos]')
      .contains('td', 'Colón')
      .parent('tr')
      .find('[data-cy=btn-borrar-favorito]')
      .click();

    
    cy.intercept('POST', '**/tpsValencia/favourite/delete', { statusCode: 200 }).as('deleteFavorito');

    // Este es el intercept para la llamada de RECARGA
    cy.intercept('POST', '**/tpsValencia/favourite/getFavouritesByUser', { 
      fixture: 'favoritos_vacios.json' 
    }).as('getFavoritosRecargados');

    // Verificamos ambas llamadas
    cy.wait('@deleteFavorito');
    cy.wait('@getFavoritosRecargados');

    // Verificamos el resultado final
    cy.get('[data-cy=tabla-favoritos]').contains('Colón').should('not.exist');
  });

});