import { addEventListenerForAddTrip } from "../src/client/js/app"

describe("Test client functionality", () => {
    test("Test if add trip button event listener is defined", () => {
        expect(addEventListenerForAddTrip).toBeDefined()
    })
})