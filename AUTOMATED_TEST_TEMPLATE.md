# Automated Test Template

This document provides templates for automated tests that can be implemented using testing frameworks like Jest, React Testing Library, Cypress, or Playwright.

## Test Framework Recommendations

### Unit & Integration Tests
- **Jest** + **React Testing Library** for component testing
- **Vitest** as a faster alternative to Jest

### End-to-End Tests
- **Cypress** for comprehensive E2E testing
- **Playwright** for cross-browser E2E testing

## Installation

```bash
# For Jest + React Testing Library
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest

# For Cypress
npm install --save-dev cypress

# For Playwright
npm install --save-dev @playwright/test
```

## Unit Test Examples

### Authentication Context Test

```typescript
// src/contexts/__tests__/AuthContext.test.tsx
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>{children}</AuthProvider>
  </QueryClientProvider>
);

describe('AuthContext', () => {
  it('should login successfully with valid credentials', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toBeDefined();
      expect(localStorage.getItem('auth_token')).toBeDefined();
    });
  });

  it('should handle login failure', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      try {
        await result.current.login('invalid@example.com', 'wrong');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('auth_token')).toBeNull();
  });

  it('should logout successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Login first
    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    // Then logout
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});
```

### Language Context Test

```typescript
// src/contexts/__tests__/LanguageContext.test.tsx
import { renderHook, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../LanguageContext';
import { Locale } from '@/types/models';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should default to English', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.locale).toBe(Locale.English);
    expect(result.current.isRTL).toBe(false);
  });

  it('should switch to Arabic and enable RTL', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => {
      result.current.setLocale(Locale.Arabic);
    });

    expect(result.current.locale).toBe(Locale.Arabic);
    expect(result.current.isRTL).toBe(true);
    expect(result.current.direction).toBe('rtl');
    expect(localStorage.getItem('locale')).toBe('ar');
  });

  it('should persist language preference', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => {
      result.current.setLocale(Locale.Spanish);
    });

    expect(localStorage.getItem('locale')).toBe('es');
  });
});
```

### Component Test Example

```typescript
// src/components/quiz/__tests__/QuizCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import QuizCard from '../QuizCard';
import { Quiz } from '@/types/models';

const mockQuiz: Quiz = {
  id: 1,
  title: { en: 'Test Quiz', ar: 'اختبار', es: 'Prueba' },
  description: { en: 'Description', ar: 'وصف', es: 'Descripción' },
  level: 'A1',
  language_id: 1,
  duration_minutes: 30,
  passing_score: 70,
  is_active: true,
  questions_count: 10,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('QuizCard', () => {
  it('should render quiz information', () => {
    render(<QuizCard quiz={mockQuiz} />, { wrapper });

    expect(screen.getByText('Test Quiz')).toBeInTheDocument();
    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText(/30/)).toBeInTheDocument();
    expect(screen.getByText(/70/)).toBeInTheDocument();
  });

  it('should navigate to quiz detail on click', () => {
    render(<QuizCard quiz={mockQuiz} />, { wrapper });

    const card = screen.getByRole('article');
    fireEvent.click(card);

    // Check if navigation occurred (you may need to mock useNavigate)
  });

  it('should show correct level badge color', () => {
    render(<QuizCard quiz={mockQuiz} />, { wrapper });

    const badge = screen.getByText('A1');
    expect(badge).toHaveClass('bg-green-100'); // or whatever your styling is
  });
});
```

## Integration Test Examples

### Quiz Taking Flow Test

