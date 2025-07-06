/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }


Cypress.Commands.add('login', (email, password) => {
  // Tu token de prueba válido. Asegúrate de que no esté caducado.
  const mockToken = "eyJhbGciOiJIUzI1NiIsImtpZCI6Imt5UkdrNHJIVFJaZW8xdUEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3Nqb2JnYnpmYm1scWlranh3amxpLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJmN2JlYmRiYS1mZTBhLTQ5OWQtOTEyMi1kNDViYmIwMTY3MDQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzUxNzY4OTk3LCJpYXQiOjE3NTE3NjUzOTcsImVtYWlsIjoiamF2aWVybG96YW5vb2xhbGxhQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJqYXZpZXJsb3phbm9vbGFsbGFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiZjdiZWJkYmEtZmUwYS00OTlkLTkxMjItZDQ1YmJiMDE2NzA0In0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib3RwIiwidGltZXN0YW1cCI6MTc1MTc2NTM5N31dLCJzZXNzaW9uX2lkIjoiZDFjOTI0M2YtOThhOS00ZDY5LWE5YWQtNWMyYzAxY2Y1NTQxIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.0HXICGiz4wJ80lclS2AYNw_o99gupH-RG8z706K4JPs";

  // --- CORRECCIÓN: Creamos un objeto de sesión más completo ---
  const sessionData = {
    access_token: mockToken,
    token_type: "bearer",
    expires_in: 3600, // Tiempo de vida en segundos (1 hora)
    expires_at: Math.floor(Date.now() / 1000) + 3600, // Momento de expiración en formato Unix
    user: {
      id: "f7bebdba-fe0a-499d-9122-d45bbb016704", // El 'sub' del token
      aud: "authenticated",
      role: "authenticated",
      email: "javierlozanoolalla@gmail.com"
    }
  };

  cy.window().then((win) => {
    // La clave de localStorage debe ser correcta
    const localStorageKey = 'sb-sjobgbzfbmlqikjxwjli-auth-token';
    
    // Guardamos el objeto de sesión completo, convertido a un string JSON
    win.localStorage.setItem(localStorageKey, JSON.stringify(sessionData));
  });
});