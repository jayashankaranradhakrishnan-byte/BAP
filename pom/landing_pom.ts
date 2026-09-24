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
        return this.page.getByText(/Free Shipping/i).first();
    }

    public get shippingBanner(): Locator {
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

    public get yearButton(): Locator {
        return this.page.locator('[data-select-id="tihomelandyear"]');
    }

    public get yearDropdown(): Locator {
        return this.page.locator(
            '[data-select-id="tihomelandyear"] ~ ul.ti-faux-select-dropdown'
        );
    }

    public get year2007(): Locator {
        return this.yearDropdown
            .locator("li")
            .filter({ hasText: /^2007$/ });
    }

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
            '[data-select-id="ti-home-sel-make"] ~ ul.ti-faux-select-dropdown'
        );
    }

    public get makeDropdownlist(): Locator {
        return this.makeDropdown.locator("li");
    }


    public get audiOption(): Locator {
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

    public get modelDropdownprinta4(): Locator {
        return this.page.locator(
            '.ti-faux-select-button[data-select-id="ti-home-sel-model"]'
        );
    }

    public get a4Option(): Locator {
        return this.page.locator(
            '.ti-faux-select-dropdown li[data-ti-value="A4_"]'
        );
    }

    public get categoryDropdownprint(): Locator {
        return this.page.locator(
            '.ti-faux-select-button[data-select-id="ti-home-sel-cat"]'
        );
    }

    public get acCategoryOption(): Locator {
        return this.page.locator(
            '.ti-faux-select-dropdown li[data-ti-value="A/C"]'
        );
    }

    public get categorySelect(): Locator {
        return this.page.locator('#ti-home-sel-cat');
    }

    public get partDropdownprint(): Locator {
        return this.page.locator(
            '.ti-faux-select-button[data-select-id="ti-home-sel-part"]'
        );
    }

    public get acCompressorOption(): Locator {
        return this.page.locator(
            '.ti-faux-select-dropdown li[data-ti-value="A/C Compressor"]'
        );
    }

    public get partSelect(): Locator {
        return this.page.locator('#ti-home-sel-part');
    }

    public get fitmentDropdownprint(): Locator {
        return this.page.locator(
            '.ti-faux-select-button[data-select-id="ti-home-sel-engine"]'
        );
    }

    public get engine20Option(): Locator {
        return this.page.locator(
            '.ti-faux-select-dropdown li[data-ti-value="2.0L Engine"]'
        );
    }

    public get engineSelect(): Locator {
        return this.page.locator('#ti-home-sel-engine');
    }

    public get goButton(): Locator {
        return this.page.getByRole('button', { name: 'Go', exact: true });
    }

    public get resultHeader(): Locator {
        return this.page.locator('h1.cad_header span[itemprop="name"]');
    }

    public get cartTitle(): Locator {
        return this.page.locator('h1.checkout_maintitle');
    }

    // public get addToCartButton(): Locator {
    //     return this.page.getByRole('button', {
    //         name: 'Add to Cart',
    //         exact: true
    //     });
    // }

    public get addToCartButtons(): Locator {
        return this.page.getByRole('button', {
            name: 'Add to Cart',
            exact: true
        });
    }

    public get addToCartButton(): Locator {
        return this.addToCartButtons.nth(0);
    }

    public get secondAddToCartButton(): Locator {
        return this.addToCartButtons.nth(1);
    }

    public async registerModalHandler(): Promise<void> {

        await this.page.addLocatorHandler(
            this.page.locator('#ltkpopup-overlay'),
            async () => {
                await this.page.evaluate(() => {
                    document
                        .querySelectorAll(
                            '#ltkpopup-container, #ltkpopup-overlay, ' +
                            '.simpleltkmodal-container, .simpleltkmodal-overlay'
                        )
                        .forEach(el => el.remove());
                });
                console.log('🔕 Modal auto-dismissed by handler');
            }
        );
        console.log('✅ Modal locator handler registered');
    }


    public async waitForModalThenClose(): Promise<void> {
        try {
            const container = this.page.locator('#ltkpopup-container');
            // Modal loads lazily — wait up to 20 s
            await container.waitFor({ state: 'attached', timeout: 20_000 });

            // Try clicking the real close button first (cleaner — triggers site's own close logic)
            const closeBtn = this.page.locator(
                '#ltkpopup-container a.ltkmodal-close, ' +
                '#ltkpopup-container .ti-sprite-close'
            ).first();

            if (await closeBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
                await closeBtn.click({ force: true });
                await container.waitFor({ state: 'detached', timeout: 5_000 }).catch(() => { });
                console.log('✅ Modal closed via close button');
            } else {
                // Fallback: remove from DOM directly
                await this.page.evaluate(() => {
                    document
                        .querySelectorAll(
                            '#ltkpopup-container, #ltkpopup-overlay, ' +
                            '.simpleltkmodal-container, .simpleltkmodal-overlay'
                        )
                        .forEach(el => el.remove());
                });
                console.log('✅ Modal removed from DOM (fallback)');
            }
        } catch {
            // Modal never appeared within 12 s — safe to proceed
            console.log('ℹ️ No modal appeared at page load — continuing');
        }
    }

    public async closeModalIfDisplayed(): Promise<void> {
        try {
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


    public async selectYear2007(): Promise<void> {
        const timeout = 30_000;

        const yearSelect = this.page.locator('select#sel-year, select#tihomelandyear').first();
        await expect(yearSelect.locator('option').filter({ hasText: /^2007$/ }).first()).toBeAttached({ timeout });
        await yearSelect.selectOption('2007', { force: true });
        await yearSelect.dispatchEvent('change');
        await expect(yearSelect).toHaveValue('2007', { timeout });

        const fauxYearButton = this.yearDropdownprint;
        await expect(fauxYearButton).toBeVisible({ timeout });
        await fauxYearButton.click();
        await expect(this.year2007).toBeVisible({ timeout: 10_000 });
        await this.year2007.click();

        console.log(`✅ Native Year value: "${await yearSelect.inputValue()}"`);
    }


    public async selectAudi(): Promise<void> {
        const timeout = 30_000;

        const makeSelect = this.page.locator('select#sel-make, select#ti-home-sel-make').first();
        await expect(makeSelect.locator('option[value="330"]')).toBeAttached({ timeout });

        const fauxMakeButton = this.makeDropdownprint;
        await expect(fauxMakeButton).toBeVisible({ timeout });
        await fauxMakeButton.click();

        await expect(this.audiOption).toBeVisible({ timeout });
        await this.audiOption.click();

        console.log("✅ Audi selected successfully");
    }

    public async selectAudiA4(): Promise<void> {
        const timeout = 30_000;

        const modelSelect = this.page.locator(
            'select#ti-home-sel-model'
        );

        await expect(modelSelect).toBeAttached({ timeout });

        await expect(this.modelDropdownprinta4).toBeVisible({
            timeout
        });

        await this.modelDropdownprinta4.click();

        await expect(this.a4Option).toBeVisible({
            timeout: 10_000
        });

        await this.a4Option.click();

        await expect(modelSelect).toHaveValue('A4_', {
            timeout: 10_000
        });

        await expect(this.modelDropdownprinta4).toHaveText('A4', {
            timeout: 10_000
        });

        console.log('✅ Audi A4 selected successfully');
    }

    public async selectACCategory(): Promise<void> {
        const timeout = 30_000;

        await expect(this.categoryDropdownprint).toBeVisible({ timeout });

        await this.categoryDropdownprint.click();

        await expect(this.acCategoryOption).toBeVisible({
            timeout: 10_000
        });

        await this.acCategoryOption.click();

        await expect(this.categorySelect).toHaveValue('A/C', {
            timeout: 10_000
        });

        await expect(this.categoryDropdownprint).toHaveText('A/C', {
            timeout: 10_000
        });

        console.log('✅ A/C category selected successfully');
    }

    public async selectACCompressor(): Promise<void> {
        const timeout = 30_000;

        await expect(this.partDropdownprint).toBeVisible({
            timeout
        });

        await this.partDropdownprint.click();

        await expect(this.acCompressorOption).toBeVisible({
            timeout: 10_000
        });

        await this.acCompressorOption.click();

        await expect(this.partSelect).toHaveValue('A/C Compressor', {
            timeout: 10_000
        });

        await expect(this.partDropdownprint).toHaveText('A/C Compressor', {
            timeout: 10_000
        });

        console.log('✅ A/C Compressor selected successfully');
    }

    public async select20LEngine(): Promise<void> {
        const timeout = 30_000;

        await expect(this.fitmentDropdownprint).toBeVisible({
            timeout
        });

        await this.fitmentDropdownprint.click();

        await expect(this.engine20Option).toBeVisible({
            timeout: 10_000
        });

        await this.engine20Option.click();

        await expect(this.engineSelect).toHaveValue('2.0L Engine', {
            timeout: 10_000
        });

        await expect(this.fitmentDropdownprint).toHaveText('2.0L Engine', {
            timeout: 10_000
        });

        console.log('✅ 2.0L Engine selected successfully');
    }

    public async clickGoButton(): Promise<void> {
        const timeout = 30_000;

        await expect(this.goButton).toHaveCount(1, { timeout });
        await expect(this.goButton).toBeVisible({ timeout });
        await expect(this.goButton).toBeEnabled({ timeout });

        await this.goButton.scrollIntoViewIfNeeded();

        const box = await this.goButton.boundingBox();

        if (!box) {
            throw new Error('Go button is not rendered');
        }

        console.log('Go button:', box);

        await this.page.mouse.move(
            box.x + box.width / 2,
            box.y + box.height / 2
        );

        await this.page.waitForTimeout(200);

        await this.page.mouse.down();
        await this.page.waitForTimeout(100);
        await this.page.mouse.up();

        console.log('✅ Go clicked');

        await this.page.waitForTimeout(3_000);

        console.log('🔗 Current URL:', this.page.url());

        console.log(
            '📄 Page heading:',
            await this.page.locator('h1').allTextContents()
        );
    }

    public async verifyResultPage(): Promise<void> {
        const timeout = 30_000;

        await expect(this.resultHeader).toBeVisible({
            timeout
        });

        await expect(this.resultHeader).toContainText('2007 Audi A4');
        await expect(this.resultHeader).toContainText('A/C Compressor');

        const currentUrl = this.page.url();

        console.log(`✅ Result page loaded`);
        console.log(`🔗 Current URL: ${currentUrl}`);

        await this.page.waitForTimeout(30_000);
    }

    public async clickAddToCart(): Promise<void> {
        const timeout = 30_000;

        await expect(this.addToCartButtons).toHaveCount(2, { timeout });

        await expect(this.addToCartButton).toBeVisible({ timeout });
        await expect(this.addToCartButton).toBeEnabled({ timeout });

        await this.addToCartButton.scrollIntoViewIfNeeded();
        await this.addToCartButton.click();

        console.log('✅ Main Add to Cart clicked');
    }

    public async verifyCartPage(): Promise<void> {
        const timeout = 30_000;

        await expect(this.cartTitle).toHaveCount(1, { timeout });
        await expect(this.cartTitle).toBeVisible({ timeout });
        await expect(this.cartTitle).toContainText('YOUR');
        await expect(this.cartTitle).toContainText('Shopping');
        await expect(this.cartTitle).toContainText('Cart');

        const currentUrl = this.page.url();

        console.log('✅ Shopping Cart page loaded');
        console.log(`🔗 Current URL: ${currentUrl}`);

        await this.page.waitForTimeout(5_000);
    }

    public async verifyAddToCartButtons(): Promise<void> {
        const timeout = 30_000;

        // Verify both buttons exist
        await expect(this.addToCartButtons).toHaveCount(2, { timeout });

        await expect(this.addToCartButton).toBeAttached();
        await expect(this.addToCartButton).toBeVisible({ timeout });
        await expect(this.addToCartButton).toBeEnabled({ timeout });

        console.log('✅ Add to Cart Button 1 is visible and enabled');

        await expect(this.secondAddToCartButton).toBeAttached();
        await expect(this.secondAddToCartButton).toBeEnabled({ timeout });

        console.log('✅ Add to Cart Button 2 is attached and enabled');

        // Scroll slightly so second button comes into viewport
        await this.secondAddToCartButton.scrollIntoViewIfNeeded();

        // Now verify it is visible
        await expect(this.secondAddToCartButton).toBeVisible({ timeout });

        console.log('✅ Add to Cart Button 2 is visible after scrolling');
    }

    public async validateShippingBanner(): Promise<void> {
        const bannerText = this.shippingBannerText;
        const banner = this.shippingBanner;

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


        const bannerBgColor = await this.page.evaluate(() => {
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

        await this.registerModalHandler();

        await this.waitForModalThenClose();

        await this.validateBapLogo();
        await this.validateShippingBanner();
        await this.validateSelectYourVehicleHeading();

        await this.selectYear2007();
        console.log('Year:', await this.yearDropdownprint.innerText());

        await this.selectAudi();
        console.log('Make:', await this.makeDropdownprint.innerText());

        await this.selectAudiA4();
        console.log('Make a4:', await this.modelDropdownprinta4.innerText());

        await this.selectACCategory();
        console.log('Category A/C:', await this.categoryDropdownprint.innerText());

        await this.selectACCompressor();
        console.log('Part A/C Compressor:', await this.partDropdownprint.innerText());

        await this.select20LEngine();
        console.log('Fitment 20L:', await this.fitmentDropdownprint.innerText());

        await this.clickGoButton();

        await this.verifyResultPage();

        await this.verifyAddToCartButtons();

        await this.clickAddToCart();

        await this.verifyCartPage();


    }

}