import {
    Page,
    expect,
    Locator,
    APIRequestContext,
    APIResponse,
} from "@playwright/test";

export class uivalidator {
    readonly page: Page;
    readonly request: APIRequestContext;

    constructor(page: Page, request: APIRequestContext) {
        this.page = page;
        this.request = request;
    }

    async getBox(locator: Locator) {
        const box = await locator.boundingBox();

        if (!box) {
            throw new Error("Element is not visible or has no bounding box");
        }

        return box;
    }

    async getCommonCss(locator: Locator) {
        return await locator.evaluate((el) => {
            const css = getComputedStyle(el);
            const rect = el.getBoundingClientRect();

            return {
                // Layout
                display: css.display,
                position: css.position,
                visibility: css.visibility,
                opacity: css.opacity,
                zIndex: css.zIndex,

                // Dimensions
                width: css.width,
                height: css.height,
                minWidth: css.minWidth,
                maxWidth: css.maxWidth,
                minHeight: css.minHeight,
                maxHeight: css.maxHeight,

                // Position
                x: rect.x,
                y: rect.y,
                top: css.top,
                right: css.right,
                bottom: css.bottom,
                left: css.left,

                // Spacing
                margin: css.margin,
                marginTop: css.marginTop,
                marginRight: css.marginRight,
                marginBottom: css.marginBottom,
                marginLeft: css.marginLeft,

                padding: css.padding,
                paddingTop: css.paddingTop,
                paddingRight: css.paddingRight,
                paddingBottom: css.paddingBottom,
                paddingLeft: css.paddingLeft,

                // Background
                backgroundColor: css.backgroundColor,
                backgroundImage: css.backgroundImage,
                backgroundSize: css.backgroundSize,
                backgroundPosition: css.backgroundPosition,

                // Border
                border: css.border,
                borderWidth: css.borderWidth,
                borderStyle: css.borderStyle,
                borderColor: css.borderColor,
                borderRadius: css.borderRadius,

                // Shadow
                boxShadow: css.boxShadow,

                // Overflow
                overflow: css.overflow,
                overflowX: css.overflowX,
                overflowY: css.overflowY,

                // Interaction
                cursor: css.cursor,
                pointerEvents: css.pointerEvents,

                // Transition
                transition: css.transition,
                transform: css.transform,
            };
        });
    }

    async getTextCss(locator: Locator) {
        return await locator.evaluate((el) => {
            const css = getComputedStyle(el);
            const rect = el.getBoundingClientRect();

            return {
                // Content
                text: el.textContent?.trim(),

                // Font
                fontFamily: css.fontFamily,
                fontSize: css.fontSize,
                fontWeight: css.fontWeight,
                fontStyle: css.fontStyle,
                lineHeight: css.lineHeight,

                // Text
                color: css.color,
                textAlign: css.textAlign,
                textTransform: css.textTransform,
                textDecoration: css.textDecoration,
                textDecorationLine: css.textDecorationLine,
                textDecorationStyle: css.textDecorationStyle,
                textDecorationColor: css.textDecorationColor,
                letterSpacing: css.letterSpacing,
                wordSpacing: css.wordSpacing,
                whiteSpace: css.whiteSpace,
                textOverflow: css.textOverflow,

                // Dimensions
                width: css.width,
                height: css.height,

                // Position
                x: rect.x,
                y: rect.y,

                // Spacing
                margin: css.margin,
                padding: css.padding,

                // Visibility
                display: css.display,
                visibility: css.visibility,
                opacity: css.opacity,
            };
        });
    }

    async validateButtonCss(
        locator: Locator,
        expected: Record<string, string | number | boolean | null>,
    ) {
        const actual = await this.getButtonCss(locator);

        const failures: string[] = [];

        for (const [property, expectedValue] of Object.entries(expected)) {
            const actualValue = actual[property as keyof typeof actual];

            if (actualValue !== expectedValue) {
                failures.push(
                    `${property} → Expected: "${expectedValue}" | Actual: "${actualValue}"`,
                );
            }
        }

        if (failures.length > 0) {
            console.error(
                "\n❌ Button CSS Validation Failed:\n" + failures.join("\n"),
            );

            throw new Error(`Button CSS validation failed:\n` + failures.join("\n"));
        }

        console.log(
            `✅ Button CSS validation passed: ${Object.keys(expected).length
            } properties`,
        );
    }

