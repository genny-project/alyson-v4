import React, { useState } from 'react';
import { path, map, prop } from 'ramda';
import { Grid, Typography } from '@material-ui/core';

import onSubmit from './field/actions/on-submit';

import Field from './field';

import useStyles from './styles';

const Form = ({
  setViewing,
  setLoading,
  formView,
  attributes,
  baseEntities,
  links,
  googleApiKey,
}) => {
  const title = path(['question', 'name'], formView);
  const formFields = path(['childAsks'], formView);
  const defaultValues = path([prop('targetCode', formView)], attributes);

  const parentCode = prop('questionCode', formView);
  const rootCode = prop('questionCode', formView);

  const classes = useStyles();

  const [errors, setErrors] = useState({});
  const [pristine, setPristine] = useState(true);

  const meta = {
    errors,
    setErrors,
    pristine,
    setPristine,
    onSubmit: onSubmit({ parentCode, rootCode, setLoading, setViewing }),
  };

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="stretch"
      className={classes.formRoot}
      spacing={2}
    >
      <Grid item>
        <Typography color="textSecondary" variant="h5">
          {title}
        </Typography>
      </Grid>
      {map(field => (
        <Grid className={classes.formItem} item key={`gridItem${field.questionCode}`}>
          <Field
            key={field.questionCode}
            fieldData={field}
            baseEntities={baseEntities}
            links={links}
            meta={meta}
            googleApiKey={googleApiKey}
            defaultValues={defaultValues}
          />
        </Grid>
      ))(formFields)}
    </Grid>
  );
};

export default Form;
