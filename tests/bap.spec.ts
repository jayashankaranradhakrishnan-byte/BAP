import { test } from "@playwright/test";
import { LandingPage } from "../pom/landing_pom";

test.describe("Bap Test Suite", () => {

    test("Bap landing page test", async ({ page, request }) => {

        const landingPage = new LandingPage(page, request);

        await page.goto("https://www.buyautoparts.com/", {
            waitUntil: "domcontentloaded",
            timeout: 60_000,
        });

        await landingPage.landing_page();
    });
});


















//import { LandingPage } from "../pom/landing_pom";