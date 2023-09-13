jest.mock("./swedish-days-api", () => ({
  getDay: jest.fn(),
}));
const { getDay } = require("./swedish-days-api");
const { isWorkingDay } = require("./isWorkingDay");

describe("isWorkingDay", () => {
  afterEach(() => {
    getDay.mockClear();
    isWorkingDay.clear(); // Clear the memoize cache
  });

  it("should exist", () => {
    expect(isWorkingDay).toBeDefined();
  });
  it("should be a function", () => {
    expect(typeof isWorkingDay).toBe("function");
  });
  it("should return a promise", () => {
    getDay.mockResolvedValueOnce(
      Promise.resolve({ dagar: [{ "arbetsfri dag": "Ja" }] }),
    );
    const result = isWorkingDay({ year: 2021, month: 1, day: 1 });
    expect(result).toBeInstanceOf(Promise);
  });
  it("should return false for a none working day", async () => {
    getDay.mockResolvedValue({ dagar: [{ "arbetsfri dag": "Ja" }] });
    const result = await isWorkingDay({ year: 2021, month: 1, day: 1 });
    expect(result).toBeFalsy();
  });
  it("should memoize results and only call the api once for the same day", async () => {
    getDay.mockResolvedValue({ dagar: [{ "arbetsfri dag": "Nej" }] });
    await isWorkingDay({ year: 2021, month: 1, day: 1 });
    await isWorkingDay({ year: 2021, month: 1, day: 1 });
    expect(getDay).toHaveBeenCalledTimes(1);
  });

  it.skip("should not memoize exceptions", async () => {
    getDay
      .mockRejectedValueOnce(new Error("test"))
      .mockResolvedValue({ dagar: [{ "arbetsfri dag": "Nej" }] });

    await expect(
      isWorkingDay({ year: 2021, month: 1, day: 1 }),
    ).rejects.toThrow("test");

    await isWorkingDay({ year: 2021, month: 1, day: 1 });
    expect(getDay).toHaveBeenCalledTimes(2);
  });
});