```typescript
// src/pages/student/__tests__/TakeQuiz.integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import TakeQuiz from '../TakeQuiz';
import { AuthProvider } from '@/contexts/AuthContext';

const queryClient = new QueryClient();

const AllTheProviders = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

describe('TakeQuiz Integration', () => {
  it('should complete full quiz flow', async () => {
    render(<TakeQuiz />, { wrapper: AllTheProviders });

    // Wait for quiz to load
    await waitFor(() => {
      expect(screen.getByText(/Question 1/)).toBeInTheDocument();
    });

    // Select answer
    const optionA = screen.getByRole('button', { name: /Option A/ });
    fireEvent.click(optionA);

    // Navigate to next question
    const nextButton = screen.getByRole('button', { name: /Next/ });
    fireEvent.click(nextButton);

    // Verify navigation
    await waitFor(() => {
      expect(screen.getByText(/Question 2/)).toBeInTheDocument();
    });

    // Continue through all questions...
    // Submit quiz
    // Verify results page
  });

  it('should auto-submit when timer expires', async () => {
    // Mock timer
    jest.useFakeTimers();

    render(<TakeQuiz />, { wrapper: AllTheProviders });

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(30 * 60 * 1000); // 30 minutes
    });

    // Verify auto-submit
    await waitFor(() => {
      expect(screen.getByText(/Results/)).toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});
```

## E2E Test Examples (Cypress)

### Authentication E2E Test

```typescript
// cypress/e2e/authentication.cy.ts
describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login with valid credentials', () => {
    cy.get('input[name="email"]').type('student@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/student/dashboard');
    cy.contains('Welcome').should('be.visible');
    cy.window().its('localStorage.auth_token').should('exist');
  });

  it('should show error with invalid credentials', () => {
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.contains('Invalid credentials').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should logout successfully', () => {
    // Login first
    cy.login('student@example.com', 'password123');

    // Then logout
    cy.get('[data-testid="user-menu"]').click();
    cy.contains('Logout').click();

    cy.url().should('include', '/login');
    cy.window().its('localStorage.auth_token').should('not.exist');
  });

  it('should redirect to login when accessing protected route', () => {
    cy.visit('/student/dashboard');
    cy.url().should('include', '/login');
  });
});
```

### Quiz Taking E2E Test

```typescript
// cypress/e2e/quiz-taking.cy.ts
describe('Quiz Taking Flow', () => {
  beforeEach(() => {
    cy.login('student@example.com', 'password123');
    cy.visit('/quizzes');
  });

  it('should complete full quiz flow', () => {
    // Browse quizzes
    cy.contains('English Quiz A1').click();

    // View quiz details
    cy.contains('Start Quiz').click();

    // Answer questions
    cy.get('[data-testid="option-a"]').click();
    cy.contains('Next').click();

    cy.get('[data-testid="option-b"]').click();
    cy.contains('Next').click();

    // Continue for all questions...

    // Submit quiz
    cy.contains('Submit Quiz').click();
    cy.contains('Are you sure').should('be.visible');
    cy.contains('Confirm').click();

    // View results
    cy.url().should('include', '/results');
    cy.contains('Your Score').should('be.visible');
    cy.get('[data-testid="score"]').should('exist');
  });

  it('should filter quizzes by language', () => {
    cy.get('[data-testid="language-filter"]').click();
    cy.contains('Spanish').click();

    cy.get('[data-testid="quiz-card"]').each(($card) => {
      cy.wrap($card).should('contain', 'Spanish');
    });
  });

  it('should show timer countdown', () => {
    cy.contains('Timed Quiz').click();
    cy.contains('Start Quiz').click();

    cy.get('[data-testid="timer"]').should('be.visible');
    cy.get('[data-testid="timer"]').should('contain', ':');

    // Wait and verify timer decreases
    cy.wait(1000);
    cy.get('[data-testid="timer"]').invoke('text').then((text1) => {
      cy.wait(1000);
      cy.get('[data-testid="timer"]').invoke('text').should('not.equal', text1);
    });
  });
});
```

### Multilingual E2E Test