    async getButtonCss(locator: Locator) {
        return await locator.evaluate((el) => {
            const css = getComputedStyle(el);
            const rect = el.getBoundingClientRect();

            return {
                // Content
                text: el.textContent?.trim(),

                // Dimensions
                width: css.width,
                height: css.height,

                // Position
                x: rect.x,
                y: rect.y,

                // Layout
                display: css.display,
                position: css.position,

                // Font
                fontFamily: css.fontFamily,
                fontSize: css.fontSize,
                fontWeight: css.fontWeight,
                lineHeight: css.lineHeight,

                // Text
                color: css.color,
                textAlign: css.textAlign,
                textTransform: css.textTransform,
                letterSpacing: css.letterSpacing,

                // Background
                backgroundColor: css.backgroundColor,
                backgroundImage: css.backgroundImage,

                // Border
                border: css.border,
                borderRadius: css.borderRadius,

                // Spacing
                padding: css.padding,
                margin: css.margin,

                // Effects
                boxShadow: css.boxShadow,
                opacity: css.opacity,

                // Interaction
                cursor: css.cursor,
                pointerEvents: css.pointerEvents,

                // State
                disabled: (el as HTMLButtonElement).disabled,

                // Accessibility
                ariaLabel: el.getAttribute("aria-label"),
                role: el.getAttribute("role"),

                // Transition
                transition: css.transition,
            };
        });
    }

    async validateImageCss(
        locator: Locator,
        expected: Record<string, string | number>,
    ) {
        const actual = await this.getImageCss(locator);

        const failures: string[] = [];

        for (const [property, expectedValue] of Object.entries(expected)) {
            const actualValue = actual[property as keyof typeof actual];

            if (actualValue !== expectedValue) {
                failures.push(
                    `${property} → Expected: "${expectedValue}" | Actual: "${actualValue}"`,
                );
            }
        }

        if (failures.length > 0) {
            console.error(
                "\n❌ Image CSS Validation Failed:\n" + failures.join("\n"),
            );

            throw new Error(`Image CSS validation failed:\n` + failures.join("\n"));
        }

        console.log(
            `✅ Image CSS validation passed: ${Object.keys(expected).length
            } properties`,
        );
    }

    async getImageCss(locator: Locator) {
        return await locator.evaluate((el) => {
            const css = getComputedStyle(el);
            const rect = el.getBoundingClientRect();

            const img = el as HTMLImageElement;

            return {
                src: img.currentSrc || img.src,
                alt: img.alt,

                // Display dimensions
                width: css.width,
                height: css.height,

                // Actual dimensions
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,

                // Position
                x: rect.x,
                y: rect.y,

                // Image behavior
                objectFit: css.objectFit,
                objectPosition: css.objectPosition,

                // Border
                border: css.border,
                borderRadius: css.borderRadius,

                // Effects
                opacity: css.opacity,
                boxShadow: css.boxShadow,

                // Layout
                display: css.display,
                position: css.position,

                // Background
                backgroundColor: css.backgroundColor,
            };
        });
    }

    private compareFirstThreeDigits(
        expected: string | number,
        actual: unknown,
    ): boolean {
        const expectedNumber = parseFloat(String(expected));
        const actualNumber = parseFloat(String(actual));

        if (Number.isNaN(expectedNumber) || Number.isNaN(actualNumber)) {
            return String(expected) === String(actual);
        }

        // Compare only the integer part.
        // Example: 269.562px === 269.5px
        return Math.floor(expectedNumber) === Math.floor(actualNumber);
    }

