import { chromium } from "playwright"
import "../src/history-router"

describe("history-router", () => {
    describe("history-route", () => {
        it("should navigate templates using links and browser url", async () => {
            const rootUrl: string = (global as any).TEST_URL
            const browser = await chromium.launch()
            const page = await browser.newPage()
            await page.goto(rootUrl)
            let title = await page.textContent("h1")
            expect(title).toEqual("Home")
            await page.screenshot({ path: "screenshots/home.png" })
            await page.goto(rootUrl + "/one")
            title = await page.textContent("h1")
            await page.screenshot({ path: "screenshots/one.png" })
            expect(title).toEqual("One")
            await page.click(`a[href="/two"]`)
            await page.screenshot({ path: "screenshots/two.png" })
            title = await page.textContent("h1")
            expect(title).toEqual("Two")
            await browser.close()
        })
    })
})