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


    public async validateBapLogo(): Promise<void> {
        const logo = this.bapLogo;

        await expect(logo).toHaveCount(1);
        await expect(logo).toBeVisible();
        await expect(logo).toBeEnabled();
        await expect(logo).toBeAttached();

        const rect = await logo.evaluate((element) => {
            const r = element.getBoundingClientRect();

            return {
                x: r.x,
                y: r.y,
                width: r.width,
                height: r.height,
                top: r.top,
                right: r.right,
                bottom: r.bottom,
                left: r.left,
                centerX: r.left + r.width / 2,
                centerY: r.top + r.height / 2,
            };
        });

        console.log('BAP Logo Rect:', rect);

        expect(rect.width).toBeGreaterThan(0);
        expect(rect.height).toBeGreaterThan(0);

        const isClickable = await this.page.evaluate(
            ({ centerX, centerY }) => {
                const element = document.elementFromPoint(centerX, centerY);

                return !!element;
            },
            rect
        );

        expect(isClickable).toBeTruthy();
    }

    async landing_page() {
        console.log("Starting landing page test");

    }

}