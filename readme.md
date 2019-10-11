# [RapidCoin API](https://www.rapidcoin.com)

A nodejs library to communicate with the RapidCoin API.

## Installation

```
npm i --save rapidcoin-api
```

## Example Usage

```
const rapidCoinApi = require("rapidcoin-api");

const config = {
  url: "https://www.rapidcoin.com/api",
  apiKey: "my-api-key",
  apiVersion: "1.0"
};

const rc = new rapidCoinApi(config);
const response = await rc.createInvoice({});
```

## Invoices

### Creating an invoice

```
const response = await rc.createInvoice(params);
```

#### Parameters

The object parameters for creating an invoice are

| key                    | type    | description                                                                                       | required? |
|------------------------|---------|---------------------------------------------------------------------------------------------------|-----------|
| reference_id           | string  | Custom reference id associated with invoice                                                       | no        |
| customer_id            | string  | Custom customer id associated with invoice                                                        | no        |
| description            | string  | Custom description associated with invoice                                                        | no        |
| confirmations_required | integer | Number of blockchains required to complete invoice transaction & trigger confirmation_url IPN     | no        |
| notification_url       | string  | Notification URL to POST when transaction is received on address                                  | no        |
| confirmation_url       | string  | Notification URL to POST when blockchain confirmations reaches confirmations_required             | no        |
| redirect_url           | string  | URL to redirect to after successful payment (web flow)                                            | no        |
| currency               | string  | Three character currency code, either USD or BTC. Used with amount to calculate rate & amount_btc | no        |
| amount                 | number  | Amount of invoice in specified currency                                                           | no        |

Note: currency and amount are optional, if they are not specified the invoice will be created an "open" invoice

#### Response

| key                    | description                                                                                                                                                                                                                            |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                     | Unique id of invoice                                                                                                                                                                                                                   |
| status                 | Invoice status, "open", pending", "confirming", "complete", "expired"                                                                                                                                                                  |
| token                  | Unique token of invoice                                                                                                                                                                                                                |
| invoice_time           | UNIX timestamp when invoice was created                                                                                                                                                                                                |
| expiration_time        | UNIX timestamp of when invoice address is expired of invoice                                                                                                                                                                           |
| exception_status       | Exception status of invoice                                                                                                                                                                                                            |
| currency               | Three character currency code, either USD or BTC. Used with amount to calculate rate & amount_btc                                                                                                                                      |
| rate                   | Rate used to convert amount in currency to amount_btc in BTC                                                                                                                                                                           |
| amount                 | Amount of invoice in specified currency (0 for open invoices)                                                                                                                                                                          |
| amount_btc             | Amount of invoice in BTC, calculated from currency, amount, and rate (0 for open invoices)                                                                                                                                             |
| paid_currency          | Three character currency code, either USD or BTC.  Used to show what currency customer will be paid out in                                                                                                                             |
| paid_rate              | Rate used to convert amount in BTC to paid amount in paid_currency                                                                                                                                                                     |
| paid_amount            | Amount paid out to customer in paid_currency                                                                                                                                                                                           |
| paid_amount_btc        | Amount paid out to customer in BTC                                                                                                                                                                                                     |
| redirect_url           | URL to redirect to after successful payment                                                                                                                                                                                            |
| notification_url       | Notification URL to POST when transaction is received on address                                                                                                                                                                       |
| confirmation_url       | Notification URL to POST when blockchain confirmations reaches required_confirmations                                                                                                                                                  |
| confirmations_required | Number of blockchain confirmations required to complete invoice and trigger POST to confirmation_notification_url                                                                                                                      |
| reference_id           | Custom reference id associated with invoice provided on creation                                                                                                                                                                       |
| customer_id            | Custom customer id associated with invoice provided on creation                                                                                                                                                                        |
| description            | Custom description associated with invoice provided on creation (if second deposit on address - description becomes SUB_INVOICE)                                                                                                       |
| parent_invoice_id      | Unique Id of parent invoice (if second deposit made on the same address - will reference the first invoice created. null if first invoice)                                                                                             |
| address                | Bitcoin deposit address of invoice                                                                                                                                                                                                     |
| paid_btc               | Amount paid by customer in BTC.                                                                                                                                                                                                        |
| transactions           | array of blockchain transactions of payments to invoice invoice  eg. "transactions": [   {"hash":"f7b0989105b03d69e1ef913b3f7a12df3886d334d0d8706ff77ea78e6602493f", "amount": 0, "confirmations" : 6, "time": 0, "received_time": 0}] |
| current_time           | Current timestamp of request                                                                                                                                                                                                           |

### Reading information from an existing invoice

```
const response = await rc.readInvoice(id);
```

#### Parameters

The id passed in is the uuid of an existing invoice.

#### Response

