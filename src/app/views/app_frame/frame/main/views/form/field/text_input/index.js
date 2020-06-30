import React, { useState, useEffect } from 'react'
import { TextField } from '@material-ui/core'

import makeHandleUpdate from '../../helpers/make-handle-update'

const TextInput = ({
  errors,
  setErrors,
  onUpdate,
  fieldData,
  label,
  initialValue,
  pristine,
  setPristine,
  fieldType,
  inputType,
  ...rest
}) => {
  const [value, setValue] = useState(initialValue || '')
  const [touched, setTouched] = useState(false)

  const {
    question: { code: questionCode },
    mandatory,
  } = fieldData

  const handleUpdate = makeHandleUpdate(onUpdate)(fieldData, setErrors)

  const handleChange = ({ target: { value } }) => {
    setValue(value)
    if (!touched) setTouched(true)
  }

  return (
    <TextField
      {...rest}
      error={touched && errors[questionCode]}
      value={value}
      onChange={handleChange}
      onBlur={() => handleUpdate(value)}
      label={label}
      required={mandatory}
      type={'text'}
      test-id={questionCode}
    />
  )
}

export default TextInput
