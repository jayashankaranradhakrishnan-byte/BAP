import {
    Page,
    expect,
    Locator,
    APIRequestContext,
    APIResponse,
} from "@playwright/test";

export class LandingPage {
    readonly page: Page;
    readonly request: APIRequestContext;

    constructor(page: Page, request: APIRequestContext) {
        this.page = page;
        this.request = request;
    }


    public get bapLogo(): Locator {
        return this.page.getByRole('img', { name: 'BAP-logo' });
    }

    public get shippingBannerText(): Locator {
        // Use getByText so the locator is resilient to tag changes (p → span/div).
        // Regex match avoids brittle exact-text coupling with punctuation.
        return this.page.getByText(/Free Shipping/i).first();
    }

    public get shippingBanner(): Locator {
        // Playwright chained locators only traverse DOWN the DOM.
        // The red container is an ancestor of the <p>, so we must use a
        // page-level locator that contains the shipping text.
        // page.getByRole('banner') resolves to the <header> landmark element.
        return this.page.getByRole('banner');
    }


    public get selectYourVehicleHeading(): Locator {
        return this.page.getByRole("heading", {
            name: "Select Your Vehicle",
        });
    }



    // select 1

    public get chooseYear(): Locator {
        return this.page.getByRole("button", {
            name: "Choose Year",
            exact: true,
        });
    }

    // Stable year button locator — doesn't break when text changes from
    // "Choose Year" to the selected year (e.g. "2007") after selection
    public get yearButton(): Locator {
        return this.page.locator('[data-select-id="tihomelandyear"]');
    }

    public get yearDropdown(): Locator {
        // Use sibling combinator: ul that follows the Choose Year button div
        // The button has data-select-id="tihomelandyear" (confirmed from DOM)
        // The ul itself has no data-select-id, so we scope via the button sibling
        return this.page.locator(
            '[data-select-id="tihomelandyear"] ~ ul.ti-faux-select-dropdown'
        );
    }

    public get year2007(): Locator {
        return this.yearDropdown
            .locator("li")
            .filter({ hasText: /^2007$/ });
    }

    // public get nativeYearSelect(): Locator {
    //     return this.page.locator('select[name="sel-year"]');
    // }

    public get modal(): Locator {
        return this.page.locator("#ltkpopup-container");
    }

    public get modalCloseButton(): Locator {
        return this.modal.locator(".ltkmodal-close").first();
    }

    public get modalOverlay(): Locator {
        return this.page.locator("#ltkpopup-overlay");
    }



    // second select 

    public get selectMake(): Locator {
        return this.page.getByRole("button", {
            name: "Select Make",
            exact: true,
        });
    }

    public get makeDropdown(): Locator {
        return this.page.locator(
            'ul.ti-faux-select-dropdown[data-select-id="ti-home-sel-make"]'
        );
    }

    public get makeDropdownlist(): Locator {
        return this.makeDropdown.locator("li");
    }


    public get audiOption(): Locator {
        // Scope through makeDropdown — getByRole listitem accessible name
        // doesn't reliably resolve to "Audi" depending on nested HTML
        return this.makeDropdown.locator("li").filter({ hasText: /^Audi$/ });
    }

    public get nativeMakeSelect(): Locator {
        return this.page.locator("#ti-home-sel-make");
    }

    public get yearDropdownprint(): Locator {
        return this.page.locator(
            '.ti-faux-select-button[data-select-id="tihomelandyear"]'
        );
    }

    public get makeDropdownprint(): Locator {
        return this.page.locator(
            '.ti-faux-select-button[data-select-id="ti-home-sel-make"]'
        );
    }

    // public async selectAudi(): Promise<void> {
    //     const timeout = 30_000;

    //     await expect(this.selectMake).toHaveCount(1, { timeout });
    //     await expect(this.selectMake).toBeVisible({ timeout });
    //     await expect(this.selectMake).toBeEnabled({ timeout });

    //     // Open the faux make dropdown
    //     await this.selectMake.click();

    //     await expect(this.selectMake).toHaveAttribute(
    //         "aria-expanded",
    //         "true",
    //         { timeout }
    //     );

    //     // Wait until Audi is populated (loaded via AJAX after year selection)
    //     await expect(this.audiOption).toHaveCount(1, { timeout });
    //     await expect(this.audiOption).toBeVisible({ timeout });

