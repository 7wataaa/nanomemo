import { Card, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { MemoCardProps } from './MemoCard';

const useStyle = makeStyles((theme) => ({
  paper: {
    width: '500px',
    height: '500px',
    backgroundColor: theme.palette.background.paper,
    //border: '2px solid #000',
    boxShadow: theme.shadows[9],
    padding: '2ch',
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
}));

export default function EditMemoCard(props: {
  memoData: MemoCardProps;
}): JSX.Element {
  const classes = useStyle();

  return (
    <div>
      <Card variant="elevation" className={classes.paper}>
        <Typography
          className={classes.tagnames}
          color="textSecondary"
          gutterBottom
        >
          {props.memoData.tags.join(' ')}
        </Typography>
        <Typography className={classes.title} variant="h5" component="h2">
          {props.memoData.title}
        </Typography>
        <Typography
          className={classes.memocontent}
          variant="body2"
          component="p"
        >
          {props.memoData.content}
        </Typography>
      </Card>
    </div>
  );
}