    async validateContainerCss(
        locator: Locator,
        expected: Record<string, string | number | string[]>,
    ) {
        const actual = await this.getContainerCss(locator);
        const failures: string[] = [];

        for (const [property, expectedValue] of Object.entries(expected)) {
            const actualValue = actual[property as keyof typeof actual];

            // Multiple accepted values - OR condition
            if (Array.isArray(expectedValue)) {
                const matched = expectedValue.some((value) => {
                    // CSS px values
                    if (
                        typeof value === "string" &&
                        value.endsWith("px") &&
                        String(actualValue).endsWith("px")
                    ) {
                        return this.compareFirstThreeDigits(value, actualValue);
                    }

                    // Normal values
                    return String(actualValue) === String(value);
                });

                if (!matched) {
                    failures.push(
                        `${property} → Expected one of: "${expectedValue.join(", ")}" | Actual: "${actualValue}"`,
                    );
                }

                continue;
            }

            // Numeric values / CSS px values
            if (
                typeof expectedValue === "number" ||
                (typeof expectedValue === "string" &&
                    expectedValue.endsWith("px") &&
                    String(actualValue).endsWith("px"))
            ) {
                if (!this.compareFirstThreeDigits(expectedValue, actualValue)) {
                    failures.push(
                        `${property} → Expected: "${expectedValue}" | Actual: "${actualValue}"`,
                    );
                }

                continue;
            }

            // Normal string comparison
            if (String(actualValue) !== String(expectedValue)) {
                failures.push(
                    `${property} → Expected: "${expectedValue}" | Actual: "${actualValue}"`,
                );
            }
        }

        if (failures.length > 0) {
            throw new Error(
                `Container CSS validation failed:\n${failures.join("\n")}`,
            );
        }

        console.log(
            `✅ Container CSS validation passed: ${Object.keys(expected).length} properties`,
        );
    }
    // async getContainerCss(locator: Locator) {
    //   return await locator.evaluate((el) => {
    //     const css = getComputedStyle(el);
    //     const rect = el.getBoundingClientRect();

    //     return {
    //       width: css.width,
    //       height: css.height,

    //       x: rect.x,
    //       y: rect.y,

    //       position: css.position,
    //       top: css.top,
    //       right: css.right,
    //       bottom: css.bottom,
    //       left: css.left,

    //       display: css.display,

    //       flexDirection: css.flexDirection,
    //       flexWrap: css.flexWrap,
    //       justifyContent: css.justifyContent,
    //       alignItems: css.alignItems,
    //       alignContent: css.alignContent,

    //       gap: css.gap,
    //       rowGap: css.rowGap,
    //       columnGap: css.columnGap,

    //       gridTemplateColumns: css.gridTemplateColumns,
    //       gridTemplateRows: css.gridTemplateRows,

    //       margin: css.margin,
    //       marginTop: css.marginTop,
    //       marginRight: css.marginRight,
    //       marginBottom: css.marginBottom,
    //       marginLeft: css.marginLeft,

    //       padding: css.padding,
    //       paddingTop: css.paddingTop,
    //       paddingRight: css.paddingRight,
    //       paddingBottom: css.paddingBottom,
    //       paddingLeft: css.paddingLeft,

    //       backgroundColor: css.backgroundColor,
    //       backgroundImage: css.backgroundImage,

    //       border: css.border,
    //       borderRadius: css.borderRadius,

    //       borderTopLeftRadius: css.borderTopLeftRadius,
    //       borderTopRightRadius: css.borderTopRightRadius,
    //       borderBottomLeftRadius: css.borderBottomLeftRadius,
    //       borderBottomRightRadius: css.borderBottomRightRadius,

    //       boxShadow: css.boxShadow,

    //       overflow: css.overflow,
    //       overflowX: css.overflowX,
    //       overflowY: css.overflowY,

    //       visibility: css.visibility,
    //       opacity: css.opacity,
    //       zIndex: css.zIndex,
    //     };
    //   });
    // } 

    // async getContainerCss(locator: Locator) {
    //   return await locator.evaluate((el) => {
    //     const css = getComputedStyle(el);
    //     const rect = el.getBoundingClientRect();

    //     return {
    //       width: css.width,
    //       height: css.height,

    //       x: rect.x,
    //       y: rect.y,

    //       position: css.position,
    //       top: css.top,
    //       right: css.right,
    //       bottom: css.bottom,
    //       left: css.left,

    //       display: css.display,

    //       // Border
    //       border: css.border,
    //       borderRadius: css.borderRadius,

    //       borderTopColor: css.borderTopColor,
    //       borderTopStyle: css.borderTopStyle,
    //       borderTopWidth: css.borderTopWidth,

    //       borderTopLeftRadius: css.borderTopLeftRadius,
    //       borderTopRightRadius: css.borderTopRightRadius,

    //       borderBottomColor: css.borderBottomColor,
    //       borderBottomStyle: css.borderBottomStyle,
    //       borderBottomWidth: css.borderBottomWidth,

    //       borderBottomLeftRadius: css.borderBottomLeftRadius,
    //       borderBottomRightRadius: css.borderBottomRightRadius,