    //     // Use native selectOption with force — same reasoning as year:
    //     // the faux li click doesn't reliably sync the hidden native <select>
    //     await this.nativeMakeSelect.selectOption("330", {
    //         force: true,
    //         timeout,
    //     });

    //     await expect(this.nativeMakeSelect).toHaveValue("330", { timeout });

    //     console.log("✅ Audi selected successfully");
    // }



    // select 3 

    public async closeModalIfDisplayed(): Promise<void> {
        try {
            // Dismiss modal container and overlay from DOM to prevent pointer event intercept
            await this.page.evaluate(() => {
                document.querySelectorAll('#ltkpopup-container, #ltkpopup-overlay, .simpleltkmodal-container, .simpleltkmodal-overlay').forEach(el => el.remove());
            });
            console.log("✅ Modal overlays removed if present");
        } catch {
            console.log("ℹ️ No modal overlay to remove");
        }
    }

    public get nativeYearSelect(): Locator {
        return this.page.locator('select[name="sel-year"]').first();
    }

    // public async selectYear2007(): Promise<void> {
    //     const timeout = 30_000;

    //     await this.closeModalIfDisplayed();

    //     // Target year select that contains option 2007
    //     const yearSelect = this.page.locator('select#sel-year, select#tihomelandyear').filter({
    //         has: this.page.locator('option[value="2007"]')
    //     }).first();

    //     await expect(yearSelect).toBeAttached({ timeout });

    //     // Select option on all year selects that have option 2007
    //     const selects = await this.page.locator('select#sel-year, select#tihomelandyear').all();
    //     for (const sel of selects) {
    //         if (await sel.locator('option[value="2007"]').count() > 0) {
    //             await sel.selectOption("2007", { force: true });
    //             await sel.dispatchEvent("change");
    //         }
    //     }

    //     console.log("✅ Year 2007 selected successfully");
    // }

    public async selectYear2007(): Promise<void> {
        const timeout = 30_000;

        await this.closeModalIfDisplayed();

        // 1. Native select option selection
        const yearSelect = this.page.locator('select#sel-year, select#tihomelandyear').first();

        // Web-First Assertion: Wait until the option is populated in the DOM before selecting
        const option2007 = yearSelect.locator('option').filter({ hasText: /^2007$/ }).first();
        await expect(option2007).toBeAttached({ timeout });

        // Select option '2007' on native select
        await yearSelect.selectOption('2007', { force: true });
        await yearSelect.dispatchEvent('change');
        await expect(yearSelect).toHaveValue('2007', { timeout });

        // 2. Interact with visible faux dropdown button if available to update UI label
        try {
            if (await this.yearButton.isVisible()) {
                await this.yearButton.click();
                await expect(this.year2007).toBeVisible({ timeout: 5000 });
                await this.year2007.click();
            }
        } catch {
            // Native select is already set
        }

        console.log(
            `✅ Native Year value: "${await yearSelect.inputValue()}"`
        );
    }


    public async selectAudi(): Promise<void> {
        const timeout = 30_000;

        await this.closeModalIfDisplayed();

        // Target make select that contains option 330 (Audi)
        const makeSelect = this.page.locator('select#sel-make, select#ti-home-sel-make').filter({
            has: this.page.locator('option[value="330"]')
        }).first();

        await expect(makeSelect).toBeAttached({ timeout });

        // Select option on all make selects that have option 330
        const selects = await this.page.locator('select#sel-make, select#ti-home-sel-make').all();
        for (const sel of selects) {
            if (await sel.locator('option[value="330"]').count() > 0) {
                await sel.selectOption("330", { force: true });
                await sel.dispatchEvent("change");
            }
        }

        // Also attempt visual faux make selection if available
        try {
            if (await this.selectMake.isVisible()) {
                await this.selectMake.click();
                await expect(this.audiOption).toBeVisible({ timeout: 5000 });
                await this.audiOption.click();
            }
        } catch {
            // Native select is already set
        }

        console.log("✅ Audi selected successfully");
    }

