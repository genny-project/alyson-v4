/* eslint-disable react/jsx-key */
import React, { useEffect } from 'react';

import { Button,TextField, Grid, Card, CardActionArea, CardContent, CardActions, Typography, CardHeader } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import clsx from 'clsx';

import useStyles from './styles';

const generateId = () => {
  return `_${Math.random().toString( 30 ).substr( 1, 7 )}`;
};

const Notes = ({ baseEntities }) => {
  const [notes, setNotes] = React.useState( [] );
  const [noteContent, setNoteContent] = React.useState( '' );
  const [noteHeader, setNoteHeader] = React.useState( '' );
  const [showNotes, setShowNotes] = React.useState( false );

  const classes = useStyles();

  const handleSubmit = () => {
    setNotes(( notes ) => notes.concat({
      headerText: noteHeader,
      contentText: noteContent,
      id: generateId(),
    }));
    setNoteHeader( '' );
    setNoteContent( '' );
    setShowNotes( false );
  };

  const handleShowNotes = () => {
    setShowNotes( true );
  };

  const removeNotes = ( id ) => setNotes(( notes ) => notes.filter(( note ) => note.id !== id ));

  console.error( 'notes', notes );

  const dataValue = {
    id: 5123,
    content: 'This is the firstttt note!',
    created: '2020-06-22T06:03:24.210Z',
    sourceCode: 'PER_USER1',
    tags: [
      {
        name: 'phone',
        value: 1,
      },
      {
        name: 'intern',
        value: 3,
      },
    ],
    targetCode: 'PER_USER1',
  };

  useEffect( async () => {
    const response = await fetch( 'https://internmatch-cyrus.gada.io/v7/notes/datatable?length=20', {
      method: 'POST',
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({}), // body data type must match "Content-Type" header
    });

    console.error( 'response', response );
    const items = await response.json();
    const data = await items.data;

    data.map(({ content, created, id, sourceCode, targetCode }) => {
      const name = baseEntities[sourceCode].name;

      setNotes(( notes ) => notes.concat({
        headerText: name,
        contentText: content,
        createdDate: created,
        id: id,
      }));
    });
  }, [] );

  return (
    <Grid
      container
      className={classes.root}
    >
      <Grid
        xs={12}
        className={classes.buttonControl}
      >
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          onClick={handleShowNotes}
          startIcon={<AddIcon />}
          fullWidth
        >
          Take a note...
        </Button>
      </Grid>

      {showNotes && (
        <Grid
          xs={12}
          className={classes.control}
        >
          <Card
            className={classes.card}
            variant="outlined"
          >
            <CardHeader
              title={(
                <TextField
                  value={noteHeader}
                  multiline
                  style={{ margin: 4 }}
                  placeholder="Title"
                  fullWidth
                  onChange={( e ) => setNoteHeader( e.target.value )}
                />
        )}
            />
            <CardContent>

              <TextField
                value={noteContent}
                multiline
                style={{ margin: 4 }}
                placeholder="Take a note"
                fullWidth
                onChange={( e ) => setNoteContent( e.target.value )}
              />
            </CardContent>
            <CardActions disableSpacing>
              <Button
                variant="contained"
                color="inherit"
                className={clsx( classes.expand )}
                onClick={handleSubmit}
              >
                Done
              </Button>
            </CardActions>
          </Card>
        </Grid>

      )
    }
      <Grid
        xs={12}
        className={classes.control}
      >
        {notes.map(({ headerText, contentText, id, createdDate }) => (
          <Card
            className={classes.card}
            variant="outlined"
          >
            <CardActionArea>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                >
                  {headerText}
                </Typography>
              </CardContent>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="subtitle1"
                  component="h2"
                >
                  {contentText}
                </Typography>
              </CardContent>
              {createdDate && (
              <CardContent>
                <Typography
                  gutterBottom
                  variant="subtitle1"
                  component="h2"
                >
                  {createdDate}
                </Typography>
              </CardContent>
              )}
            </CardActionArea>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={() => removeNotes( id )}
              >
                <DeleteIcon />
              </Button>
            </CardActions>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
};

export default Notes;