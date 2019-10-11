const nock = require('nock');
const _ = require('lodash');

const createOpenInvoiceParams = {
  currency: 'USD',
  notification_url: 'https://www.rapidcoin.com/notification',
  confirmation_url: 'https://www.rapidcoin.com/confirmation',
  confirmations_required: 1,
  reference_id: 'reference_id',
  customer_id: 'customer_id',
  description: 'Test Product',
  redirect_url: 'https://www.rapidcoin.com',
  payment_window: '900',
};

const createInvoiceParams = { ...createOpenInvoiceParams, amount: 22 };

const createInvoiceExpectedOutput = {
  id: '37a10d0d-3d3f-4d1c-ada1-82d1aeaa6aa7',
  status: 'new',
  confidence: 0,
  token: '3088644a2feb5e7de0724d36231665e7',
  invoice_time: '1570121856490',
  payment_time: '1570122756490',
  expiration_time: '1570726656490',
  exception_status: '',
  currency: 'USD',
  rate: '8186.220000',
  amount: '22',
  amount_btc: '0.00268744',
  paid_currency: '',
  paid_rate: '0.00',
  paid_amount: '0.00',
  paid_amount_btc: '0.00',
  redirect_url: 'https://www.google.ca',
  notification_url: 'https://www.rapidcoin.com/notification',
  confirmation_url: 'https://www.rapidcoin.com/confirmation',
  confirmations_required: 1,
  reference_id: 'reference_id',
  customer_id: 'customer_id',
  description: 'Test Product',
  parent_invoice_id: '',
  paid_btc: '0.00',
  address: 'mkUJNfPRLkfkfFoi3hoV3mhzUs9bUcJrSA',
  transactions: [],
  current_time: '2019-10-03T16:57:36.702Z',
};

const createOpenInvoiceExpectedOutput = {
  ...createInvoiceExpectedOutput,
  amount: '0',
  amount_btc: '0.00',
};

const createPayoutParams = {
  address: 'mfkXHJnvyS9bXp29rowWVyUDrDxJoq6YFC',
  amount: '0.012',
  currency: 'BTC',
  reference_id: '1',
  customer_id: '1234',
  description: 'Test',
};

const createPayoutExpectedOutput = {
  id: 'dcaaf436-d98c-47ab-9b34-acb8be64b259',
  status: 'new',
  address: 'mfkXHJnvyS9bXp29rowWVyUDrDxJoq6YFC',
  currency: 'BTC',
  amount: '0.012',
  amount_btc: '0.012',
  rate: '1.0',
  reference_id: '1',
  customer_id: '1234',
  description: 'Test',
  transaction: [],
  created_at: '1570121856490',
  completed_at: '1570121856490',
  automated: '',
};