    //       borderLeftColor: css.borderLeftColor,
    //       borderLeftStyle: css.borderLeftStyle,
    //       borderLeftWidth: css.borderLeftWidth,

    //       borderRightColor: css.borderRightColor,
    //       borderRightStyle: css.borderRightStyle,
    //       borderRightWidth: css.borderRightWidth,

    //       // Box
    //       boxSizing: css.boxSizing,

    //       // Effects
    //       backdropFilter: css.backdropFilter,

    //       // Layout
    //       flexDirection: css.flexDirection,
    //       flexWrap: css.flexWrap,
    //       justifyContent: css.justifyContent,
    //       alignItems: css.alignItems,

    //       // Other
    //       backgroundColor: css.backgroundColor,
    //       boxShadow: css.boxShadow,
    //       opacity: css.opacity,
    //       zIndex: css.zIndex,
    //     };
    //   });
    // }

    // async getContainerCss_expect(locator: Locator) {

    //     return await locator.evaluate((el) => {

    //         const css = getComputedStyle(el);
    //         const rect = el.getBoundingClientRect();

    //         return {
    //             width: css.width,
    //             height: css.height,

    //             x: rect.x,
    //             y: rect.y,

    //             position: css.position,
    //             top: css.top,
    //             right: css.right,
    //             bottom: css.bottom,
    //             left: css.left,

    //             display: css.display,

    //             flexDirection: css.flexDirection,
    //             flexWrap: css.flexWrap,
    //             justifyContent: css.justifyContent,
    //             alignItems: css.alignItems,
    //             alignContent: css.alignContent,

    //             gap: css.gap,
    //             rowGap: css.rowGap,
    //             columnGap: css.columnGap,

    //             gridTemplateColumns: css.gridTemplateColumns,
    //             gridTemplateRows: css.gridTemplateRows,

    //             margin: css.margin,
    //             padding: css.padding,

    //             backgroundColor: css.backgroundColor,
    //             backgroundImage: css.backgroundImage,

    //             border: css.border,
    //             borderRadius: css.borderRadius,

    //             boxShadow: css.boxShadow,

    //             overflow: css.overflow,
    //             overflowX: css.overflowX,
    //             overflowY: css.overflowY,

    //             visibility: css.visibility,
    //             opacity: css.opacity,

    //             zIndex: css.zIndex,
    //         };
    //     });
    // }

    async getContainerCss(locator: Locator) {
        return await locator.evaluate((el) => {
            const css = getComputedStyle(el);
            const rect = el.getBoundingClientRect();

            return {
                // Dimensions & Position
                width: css.width,
                height: css.height,
                x: rect.x,
                y: rect.y,

                position: css.position,
                top: css.top,
                right: css.right,
                bottom: css.bottom,
                left: css.left,

                // Display & Flex
                display: css.display,
                flexDirection: css.flexDirection,
                flexWrap: css.flexWrap,
                justifyContent: css.justifyContent,
                alignItems: css.alignItems,
                alignContent: css.alignContent,

                // Gap
                gap: css.gap,
                rowGap: css.rowGap,
                columnGap: css.columnGap,

                // Grid
                gridTemplateColumns: css.gridTemplateColumns,
                gridTemplateRows: css.gridTemplateRows,

                // Margin
                margin: css.margin,
                marginTop: css.marginTop,
                marginRight: css.marginRight,
                marginBottom: css.marginBottom,
                marginLeft: css.marginLeft,

                // Padding
                padding: css.padding,
                paddingTop: css.paddingTop,
                paddingRight: css.paddingRight,
                paddingBottom: css.paddingBottom,
                paddingLeft: css.paddingLeft,

                // Background
                backgroundColor: css.backgroundColor,
                backgroundImage: css.backgroundImage,

                // Border
                border: css.border,
                borderRadius: css.borderRadius,

                borderTopColor: css.borderTopColor,
                borderTopStyle: css.borderTopStyle,
                borderTopWidth: css.borderTopWidth,

                borderTopLeftRadius: css.borderTopLeftRadius,
                borderTopRightRadius: css.borderTopRightRadius,

                borderBottomColor: css.borderBottomColor,
                borderBottomStyle: css.borderBottomStyle,
                borderBottomWidth: css.borderBottomWidth,

                borderBottomLeftRadius: css.borderBottomLeftRadius,
                borderBottomRightRadius: css.borderBottomRightRadius,

                borderLeftColor: css.borderLeftColor,
                borderLeftStyle: css.borderLeftStyle,
                borderLeftWidth: css.borderLeftWidth,

                borderRightColor: css.borderRightColor,
                borderRightStyle: css.borderRightStyle,
                borderRightWidth: css.borderRightWidth,

                // Box
                boxSizing: css.boxSizing,

                // Effects
                backdropFilter: css.backdropFilter,
                boxShadow: css.boxShadow,
                opacity: css.opacity,

                // Overflow
                overflow: css.overflow,
                overflowX: css.overflowX,
                overflowY: css.overflowY,

                // Visibility
                visibility: css.visibility,

                // Layer
                zIndex: css.zIndex,
            };
        });
    }


