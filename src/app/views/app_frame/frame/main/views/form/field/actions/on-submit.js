import Bridge from '../../../../../../../../../utils/vertx/Bridge'
import debounce from 'lodash.debounce'

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms || 8000))
}
const onSubmit = ({ parentCode, rootCode, setLoading, setViewing }) => async ({ ask, value }) => {
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

  setLoading('Saving...')

  await sleep()
  // Please backend send me the data automatically

  setLoading('Nearly done')

  setViewing({
    code: `QUE_PRI_EVENT_VIEW_${targetCode}`,
    parentCode: `QUE_${targetCode}_GRP`,
    rootCode: 'QUE_TABLE_RESULTS_GRP',
    targetCode,
  })
}

const debouncedOnSubmit = debounce(onSubmit, 400)

export default debouncedOnSubmit