| key                    | description                                                                                                                                                                                                                            |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                     | Unique id of invoice                                                                                                                                                                                                                   |
| status                 | Invoice status, "open", pending", "confirming", "complete", "expired"                                                                                                                                                                  |
| token                  | Unique token of invoice                                                                                                                                                                                                                |
| invoice_time           | UNIX timestamp when invoice was created                                                                                                                                                                                                |
| expiration_time        | UNIX timestamp of when invoice address is expired of invoice                                                                                                                                                                           |
| exception_status       | Exception status of invoice                                                                                                                                                                                                            |
| currency               | Three character currency code, either USD or BTC. Used with amount to calculate rate & amount_btc                                                                                                                                      |
| rate                   | Rate used to convert amount in currency to amount_btc in BTC                                                                                                                                                                           |
| amount                 | Amount of invoice in specified currency (0 for open invoices)                                                                                                                                                                          |
| amount_btc             | Amount of invoice in BTC, calculated from currency, amount, and rate (0 for open invoices)                                                                                                                                             |
| paid_currency          | Three character currency code, either USD or BTC.  Used to show what currency customer will be paid out in                                                                                                                             |
| paid_rate              | Rate used to convert amount in BTC to paid amount in paid_currency                                                                                                                                                                     |
| paid_amount            | Amount paid out to customer in paid_currency                                                                                                                                                                                           |
| paid_amount_btc        | Amount paid out to customer in BTC                                                                                                                                                                                                     |
| redirect_url           | URL to redirect to after successful payment                                                                                                                                                                                            |
| notification_url       | Notification URL to POST when transaction is received on address                                                                                                                                                                       |
| confirmation_url       | Notification URL to POST when blockchain confirmations reaches required_confirmations                                                                                                                                                  |
| confirmations_required | Number of blockchain confirmations required to complete invoice and trigger POST to confirmation_notification_url                                                                                                                      |
| reference_id           | Custom reference id associated with invoice provided on creation                                                                                                                                                                       |
| customer_id            | Custom customer id associated with invoice provided on creation                                                                                                                                                                        |
| description            | Custom description associated with invoice provided on creation (if second deposit on address - description becomes SUB_INVOICE)                                                                                                       |
| parent_invoice_id      | Unique Id of parent invoice (if second deposit made on the same address - will reference the first invoice created. null if first invoice)                                                                                             |
| address                | Bitcoin deposit address of invoice                                                                                                                                                                                                     |
| paid_btc               | Amount paid by customer in BTC.                                                                                                                                                                                                        |
| transactions           | array of blockchain transactions of payments to invoice invoice  eg. "transactions": [   {"hash":"f7b0989105b03d69e1ef913b3f7a12df3886d334d0d8706ff77ea78e6602493f", "amount": 0, "confirmations" : 6, "time": 0, "received_time": 0}] |
| current_time           | Current timestamp of request                                                                                                                                                                                                           |

### Updating an invoice

```
const response = await rc.updateInvoice(id, params);
```

#### Parameters

The id passed in is the uuid of an existing invoice.

The object parameters for updating an invoice are

| key          | type   | description                                 | required? |
|--------------|--------|---------------------------------------------|-----------|
| reference_id | string | Custom reference id associated with invoice | no        |
| customer_id  | string | Custom customer id associated with invoice  | no        |
| description  | string | Custom description associated with invoice  | no        |

#### Response

| key                    | description                                                                                                                                                                                                                        |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                     | Unique id of invoice                                                                                                                                                                                                               |
| status                 | Invoice status, "open", pending", "confirming", "complete", "expired"                                                                                                                                                              |
| token                  | Unique token of invoice                                                                                                                                                                                                            |
| invoice_time           | UNIX timestamp when invoice was created                                                                                                                                                                                            |
| expiration_time        | UNIX timestamp of when invoice address is expired of invoice                                                                                                                                                                       |
| exception_status       | Exception status of invoice                                                                                                                                                                                                        |
| currency               | Three character currency code, either USD or BTC. Used with amount to calculate rate & amount_btc                                                                                                                                  |
| rate                   | Rate used to convert amount in currency to amount_btc in BTC                                                                                                                                                                       |
| amount                 | Amount of invoice in specified currency (0 for open invoices)                                                                                                                                                                      |
| amount_btc             | Amount of invoice in BTC, calculated from currency, amount, and rate (0 for open invoices)                                                                                                                                         |
| paid_currency          | Three character currency code, either USD or BTC.  Used to show what currency customer will be paid out in                                                                                                                         |
| paid_rate              | Rate used to convert amount in BTC to paid amount in paid_currency                                                                                                                                                                 |
| paid_amount            | Amount paid out to customer in paid_currency                                                                                                                                                                                       |
| paid_amount_btc        | Amount paid out to customer in BTC                                                                                                                                                                                                 |
| redirect_url           | URL to redirect to after successful payment                                                                                                                                                                                        |
| notification_url       | Notification URL to POST when transaction is received on address                                                                                                                                                                   |
| confirmation_url       | Notification URL to POST when blockchain confirmations reaches required_confirmations                                                                                                                                              |
| confirmations_required | Number of blockchain confirmations required to complete invoice and trigger POST to confirmation_notification_url                                                                                                                  |
| reference_id           | Custom reference id associated with invoice provided on creation                                                                                                                                                                   |
| customer_id            | Custom customer id associated with invoice provided on creation                                                                                                                                                                    |
| description            | Custom description associated with invoice provided on creation (if second deposit on address - description becomes SUB_INVOICE)                                                                                                   |
| parent_invoice_id      | Unique Id of parent invoice (if second deposit made on the same address - will reference the first invoice created. null if first invoice)                                                                                         |
| address                | Bitcoin deposit address of invoice                                                                                                                                                                                                 |
| paid_btc               | Amount paid by customer in BTC.                                                                                                                                                                                                    |
| transactions           | array of blockchain transactions of payments to invoice invoice eg. "transactions": [{"hash":"f7b0989105b03d69e1ef913b3f7a12df3886d334d0d8706ff77ea78e6602493f", "amount": 0, "confirmations" : 6, "time": 0, "received_time": 0}] |
| current_time           | Current timestamp of request                                                                                                                                                                                                       |

