const axios = require('axios');
const Joi = require('@hapi/joi');

class RapidCoinApi {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.url = config.url;
    this.apiVersion = config.apiVersion;
  }

  /**
   * Create an invoice
   * @param params invoice parameters
   * @return       invoice details if successful
   */
  async createInvoice(params) {
    const schema = Joi.object({
      reference_id: Joi.string().optional(),
      customer_id: Joi.string().optional(),
      description: Joi.string().optional(),
      confirmations_required: Joi.number()
        .integer()
        .greater(0)
        .optional(),
      notification_url: Joi.string()
        .uri()
        .optional(),
      confirmation_url: Joi.string()
        .uri()
        .optional(),
      redirect_url: Joi.string()
        .uri()
        .optional(),
      currency: Joi.string()
        .valid('BTC', 'USD')
        .optional(),
      amount: Joi.number()
        .greater(0)
        .optional(),
      payment_window: Joi.number()
        .integer()
        .greater(0)
        .optional(),
    });

    await schema.validateAsync(params);

    return this.httpRequest(
      {
        method: 'POST',
        url: `${this.url}/invoices`,
      },
      { ...params, amount: params.amount !== null ? params.amount : 0 },
    );
  }

  /**
   * Read invoice info from id
   * @param  id invoice id
   * @return    invoice details
   */
  async readInvoice(id) {
    const schema = Joi.string()
      .uuid({ version: 'uuidv4' })
      .required();

    await schema.validateAsync(id);

    return this.httpRequest({
      method: 'GET',
      url: `${this.url}/invoices/${id}`,
    });
  }

  /**
   * Update invoice details
   * @param  id invoice id
   * @return    invoice details
   */
  async updateInvoice(id, params) {
    const schemaId = Joi.string()
      .uuid({ version: 'uuidv4' })
      .required();

    const schema = Joi.object({
      reference_id: Joi.string().optional(),
      customer_id: Joi.string().optional(),
      description: Joi.string().optional(),
    });

    await schemaId.validateAsync(id);
    await schema.validate(params);

    return this.httpRequest(
      {
        method: 'PATCH',
        url: `${this.url}/invoices/${id}`,
      },
      params,
    );
  }

  /**
   * Create a payout
   * @param  params payout parameters
   * @return        payout details if successful
   */
  async createPayout(params) {
    const schema = Joi.object({
      currency: Joi.string()
        .valid('BTC', 'USD')
        .required(),
      amount: Joi.number()
        .greater(0)
        .required(),
      address: Joi.string().required(),
      reference_id: Joi.string().optional(),
      customer_id: Joi.string().optional(),
      description: Joi.string().optional(),
    });

    await schema.validateAsync(params);

    return this.httpRequest(
      {
        method: 'POST',
        url: `${this.url}/payouts`,
      },
      params,
    );
  }

  /**
   * Read payout info from id
   * @param  id payout id
   * @return    payout details
   */
  async readPayout(id) {
    const schema = Joi.string()
      .uuid({ version: 'uuidv4' })
      .required();

    await schema.validateAsync(id);

    return this.httpRequest({
      method: 'GET',
      url: `${this.url}/payouts/${id}`,
    });
  }

  /**
   * Get the balance
   * @return balances in btc and usd
   */
  async getOrganizationBalance() {
    return this.httpRequest({
      method: 'GET',
      url: `${this.url}/organization/balance`,
    });
  }

  /**
   * Get the currency exchange rate
   * @param  currency either USD or BTC
   * @return          conversion rate from BTC to the currency specified
   */
  async getRate(currency) {
    const schema = Joi.string()
      .valid('BTC', 'USD')
      .required();

    await schema.validateAsync(currency);

    return this.httpRequest({
      method: 'GET',
      url: `${this.url}/rates/${currency}`,
    });
  }

  /**
   * RapidCoin http request
   */
  async httpRequest(object, params) {
    try {
      const response = await axios({
        method: object.method,
        headers: {
          'content-type': 'application/json',
          'x-api-key': this.apiKey,
          'x-api-version': this.apiVersion,
        },
        url: object.url,
        data: params,
        timeout: 30000,
      });

      return response.data;
    } catch (error) {
      const errorResponse = {
        status: error.response.status,
        error: error.response.data,
      };
      return errorResponse;
    }
  }
}

module.exports = RapidCoinApi;
