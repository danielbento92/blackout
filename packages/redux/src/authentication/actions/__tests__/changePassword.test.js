import { changePassword } from '..';
import { mockStore } from '../../../../tests';
import { postPasswordChange } from '@farfetch/blackout-client/authentication';
import find from 'lodash/find';
import reducer, { actionTypes } from '../..';

jest.mock('@farfetch/blackout-client/authentication', () => ({
  ...jest.requireActual('@farfetch/blackout-client/authentication'),
  postPasswordChange: jest.fn(),
}));

const authenticationMockStore = (state = {}) =>
  mockStore({ authentication: reducer() }, state);

const expectedConfig = undefined;
let store;

describe('changePassword() action creator', () => {
  const passwordChangeData = {
    oldPassword: 'thisisOLDpassword',
    newPassword: 'thisisNEWpassword',
    userId: 0,
    username: 'pepe',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    store = authenticationMockStore();
  });

  it('should create the correct actions for when the password changing procedure fails', async () => {
    const expectedError = new Error('post password change error');

    postPasswordChange.mockRejectedValueOnce(expectedError);
    expect.assertions(4);

    try {
      await store.dispatch(changePassword(passwordChangeData));
    } catch (error) {
      expect(error).toBe(expectedError);
      expect(postPasswordChange).toHaveBeenCalledTimes(1);
      expect(postPasswordChange).toHaveBeenCalledWith(
        passwordChangeData,
        expectedConfig,
      );
      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          { type: actionTypes.PASSWORD_CHANGE_REQUEST },
          {
            type: actionTypes.PASSWORD_CHANGE_FAILURE,
            payload: { error: expectedError },
          },
        ]),
      );
    }
  });

  it('should create the correct actions for when the password changing procedure is successful', async () => {
    postPasswordChange.mockResolvedValueOnce({});
    await store.dispatch(changePassword(passwordChangeData));

    const actionResults = store.getActions();

    expect(postPasswordChange).toHaveBeenCalledTimes(1);
    expect(postPasswordChange).toHaveBeenCalledWith(
      passwordChangeData,
      expectedConfig,
    );

    expect(actionResults).toMatchObject([
      { type: actionTypes.PASSWORD_CHANGE_REQUEST },
      {
        type: actionTypes.PASSWORD_CHANGE_SUCCESS,
      },
    ]);
    expect(
      find(actionResults, {
        type: actionTypes.PASSWORD_CHANGE_SUCCESS,
      }),
    ).toMatchSnapshot('password change success payload');
  });
});
