import { useReducer } from 'react';

const reducer = (state = {}, action) => ({ ...state, ...action });

const useSetState = initialState => useReducer(reducer, initialState);

export default useSetState;