    async getCardCss(locator: Locator) {
        return await locator.evaluate((el) => {
            const css = getComputedStyle(el);
            const rect = el.getBoundingClientRect();

            return {
                width: css.width,
                height: css.height,

                x: rect.x,
                y: rect.y,

                display: css.display,

                backgroundColor: css.backgroundColor,

                border: css.border,
                borderRadius: css.borderRadius,

                boxShadow: css.boxShadow,

                padding: css.padding,
                margin: css.margin,

                overflow: css.overflow,

                position: css.position,

                // Flex/Grid
                flexDirection: css.flexDirection,
                justifyContent: css.justifyContent,
                alignItems: css.alignItems,
                gap: css.gap,

                opacity: css.opacity,
                visibility: css.visibility,

                transition: css.transition,
            };
        });
    }

    async validateDimensions(
        locator: Locator,
        expected: {
            width?: number;
            height?: number;
            minWidth?: number;
            maxWidth?: number;
            minHeight?: number;
            maxHeight?: number;
            tolerance?: number;
        },
    ) {
        const box = await this.getBox(locator);

        const tolerance = expected.tolerance ?? 2;

        if (expected.width !== undefined) {
            expect(box.width).toBeGreaterThanOrEqual(expected.width - tolerance);

            expect(box.width).toBeLessThanOrEqual(expected.width + tolerance);
        }

        if (expected.height !== undefined) {
            expect(box.height).toBeGreaterThanOrEqual(expected.height - tolerance);

            expect(box.height).toBeLessThanOrEqual(expected.height + tolerance);
        }

        if (expected.minWidth !== undefined) {
            expect(box.width).toBeGreaterThanOrEqual(expected.minWidth);
        }

        if (expected.maxWidth !== undefined) {
            expect(box.width).toBeLessThanOrEqual(expected.maxWidth);
        }

        if (expected.minHeight !== undefined) {
            expect(box.height).toBeGreaterThanOrEqual(expected.minHeight);
        }

        if (expected.maxHeight !== undefined) {
            expect(box.height).toBeLessThanOrEqual(expected.maxHeight);
        }

        return {
            width: box.width,
            height: box.height,
        };
    }

    async validatePosition(
        locator: Locator,
        expected: {
            x?: number;
            y?: number;
            tolerance?: number;
        },
    ) {
        const box = await this.getBox(locator);

        const tolerance = expected.tolerance ?? 2;

        if (expected.x !== undefined) {
            expect(box.x).toBeGreaterThanOrEqual(expected.x - tolerance);

            expect(box.x).toBeLessThanOrEqual(expected.x + tolerance);
        }

        if (expected.y !== undefined) {
            expect(box.y).toBeGreaterThanOrEqual(expected.y - tolerance);

            expect(box.y).toBeLessThanOrEqual(expected.y + tolerance);
        }

        return {
            x: box.x,
            y: box.y,
        };
    }

    async validateColors(
        locator: Locator,
        expected: {
            color?: string;
            backgroundColor?: string;
            borderColor?: string;
        },
    ) {
        const css = await locator.evaluate((el) => {
            const style = getComputedStyle(el);

            return {
                color: style.color,
                backgroundColor: style.backgroundColor,
                borderColor: style.borderColor,
            };
        });

        if (expected.color !== undefined) {
            expect(css.color).toBe(expected.color);
        }

        if (expected.backgroundColor !== undefined) {
            expect(css.backgroundColor).toBe(expected.backgroundColor);
        }

        if (expected.borderColor !== undefined) {
            expect(css.borderColor).toBe(expected.borderColor);
        }

        return css;
    }

    // ============================================================
    // 5. SPACING
    // ============================================================

