const { DateTime } = require("luxon");

const { isHighTariff } = require("./isHighTariff");
const { isWorkingDay } = require("../swedish-days");
jest.mock("../swedish-days", () => ({
  isWorkingDay: jest.fn(),
}));

const testDate = (dateString) => {
  const startDate = DateTime.fromISO(dateString);
  const startDateInCET = startDate.setZone("Europe/Stockholm");
  return startDateInCET.toISO();
};

describe("isHighTariff", () => {
  it("should throw an error if the date is not a string", async () => {
    await expect(isHighTariff(1)).rejects.toThrow();
  });
  it("should throw an error if the date is not a valid date", async () => {
    await expect(isHighTariff("2021-13-01T00:00:00")).rejects.toThrow();
  });
  describe("working days", () => {
    beforeEach(() => {
      isWorkingDay.mockResolvedValue(true);
    });
    afterEach(() => {
      isWorkingDay.mockClear();
    });
    it("should return false if the date is in a low tariff month and between 06:00 and 22:00", async () => {
      const date = testDate("2021-04-01T06:00:00");
      const result = await isHighTariff(date);
      expect(result).toBe(false);
    });
    it("should return false if the date is in a low tariff month and before 06:00", async () => {
      const date = testDate("2021-04-01T05:59:59");
      const result = await isHighTariff(date);
      expect(result).toBe(false);
    });
    it("should return false if the date is in a low tariff month and after 22:00", async () => {
      const date = testDate("2021-04-01T22:00:01");
      const result = await isHighTariff(date);
      expect(result).toBe(false);
    });
    it("should return true if the date is in a high tariff month and between 06:00 and 22:00", async () => {
      const date = testDate("2021-11-01T06:00:00");
      const result = await isHighTariff(date);
      expect(result).toBe(true);
    });
    it("should return false if the date is in a high tariff month and before 06:00", async () => {
      const date = testDate("2021-10-01T05:59:59");
      const result = await isHighTariff(date);
      expect(result).toBe(false);
    });
    it("should return false if the date is in a high tariff month and after 22:00", async () => {
      const date = testDate("2021-10-01T22:00:01");
      const result = await isHighTariff(date);
      expect(result).toBe(false);
    });
  });
  describe("non working days", () => {
    beforeEach(() => {
      isWorkingDay.mockResolvedValue(false);
    });
    afterEach(() => {
      isWorkingDay.mockClear();
    });

    it("should return false if the date is a holliday", async () => {
      const date = testDate("2022-12-24T15:00:00");
      const result = await isHighTariff(date);
      expect(result).toBe(false);
    });
    it("should return false if the date is a saturday", async () => {
      const date = testDate("2022-12-25T15:00:00");
      const result = await isHighTariff(date);
      expect(result).toBe(false);
    });
    it("should return false if the date is a sunday", async () => {
      const date = testDate("2022-12-26T15:00:00");
      const result = await isHighTariff(date);
      expect(result).toBe(false);
    });
  });
});
