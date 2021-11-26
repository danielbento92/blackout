import * as actionTypes from '../../actionTypes';

/**
 * @callback SubmitFormDataThunkFactory
 * @alias SubmitFormDataThunkFactory
 * @memberof module:forms/actions/factories
 *
 * @param {string} schemaCode - Schema code to be changed.
 * @param {object} data - Schema content to update.
 * @param {object} [config] - Custom configurations to send to the client
 * instance (axios).
 *
 * @returns {Function} Thunk to be dispatched to the redux store.
 */

/**
 * Method responsible for posting Form data based on a schema.
 *
 * @function submitFormDataFactory
 * @memberof module:forms/actions/factories
 *
 * @param {Function} postFormData - Post form data client.
 *
 * @returns {SubmitFormDataThunkFactory} Thunk factory.
 */
export default postFormData => (schemaCode, data, config) => async dispatch => {
  dispatch({
    type: actionTypes.SUBMIT_FORM_REQUEST,
    meta: { schemaCode },
  });

  try {
    const result = await postFormData(schemaCode, data, config);

    dispatch({
      meta: { schemaCode },
      payload: result,
      type: actionTypes.SUBMIT_FORM_SUCCESS,
    });

    return result;
  } catch (error) {
    dispatch({
      meta: { schemaCode },
      payload: { error },
      type: actionTypes.SUBMIT_FORM_FAILURE,
    });

    throw error;
  }
};
