import {
  path,
  compose,
  pickBy,
  prop,
  map,
  includes,
  values,
  sortBy,
  head,
  keys,
  replace,
  not,
  isEmpty,
  mergeAll,
} from 'ramda'

const removeCOL_ = replace('COL_', '')

const getTitle = path(['metaData', 'SCH_TITLE', 'value'])

const getActions = compose(
  map(action => ({
    ...action,
    attributeCode: replace('COL_', 'QUE_', prop('attributeCode', action)),
  })),
  values,
  pickBy((val, key) => includes('_EVENT_', key)),
  prop('metaData'),
)

const getColumns = compose(
  map(col => ({
    ...col,
    title: prop('attributeName', col),
    field: removeCOL_(prop('attributeCode', col)),
    cellStyle: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '20rem',
    },
  })),
  sortBy(prop('weight')),
  values,
  pickBy((val, key) => includes('COL_', key || '') && !includes('_EVENT_', key || '')),
  prop('metaData'),
)

const getData = compose(
  map(
    compose(
      mergeAll,
      map(({ attributeCode, value, baseEntityCode }) => ({
        [attributeCode]: value,
        targetCode: baseEntityCode,
      })),
      head,
      values,
      pickBy((val, key) => key !== 'tableData'),
    ),
  ),
  prop('data'),
)

const getTable = currentSearch =>
  not(isEmpty(currentSearch))
    ? {
        searchCode: head(keys(currentSearch)),
        ...prop(head(keys(currentSearch)), currentSearch),
      }
    : {
        data: 'initializing',
        metaData: {
          PRI_TOTAL_RESULTS: {},
          SCH_PAGE_SIZE: {},
          SCH_PAGE_START: {},
          SCH_TITLE: { value: 'Loading...' },
        },
      }

const icons = {
  View: 'info',
  Apply: 'edit',
  Journal: 'book',
}
const getIcon = name => prop(name, icons)

const makeActionData = ({ attributeCode, targetCode }) => ({
  rootCode: 'QUE_TABLE_RESULTS_GRP',
  code: `${attributeCode}_${targetCode}`,
  parentCode: `QUE_${targetCode}_GRP`,
  targetCode,
})
export { getTitle, getColumns, getData, getTable, getActions, getIcon, makeActionData }
