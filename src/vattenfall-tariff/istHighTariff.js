const { DateTime } = require('luxon');

const highTariffMonths = [11, 12, 1, 2, 3];

const isHighTariff = (dateString) => {
  // Parse the date string into a Luxon DateTime object
  const startDate = DateTime.fromISO(dateString);

  // Convert to CET/CEST
  const startDateInCET = startDate.setZone('Europe/Stockholm');

  // Check if the month is a high tariff month
  if (!highTariffMonths.includes(startDateInCET.month)) {
    return false;
  }

  // Get the hour in CET/CEST time
  const cetHour = startDateInCET.hour;

  // Check if the time is between 06:00 CET/CEST and 22:00 CET/CEST in a high tariff month
  return cetHour > 5 && cetHour < 23;
};

module.exports = isHighTariff;
