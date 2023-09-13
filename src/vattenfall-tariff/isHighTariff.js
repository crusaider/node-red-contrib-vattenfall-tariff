const { DateTime } = require("luxon");
const { isWorkingDay } = require("../swedish-days");

const highTariffMonths = [11, 12, 1, 2, 3];

/**
 * @param {string} dateString
 * @returns {Promise<boolean>}
 */
const isHighTariff = async (dateString) => {
  // Parse the date string into a Luxon DateTime object
  const startDate = DateTime.fromISO(dateString);

  if (!startDate.isValid) {
    throw new Error("Invalid dateString :" + startDate.invalidReason);
  }

  // Convert to CET/CEST
  const startDateInCET = startDate.setZone("Europe/Stockholm");

  // Check if the month is a high tariff month
  if (!highTariffMonths.includes(startDateInCET.month)) {
    return false;
  }

  // Check if the day is a working day
  if (
    !(await isWorkingDay({
      year: startDateInCET.year,
      month: startDateInCET.month,
      day: startDateInCET.day,
    }))
  ) {
    return false;
  }

  // Get the hour in CET/CEST time
  const cetHour = startDateInCET.hour;

  // Check if the time is between 06:00 CET/CEST and 22:00 CET/CEST
  return cetHour > 5 && cetHour < 23;
};

module.exports = { isHighTariff };
