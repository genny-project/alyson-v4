import React, { useEffect, useState } from 'react'
import { map, pathOr } from 'ramda'
import { connect } from 'react-redux'

import {
  Button,
  InputBase,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardActions,
  Typography,
  CardHeader,
  LinearProgress,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'

import Note from './note'

import { Col, Row } from '../../../components/layouts'

import useStyles from './styles'

import { getAll, postNote, deleteNote, editNote } from './helpers/notes-api'

const Notes = ({ baseEntities, attributes, accessToken, setApiLoading }) => {
  const [notes, setNotes] = useState({})
  const [noteContent, setNoteContent] = useState('')
  const [noteHeader, setNoteHeader] = useState('')
  const [error, setError] = useState(false)

  console.error('status', error)

  const classes = useStyles()

  const handleError = () => {
    console.error('invoked')
    setError(true)
  }

  const handleSubmit = () => {
    setNoteHeader('')
    setNoteContent('')
    postNote({ noteContent, noteHeader, setNotes, accessToken, setApiLoading })
  }

  const removeNotes = id => {
    return deleteNote({ id, accessToken, setNotes, setApiLoading })
    // setNotes(( notes ) => notes.filter(( note ) => note.id !== id ))
  }

  useEffect(
    () => {
      getAll({ setNotes, accessToken, setApiLoading, handleError })
    },
    [accessToken],
  )

  if (error) {
    return (
      <div>
        <p>Error tryin to fetch the notes!</p>
      </div>
    )
  }

  return (
    <Col top stretch className={classes.notesContainer}>
      {map(
        ({ id, ...rest }) => (
          <Note
            baseEntities={baseEntities}
            id={id}
            key={`note${id}`}
            {...rest}
            removeNotes={removeNotes}
            attributes={attributes}
            editNote={editNote}
            setNotes={setNotes}
            accessToken={accessToken}
            setApiLoading={setApiLoading}
          />
        ),
        [...notes] || [],
      )}
      <Card variant="outlined">
        <CardHeader
          title={
            <InputBase
              value={noteHeader}
              style={{ margin: 4 }}
              placeholder="Tags"
              fullWidth
              onChange={e => setNoteHeader(e.target.value)}
            />
          }
        />
        <CardContent>
          <InputBase
            autoFocus
            value={noteContent}
            multiline
            style={{ margin: 4 }}
            placeholder="Post a note"
            fullWidth
            onChange={e => setNoteContent(e.target.value)}
          />
        </CardContent>
        <CardActions disableSpacing>
          <Row justify="flex-end">
            <Button variant="contained" color="inherit" onClick={handleSubmit}>
              Done
            </Button>
          </Row>
        </CardActions>
      </Card>
    </Col>
  )
}

const mapStateToProps = state => ({
  accessToken: pathOr('', ['keycloak', 'accessToken'], state),
})

export default connect(mapStateToProps)(Notes)
