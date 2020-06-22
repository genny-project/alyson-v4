import { contains, prop, replace } from 'ramda'
import getBackendViewing from '../../helpers/get-backend-viewing'

const getView = ({ viewing: { parentCode = '', code = '' }, asks, frames }) =>
  contains('QUE_PRI_EVENT_APPLY_PER', code)
    ? 'APPLICATION'
    : contains('QUE_VIEW_AGREEMENT', code)
      ? 'AGREEMENT'
      : contains('BUCKET', code)
        ? 'BUCKET'
        : contains('CARD_RIGHT', parentCode)
          ? 'BUCKET'
          : contains('PROFILE', code) || contains('QUE_PRI_EVENT_VIEW', code)
            ? 'DETAIL'
            : getBackendViewing(frames) === 'UNITY'
              ? 'UNITY'
              : contains('DASHBOARD', code)
                ? 'DASHBOARD'
                : contains('MENU', code)
                  ? prop(replace('MENU', 'GRP', code), asks)
                  : contains('APPLY', code)
                    ? 'APPLICATION'
                    : contains('GRP', parentCode)
                      ? 'TABLE'
                      : 'DASHBOARD'

export default getView