    public async validateShippingBanner(): Promise<void> {
        const bannerText = this.shippingBannerText;
        const banner = this.shippingBanner;

        // Wait up to 30 seconds for banner to appear
        // Note: .first() always resolves to 0 or 1 element — use toBeAttached, not toHaveCount
        await expect(bannerText).toBeAttached({
            timeout: 30_000,
        });

        await expect(bannerText).toBeVisible({
            timeout: 30_000,
        });

        await expect(bannerText).toContainText(
            "Free Shipping",
            { timeout: 30_000 }
        );

        await expect(bannerText).toHaveCSS(
            "font-size",
            "18px",
            { timeout: 30_000 }
        );

        await expect(bannerText).toHaveCSS(
            "font-family",
            /Roboto Condensed/i,
            { timeout: 30_000 }
        );


        // ── Verify the banner container has the red background ──────────────────
        // Playwright locators only traverse DOWN; to find a colored ancestor we
        // must use evaluate() to walk UP the DOM from the <p> element.
        const bannerBgColor = await this.page.evaluate(() => {
            // Search ALL elements (not just <p>) so the locator survives tag changes
            const source = Array.from(document.querySelectorAll('*'))
                .find(el => el.textContent?.trim().includes('Free Shipping') &&
                    !el.children.length); // leaf node containing the text
            if (!source) return null;
            let el: Element | null = source;
            while (el) {
                const bg = window.getComputedStyle(el).backgroundColor;
                // Return the first ancestor whose background is not transparent
                if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                    return { bg, tag: el.tagName, cls: el.className };
                }
                el = el.parentElement;
            }
            return null;
        });

        console.log('🔍 Shipping banner colored ancestor:', bannerBgColor);

        expect(bannerBgColor, 'No ancestor with a non-transparent background found').not.toBeNull();
        expect(bannerBgColor!.bg).toBe('rgb(204, 32, 39)');
        // ────────────────────────────────────────────────────────────────────────
    }


    public async validateBapLogo(): Promise<void> {
        const logo = this.bapLogo;

        await expect(logo).toHaveCount(1, {
            timeout: 30_000,
        });

        await expect(logo).toBeVisible({
            timeout: 30_000,
        });

        const rect = await logo.boundingBox();

        expect(rect).not.toBeNull();
        expect(rect!.width).toBeGreaterThan(0);
        expect(rect!.height).toBeGreaterThan(0);

        console.log("BAP Logo Rect:", rect);

        const viewport = this.page.viewportSize();

        expect(viewport).not.toBeNull();

        expect(rect!.x).toBeGreaterThanOrEqual(0);
        expect(rect!.y).toBeGreaterThanOrEqual(0);
        expect(rect!.x + rect!.width).toBeLessThanOrEqual(viewport!.width);
        expect(rect!.y + rect!.height).toBeLessThanOrEqual(viewport!.height);
    }

    public async validateSelectYourVehicleHeading(): Promise<void> {
        const heading = this.selectYourVehicleHeading;

        // Locator validation
        await expect(heading).toHaveCount(1);
        await expect(heading).toBeVisible();
        await expect(heading).toBeAttached();

        // Important UI expectations
        await expect(heading).toHaveText("Select Your Vehicle");

        // Font
        await expect(heading).toHaveCSS("font-size", "48px");
        await expect(heading).toHaveCSS("font-weight", "700");
        await expect(heading).toHaveCSS(
            "font-family",
            /Roboto Condensed/i
        );

        // Text appearance
        await expect(heading).toHaveCSS(
            "color",
            "rgb(255, 255, 255)"
        );
        await expect(heading).toHaveCSS(
            "text-align",
            "center"
        );

        // Layout
        await expect(heading).toHaveCSS(
            "display",
            "block"
        );
        await expect(heading).toHaveCSS(
            "position",
            "relative"
        );
        await expect(heading).toHaveCSS(
            "z-index",
            "2"
        );
    }

    async landing_page(): Promise<void> {
        await this.page.waitForLoadState("domcontentloaded", {
            timeout: 30_000,
        });

        console.log("🌐 BAP URL:", this.page.url());
        console.log("🌐 BAP Title:", await this.page.title());

        await this.validateBapLogo();
        await this.validateShippingBanner();
        await this.validateSelectYourVehicleHeading();

        // Modal first
        await this.closeModalIfDisplayed();

        // Then Year
        await this.selectYear2007();
        console.log('Year:', await this.yearDropdownprint.innerText());

        // Then Make
        await this.selectAudi();
        console.log('Make:', await this.makeDropdownprint.innerText());


    }

}