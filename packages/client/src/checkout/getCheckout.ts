import client, { adaptError } from '../helpers/client';
import join from 'proper-url-join';
import type { GetCheckout } from './types';

/**
 * @typedef {object} GetCheckoutQuery
 *
 * @alias GetCheckoutQuery
 * @memberof module:checkout/client
 *
 * @property {object | Array} [fields] - Get the order only with the specified
 * fields, separated by commas. Possible values: checkoutOrder, paymentMethods,
 * shippingOptions or deliveryBundles, userPaymentTokens.
 */

/**
 * Method responsible for loading the checkout.
 *
 * @function getCheckout
 * @memberof module:checkout/client
 *
 * @param {number} id                 - Universal identifier of the Checkout.
 * @param {GetCheckoutQuery} [query]  - Query params.
 * @param {object} [config]           - Custom configurations to send to the client
 * instance (axios).
 *
 * @returns {Promise} Promise that will resolve when the call to
 * the endpoint finishes.
 */
const getCheckout: GetCheckout = (id, query, config) =>
  client
    .get(join('/checkout/v1/orders/', id, { query }), config)
    .then(response => response.data)
    .catch(error => {
      throw adaptError(error);
    });

export default getCheckout;