```typescript
// cypress/e2e/multilingual.cy.ts
describe('Multilingual Functionality', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should switch to Arabic and enable RTL', () => {
    cy.get('[data-testid="language-switcher"]').click();
    cy.contains('العربية').click();

    cy.get('html').should('have.attr', 'dir', 'rtl');
    cy.get('html').should('have.attr', 'lang', 'ar');
    cy.contains('الصفحة الرئيسية').should('be.visible');
  });

  it('should persist language preference', () => {
    cy.get('[data-testid="language-switcher"]').click();
    cy.contains('Español').click();

    cy.reload();

    cy.get('html').should('have.attr', 'lang', 'es');
    cy.contains('Inicio').should('be.visible');
  });

  it('should translate all UI elements', () => {
    cy.get('[data-testid="language-switcher"]').click();
    cy.contains('Español').click();

    // Check various UI elements
    cy.contains('Iniciar sesión').should('be.visible');
    cy.contains('Registrarse').should('be.visible');
    cy.contains('Profesores').should('be.visible');
  });

  it('should send Accept-Language header', () => {
    cy.intercept('GET', '/api/**').as('apiRequest');

    cy.get('[data-testid="language-switcher"]').click();
    cy.contains('Español').click();

    cy.visit('/quizzes');

    cy.wait('@apiRequest').its('request.headers').should('have.property', 'accept-language', 'es');
  });
});
```

## Playwright Test Examples

```typescript
// tests/e2e/responsive.spec.ts
import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('should display mobile menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Hamburger menu should be visible
    await expect(page.locator('[data-testid="hamburger-menu"]')).toBeVisible();

    // Full navigation should be hidden
    await expect(page.locator('[data-testid="desktop-nav"]')).not.toBeVisible();

    // Click hamburger
    await page.click('[data-testid="hamburger-menu"]');

    // Mobile menu should open
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
  });

  test('should display desktop navigation on large screens', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // Desktop navigation should be visible
    await expect(page.locator('[data-testid="desktop-nav"]')).toBeVisible();

    // Hamburger menu should be hidden
    await expect(page.locator('[data-testid="hamburger-menu"]')).not.toBeVisible();
  });

  test('should adapt quiz grid to viewport', async ({ page }) => {
    await page.goto('/quizzes');

    // Mobile: 1 column
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileCards = await page.locator('[data-testid="quiz-card"]').count();
    const mobileWidth = await page.locator('[data-testid="quiz-grid"]').evaluate(el => el.clientWidth);

    // Tablet: 2 columns
    await page.setViewportSize({ width: 768, height: 1024 });
    const tabletWidth = await page.locator('[data-testid="quiz-grid"]').evaluate(el => el.clientWidth);

    // Desktop: 3-4 columns
    await page.setViewportSize({ width: 1920, height: 1080 });
    const desktopWidth = await page.locator('[data-testid="quiz-grid"]').evaluate(el => el.clientWidth);

    expect(desktopWidth).toBeGreaterThan(tabletWidth);
    expect(tabletWidth).toBeGreaterThan(mobileWidth);
  });
});
```

## Custom Cypress Commands

```typescript
// cypress/support/commands.ts
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
      switchLanguage(language: 'en' | 'ar' | 'es'): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="user-menu"]').click();
  cy.contains('Logout').click();
});

Cypress.Commands.add('switchLanguage', (language) => {
  const languageMap = {
    en: 'English',
    ar: 'العربية',
    es: 'Español',
  };

  cy.get('[data-testid="language-switcher"]').click();
  cy.contains(languageMap[language]).click();
});
```

## Test Configuration

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### Cypress Configuration

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: true,
    screenshotOnRunFailure: true,
  },
  env: {
    apiUrl: 'http://localhost:8000/api',
  },
});
```

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Running Tests

```bash
# Unit tests
npm test
npm run test:coverage

# E2E tests with Cypress
npx cypress open
npx cypress run

# E2E tests with Playwright
npx playwright test
npx playwright test --ui
npx playwright show-report
```

## CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run build
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Notes

- These are templates - adapt to your specific needs
- Add more test cases as needed
- Maintain test data fixtures
- Keep tests independent and isolated
- Use data-testid attributes for reliable selectors
- Mock external dependencies
- Test edge cases and error scenarios
