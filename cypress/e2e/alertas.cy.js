// cypress/e2e/alertas.cy.js

describe('Flujo de Gestión de Alertas por Email', () => {

  // Antes de cada prueba, simulamos el inicio de sesión.
  beforeEach(() => {
    cy.login(); 
  });

  // --- PRUEBA 1: Verificar la carga inicial ---
  it('debería cargar y mostrar las alertas iniciales correctamente', () => {
    // Mock para la carga inicial
    cy.intercept('POST', '**/tpsValencia/alertaMail/getAlertasByUser', {
      fixture: 'alertas_iniciales.json'
    }).as('getAlertas');

    cy.visit('/alertas'); // Asegúrate de que esta es la ruta correcta
    cy.wait('@getAlertas');

    cy.get('[data-cy=tabla-alertas]').contains('Xàtiva').should('be.visible');
    cy.get('[data-cy=tabla-alertas]').contains('08:30').should('be.visible');
  });


  // --- PRUEBA 2: Verificar la adición de una nueva alerta ---
  it('debería permitir crear una nueva alerta diaria', () => {
    // Mocks para el flujo de AÑADIR
    cy.intercept('POST', '**/tpsValencia/alertaMail/getAlertasByUser', { fixture: 'alertas_iniciales.json' }).as('getAlertasInicial');
    cy.intercept('POST', '**/tpsValencia/parada/getParadasEmt', { fixture: 'paradas_emt.json' }).as('getParadasEmt');

    cy.visit('/alertas');
    cy.wait('@getAlertasInicial');

    // Flujo para añadir una nueva alerta
    cy.get('[data-cy=btn-nueva-alerta]').click();
    cy.get('[data-cy=dialog-alerta]').should('be.visible');
    cy.get('[data-cy=select-agencia-alerta]').click();
    cy.get('.v-list-item-title').contains('EMT').click();
    cy.wait('@getParadasEmt');
    
    cy.intercept('POST', '**/tpsValencia/alertaMail/addAlertaMail', { statusCode: 201 }).as('saveAlerta');
    
    cy.intercept('POST', '**/tpsValencia/alertaMail/getAlertasByUser', { fixture: 'alertas_actualizadas.json' }).as('getAlertasRefrescadas');
    cy.get('[data-cy=autocomplete-parada-alerta]').type('Nueva Parada');
    
    cy.get('.v-list-item-title').contains('Nueva Parada').click();
    cy.get('[data-cy=input-hora-alerta]').type('19:00');
    cy.get('[data-cy=btn-guardar-alerta]').click();

    

    // Verificamos las llamadas a la API
    cy.wait('@saveAlerta');
    cy.wait('@getAlertasRefrescadas');

    // Verificamos que la nueva alerta aparece en la tabla
    cy.get('[data-cy=tabla-alertas]').contains('Nueva Parada').should('be.visible');
    cy.get('[data-cy=tabla-alertas]').contains('19:00').should('be.visible');
  });


  // --- PRUEBA 3: Verificar el borrado de una alerta ---
  it('debería permitir borrar una alerta existente', () => {
    // Mocks para el flujo de BORRADO
    cy.intercept('POST', '**/tpsValencia/alertaMail/getAlertasByUser', { fixture: 'alertas_iniciales.json' }).as('getAlertasInicial');
    cy.intercept('POST', '**/tpsValencia/alertaMail/deleteAlertaMail', { statusCode: 200 }).as('deleteAlerta');
    
    cy.visit('/alertas');
    cy.wait('@getAlertasInicial');
    cy.get('[data-cy=tabla-alertas]').contains('Xàtiva').should('be.visible');

    // Acción de borrar
    cy.get('[data-cy=tabla-alertas]')
      .contains('td', 'Xàtiva')
      .parent('tr')
      .find('[data-cy=btn-borrar-alerta]')
      .click();

    // Verificamos la llamada de borrado
    cy.wait('@deleteAlerta');
    
    // Verificamos que el elemento ya no existe en la vista
    // NOTA: Esta verificación depende de que tu lógica de borrado en el frontend funcione.
    // Has puesto un `debugger` y un filtro incorrecto en tu método `fDeleteAlert`,
    // por lo que este paso podría fallar hasta que lo corrijas.
    cy.get('[data-cy=tabla-alertas]').contains('Xàtiva').should('not.exist');
  });

});