    async validateSpacing(
        locator: Locator,
        expected: {
            margin?: string;
            padding?: string;
            marginTop?: string;
            marginRight?: string;
            marginBottom?: string;
            marginLeft?: string;
            paddingTop?: string;
            paddingRight?: string;
            paddingBottom?: string;
            paddingLeft?: string;
        },
    ) {
        const css = await locator.evaluate((el) => {
            const style = getComputedStyle(el);

            return {
                margin: style.margin,
                marginTop: style.marginTop,
                marginRight: style.marginRight,
                marginBottom: style.marginBottom,
                marginLeft: style.marginLeft,

                padding: style.padding,
                paddingTop: style.paddingTop,
                paddingRight: style.paddingRight,
                paddingBottom: style.paddingBottom,
                paddingLeft: style.paddingLeft,
            };
        });

        Object.entries(expected).forEach(([key, value]) => {
            if (value !== undefined) {
                expect(css[key as keyof typeof css]).toBe(value);
            }
        });

        return css;
    }

    // ============================================================
    // 6. BORDER
    // ============================================================

    async validateBorder(
        locator: Locator,
        expected: {
            border?: string;
            borderWidth?: string;
            borderStyle?: string;
            borderColor?: string;
            borderRadius?: string;
        },
    ) {
        const css = await locator.evaluate((el) => {
            const style = getComputedStyle(el);

            return {
                border: style.border,
                borderWidth: style.borderWidth,
                borderStyle: style.borderStyle,
                borderColor: style.borderColor,
                borderRadius: style.borderRadius,
            };
        });

        Object.entries(expected).forEach(([key, value]) => {
            if (value !== undefined) {
                expect(css[key as keyof typeof css]).toBe(value);
            }
        });

        return css;
    }

    // ============================================================
    // 7. BOX SHADOW
    // ============================================================

    async validateShadow(locator: Locator, expectedShadow: string) {
        const shadow = await locator.evaluate((el) => {
            return getComputedStyle(el).boxShadow;
        });

        expect(shadow).toBe(expectedShadow);

        return shadow;
    }

    // ============================================================
    // 8. VISIBILITY
    // ============================================================

    async validateVisibility(locator: Locator, expectedVisible: boolean = true) {
        if (expectedVisible) {
            await expect(locator).toBeVisible();
        } else {
            await expect(locator).toBeHidden();
        }

        return {
            visible: await locator.isVisible(),
        };
    }

    // ============================================================
    // 9. ALIGNMENT
    // ============================================================

    async validateAlignment(
        locator: Locator,
        referenceLocator: Locator,
        expected: "left" | "right" | "top" | "bottom" | "centerX" | "centerY",
        tolerance: number = 2,
    ) {
        const element = await this.getBox(locator);
        const reference = await this.getBox(referenceLocator);

        switch (expected) {
            case "left":
                expect(Math.abs(element.x - reference.x)).toBeLessThanOrEqual(
                    tolerance,
                );
                break;

            case "right":
                expect(
                    Math.abs(element.x + element.width - (reference.x + reference.width)),
                ).toBeLessThanOrEqual(tolerance);
                break;

            case "top":
                expect(Math.abs(element.y - reference.y)).toBeLessThanOrEqual(
                    tolerance,
                );
                break;

            case "bottom":
                expect(
                    Math.abs(
                        element.y + element.height - (reference.y + reference.height),
                    ),
                ).toBeLessThanOrEqual(tolerance);
                break;

            case "centerX":
                expect(
                    Math.abs(
                        element.x + element.width / 2 - (reference.x + reference.width / 2),
                    ),
                ).toBeLessThanOrEqual(tolerance);
                break;

            case "centerY":
                expect(
                    Math.abs(
                        element.y +
                        element.height / 2 -
                        (reference.y + reference.height / 2),
                    ),
                ).toBeLessThanOrEqual(tolerance);
                break;
        }

        return {
            element,
            reference,
            alignment: expected,
        };
    }

    // ============================================================
    // 10. RESPONSIVE
    // ============================================================

    async validateResponsive(
        page: Page,
        locator: Locator,
        viewports: {
            width: number;
            height: number;
            shouldBeVisible?: boolean;
        }[],
    ) {
        const results = [];

        for (const viewport of viewports) {
            await page.setViewportSize({
                width: viewport.width,
                height: viewport.height,
            });

            await page.waitForTimeout(300);

            const visible = await locator.isVisible();

            if (viewport.shouldBeVisible !== undefined) {
                expect(visible).toBe(viewport.shouldBeVisible);
            }

            results.push({
                viewport,
                visible,
            });
        }

        return results;
    }