## Payouts

### Creating a payout

```
const response = await rc.createPayout(params);
```

#### Parameters

The object parameters for creating an invoice are

| key          | type   | description                                                                                       | required? |
|--------------|--------|---------------------------------------------------------------------------------------------------|-----------|
| currency     | string | Three character currency code, either USD or BTC. Used with amount to calculate rate & amount_btc | yes       |
| amount       | number | Amount of payout to send in specified currency                                                    | yes       |
| address      | string | Bitcoin address to send payout too                                                                | yes       |
| reference_id | string | Custom reference id associated with payout                                                        | no        |
| customer_id  | string | Custom customer id associated with payout                                                         | no        |
| description  | string | Custom description associated with payout                                                         | no        |

#### Response

| key          | description                                                                                                                                 |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| id           | Unique id of payout                                                                                                                         |
| status       | Payout status, "pending", "complete", "exception"                                                                                           |
| address      | Bitcoin address of payout                                                                                                                   |
| currency     | Three character currency code, either USD or BTC. Used with amount to calculate rate & amount_btc                                           |
| amount       | Amount of payout to send in specified currency                                                                                              |
| amount_btc   | Amount of payout to send in BTC, calculated from currency, amount, and rate                                                                 |
| rate         | Rate used to convert amount in currency to amount_btc in BTC                                                                                |
| reference_id | Custom reference id associated with payout provided on creation                                                                             |
| customer_id  | Custom customer id associated with payout provided on creation                                                                              |
| description  | Custom description associated with payout provided on creation                                                                              |
| created_at   | Datetime payout transaction was created                                                                                                     |
| completed_at | Datetime payout transaction was completed                                                                                                   |
| transaction  | Details of blockchain transaction of payout  eg. "transaction": {"hash":"f7b0989105b03d69e1ef913b3f7a12df3886d334d0d8706ff77ea78e6602493f"} |

### Reading information from an existing payout

```
const response = await rc.readPayout(id);
```

#### Parameters

The id passed in is the uuid of an existing invoice.

#### Response

| key          | description                                                                                                                                 |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| id           | Unique id of payout                                                                                                                         |
| status       | Payout status, "pending", "complete", "exception"                                                                                           |
| address      | Bitcoin address of payout                                                                                                                   |
| currency     | Three character currency code, either USD or BTC. Used with amount to calculate rate & amount_btc                                           |
| amount       | Amount of payout to send in specified currency                                                                                              |
| amount_btc   | Amount of payout to send in BTC, calculated from currency, amount, and rate                                                                 |
| rate         | Rate used to convert amount in currency to amount_btc in BTC                                                                                |
| reference_id | Custom reference id associated with payout provided on creation                                                                             |
| customer_id  | Custom customer id associated with payout provided on creation                                                                              |
| description  | Custom description associated with payout provided on creation                                                                              |
| created_at   | Datetime payout transaction was created                                                                                                     |
| completed_at | Datetime payout transaction was completed                                                                                                   |
| transaction  | Details of blockchain transaction of payout  eg. "transaction": {"hash":"f7b0989105b03d69e1ef913b3f7a12df3886d334d0d8706ff77ea78e6602493f"} |

## Other

### Finding the currency exchange rate

```
const response = await rc.getRate(currency);
```

#### Parameters

The currency to look up for the exchange rate (currently only BTC or USD).

#### Response

| key      | description            |
|----------|------------------------|
| currency | the currency           |
| rate     | currency exchange rate |

### Getting the available balance

```
const response = await rc.getOrganizationBalance();
```

#### Response

| key | description                                       |
|-----|---------------------------------------------------|
| btc | the BTC balance                                   |
| usd | the amount in USD using the current exchange rate |
