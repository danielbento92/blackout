import { actionTypes } from '../..';
import { addBagItem } from '..';
import { INITIAL_STATE } from '../../reducer';
import {
  mockBagId,
  mockData,
  mockNormalizedPayload,
  mockResponse,
  mockState,
} from 'tests/__fixtures__/bags';
import { mockStore } from '../../../../tests';
import { postBagItem } from '@farfetch/blackout-client/bags';
import find from 'lodash/find';
import thunk from 'redux-thunk';

jest.mock('@farfetch/blackout-client/bags', () => ({
  ...jest.requireActual('@farfetch/blackout-client/bags'),
  postBagItem: jest.fn(),
}));

const mockMiddlewares = [
  thunk.withExtraArgument({
    getOptions: () => ({ productImgQueryParam: '?c=2' }),
  }),
];
const bagMockStore = (state = {}) =>
  mockStore({ bag: INITIAL_STATE }, state, mockMiddlewares);
const bagMockStoreWithoutMiddlewares = (state = {}) =>
  mockStore({ bag: INITIAL_STATE }, state);
const expectedConfig = undefined;
const expectedQuery = undefined;
let store;

describe('addBagItem() action creator', () => {
  beforeEach(jest.clearAllMocks);

  it('should throw an error if the bagId is not set on state', async () => {
    store = bagMockStore({ bag: { id: null } });
    expect.assertions(2);

    await store.dispatch(addBagItem(mockData)).catch(error => {
      expect(error).toMatchSnapshot();
      expect(store.getActions()).toHaveLength(0);
    });
  });

  it('should create the correct actions for when the add bag item procedure fails', async () => {
    const expectedError = new Error('post bag item error');

    store = bagMockStore(mockState);
    postBagItem.mockRejectedValueOnce(expectedError);

    expect.assertions(4);

    await store.dispatch(addBagItem(mockData)).catch(error => {
      expect(error).toBe(expectedError);
      expect(postBagItem).toHaveBeenCalledTimes(1);
      expect(postBagItem).toHaveBeenCalledWith(
        mockBagId,
        mockData,
        expectedQuery,
        expectedConfig,
      );
      expect(store.getActions()).toEqual([
        {
          type: actionTypes.ADD_BAG_ITEM_REQUEST,
          meta: {
            ...mockData,
            bagId: mockBagId,
          },
        },
        {
          payload: { error: expectedError },
          meta: {
            ...mockData,
            bagId: mockBagId,
          },
          type: actionTypes.ADD_BAG_ITEM_FAILURE,
        },
      ]);
    });
  });

  it('should create the correct actions for when the add bag item procedure is successful', async () => {
    store = bagMockStore(mockState);
    postBagItem.mockResolvedValueOnce(mockResponse);

    expect.assertions(5);

    await store.dispatch(addBagItem(mockData)).then(clientResult => {
      expect(clientResult).toBe(mockResponse);
    });

    const actionResults = store.getActions();

    expect(postBagItem).toHaveBeenCalledTimes(1);
    expect(postBagItem).toHaveBeenCalledWith(
      mockBagId,
      mockData,
      expectedQuery,
      expectedConfig,
    );
    expect(actionResults).toMatchObject([
      {
        type: actionTypes.ADD_BAG_ITEM_REQUEST,
        meta: {
          ...mockData,
          bagId: mockBagId,
        },
      },
      {
        payload: mockNormalizedPayload,
        type: actionTypes.ADD_BAG_ITEM_SUCCESS,
        meta: {
          ...mockData,
          bagId: mockBagId,
        },
      },
    ]);
    expect(
      find(actionResults, {
        type: actionTypes.ADD_BAG_ITEM_SUCCESS,
      }),
    ).toMatchSnapshot('add bag item success payload');
  });

  it('should create the correct actions for when the add bag item procedure is successful without receiving options', async () => {
    store = bagMockStoreWithoutMiddlewares(mockState);
    postBagItem.mockResolvedValueOnce(mockResponse);

    expect.assertions(5);

    await store.dispatch(addBagItem(mockData)).then(clientResult => {
      expect(clientResult).toBe(mockResponse);
    });

    const actionResults = store.getActions();

    expect(postBagItem).toHaveBeenCalledTimes(1);
    expect(postBagItem).toHaveBeenCalledWith(
      mockBagId,
      mockData,
      expectedQuery,
      expectedConfig,
    );
    expect(actionResults).toMatchObject([
      {
        type: actionTypes.ADD_BAG_ITEM_REQUEST,
        meta: {
          ...mockData,
          bagId: mockBagId,
        },
      },
      {
        payload: mockNormalizedPayload,
        type: actionTypes.ADD_BAG_ITEM_SUCCESS,
        meta: {
          ...mockData,
          bagId: mockBagId,
        },
      },
    ]);
    expect(
      find(actionResults, {
        type: actionTypes.ADD_BAG_ITEM_SUCCESS,
      }),
    ).toMatchSnapshot('add bag item success payload without receiving options');
  });
});
