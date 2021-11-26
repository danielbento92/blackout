import client, { adaptError } from '../helpers/client';
import join from 'proper-url-join';
import type { PatchCheckoutCompletePayment } from './types';
/**
 * @typedef {object} PatchCheckoutCompletePaymentData
 *
 * @alias PatchCheckoutCompletePaymentData
 * @memberof module:checkout/client
 *
 * @property {object} confirmationParameters - Confirmation parameters.
 */

/**
 * Attempts to complete the payment of a checkout order.
 *
 * @function patchCheckoutCompletePayment
 * @memberof module:checkout/client
 *
 * @param {number} id - Identifier of the transaction.
 * @param {PatchCheckoutCompletePaymentData} data - Request data.
 * @param {object} [config] - Custom configurations to send to the client
 * instance (axios).
 *
 * @returns {Promise} Promise that will resolve when the call to
 * the endpoint finishes.
 */
const patchCheckoutCompletePayment: PatchCheckoutCompletePayment = (
  id,
  data,
  config,
) =>
  client
    .patch(join('/payment/v1/payments', id), data, config)
    .then(response => response.data)
    .catch(error => {
      throw adaptError(error);
    });

export default patchCheckoutCompletePayment;
