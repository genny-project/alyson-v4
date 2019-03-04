import dlv from 'dlv';
import { isArray, isObject, isString  } from '../../index';

const filterThemes = ( themeCodes, allThemes, options = {}) => {
  const {
    panel,
    onlyInheritableThemes,
  } = options;

  let styling = {};

  if (
    !isArray( themeCodes ) ||
    !isObject( allThemes )
  )
    return {};

  themeCodes.forEach( theme => {
    if ( isString( panel ) && theme.panel !== panel ) return;

    const themeData = dlv( allThemes, `${theme.code}.data` );
    const themeIsInheritable = dlv( allThemes, `${theme.code}.isInheritable` );

    if ( onlyInheritableThemes && !themeIsInheritable ) return;

    if ( isObject( themeData )) {
      styling = {
        ...styling,
        ...themeData,
      };
    }
  });

  return styling;
};

export default filterThemes;
