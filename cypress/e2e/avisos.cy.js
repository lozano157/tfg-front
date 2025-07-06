describe('Flujo de Gestión de Avisos de Usuario', () => {

  // El beforeEach se ejecuta antes de CADA 'it', asegurando que
  // el usuario está logueado y la página se visita en un estado limpio.
  beforeEach(() => {
    cy.login(); // Simula el inicio de sesión
  });

  // --- PRUEBA 1: Verificar la carga inicial ---
  it('debería cargar y mostrar los avisos iniciales correctamente', () => {
    // Preparamos el mock para la carga inicial
    cy.intercept('POST', '**/tpsValencia/alerta/getAlertasByUser', {
      fixture: 'avisos_iniciales.json'
    }).as('getAvisos');

    // Visitamos la página
    cy.visit('/avisos');

    // Esperamos y verificamos
    cy.wait('@getAvisos');
    cy.get('[data-cy=tabla-avisos]').contains('Aviso inicial de prueba').should('be.visible');
  });


  // --- PRUEBA 2: Verificar la adición de un nuevo aviso ---
  it('debería permitir publicar un nuevo aviso', () => {
    // Mockeamos las llamadas necesarias para AÑADIR
    cy.intercept('POST', '**/tpsValencia/parada/getParadasEmt', { fixture: 'paradas_emt.json' }).as('getParadasEmt');
    cy.intercept('POST', '**/tpsValencia/alerta/addAlerta', { statusCode: 201 }).as('saveAviso');
    // Mockeamos la recarga de la lista que ocurre después de guardar
    cy.intercept('POST', '**/tpsValencia/alerta/getAlertasByUser', { fixture: 'avisos_actualizados.json' }).as('getAvisosRefrescados');
    
    cy.visit('/avisos'); // Visitamos la página en este test también

    // Flujo para añadir un nuevo aviso
    cy.get('[data-cy=btn-nuevo-aviso]').click();
    cy.get('[data-cy=dialog-aviso]').should('be.visible');
    cy.get('[data-cy=select-agencia-aviso]').click();
    cy.get('.v-list-item-title').contains('EMT').click();
    cy.wait('@getParadasEmt');
    cy.get('[data-cy=autocomplete-parada-aviso]').type('Nueva Parada');
    cy.get('.v-list-item-title').contains('Nueva Parada').click();
    cy.get('[data-cy=textarea-mensaje-aviso]').type('Este es un nuevo aviso');
    cy.get('[data-cy=btn-guardar-aviso]').click();

    // Verificamos las llamadas a la API
    cy.wait('@saveAviso');
    cy.wait('@getAvisosRefrescados');

    // Verificamos que el nuevo aviso aparece en la tabla
    cy.get('[data-cy=tabla-avisos]').contains('Este es un nuevo aviso').should('be.visible');
  });


  // --- PRUEBA 3: Verificar el borrado de un aviso ---
  it('debería permitir borrar un aviso existente', () => {
    // Mockeamos la carga inicial y las llamadas de borrado
    cy.intercept('POST', '**/tpsValencia/alerta/getAlertasByUser', { fixture: 'avisos_iniciales.json' }).as('getAvisosInicial');
    // Mockeamos la recarga que ocurre después de borrar

    cy.visit('/avisos');
    cy.wait('@getAvisosInicial');
    cy.get('[data-cy=tabla-avisos]').contains('Aviso inicial de prueba').should('be.visible');

    
    
    cy.intercept('POST', '**/tpsValencia/alerta/deleteAlerta', { statusCode: 200 }).as('deleteAviso');
    cy.intercept('POST', '**/tpsValencia/alerta/getAlertasByUser', { body: [] }).as('getAvisosFinal');

    // Acción de borrar
    cy.get('[data-cy=tabla-avisos]')
      .contains('td', 'Aviso inicial de prueba')
      .parent('tr')
      .find('[data-cy=btn-borrar-aviso]')
      .click();

    

    // Verificamos las llamadas de borrado y recarga
    cy.wait('@deleteAviso');
    cy.wait('@getAvisosFinal');

    // Verificamos que el elemento ya no existe
    cy.get('[data-cy=tabla-avisos]').contains('Aviso inicial de prueba').should('not.exist');
  });

});