import React from 'react';
import { path, toLower, includes, has, not } from 'ramda';
import onUpdate from './actions/on-update';

import RadioGroup from './radio_group';
import PhoneNumberInput from './phone_number';
import DropdownSelect from './dropdown';
import SubmitButton from './submit_button';
import AddressSelect from './address_select';
import TextInput from './text_input';
import ImageUpload from './image_upload';
import RichTextEditor from './rich_text';
import DateTimePicker from './date_time_picker';

const Field = ({
  fieldData,
  baseEntities,
  links,
  meta: { onSubmit, errors, setErrors, pristine, setPristine },
  googleApiKey,
}) => {
  const label = path(['name'], fieldData);
  const dataType = path(['question', 'attribute', 'dataType'], fieldData);
  const fieldType = toLower(path(['typeName'], dataType));
  const validationList = path(['validationList'], dataType);

  const {
    question: { code: questionCode },
    mandatory,
  } = fieldData;

  if (mandatory && not(has(questionCode, errors))) setErrors({ ...errors, [questionCode]: true });

  if (fieldType === 'tag') console.log(fieldData);
  return fieldType === 'text' ||
    fieldType === 'email' ||
    fieldType === 'abn number' ||
    fieldType === 'java.lang.integer' ? (
    <TextInput
      fieldData={fieldData}
      label={label}
      variant="outlined"
      fullWidth
      onUpdate={onUpdate}
      errors={errors}
      setErrors={setErrors}
      pristine={pristine}
      setPristine={setPristine}
      fieldType={fieldType}
      inputType={
        fieldType === 'abn number' || fieldType === 'java.lang.Integer' ? 'number' : 'text'
      }
    />
  ) : fieldType === 'radio' ? (
    <RadioGroup
      fieldData={fieldData}
      label={label}
      dataType={dataType}
      validationList={validationList}
      baseEntities={baseEntities}
      links={links}
      onUpdate={onUpdate}
      errors={errors}
      setErrors={setErrors}
    />
  ) : fieldType === 'mobile' || fieldType === 'landline' ? (
    <PhoneNumberInput
      fieldData={fieldData}
      label={label}
      onUpdate={onUpdate}
      fieldType={fieldType}
      errors={errors}
      setErrors={setErrors}
    />
  ) : fieldType === 'dropdown' || fieldType === 'dropdownmultiple' || fieldType === 'tag' ? (
    <DropdownSelect
      fieldData={fieldData}
      baseEntities={baseEntities}
      validationList={validationList}
      label={label}
      multiple={includes('multiple', fieldType) || fieldType === 'tag'}
      onUpdate={onUpdate}
      errors={errors}
      setErrors={setErrors}
    />
  ) : fieldType === 'buttonevent' ? (
    <SubmitButton
      fieldData={fieldData}
      label={label}
      onSubmit={onSubmit}
      errors={errors}
      setErrors={setErrors}
      pristine={pristine}
    />
  ) : fieldType === 'address' ? (
    <AddressSelect
      onUpdate={onUpdate}
      fieldData={fieldData}
      googleApiKey={googleApiKey}
      setErrors={setErrors}
    />
  ) : fieldType === 'image' ? (
    <ImageUpload fieldData={fieldData} label={label} onUpdate={onUpdate} />
  ) : fieldType === 'htmlarea' ? (
    <RichTextEditor
      fieldData={fieldData}
      label={label}
      onSubmit={onSubmit}
      errors={errors}
      setErrors={setErrors}
      pristine={pristine}
    />
  ) : fieldType === 'java.time.localdate' ? (
    <DateTimePicker
      label={label}
      fieldData={fieldData}
      label={label}
      onSubmit={onSubmit}
      errors={errors}
      setErrors={setErrors}
      pristine={pristine}
    />
  ) : fieldType === 'time' ? (
    <DateTimePicker
      label={label}
      fieldData={fieldData}
      label={label}
      onSubmit={onSubmit}
      errors={errors}
      setErrors={setErrors}
      pristine={pristine}
      inputType={'time'}
    />
  ) : null;
};

export default Field;
