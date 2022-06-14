import {
  Card,
  Fab,
  LinearProgress,
  makeStyles,
  Modal,
  TextField,
  Typography,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import {
  ContentState,
  Editor,
  EditorState,
  getDefaultKeyBinding,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import styled from 'styled-components';
import Header from '../components/Header';
import MemoCard, {
  MemoCardProps,
  StyledTagInputForm,
} from '../components/MemoCard';
import MemoCardSkeletons from '../components/MemoCardSkeletons';
import '../index';

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
  editCardTagnames: {
    color: theme.palette.text.secondary,
    fontSize: 14,
    marginBottom: 15,
  },
}));

function HomePage(): JSX.Element {
  const classes = useHomePageStyles();

  const [creatingState] = useState(false);

  const [contentEditorState, setContentEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const handleContentOnChange = (e: EditorState) => {
    setContentEditorState(e);
  };

  const [titleEditorState, setTitleEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const user = firebase.auth().currentUser;

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const onTitleChange = (newTitleEditorState: EditorState) => {
    let beforeTitle = '';
    for (const b of titleEditorState.getCurrentContent().getBlocksAsArray()) {
      beforeTitle = (beforeTitle + '\n' + b.getText()).trim();
    }

    let afterTitle = '';
    for (const b of newTitleEditorState
      .getCurrentContent()
      .getBlocksAsArray()) {
      afterTitle = (afterTitle + '\n' + b.getText()).trim();
    }

    const lines = afterTitle.match(/\r|\n/g)?.length;

    afterTitle = afterTitle.replace(/\n|\r/g, ' ');

    console.log(`lines = ${lines}`);

    let fixedNewTitleEditorState: EditorState;

    if (!lines) {
      fixedNewTitleEditorState = newTitleEditorState;
    } else {
      fixedNewTitleEditorState = EditorState.moveFocusToEnd(
        EditorState.push(
          newTitleEditorState,
          ContentState.createFromText(afterTitle),
          'change-block-data'
        )
      );
    }

    setTitleEditorState(fixedNewTitleEditorState);
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

    if (contentStr.length === 0) {
      console.log('本文がないので作成しない');

      setOpen(false);

      return;
    }

    if (titleStr.length === 0) {
      //contentStrの1行目か1行目のの9文字目までをいれる

      titleStr = contentStr.split(/\r|\n/)[0].substr(0, 20).trim();
    }

    if (!user) {
      throw Error();
    }

    await firebase
      .firestore()
      .collection('files')
      .doc(user.uid)
      .collection('userFiles')
      .add({
        title: titleStr,
        content: contentStr,
        tags: createTags,
        lastEditTime: new Date(),
      });

    console.log(
      `作成内容 = {titleStr: ${titleStr}, contentStr: ${contentStr}}`
    );

    setOpen(false);

    setTitleEditorState(EditorState.createEmpty());
    setContentEditorState(EditorState.createEmpty());
    setCreateTags([]);
  };

  const [createTags, setCreateTags] = useState<string[]>([]);

  const [searchStr, setSearchStr] = useState('');

  if (!user) {
    console.log('userが空');
    throw Error();
  }

  return (
    <>
      <Header user={user} strFunc={setSearchStr} />

      <div className={classes.offset} />

      <Body user={user} searchStr={searchStr} />

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
              <div className={classes.editCardTagnames}>
                {/* <ReactTagInput
                  tags={createTags}
                  onChange={(e) => setCreateTags(e)}
                  placeholder="input & enter"
                  removeOnBackspace={true}
                  editable={true}
                  validator={(value) =>
                    !createTags.includes(value) && value.trim() !== ''
                  }
                /> */}
                <StyledTagInputForm
                  freeSolo
                  multiple
                  size="small"
                  renderInput={(params) => {
                    return <TextField {...params} variant="outlined" />;
                  }}
                  value={createTags}
                  onChange={(_, value) => setCreateTags(value as string[])}
                  options={[]}
                />
              </div>
              <div className={classes.createCardTitle}>
                <Editor
                  keyBindingFn={(e) =>
                    e.key === 'Enter' ? 'disabled' : getDefaultKeyBinding(e)
                  }
                  placeholder="タイトルは自動で入力されます"
                  editorState={titleEditorState}
                  onChange={onTitleChange}
                />
              </div>
              <div className={classes.createCardContent}>
                <ContentEditor
                  placeholder="本文は自動で入力されません"
                  editorState={contentEditorState}
                  onChange={handleContentOnChange}
                />
              </div>
            </Card>
          </div>
        </Modal>
      </div>
    </>
  );
}

const ContentEditor = (props: {
  editorState: EditorState;
  onChange: (e: EditorState) => void;
  placeholder: string;
}): JSX.Element => {
  const editorRef = useRef<Editor>(null);

  useEffect(() => {
    editorRef.current?.focus();
  }, []);

  return (
    <Editor
      editorState={props.editorState}
      onChange={props.onChange}
      placeholder={props.placeholder}
      ref={editorRef}
    />
  );
};

const StyledErrorText = styled.div`
  color: red;
  display: inline-block;
  margin-left: auto;
  margin-right: auto;
`;

function Body(prop: { user: firebase.User; searchStr: string }) {
  const classes = useHomePageStyles();

  console.log('bodyレンダリング');

  console.log(`searchStr = ${prop.searchStr}`);

  const [value, loading, error] = useCollectionData<MemoCardProps>(
    firebase
      .firestore()
      .collection('files')
      .doc(prop.user.uid)
      .collection('userFiles'),
    { idField: 'id' }
  );

  if (loading) {
    return <Memos memoData={'skeleton'} searchStr="" />;
  }

  if (error) {
    return (
      <Typography className={classes.typography} component="div">
        <StyledErrorText>読み込み時にエラーが発生しました</StyledErrorText>
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

  return <Memos memoData={value} searchStr={prop.searchStr} />;
}

const StyledMemosDiv = styled.div`
  margin: 40px 40px 40px 40px;
  display: grid;
  grid-gap: 20px;
  grid-auto-rows: 251px;
  grid-template-columns: repeat(auto-fit, minmax(239px, 0.3fr));
  justify-content: center;
`;

/**
 * @param {MemoCardProps} memoData このリストに入ってる情報でMemoCardたちを作る
 */
function Memos(props: {
  memoData: MemoCardProps[] | 'skeleton';
  searchStr: string;
}) {
  if (props.memoData === 'skeleton') {
    //TODO displayCountを更新できるようにする
    return <MemoCardSkeletons displayCount={5} />;
  }

  const cards: JSX.Element[] = [];

  const searchRegExp = RegExp(props.searchStr.trim());

  if (props.searchStr === '') {
    cards.push(
      ...props.memoData.map((e) => {
        return (
          <MemoCard
            key={e.id}
            id={e.id}
            title={e.title}
            tags={e.tags}
            content={e.content}
          />
        );
      })
    );
  } else if (props.searchStr.trim()) {
    cards.push(
      ...props.memoData
        .filter((e) => {
          for (const tag of e.tags) {
            if (searchRegExp.test('#' + tag)) {
              return true;
            }
          }

          return false;
        })
        .map((e) => (
          <MemoCard
            key={e.id}
            id={e.id}
            title={e.title}
            tags={e.tags}
            content={e.content}
          />
        ))
    );
  }

  return (
    <>
      <StyledMemosDiv>{cards}</StyledMemosDiv>
    </>
  );
}

export default HomePage;
