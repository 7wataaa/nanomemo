import React, { useState } from 'react';
import {
  makeStyles,
  Card,
  Typography,
  CardContent,
  Modal,
} from '@material-ui/core';

const useMemoCardStyle = makeStyles((theme) => ({
  card: {
    width: '100%',
    height: '100%',
  },
  tagnames: {
    fontSize: 14,
  },
  title: {
    marginBottom: 12,
  },
  memocontent: {
    width: '100%',
    height: '100%',
    overflowWrap: 'break-word',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  memoModal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1ch',
  },
  paper: {
    width: '80%',
    height: '80%',
    backgroundColor: theme.palette.background.paper,
    //border: '2px solid #000',
    boxShadow: theme.shadows[9],
    padding: '2ch',
  },
}));

interface MemoCardProps {
  title: string;
  tags: string[];
  content: string;
}

/**
 * @param {MemoCardProps} props
 * 
 * interface MemoCardProps {
  title: string,
  tags: string[],
  content: string,
}
 */
const MemoCard = (props: MemoCardProps): JSX.Element => {
  const classes = useMemoCardStyle();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div onClick={handleOpen}>
        <Card className={classes.card} variant="outlined">
          <CardContent>
            <Typography
              className={classes.tagnames}
              color="textSecondary"
              gutterBottom
            >
              {props.tags.join(' ')}
            </Typography>
            <Typography className={classes.title} variant="h5" component="h2">
              {props.title}
            </Typography>
            <Typography
              className={classes.memocontent}
              variant="body2"
              component="p"
            >
              {props.content}
            </Typography>
          </CardContent>
        </Card>
      </div>
      <Modal
        className={classes.memoModal}
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Card className={classes.paper}>
          <h4>{props.tags}</h4>
          <h2>{props.title}</h2>
          <h3>{props.content}</h3>
        </Card>
      </Modal>
    </>
  );
};

export default MemoCard;
