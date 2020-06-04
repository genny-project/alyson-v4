import React from 'react';
import { map } from 'ramda';

import { Grid, Typography } from '@material-ui/core';
import useStyles from '../styles';

const RowItems = props => map(({ attributeName , value = ''  }) => {
  const classes = useStyles();

  return (
    <Grid item>
      <Grid
        container
        direction="row"
      >
        <Typography
          color="secondary"
          className={classes.label}
        >
          {attributeName}
        </Typography>
        <Typography>
          {value}
        </Typography>
      </Grid>
    </Grid>

  );
}, props.children );

export default RowItems;
