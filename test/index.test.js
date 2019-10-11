const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');
const RapidCoinApi = require('../lib/rapidcoin');
const testData = require('./test-data');

chai.use(chaiAsPromised);
const { expect } = chai;

// test configuration
const config = {
  url: 'https://www.rapidcoin.com/api',
  apiKey: 'api-key-test-0000',
  apiVersion: '1.0',
};

describe('RapidCoin library tests', function() {
  beforeEach(async function() {
    testData.rapidCoinMock(config.url, config.apiKey);
  });

  afterEach(async function() {
    nock.cleanAll();
  });

  describe('invoices', function() {
    it('should fail to create an invoice if an invalid api-key is used', async function() {
      const rapidCoinApi = new RapidCoinApi({ ...config, apiKey: 'some-api-key' });
      const response = await rapidCoinApi.createInvoice(testData.createInvoiceParams);

      expect(response.status).to.eql(401);
      expect(response.error).to.deep.equal({ message: 'Invalid API key' });
    });

    it('should create an invoice with fixed amount', async function() {
      const rapidCoinApi = new RapidCoinApi(config);
      const response = await rapidCoinApi.createInvoice(testData.createInvoiceParams);

      expect(response).to.deep.equal(testData.createInvoiceExpectedOutput);
    });

    it('should create an open invoice', async function() {
      const rapidCoinApi = new RapidCoinApi(config);
      const response = await rapidCoinApi.createInvoice(testData.createOpenInvoiceParams);

      expect(response).to.deep.equal(testData.createOpenInvoiceExpectedOutput);
    });

    it('should fail to read an invoice if an invalid api-key is used', async function() {
      const rapidCoinApi = new RapidCoinApi({ ...config, apiKey: 'some-api-key' });
      const response = await rapidCoinApi.readInvoice(testData.createInvoiceExpectedOutput.id);

      expect(response.status).to.eql(401);
      expect(response.error).to.deep.equal({ message: 'Invalid API key' });
    });

    it('should fail to read an invoice if it does not exist', async function() {
      const invalidId = '8122e413-7246-4874-ad1c-15261d32c2cf';
      const rapidCoinApi = new RapidCoinApi(config);
      const response = await rapidCoinApi.readInvoice(invalidId);

      expect(response.status).to.eql(404);
      expect(response.error).to.deep.equal({ message: 'Invoice not found.' });
    });

    it('should read an invoice', async function() {
      const rapidCoinApi = new RapidCoinApi(config);
      const response = await rapidCoinApi.readInvoice(testData.createInvoiceExpectedOutput.id);

      expect(response).to.deep.equal(testData.createInvoiceExpectedOutput);
    });

    it('should fail to update an invoice if an invalid api-key is used', async function() {
      const rapidCoinApi = new RapidCoinApi({ ...config, apiKey: 'some-api-key' });
      const response = await rapidCoinApi.updateInvoice(testData.createInvoiceExpectedOutput.id);

      expect(response.status).to.eql(401);
      expect(response.error).to.deep.equal({ message: 'Invalid API key' });
    });

    it('should fail to update an invoice if it does not exist', async function() {
      const invalidId = '8122e413-7246-4874-ad1c-15261d32c2cf';
      const rapidCoinApi = new RapidCoinApi(config);
      const response = await rapidCoinApi.updateInvoice(invalidId);

      expect(response.status).to.eql(404);
      expect(response.error).to.deep.equal({ message: 'Invoice not found.' });
    });

    it('should update an invoice', async function() {
      const newReferenceId = 'new-reference-id';
      const rapidCoinApi = new RapidCoinApi(config);
      const response = await rapidCoinApi.updateInvoice(testData.createInvoiceExpectedOutput.id, {
        reference_id: newReferenceId,
      });

      expect(response.reference_id).to.equal(newReferenceId);
    });
  });

  describe('payouts', function() {
    it('should fail to create a payout if an invalid api-key is used', async function() {
      const rapidCoinApi = new RapidCoinApi({ ...config, apiKey: 'some-api-key' });
      const response = await rapidCoinApi.createPayout(testData.createPayoutParams);

      expect(response.status).to.eql(401);
      expect(response.error).to.deep.equal({ message: 'Invalid API key' });
    });

    it('should fail to create a payout if insufficient funds are available', async function() {
      const rapidCoinApi = new RapidCoinApi(config);
      const response = await rapidCoinApi.createPayout({
        ...testData.createPayoutParams,
        amount: '1.2',
      });

      expect(response.status).to.eql(403);
      expect(response.error).to.deep.equal({
        error: { message: 'Insufficient funds' },
      });
    });

    it('should create a payout', async function() {
      const rapidCoinApi = new RapidCoinApi(config);
      const response = await rapidCoinApi.createPayout(testData.createPayoutParams);

      expect(response).to.deep.equal(testData.createPayoutExpectedOutput);
    });

    it('should fail to read a payout if an invalid api-key is used', async function() {
      const rapidCoinApi = new RapidCoinApi({ ...config, apiKey: 'some-api-key' });
      const response = await rapidCoinApi.readPayout(testData.createPayoutExpectedOutput.id);

      expect(response.status).to.eql(401);
      expect(response.error).to.deep.equal({ message: 'Invalid API key' });
    });

    it('should fail to read a payout if it does not exist', async function() {
      const invalidId = '8122e413-7246-4874-ad1c-15261d32c2cf';
      const rapidCoinApi = new RapidCoinApi(config);
      const response = await rapidCoinApi.readPayout(invalidId);

      expect(response.status).to.eql(404);
      expect(response.error).to.deep.equal({ message: 'Payout not found.' });
    });

    it('should read a payout', async function() {
      const rapidCoinApi = new RapidCoinApi(config);
      const response = await rapidCoinApi.readPayout(testData.createPayoutExpectedOutput.id);

      expect(response).to.deep.equal(testData.createPayoutExpectedOutput);
    });
  });

  describe('get currency rate', function() {
    it('should get the BTC rate', async function() {
      const currency = 'BTC';
      const rapidCoinApi = new RapidCoinApi(config);
      const response = await rapidCoinApi.getRate(currency);

      expect(response.currency).to.equal(currency);
    });

    it('should get the USD rate', async function() {
      const currency = 'USD';
      const rapidCoinApi = new RapidCoinApi(config);
      const response = await rapidCoinApi.getRate(currency);

      expect(response.currency).to.equal(currency);
    });
  });

  describe('balance', function() {
    it('should fail to get the organization balance if an invalid api-key is used', async function() {
      const rapidCoinApi = new RapidCoinApi({ ...config, apiKey: 'some-api-key' });
      const response = await rapidCoinApi.getOrganizationBalance();

      expect(response.status).to.eql(401);
      expect(response.error).to.deep.equal({ message: 'Invalid API key' });
    });

    it('should get the organization balance', async function() {
      const rapidCoinApi = new RapidCoinApi(config);
      const response = await rapidCoinApi.getOrganizationBalance();

      expect(response).to.deep.equal({
        btc: 0.22648,
        usd: 5200,
      });
    });
  });
});
