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

export default function MemoCardSkeletons(prop: {
  displayCount: number;
}): JSX.Element {
  const classes = useStyle();

  const list: JSX.Element[] = [];

  for (let i = 0; i < prop.displayCount; i++) {
    list.push(<Skeleton className={classes.card} variant="rect" key={i} />);
  }

  return (
    <>
      <div className={classes.gridContainer}>{list}</div>
    </>
  );
}
