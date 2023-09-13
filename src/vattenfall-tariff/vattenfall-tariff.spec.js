const helper = require("node-red-node-test-helper");
const vattenfallTariffNode = require("./vattenfall-tariff");

jest.mock("./isHighTariff", () => ({
  isHighTariff: jest.fn(),
}));
const { isHighTariff } = require("./isHighTariff");

helper.init(require.resolve("node-red"));

describe("vattenfall-tariff Node", () => {
  beforeAll((done) => {
    helper.startServer(done);
  });

  afterAll((done) => {
    helper.stopServer(done);
  });

  afterEach(async () => {
    await helper.unload();
  });

  // One flow for all tests, supply additional node configuration when needed.
  const flowFactory = (configuration) => [
    {
      id: "n1",
      type: "vattenfall-tariff",
      wires: [["n2"]],
      ...configuration,
    },
    { id: "n2", type: "helper" },
  ];

  // The node under test and the node it depends on.
  const NODES = [vattenfallTariffNode];

  it("should be loaded", (done) => {
    helper.load(NODES, flowFactory({}), () => {
      const n1 = helper.getNode("n1");
      try {
        expect(n1).not.toBeNull();
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  describe("configuration", () => {
    it("should error if highTariff i missing", (done) => {
      helper.load(NODES, flowFactory({ lowTariff: 1 }), () => {
        const n1 = helper.getNode("n1");
        try {
          n1.error.should.be.calledWithExactly("High tariff is not a number");
          n1.status.should.be.called();
          done();
        } catch (err) {
          done(err);
        }
      });
    });
    it("should error if lowTariff i missing", (done) => {
      helper.load(NODES, flowFactory({ highTariff: 1 }), () => {
        const n1 = helper.getNode("n1");
        try {
          n1.error.should.be.calledWithExactly("Low tariff is not a number");
          n1.status.should.be.called();
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  describe("input", () => {
    it("should error if no price data", (done) => {
      helper.load(NODES, flowFactory({ highTariff: 1, lowTariff: 1 }), () => {
        const n1 = helper.getNode("n1");
        n1.on("call:error", (call) => {
          try {
            call.should.be.calledWithMatch("No price data");
            n1.status.should.be.called();
            done();
          } catch (err) {
            done(err);
          }
        });
        n1.receive({ payload: {} });
      });
    });
    it("should error if price data is not an array", (done) => {
      helper.load(NODES, flowFactory({ highTariff: 1, lowTariff: 1 }), () => {
        const n1 = helper.getNode("n1");
        n1.on("call:error", (call) => {
          try {
            call.should.be.calledWithMatch("Price data is not an array");
            n1.status.should.be.called();
            done();
          } catch (err) {
            done(err);
          }
        });
        n1.receive({ payload: { priceData: {} } });
      });
    });
    it("should error if price data is invalid (missing timestamp) ", (done) => {
      helper.load(NODES, flowFactory({ highTariff: 1, lowTariff: 1 }), () => {
        const n1 = helper.getNode("n1");
        n1.on("call:error", (call) => {
          try {
            call.should.be.calledWithMatch("Invalid price data");
            n1.status.should.be.called();
            done();
          } catch (err) {
            done(err);
          }
        });
        n1.receive({ payload: { priceData: [{ value: "a" }] } });
      });
    });
    it("should error if price data is invalid (missing value) ", (done) => {
      helper.load(NODES, flowFactory({ highTariff: 1, lowTariff: 1 }), () => {
        const n1 = helper.getNode("n1");
        n1.on("call:error", (call) => {
          try {
            call.should.be.calledWithMatch("Invalid price data");
            n1.status.should.be.called();
            done();
          } catch (err) {
            done(err);
          }
        });
        n1.receive({ payload: { priceData: [{ start: "a" }] } });
      });
    });
    it("should error if price data is invalid (value is not a number) ", (done) => {
      helper.load(NODES, flowFactory({ highTariff: 1, lowTariff: 1 }), () => {
        const n1 = helper.getNode("n1");
        n1.on("call:error", (call) => {
          try {
            call.should.be.calledWithMatch("Invalid price data");
            n1.status.should.be.called();
            done();
          } catch (err) {
            done(err);
          }
        });
        n1.receive({ payload: { priceData: [{ start: "a", value: "a" }] } });
      });
    });
    it("should error if price data is invalid (timestamp is not a string) ", (done) => {
      helper.load(NODES, flowFactory({ highTariff: 1, lowTariff: 1 }), () => {
        const n1 = helper.getNode("n1");
        n1.on("call:error", (call) => {
          try {
            call.should.be.calledWithMatch("Invalid price data");
            n1.status.should.be.called();
            done();
          } catch (err) {
            done(err);
          }
        });
        n1.receive({ payload: { priceData: [{ start: 1, value: 1 }] } });
      });
    });
    it("should error if price data is invalid (timestamp is not a valid date) ", (done) => {
      helper.load(NODES, flowFactory({ highTariff: 1, lowTariff: 1 }), () => {
        const n1 = helper.getNode("n1");
        n1.on("call:error", (call) => {
          try {
            call.should.be.calledWithMatch("Invalid price data");
            n1.status.should.be.called();
            done();
          } catch (err) {
            done(err);
          }
        });
        n1.receive({ payload: { priceData: [{ start: "a", value: 1 }] } });
      });
    });
    it("should error if isHighTariff throws", (done) => {
      // eslint-disable-next-line prefer-promise-reject-errors
      isHighTariff.mockImplementation(() => Promise.reject("test"));
      helper.load(NODES, flowFactory({ highTariff: 1, lowTariff: 1 }), () => {
        const n1 = helper.getNode("n1");
        n1.on("call:error", (call) => {
          try {
            call.should.be.calledWithMatch("test");
            n1.status.should.be.called();
            done();
          } catch (err) {
            done(err);
          }
        });
        n1.receive({
          payload: { priceData: [{ value: 1, start: "2021-11-01T06:00:00" }] },
        });
      });
    });
    it("should accept a number value as a string", (done) => {
      isHighTariff.mockImplementation(() => Promise.resolve(false));
      helper.load(NODES, flowFactory({ highTariff: 2, lowTariff: 1 }), () => {
        const n1 = helper.getNode("n1");
        const n2 = helper.getNode("n2");
        n2.on("input", (msg) => {
          try {
            expect(msg.payload.priceData[0].value).toBe(2);
            done();
          } catch (err) {
            done(err);
          }
        });
        n1.receive({
          payload: {
            priceData: [{ value: "1", start: "2021-11-01T06:00:00" }],
          },
        });
      });
    });

    it("should add the low tariff to the value", (done) => {
      isHighTariff.mockImplementation(() => Promise.resolve(false));
      helper.load(NODES, flowFactory({ highTariff: 2, lowTariff: 1 }), () => {
        const n1 = helper.getNode("n1");
        const n2 = helper.getNode("n2");
        n2.on("input", (msg) => {
          try {
            expect(msg.payload.priceData[0].value).toBe(2);
            done();
          } catch (err) {
            done(err);
          }
        });
        n1.receive({
          payload: { priceData: [{ value: 1, start: "2021-11-01T06:00:00" }] },
        });
      });
    });
    it("should add the high tariff to the value", (done) => {
      isHighTariff.mockResolvedValue(true);
      helper.load(NODES, flowFactory({ highTariff: 2, lowTariff: 1 }), () => {
        const n1 = helper.getNode("n1");
        const n2 = helper.getNode("n2");
        n2.on("input", (msg) => {
          try {
            expect(msg.payload.priceData[0].value).toBe(3);
            done();
          } catch (err) {
            done(err);
          }
        });
        n1.receive({
          payload: { priceData: [{ value: 1, start: "2021-11-01T06:00:00" }] },
        });
      });
    });
  });
});
