
import { test, expect } from '@playwright/test';

test.describe('Diagnostic Module Flow', () => {
    test.setTimeout(90000);

    test('Super Admin creates diagnostic and Collaborator takes it', async ({ page }) => {
        // 1. Super Admin Login
        await page.goto('/login');
        await page.fill('input[type="email"]', 'super@esolutions.com');
        await page.fill('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');

        // Wait for redirect to dashboard
        await page.waitForURL('/super-admin');

        // 2. Create Diagnostic
        await page.goto('/super-admin/diagnosticos/crear');

        const uniqueTitle = `Excel Test ${Date.now()}`;
        await page.fill('input[placeholder="Ej: Excel Intermedio"]', uniqueTitle);

        // Select Category (using text matching for select trigger)
        await page.click('button[role="combobox"]'); // Category select
        await page.click('div[role="option"]:has-text("Excel")');

        await page.fill('textarea', 'Test description for E2E');

        // Toggle Published
        await page.click('button[role="switch"]');

        // Add Question 1
        await page.click('button:has-text("Agregar Pregunta")');

        const q1Input = page.locator('input').nth(1); // First input is title, second is question 1? Need better selectors.
        // Better to target by label or layout

        // We can use the fact that inputs are added. 
        // Wait for the card to appear.
        await expect(page.locator('text=Pregunta 1')).toBeVisible();

        // Fill Question
        // In the Question Card:
        // First input is Question text
        // Second select is Type

        // Let's use specific locators based on the component structure I wrote
        // CardContent > div > div > input (Question text)
        // CardContent > div > div > button (Type select)

        const questionCard = page.locator('.space-y-6 > .relative').first();
        await questionCard.locator('input').first().fill('Quanto es 2+2?');

        // Type is Multiple Choice by default. 
        // Options:
        // 1st option input
        const optionsContainer = questionCard.locator('.bg-muted\\/30');
        await optionsContainer.locator('input[type="text"]').nth(0).fill('Cuatro');
        await optionsContainer.locator('input[type="radio"]').nth(0).check(); // Select as correct

        await optionsContainer.locator('input[type="text"]').nth(1).fill('Cinco');

        // Save
        await page.click('button:has-text("Guardar Diagnóstico")');

        // Verify Redirect to List
        await page.waitForURL('/super-admin/diagnosticos');
        await expect(page.locator(`text=${uniqueTitle}`)).toBeVisible();

        // 3. Logout
        await page.goto('/api/auth/signout');
        // Confirm signout if prompted, or just goto login
        await page.goto('/login');

        // 4. Collaborator Login
        await page.fill('input[type="email"]', 'colaborador@empresa.com');
        await page.fill('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');

        // Wait for redirect
        await page.waitForURL('/dashboard'); // or whatever the collab home is

        // 5. Go to Diagnostics
        await page.goto('/diagnosticos');

        // Find our diagnostic
        await expect(page.locator(`text=${uniqueTitle}`)).toBeVisible();

        // Click Start
        // Find the card with the title, then click the button inside
        const colCard = page.locator('.group', { hasText: uniqueTitle }).locator('..').locator('..').locator('..');
        // My component structure: Card > CardHeader (Title) ... CardFooter > Link > Button
        // Easier: click the link wrapping the button
        await page.click(`a[href^="/diagnosticos/"]`); // This might be too broad if multiple exist.
        // Better: click the card with title
        await page.click(`text=${uniqueTitle}`);
        // or the "Comenzar" button

        // Verify Runner Page
        await expect(page.locator('text=Quanto es 2+2?')).toBeVisible();

        // Answer "Cuatro"
        await page.click('label:has-text("Cuatro")');

        // Submit
        await page.click('button:has-text("Entregar Diagnóstico")');

        // Verify Results Page
        await expect(page.locator('text=¡Resultado Completado!')).toBeVisible();
        await expect(page.locator('text=100%')).toBeVisible(); // 1 question, 1 correct

    });
});
