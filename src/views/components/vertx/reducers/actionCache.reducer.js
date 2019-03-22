/* eslint-disable */

import dlv from 'dlv';
import { isArray, isString, isObject } from '../../../../utils';

const injectActionIntoState = ({ item, state }) => {
  /* alter the state */

  console.warn('adding action to cache', item.msg_id);

  if ( item.msg_id ) {
    state[item.msg_id] = item;
  }
};

const reducer = ( state = {}, { type, payload }) => {

  switch ( type ) {
    // case 'ROUTE_CHANGE': {
    //   if ( !isString( payload.msg_id, { ofMinLength: 1 }))
    //     return state;

    //   injectActionIntoState({ item: { ...payload }, state });

    //   return state;
    // }

    case 'CACHE_ACTIONS': {

      if ( !isArray( payload.actions, { ofMinLength: 1 }))
        return state;

      /* Loop through all of the layouts and store them in their corresponding layout groups. */
      return payload.actions.reduce(( newState, item ) => {
        // console.log( newState );
        try {
          if ( isString( item.msg_id )) {
            injectActionIntoState({ item, state: newState });
          }
          else {
            return state;
          }
        }
        catch ( error ) {
          // eslint-disable-next-line no-console
          console.warn( 'Unable to add cached action to reducer state', error, item.code, item );
        }

        return newState;
      }, { ...state });
    }

    case 'USER_LOGOUT':
      return {};

    default:
      return state;
  }
};

export default reducer;