module.exports = {
  createOpenInvoiceParams,
  createInvoiceParams,

  createInvoiceExpectedOutput,
  createOpenInvoiceExpectedOutput,

  createPayoutParams,
  createPayoutExpectedOutput,

  // mock rapidcoin server
  rapidCoinMock: (url, apiKey) => {
    nock(url)
      // create invoice routes
      .post('/invoices')
      .reply(function(uri, requestBody) {
        // If api key is not specified, return unauthorized response
        if (!this.req.headers['x-api-key']) {
          return [
            401,
            {
              message: 'Missing API key',
            },
          ];
        }
        if (this.req.headers['x-api-key'] !== apiKey) {
          return [
            401,
            {
              message: 'Invalid API key',
            },
          ];
        }

        // invalid currency
        if (!['BTC', 'USD'].includes(requestBody.currency)) {
          return [
            422,
            {
              message: 'validation error',
              errors: { currency: ['Currency code is invalid.'] },
            },
          ];
        }

        // test responses
        if (_.isEqual(requestBody, createInvoiceParams)) {
          return [201, createInvoiceExpectedOutput];
        }
        if (_.isEqual(requestBody, createOpenInvoiceParams)) {
          return [201, createOpenInvoiceExpectedOutput];
        }

        return [500, { message: 'error' }];
      })
      // read invoice routes
      .get('/invoices/8122e413-7246-4874-ad1c-15261d32c2cf')
      .reply(function() {
        // If api key is not specified, return unauthorized response
        if (!this.req.headers['x-api-key']) {
          return [
            401,
            {
              message: 'Missing API key',
            },
          ];
        }
        if (this.req.headers['x-api-key'] !== apiKey) {
          return [
            401,
            {
              message: 'Invalid API key',
            },
          ];
        }

        return [
          404,
          {
            message: 'Invoice not found.',
          },
        ];
      })
      .get(`/invoices/${createInvoiceExpectedOutput.id}`)
      .reply(function() {
        // If api key is not specified, return unauthorized response
        if (!this.req.headers['x-api-key']) {
          return [
            401,
            {
              message: 'Missing API key',
            },
          ];
        }
        if (this.req.headers['x-api-key'] !== apiKey) {
          return [
            401,
            {
              message: 'Invalid API key',
            },
          ];
        }

        return [200, createInvoiceExpectedOutput];
      })
      // update invoice routes
      .patch('/invoices/8122e413-7246-4874-ad1c-15261d32c2cf')
      .reply(function() {
        // If api key is not specified, return unauthorized response
        if (!this.req.headers['x-api-key']) {
          return [
            401,
            {
              message: 'Missing API key',
            },
          ];
        }
        if (this.req.headers['x-api-key'] !== apiKey) {
          return [
            401,
            {
              message: 'Invalid API key',
            },
          ];
        }

        return [
          404,
          {
            message: 'Invoice not found.',
          },
        ];
      })
      .patch(`/invoices/${createInvoiceExpectedOutput.id}`)
      .reply(function(uri, requestBody) {
        // If api key is not specified, return unauthorized response
        if (!this.req.headers['x-api-key']) {
          return [
            401,
            {
              message: 'Missing API key',
            },
          ];
        }
        if (this.req.headers['x-api-key'] !== apiKey) {
          return [
            401,
            {
              message: 'Invalid API key',
            },
          ];
        }

        return [200, { ...createInvoiceExpectedOutput, ...requestBody }];
      })
      // create payout routes
      .post('/payouts')
      .reply(function(uri, requestBody) {
        // If api key is not specified, return unauthorized response
        if (!this.req.headers['x-api-key']) {
          return [
            401,
            {
              message: 'Missing API key',
            },
          ];
        }
        if (this.req.headers['x-api-key'] !== apiKey) {
          return [
            401,
            {
              message: 'Invalid API key',
            },
          ];
        }

        // invalid currency
        if (!['BTC', 'USD'].includes(requestBody.currency)) {
          return [
            422,
            {
              message: 'validation error',
              errors: { currency: ['Currency code is invalid.'] },
            },
          ];
        }

        if (Number(requestBody.amount) > 1) {
          return [
            403,
            {
              error: {
                message: 'Insufficient funds',
              },
            },
          ];
        }
        // test responses
        if (_.isEqual(requestBody, createPayoutParams)) {
          return [200, createPayoutExpectedOutput];
        }

        return [500, { message: 'error' }];
      })
      // read payout routes
      .get('/payouts/8122e413-7246-4874-ad1c-15261d32c2cf')
      .reply(function() {
        // If api key is not specified, return unauthorized response
        if (!this.req.headers['x-api-key']) {
          return [
            401,
            {
              message: 'Missing API key',
            },
          ];
        }
        if (this.req.headers['x-api-key'] !== apiKey) {
          return [
            401,
            {
              message: 'Invalid API key',
            },
          ];
        }

        return [
          404,
          {
            message: 'Payout not found.',
          },
        ];
      })
      .get(`/payouts/${createPayoutExpectedOutput.id}`)
      .reply(function() {
        // If api key is not specified, return unauthorized response
        if (!this.req.headers['x-api-key']) {
          return [
            401,
            {
              message: 'Missing API key',
            },
          ];
        }
        if (this.req.headers['x-api-key'] !== apiKey) {
          return [
            401,
            {
              message: 'Invalid API key',
            },
          ];
        }

        return [200, createPayoutExpectedOutput];
      })
      // read currency routes
      .get('/rates/BTC')
      .reply(200, { currency: 'BTC', rate: 1 })
      .get('/rates/USD')
      .reply(200, { currency: 'USD', rate: 8186.22 })
      // organization balance
      .get('/organization/balance')
      .reply(function() {
        // If api key is not specified, return unauthorized response
        if (!this.req.headers['x-api-key']) {
          return [
            401,
            {
              message: 'Missing API key',
            },
          ];
        }
        if (this.req.headers['x-api-key'] !== apiKey) {
          return [
            401,
            {
              message: 'Invalid API key',
            },
          ];
        }

        return [
          200,
          {
            btc: 0.22648,
            usd: 5200,
          },
        ];
      });
  },
};
