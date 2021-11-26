import { actionTypes } from '../..';
import { mockStore } from '../../../../tests';
import { resetProductsLists } from '..';

describe('resetProductsLists() action creator', () => {
  let store;

  it('should dispatch the correct action type', () => {
    store = mockStore();
    store.dispatch(resetProductsLists());

    expect(store.getActions()).toEqual([
      {
        type: actionTypes.RESET_PRODUCTS_LISTS_STATE,
      },
      {
        type: actionTypes.RESET_PRODUCTS_LISTS_ENTITIES,
      },
    ]);
  });
});
