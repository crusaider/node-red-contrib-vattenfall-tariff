const { isHighTariff } = require("./isHighTariff");
const { DateTime } = require("luxon");

module.exports = function (RED) {
  function VattenfallTariffNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.highTariff = parseFloat(config.highTariff);

    if (isNaN(node.highTariff)) {
      node.error("High tariff is not a number");
      node.status({
        fill: "red",
        shape: "dot",
        text: "High tariff is not a number",
      });
      return;
    }

    node.lowTariff = parseFloat(config.lowTariff);

    if (isNaN(node.lowTariff)) {
      node.error("Low tariff is not a number");
      node.status({
        fill: "red",
        shape: "ring",
        text: "Low tariff is not a number",
      });
      return;
    }

    /**
     * @param {{payload: { source:string, priceData:[{ value: number, start: string } ]  }}} msg
     */
    node.on("input", (msg, send, done) => {
      if (!msg?.payload?.priceData) {
        node.status({ fill: "red", shape: "dot", text: "No price data" });
        done("No price data", msg);
        return;
      }

      if (!Array.isArray(msg?.payload?.priceData)) {
        node.status(
          { fill: "red", shape: "dot", text: "Price data is not an array" },
          msg,
        );
        done("Price data is not an array");
        return;
      }

      const { payload } = msg;
      const { priceData } = payload;

      if (
        priceData.reduce((acc, elem) => {
          return (
            acc || isNaN(elem?.value) || !DateTime.fromISO(elem?.start).isValid
          );
        }, false)
      ) {
        node.status({ fill: "red", shape: "dot", text: "Invalid price data" });
        done("Invalid price data", msg);
        return;
      }

      node.status({});

      Promise.all(
        priceData.map(async ({ start, value, ...rest }) => ({
          ...rest,
          start,
          value: (await isHighTariff(start))
            ? Number(value) + node.highTariff
            : Number(value) + node.lowTariff,
        })),
      )
        .then((tarriffedPriceData) => {
          send({
            ...msg,
            payload: {
              ...payload,
              priceData: tarriffedPriceData,
            },
          });
          done();
        })
        .catch((err) => {
          node.status({ fill: "red", shape: "dot", text: err.message });
          done(err);
        });
    });
  }
  RED.nodes.registerType("vattenfall-tariff", VattenfallTariffNode);
};
