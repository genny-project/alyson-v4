import React, { useState } from 'react'

import { pathOr } from 'ramda'
import DateFnsAdapter from '@date-io/date-fns'
import { Row, Col } from '../../../../components/layouts'
import {
  Card,
  CardHeader,
  Collapse,
  CardContent,
  CardActions,
  Typography,
  Button,
  Avatar,
  Popper,
  ButtonGroup,
  InputBase,
} from '@material-ui/core'

import useStyles from './styles'

import MoreIcon from '@material-ui/icons/MoreVert'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import ClearIcon from '@material-ui/icons/Clear'
import VisibilityIcon from '@material-ui/icons/Visibility'

const Note = ({
  content,
  sourceCode,
  id,
  tags,
  created,
  removeNotes,
  baseEntities,
  targetCode,
  attributes,
  editNote,
}) => {
  const [hover, setHover] = useState(false)
  const [editing, setEditing] = useState(false)
  const [newContent, setNewContent] = useState(content)

  const dateFns = new DateFnsAdapter()
  const parsedDate = new Date(created)

  const name = baseEntities[sourceCode].name
  const profileImage = pathOr('', [targetCode, 'PRI_IMAGE_URL', 'value'], attributes)

  const handleSubmit = () => editNote({ newContent, id })
  const classes = useStyles({ hover })

  return (
    <div onMouseEnter={event => setHover(event.currentTarget)} onMouseLeave={() => setHover(false)}>
      <Row justify="flex-start" className={classes.cardContainer}>
        <Avatar variant="rounded" src={profileImage} />
        <Col alignItems="flex-start" spacing={0}>
          <Row justify="flex-start">
            <Typography variant="subtitle2" color={hover ? 'primary' : 'textPrimary'}>
              {name}
            </Typography>
            <Typography
              variant="caption"
              color={hover ? 'primary' : 'textPrimary'}
            >{`${dateFns.format(parsedDate, 'p')}`}</Typography>
          </Row>
          {editing ? (
            <InputBase
              autoFocus
              value={newContent}
              onChange={event => setNewContent(event.target.value)}
              className={classes.input}
            />
          ) : (
            <Typography variant="body2">{content}</Typography>
          )}
        </Col>
        <Popper open={!!hover} anchorEl={hover} placement="top-end" className={classes.popper}>
          <Card className={classes.buttonGroup}>
            <ButtonGroup color="primary" size="small">
              <Button>
                {editing ? (
                  <ClearIcon fontSize="small" onClick={() => setEditing(false)} />
                ) : (
                  <EditIcon fontSize="small" onClick={() => setEditing(true)} />
                )}
              </Button>
              <Button>
                <MoreIcon fontSize="small" />
              </Button>
            </ButtonGroup>
          </Card>
        </Popper>
      </Row>
      <Row>
        {editing ? (
          <Button variant="outlined" color="primary" onClick={handleSubmit}>{`SUBMIT`}</Button>
        ) : (
          <div />
        )}
      </Row>
    </div>
  )
}

export default Note