    // ============================================================
    // 11. HOVER STATE
    // ============================================================

    async validateHoverState(
        locator: Locator,
        expected: {
            color?: string;
            backgroundColor?: string;
            borderColor?: string;
            boxShadow?: string;
            cursor?: string;
        },
    ) {
        await locator.hover();

        await locator.page().waitForTimeout(100);

        const css = await locator.evaluate((el) => {
            const style = getComputedStyle(el);

            return {
                color: style.color,
                backgroundColor: style.backgroundColor,
                borderColor: style.borderColor,
                boxShadow: style.boxShadow,
                cursor: style.cursor,
            };
        });

        Object.entries(expected).forEach(([key, value]) => {
            if (value !== undefined) {
                expect(css[key as keyof typeof css]).toBe(value);
            }
        });

        return css;
    }

    // ============================================================
    // 12. FOCUS STATE
    // ============================================================

    async validateFocusState(
        locator: Locator,
        expected: {
            outline?: string;
            outlineColor?: string;
            outlineWidth?: string;
            borderColor?: string;
            boxShadow?: string;
        },
    ) {
        await locator.focus();

        const css = await locator.evaluate((el) => {
            const style = getComputedStyle(el);

            return {
                outline: style.outline,
                outlineColor: style.outlineColor,
                outlineWidth: style.outlineWidth,
                borderColor: style.borderColor,
                boxShadow: style.boxShadow,
            };
        });

        expect(await locator.evaluate((el) => document.activeElement === el)).toBe(
            true,
        );

        Object.entries(expected).forEach(([key, value]) => {
            if (value !== undefined) {
                expect(css[key as keyof typeof css]).toBe(value);
            }
        });

        return css;
    }

    // ============================================================
    // 13. ACTIVE STATE
    // ============================================================

    async validateActiveState(
        locator: Locator,
        expected: {
            color?: string;
            backgroundColor?: string;
            borderColor?: string;
            transform?: string;
        },
    ) {
        await locator.click();

        const css = await locator.evaluate((el) => {
            const style = getComputedStyle(el);

            return {
                color: style.color,
                backgroundColor: style.backgroundColor,
                borderColor: style.borderColor,
                transform: style.transform,
            };
        });

        Object.entries(expected).forEach(([key, value]) => {
            if (value !== undefined) {
                expect(css[key as keyof typeof css]).toBe(value);
            }
        });

        return css;
    }

    // ============================================================
    // 14. DISABLED STATE
    // ============================================================

    async validateDisabledState(
        locator: Locator,
        expectedDisabled: boolean = true,
    ) {
        const disabled = await locator.isDisabled();

        expect(disabled).toBe(expectedDisabled);

        const css = await locator.evaluate((el) => {
            const style = getComputedStyle(el);

            return {
                opacity: style.opacity,
                cursor: style.cursor,
                pointerEvents: style.pointerEvents,
                color: style.color,
                backgroundColor: style.backgroundColor,
            };
        });

        return {
            disabled,
            css,
        };
    }
}

export class APIData {
    // Complete API response
    async getResponse(
        request: APIRequestContext,
        method: string,
        url: string,
        options: any = {},
    ) {
        const startTime = Date.now();

        const response = await request.fetch(url, {
            method,
            ...options,
        });

        const responseTime = Date.now() - startTime;

        return {
            status: response.status(),
            statusText: response.statusText(),
            url: response.url(),
            headers: response.headers(),
            responseTime,
            body: await response.json(),
        };
    }

    // Only response body
    async getBody(response: APIResponse) {
        return await response.json();
    }

    // Response status
    async getStatus(response: APIResponse) {
        return {
            status: response.status(),
            statusText: response.statusText(),
        };
    }

    // Response headers
    async getHeaders(response: APIResponse) {
        return await response.headers();
    }

    // Response time
    async getResponseTime(
        request: APIRequestContext,
        method: string,
        url: string,
        options: any = {},
    ) {
        const startTime = Date.now();

        const response = await request.fetch(url, {
            method,
            ...options,
        });

        return {
            responseTime: Date.now() - startTime,
        };
    }
}
