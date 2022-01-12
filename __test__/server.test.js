import getStringFormOfDate from "../src/server/server"

describe("Test server functionality", () => {
    test("Test if index works correctly", () => {
        const someDate = new Date('2022-01-01')
        expect(getStringFormOfDate(someDate)).toEqual('2022-1-1');
    })
})