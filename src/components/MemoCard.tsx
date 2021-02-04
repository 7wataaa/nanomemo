import React, { useState } from 'react';
import {
  makeStyles,
  Card,
  Typography,
  CardContent,
  Modal,
  CardActionArea,
} from '@material-ui/core';
import EditMemoCard from './EditMemoCard';

const useMemoCardStyle = makeStyles(() => ({
  card: {
    width: '100%',
    height: '100%',
  },
  aria: {
    display: 'flex',
    alignItems: 'start',
    justifyContent: 'start',
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
}));

export interface MemoCardProps {
  id: string;
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
          <CardActionArea className={classes.aria}>
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
          </CardActionArea>
        </Card>
      </div>
      <Modal
        className={classes.memoModal}
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <EditMemoCard memoData={props} />
      </Modal>
    </>
  );
};

export default MemoCard;
