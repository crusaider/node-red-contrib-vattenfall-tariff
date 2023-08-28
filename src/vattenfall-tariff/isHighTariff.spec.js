const { DateTime } = require('luxon');

const isHighTariff = require('./istHighTariff');

const testDate = (dateString) => {
  const startDate = DateTime.fromISO(dateString);
  const startDateInCET = startDate.setZone('Europe/Stockholm');
    return startDateInCET.toISO();
};

describe('isHighTariff', () => {
  it('should return true if the date is in a high tariff month and between 06:00 and 22:00', () => {
    const date = testDate('2021-11-01T06:00:00');
    const result = isHighTariff(date);
    expect(result).toBe(true);
  });
  it('should return false if the date is in a high tariff month and before 06:00', () => {
    const date = testDate('2021-10-01T05:59:59');
    const result = isHighTariff(date);
    expect(result).toBe(false);
  });
  it('should return false if the date is in a high tariff month and after 22:00', () => {
    const date = testDate('2021-10-01T22:00:01');
    const result = isHighTariff(date);
    expect(result).toBe(false);
  });
  it('should return false if the date is in a low tariff month and between 06:00 and 22:00', () => {
    const date = testDate('2021-04-01T06:00:00');
    const result = isHighTariff(date);
    expect(result).toBe(false);
  });
  it('should return false if the date is in a low tariff month and before 06:00', () => {
    const date = testDate('2021-04-01T05:59:59');
    const result = isHighTariff(date);
    expect(result).toBe(false);
  });
  it('should return false if the date is in a low tariff month and after 22:00', () => {
    const date = testDate('2021-04-01T22:00:01');
    const result = isHighTariff(date);
    expect(result).toBe(false);
  });
});
