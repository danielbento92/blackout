import * as actionTypes from '../../actionTypes';
import { normalize } from 'normalizr';
import wishlistItemSchema from '../../../entities/schemas/wishlistItem';
import type { Dispatch } from 'redux';
import type { FetchWishlistAction } from '../../types';
import type { GetOptionsArgument, StoreState } from '../../../types';
import type {
  GetWishlist,
  Wishlist,
} from '@farfetch/blackout-client/wishlists/types';

/**
 * @callback FetchWishlistThunkFactory
 * @param {number} wishlistId - Wishlist id.
 * @param {object} [config] - Custom configurations to send to the client
 * instance (axios).
 *
 * @returns {Function} Thunk to be dispatched to the redux store.
 */

/**
 * Creates a thunk factory configured with the specified client
 * to fetch wishlist with given id.
 *
 * @memberof module:wishlists/actions/factories
 *
 * @param {Function} getWishlist - Get wishlist client.
 *
 * @returns {FetchWishlistThunkFactory} Thunk factory.
 */
const fetchWishlistFactory =
  (getWishlist: GetWishlist) =>
  (wishlistId: Wishlist['id'], config?: Record<string, unknown>) =>
  async (
    dispatch: Dispatch<FetchWishlistAction>,
    getState: () => StoreState,
    {
      getOptions = ({ productImgQueryParam }) => ({ productImgQueryParam }),
    }: GetOptionsArgument,
  ): Promise<Wishlist | undefined> => {
    dispatch({
      type: actionTypes.FETCH_WISHLIST_REQUEST,
    });

    try {
      const result = await getWishlist(wishlistId, config);
      const { productImgQueryParam } = getOptions(getState);
      const newItems = result.items.map(item => ({
        ...item,
        productImgQueryParam,
      }));

      dispatch({
        payload: normalize(
          { ...result, items: newItems },
          { items: [wishlistItemSchema] },
        ),
        type: actionTypes.FETCH_WISHLIST_SUCCESS,
      });

      return result;
    } catch (error) {
      dispatch({
        payload: { error },
        type: actionTypes.FETCH_WISHLIST_FAILURE,
      });

      throw error;
    }
  };

export default fetchWishlistFactory;
