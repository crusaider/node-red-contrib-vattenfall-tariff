const fetchMock = require("fetch-mock-jest");
const { getDay } = require("./getDay");

describe("getDay", () => {
  beforeAll(() => {
    fetchMock.get("https://sholiday.faboul.se/dagar/v2.1/2021/1/1", {
      cachetid: "2023-08-29 13:54:41",
    });
    fetchMock.get("https://sholiday.faboul.se/dagar/v2.1/1800/1/1", 404);
  });

  afterEach(() => {
    fetchMock.mockClear();
  });

  it("should exist", () => {
    expect(getDay).toBeDefined();
  });
  it("should be a function", () => {
    expect(typeof getDay).toBe("function");
  });
  it("should return a promise", () => {
    const result = getDay({ year: 2021, month: 1, day: 1 });
    expect(result).toBeInstanceOf(Promise);
  });
  it("should return a promise that resolves to an object", async () => {
    const result = await getDay({ year: 2021, month: 1, day: 1 });
    expect(typeof result).toBe("object");
  });
  it('should return a promise that resolves to an object with a property "cachetid"', async () => {
    const result = await getDay({ year: 2021, month: 1, day: 1 });
    expect(result).toHaveProperty("cachetid");
  });
  it("should throw if the status is not ok", async () => {
    await expect(getDay({ year: 1800, month: 1, day: 1 })).rejects.toThrow();
  });
});
