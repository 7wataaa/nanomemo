import React, { useState } from 'react';
import Header from '../components/Header';
import MemoCard from '../components/MemoCard';
import { Add } from '@material-ui/icons';
import { Fab, makeStyles } from '@material-ui/core';
import firebase from 'firebase/app';

const useHomePageStyles = makeStyles((theme) => ({
  offset: {
    ...theme.mixins.toolbar,
    //flexGrow: 1,
  },
  fab: {
    margin: '0px',
    top: 'auto',
    right: '50px',
    bottom: '25px',
    left: 'auto',
    position: 'fixed',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

function HomePage(): JSX.Element {
  const [, setUser] = useState<null | firebase.User>(null);

  const classes = useHomePageStyles();

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    }
  });

  return (
    <>
      {firebase.auth().currentUser != null ? (
        <Header user={firebase.auth().currentUser} />
      ) : (
        <Header user={null} />
      )}

      <div className={classes.offset} />

      <Body />

      <Fab className={classes.fab} variant="extended">
        <Add className={classes.extendedIcon} /> New Memo
      </Fab>
    </>
  );
}

interface MemoCardProps {
  id: string;
  title: string;
  tags: string[];
  content: string;
}

function Body() {
  const memoinfoMock = [
    {
      id: '0',
      title: 'Title',
      tags: ['#tag1', '#tag2'],
      content: `
      content1,content1,content1,content1,content1,content1,content1,content1,content1,content1,
      content1,content1,content1,content1,content1,
      content1,content1,content1,content1,content1,
      content1,content1,content1,content1,content1,
      content1,content1,content1,content1,content1,
      content1,content1,content1,content1,content1,
      content1,content1,content1,content1,content1,
      content1,content1,content1,content1,content1,
      `,
    } as MemoCardProps,
    {
      id: '1',
      title: 'displayName',
      tags: ['#tag1', '#tag2'],
      content: `${firebase.auth().currentUser?.displayName}`,
    } as MemoCardProps,
    {
      id: '2',
      title: 'email',
      tags: ['#tag1', '#tag2'],
      content: `${firebase.auth().currentUser?.email}`,
    } as MemoCardProps,
    {
      id: '3',
      title: 'uid',
      tags: ['#tag1', '#tag2'],
      content: `${firebase.auth().currentUser?.uid}`,
    } as MemoCardProps,
    {
      id: '4',
      title: 'photoURL',
      tags: ['#tag1', '#tag2'],
      content: `${firebase.auth().currentUser?.photoURL}`,
    } as MemoCardProps,
    {
      id: '5',
      title: 'Title',
      tags: ['#tag1', '#tag2'],
      content: 'content6',
    } as MemoCardProps,
    {
      id: '6',
      title: 'Title',
      tags: ['#tag1', '#tag2'],
      content: 'content7',
    } as MemoCardProps,
  ];

  return <Memos memoinfos={memoinfoMock} />;
}

const useMemoStyle = makeStyles(() => ({
  gridContainer: {
    margin: '40px',
    display: 'grid',
    gridGap: '20px',
    gridAutoRows: '251px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(239px, 0.3fr))',
    justifyContent: 'center',
  },
}));

/**
 * @param {MemoCardProps} memoinfo このリストに入ってる情報でMemoCardたちを作る
 */
function Memos(props: { memoinfos: MemoCardProps[] }) {
  const classes = useMemoStyle();

  const cards = props.memoinfos.map((e) => {
    return (
      <MemoCard key={e.id} title={e.title} tags={e.tags} content={e.content} />
    );
  });

  return <div className={classes.gridContainer}>{cards}</div>;
}

export default HomePage;
