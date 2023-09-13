const memoize = require("memoizee");
const { getDay } = require("./swedish-days-api");

const isWorkingDay = async ({ year, month, day }) => {
  const { dagar } = await getDay({ year, month, day });
  const { "arbetsfri dag": isWorkingDay } = dagar[0];
  return isWorkingDay !== "Ja";
};

module.exports = {
  isWorkingDay: memoize(isWorkingDay, {
    promise: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    normalizer: (args) => JSON.stringify(args[0]),
  }),
};
