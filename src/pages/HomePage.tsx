import {
  Card,
  Fab,
  LinearProgress,
  makeStyles,
  Modal,
  Typography,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Editor, EditorState, getDefaultKeyBinding } from 'draft-js';
import 'draft-js/dist/Draft.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import React, { useMemo, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Header from '../components/Header';
import MemoCard, { MemoCardProps } from '../components/MemoCard';
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
  createCardPaper: {
    width: '500px',
    minHeight: '500px',
    height: 'auto',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[9],
    padding: '2ch',
  },
  createCardTitle: {
    fontSize: theme.typography.h5.fontSize,
    marginBottom: 12,
  },
  createCardContent: {
    width: '100%',
    height: '100%',
    overflowWrap: 'break-word',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  createModal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1ch',
  },
}));

function HomePage(): JSX.Element {
  const classes = useHomePageStyles();

  const [creatingState] = useState(false);

  const [contentEditorState, setcontentEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [titleEditorState, setTitleEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const user = firebase.auth().currentUser;

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    let contentStr = '';
    for (const str of contentEditorState
      .getCurrentContent()
      .getBlocksAsArray()) {
      contentStr = (contentStr + '\n' + str.getText()).trim();
    }

    let titleStr = '';
    for (const str of titleEditorState.getCurrentContent().getBlocksAsArray()) {
      titleStr = (titleStr + '\n' + str.getText()).trim();
    }

    if (user == null) {
      throw Error();
    }

    if (contentStr.length === 0) {
      console.log('本文がないので作成しない');

      setOpen(false);

      return;
    }

    await firebase
      .firestore()
      .collection('files')
      .doc(user.uid)
      .collection('userFiles')
      .add({
        title: titleStr,
        content: contentStr,
        tags: [],
      });

    console.log(
      `作成内容 = {titleStr: ${titleStr}, contentStr: ${contentStr}}`
    );

    setOpen(false);
  };

  if (!user) {
    console.log('userが空なので/loginにリダイレクト');
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Header user={user} />

      <div className={classes.offset} />

      <Body user={user} />

      <Fab
        className={classes.fab}
        variant="extended"
        color="secondary"
        onClick={handleOpen}
      >
        <Add className={classes.extendedIcon} /> メモを作成
      </Fab>
      <div tabIndex={-1}>
        <Modal
          className={classes.createModal}
          open={open}
          onClose={handleClose}
        >
          <div tabIndex={-1}>
            {creatingState ? <LinearProgress /> : null}
            <Card
              variant="elevation"
              className={classes.createCardPaper}
              tabIndex={-1}
            >
              {/* <div className={classes.editCardTagnames}>
              {tagsState.join(' ')}
            </div> */}
              <div className={classes.createCardTitle}>
                <Editor
                  keyBindingFn={(e) => {
                    if (e.key === 'Enter') {
                      console.log('titleで開業できません');

                      return 'tab';
                    }

                    return getDefaultKeyBinding(e);
                  }}
                  placeholder="タイトルは自動で入力されます"
                  editorState={titleEditorState}
                  onChange={setTitleEditorState}
                />
              </div>
              <div className={classes.createCardContent}>
                <Editor
                  placeholder="本文は自動で入力されません"
                  editorState={contentEditorState}
                  onChange={setcontentEditorState}
                />
              </div>
            </Card>
          </div>
        </Modal>
      </div>
    </>
  );
}

//let latedMemoData: MemoCardProps[] = [];

function Body(prop: { user: firebase.User }) {
  const classes = useHomePageStyles();

  const [memoData, setMemoData] = useState<Array<MemoCardProps> | null>(null);

  console.log('koko');

  /* useMemo(() => {
    console.log('usememo');
    firebase
      .firestore()
      .collection('files')
      .doc(prop.user.uid)
      .collection('userFiles')
      .onSnapshot((snapshot) => {
        let changeResult: MemoCardProps[] = [];

        for (const change of snapshot.docChanges()) {
          const doc = change.doc;

          const memo = {
            //kousinnnitijiwomotu
            id: doc.id,
            tags: doc.get('tags'),
            title: doc.get('title'),
            content: doc.get('content'),
          };
          console.log(memo);

          console.log(`change.type = "${change.type}"`);
          if (change.type === 'added') {
            //表示内容の追加

            const index = memoData?.map((e) => e.id).indexOf(doc.id) ?? -1;

            if (index !== -1) {
              console.log(
                'doc.id がmemoDataの' +
                  memoData?.map((e) => e.id).indexOf(doc.id) +
                  'に存在している'
              );
              continue;
            }

            changeResult.push(memo);
          } else if (change.type === 'modified') {
            //なぜかmemoDataが空になるのでlatedMemoDataを使う
            changeResult = latedMemoData.map((value) =>
              value.id === memo.id ? memo : value
            );
          } else if (change.type === 'removed') {
            if (memoData == null) {
              console.warn('memodata == null');
            }

            changeResult = latedMemoData.filter((memo) => memo.id !== doc.id);
          }
        }

        if (
          JSON.stringify(memoData) !== JSON.stringify(changeResult) &&
          changeResult.length !== 0
        ) {
          latedMemoData = changeResult;
          console.log(changeResult);
          console.log('are');
          setMemoData(changeResult);
          console.log('you');
          console.log(`1 memoData = ${memoData}`);

      });
  }, []); */
  // console.log(`2 memoData = ${memoData}`);

  /* if (memoData?.length == 1 ?? false) {
    return (
      <Typography className={classes.typography} component="div">
        <h3 className={classes.hintText}>右下のボタンからメモを作成できます</h3>
      </Typography>
    );
  }
  console.log(`3 memoData = ${memoData}`);

  return <Memos memoData={memoData != null ? memoData : 'skeleton'} />; */

  const [value, loading, error] = useCollectionData<MemoCardProps>(
    firebase
      .firestore()
      .collection('files')
      .doc(prop.user.uid)
      .collection('userFiles'),
    { idField: 'id' }
  );

  if (loading) {
    return <Memos memoData={'skeleton'} />;
  }

  if (error) {
    return (
      <Typography className={classes.typography} component="div">
        <h3 className={classes.hintText}>読み込み時にエラーが発生しました</h3>
      </Typography>
    );
  }

  if (value?.length === 0 || value == null) {
    return (
      <Typography className={classes.typography} component="div">
        <h3 className={classes.hintText}>右下のボタンからメモを作成できます</h3>
      </Typography>
    );
  }

  return <Memos memoData={value} />;
}

const useMemoStyle = makeStyles(() => ({
  gridContainer: {
    margin: '40px',
    display: 'grid',
    gridGap: '20px',
    gridAutoRows: '251px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(239px, 0.3fr))',
    justifyContent: 'bottom',
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
