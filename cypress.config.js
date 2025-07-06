import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // Fichero de soporte para cargar comandos, etc.
    supportFile: 'cypress/support/e2e.js',
    
    // Patrón para encontrar los ficheros de prueba
    specPattern: 'cypress/e2e/**/*.cy.js',
    
    // URL base de tu aplicación frontend
    baseUrl: 'http://localhost:5173',

    // --- Optimizaciones para Estabilidad y Memoria ---
    
    // Reduce la memoria usada en modo interactivo
    numTestsKeptInMemory: 0,
    
    // Activa la gestión de memoria experimental de Cypress
    experimentalMemoryManagement: true,
    
    // Permite a Cypress intentar modificar código de terceros que causa inestabilidad
    experimentalModifyObstructiveThirdPartyCode: true,

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});