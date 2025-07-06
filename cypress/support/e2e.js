// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

Cypress.on('uncaught:exception', (err, runnable) => {
  // Le decimos a Cypress que si el error contiene el texto "ResizeObserver loop",
  // lo ignore y no falle el test.
  if (err.message.includes('ResizeObserver loop')) {
    return false
  }
  // Para cualquier otro error, dejamos que Cypress falle el test como haría normalmente.
  return true
})