import "core-js/stable"
import "regenerator-runtime/runtime"
import server from "pushstate-server"

jest.mock("./src/history")

let testserver
beforeAll(() => {
    testserver = server.start({ port: 3101, directory: "./dist" })
    global.TEST_URL = "http://localhost:3101"
})

afterAll(() => {
    testserver.close()
})