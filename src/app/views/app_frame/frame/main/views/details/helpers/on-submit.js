import Bridge from '../../../../../../../../utils/vertx/Bridge'
import debounce from 'lodash.debounce'

const onSubmit = ({ redirect, parentCode, rootCode, setLoading, setViewing }) => async ({
  ask,
  value,
}) => {
  const { attributeCode, questionCode, sourceCode, targetCode } = ask

  Bridge.sendFormattedEvent({
    code: questionCode,
    parentCode,
    rootCode,
    targetCode,
    eventType: 'BTN_CLICK',
    messageType: 'BTN',
    value,
  })

  setViewing({
    view: 'BUCKET',
    code: `QUE_PRI_EVENT_VIEW_${targetCode}`,
    parentCode: `QUE_${targetCode}_GRP`,
    rootCode: 'QUE_TABLE_RESULTS_GRP',
    targetCode,
  })
}

export default onSubmit
