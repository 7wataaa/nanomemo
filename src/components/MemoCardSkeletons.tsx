import { makeStyles } from '@material-ui/core';
import React from 'react';
import { Skeleton } from '@material-ui/lab';

const useStyle = makeStyles(() => ({
  gridContainer: {
    margin: '40px',
    display: 'grid',
    gridGap: '20px',
    gridAutoRows: '251px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(239px, 0.3fr))',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
  },
}));

export default function MemoCardSkeletons(): JSX.Element {
  const classes = useStyle();

  const skeleton = <Skeleton className={classes.card} variant="rect" />;

  const list: JSX.Element[] = [];

  for (let i = 0; i < 5; i++) {
    list.push(skeleton);
  }

  return (
    <>
      <div className={classes.gridContainer}>{list}</div>
    </>
  );
}
