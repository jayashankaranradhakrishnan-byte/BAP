import { test } from "../base/bap_base";
import { LandingPage } from "../pom/landing_pom";

//import { setup, teardown, getPage } from '../base/simbli_testBase';

test.describe("Bap Test Suite", () => {


    test("Bap landing page test", async ({ page, request }) => {

        const landing = new LandingPage(page, request);
        await landing.validateBapLogo();

    });


});
