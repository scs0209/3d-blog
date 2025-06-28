# Gemini Code Assistant: Auto Code Review Guidelines

**Review Language:** All review comments must be written in Korean.

## 1. General Principles

- **Readability:** Code must be clear and easy to understand. Add comments for complex logic to help other developers.
- **Consistency:** Maintain a consistent coding style and structure throughout the project. New code should follow the conventions of existing code.
- **Simplicity (KISS):** Avoid unnecessarily complex designs or code. Strive for the simplest possible implementation.

## 2. TypeScript & Next.js

- **Type Definitions:** Minimize the use of the `any` type. Define specific types wherever possible. Use `interface` and `type` appropriately based on the context.
- **Next.js Conventions:**
    - Ensure the correct use of modern App Router conventions (Server Components, Client Components).
    - Data fetching must be performed through the common functions in `fetcher.ts`. Avoid direct use of the `fetch` API and verify that `fetcher.ts` is used instead.
    - API route handlers must be written clearly and securely.
- **React Best Practices:**
    - Adhere to the Rules of Hooks.
    - Components should be small and follow the Single Responsibility Principle (SRP).
    - State management logic should be clear and efficient.

## 3. Testing (Vitest)

- **Test Coverage:** Critical business logic and components must be covered by tests.
- **Test Cases:** Test cases should be written clearly and include both success and error scenarios (using `describe`, `it`, `expect` structure).
- **Mocking:** External dependencies must be properly mocked to ensure test independence.

## 4. Security

- **Input Validation:** Always validate and sanitize untrusted data, such as user input or external API responses, to prevent XSS (Cross-Site Scripting) attacks.
- **API Security:** Ensure that API endpoints have proper authentication and authorization checks.
- **Sensitive Information Exposure:** Check that sensitive information like API keys or passwords is not hardcoded in the source code or exposed to the client. Verify the correct use of `.env` files and environment variables.
- **Dependency Management:** Do not use libraries with known security vulnerabilities.