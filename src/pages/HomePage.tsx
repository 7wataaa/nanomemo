import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import MemoCard, { MemoCardProps } from '../components/MemoCard';
import { Add } from '@material-ui/icons';
import { Fab, makeStyles, Typography } from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { Redirect } from 'react-router-dom';
import MemoCardSkeletons from '../components/MemoCardSkeletons';

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
  hintText: {
    color: '#757575',
    display: 'inline-block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  typography: {
    textSlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'table',
  },
}));

function HomePage(): JSX.Element {
  const classes = useHomePageStyles();

  const user = firebase.auth().currentUser;

  if (!user) {
    console.log('userが空なので/loginにリダイレクト');
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Header user={user} />

      <div className={classes.offset} />

      <Body user={user} />

      <Fab className={classes.fab} variant="extended" color="secondary">
        <Add className={classes.extendedIcon} /> メモを作成
      </Fab>
    </>
  );
}

function Body(prop: { user: firebase.User }) {
  const classes = useHomePageStyles();

  const [memoData, setMemoData] = useState<Array<MemoCardProps> | null>(null);

  useEffect(() => {
    let unmounted = false;

    (async () => {
      const result: MemoCardProps[] = [];

      /*const wait = (sec: number) => {
        return new Promise((resolve, reject) => {
          setTimeout(resolve, sec * 1000);
        });
      };

      await wait(7);*/

      (
        await firebase
          .firestore()
          .collection('files')
          .doc(`${prop.user.uid}`)
          .collection('userFiles')
          .get()
      ).forEach((docsnapshot) => {
        result.push({
          title: docsnapshot.get('title'),
          content: docsnapshot.get('content'),
          tags: docsnapshot.get('tags'),
          id: docsnapshot.id,
        });
      });

      if (!unmounted) {
        console.log('setMemoDataが呼ばれた');
        setMemoData(result);
      }
    })();

    console.log('homePageのuseEffectが動いてるらしい');

    return () => {
      unmounted = true;
    };
  }, []);

  if (memoData?.length == 0 ?? false) {
    return (
      <Typography className={classes.typography} component="div">
        <h2 className={classes.hintText}>右下のボタンからメモを作成できます</h2>
      </Typography>
    );
  }

  return <Memos memoData={memoData != null ? memoData : 'skeleton'} />;
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
 * @param {MemoCardProps} memoData このリストに入ってる情報でMemoCardたちを作る
 */
function Memos(props: { memoData: MemoCardProps[] | 'skeleton' }) {
  const classes = useMemoStyle();

  if (props.memoData === 'skeleton') {
    //TODO displayCountを更新できるようにする
    return <MemoCardSkeletons displayCount={5} />;
  }

  const cards = props.memoData.map((e) => {
    return (
      <MemoCard
        key={e.id}
        id={e.id}
        title={e.title}
        tags={e.tags}
        content={e.content}
      />
    );
  });

  return <div className={classes.gridContainer}>{cards}</div>;
}

export default HomePage;
