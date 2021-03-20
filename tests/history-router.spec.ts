import "../src/history-router"

const tick = () => new Promise((resolve) => setTimeout(resolve))

describe("history-router", () => {
    describe("history-route", () => {
        it("should not display when path unmatched", async () => {
            const el = document.createElement("history-router")
            el.innerHTML = `
                <history-route path="/">
                    <template>
                        <h1>Home</h1>
                    </template>
                </history-route>
                <history-route path="/one">
                    <template>
                        <h1>One</h1>
                    </template>
                </history-route>
                <history-route path="/two">
                    <template>
                        <h1>Two</h1>
                    </template>
                </history-route>
            `
            document.body.appendChild(el)
            await tick()
            console.log(el.innerHTML)
            expect(el.innerText).toEqual("Home")
        })
    })
})