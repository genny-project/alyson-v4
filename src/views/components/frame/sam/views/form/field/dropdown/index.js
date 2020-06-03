import React, { useState } from 'react';
import { map, path, pick, values, prop, sortBy, find, propEq, head, compose } from 'ramda';
import { FormControl, InputLabel, MenuItem, Select, Chip, Typography } from '@material-ui/core';

import useStyles from './styles';

const DropdownSelect = ({
  fieldData,
  initialValue,
  label,
  validationList,
  baseEntities,
  multiple,
  onUpdate,
}) => {
  const optionsGrpName = compose(
    head,
    prop( 'selectionBaseEntityGroupList' ),
    head
  )( validationList );

  const optionsLinkList = path( [optionsGrpName, 'links'], baseEntities ) || [];
  const targetCodes = map( path( ['link', 'targetCode'] ), optionsLinkList ) || [];
  const options = sortBy( prop( 'name' ))( values( pick( values( targetCodes ), baseEntities ))) || [];

  const {
    attributeCode,
    question: { code: questionCode },
    sourceCode,
    targetCode,
    weight,
  } = fieldData;

  const handleUpdate = value =>
    onUpdate({
      ask: {
        attributeCode,
        questionCode,
        sourceCode,
        targetCode,
        weight,
      },
      value,
    });

  const findOption = code => find( propEq( 'code', code ))( options );
  const [value, setValue] = useState( initialValue || multiple ? [] : '' );
  const classes = useStyles();

  const handleChange = ({ target: { value } }) => {
    setValue( value );
    handleUpdate( multiple ? value : [value] );
  };

  return (
    <FormControl
      variant="outlined"
      className={classes.select}
    >
      <InputLabel>
        {label}
      </InputLabel>
      <Select
        label={label}
        multiple={multiple}
        value={value}
        onChange={handleChange}
        renderValue={selected =>
          multiple ? (
            <div className={classes.chips}>
              {map(
                code => (
                  <Chip
                    key={code}
                    label={prop( 'name', findOption( code ) || {})}
                    className={classes.chip}
                  />
                ),
                selected
              )}
            </div>
          ) : (
            <Typography>
              {prop( 'name', findOption( selected ) || {})}
            </Typography>
          )
        }
      >
        {map(
          ({ code, name }) => (
            <MenuItem
              value={code}
              key={`menuItem${code}`}
            >
              {name}
            </MenuItem>
          ),
          options || []
        )}
      </Select>
    </FormControl>
  );
};

export default DropdownSelect;