import React from 'react';
import { makeStyles, Card, Typography, CardContent } from '@material-ui/core';

const useMemoCardStyle = makeStyles(() => ({
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

  return (
    <>
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
    </>
  );
};

export default MemoCard;
