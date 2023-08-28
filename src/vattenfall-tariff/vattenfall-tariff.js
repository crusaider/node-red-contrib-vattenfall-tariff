const isHighTariff = require('./istHighTariff');

module.exports = function (RED) {
  function VattenfallTariffNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.highTariff = parseFloat(config.highTariff);

    if (isNaN(node.highTariff)) {
      node.error('High tariff is not a number');
      node.status({ fill: 'red', shape: 'dot', text: 'High tariff is not a number' });
      return;
    }

    node.lowTariff = parseFloat(config.lowTariff);

    if (isNaN(node.lowTariff)) {
      node.error('Low tariff is not a number');
      node.status({ fill: 'red', shape: 'ring', text: 'Low tariff is not a number' });
      return;
    }

    /**
     * @param {{payload: { source:string, priceData:[{ value: number, start: string } ]  }}} msg
 
     */
    node.on('input', (msg) => {
      if (!msg?.payload?.priceData) {
        node.error('No price data', msg);
        node.status({ fill: 'red', shape: 'dot', text: 'No price data' });
        return;
      }

      if (!Array.isArray(msg?.payload?.priceData)) {
        node.error('Price data is not an array');
        node.status(
          { fill: 'red', shape: 'dot', text: 'Price data is not an array' },
          msg
        );
        return;
      }

      const { payload } = msg;
      const { priceData } = payload;

      node.status({});

      node.send({
        ...msg,
        payload: {
          ...payload,

          priceData: priceData.map(({ start, value, ...rest }) => ({
            ...rest,
            start,
            value: isHighTariff(start)
              ? value + node.highTariff
              : value + node.lowTariff,
          })),
        },
      });
    });
  }

  RED.nodes.registerType('vattenfall-tariff', VattenfallTariffNode);
};
