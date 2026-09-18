import { test as base, expect } from "@playwright/test";

export const test = base.extend({
    page: async ({ page }, use) => {

        console.log("🌐 Bap");

        await page.goto("/", {
            waitUntil: "domcontentloaded",
            timeout: 60_000,
        });

        await use(page);

    },
});

export { expect };