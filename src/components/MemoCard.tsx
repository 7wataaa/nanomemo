import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  IconButton,
  LinearProgress,
  makeStyles,
  Modal,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import {
  convertFromRaw,
  DraftHandleValue,
  Editor,
  EditorState,
  ContentState,
  getDefaultKeyBinding,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import React, { useState } from 'react';
import styled from 'styled-components';
import { setTimeout } from 'timers';
import ReactTagInput from '@pathofdev/react-tag-input';
import '@pathofdev/react-tag-input/build/index.css';

const useMemoCardStyle = makeStyles((theme) => ({
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
  editCardPaper: {
    width: '500px',
    minHeight: '500px',
    height: 'auto',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[9],
    padding: '2ch',
  },
  editCardTagnames: {
    color: theme.palette.text.secondary,
    fontSize: 14,
    marginBottom: 15,
  },
  editCardTitle: {
    fontSize: theme.typography.h5.fontSize,
    marginBottom: 12,
  },
  editCardContent: {
    width: '100%',
    height: '100%',
    overflowWrap: 'break-word',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
}));

export interface MemoCardProps {
  id: string;
  title: string;
  tags: string[];
  content: string;
}

const StyledMemoCard = styled(Card)`
  width: 100%;
  height: 100%;
  display: grid;
  &:hover {
    background-color: #f4f4f4;
  }
`;

const StyledIconButton = styled(IconButton)`
  ${StyledMemoCard}:hover & {
    display: block;
  }
  display: none;
  margin-left: auto;
`;

const StyledCardActions = styled(CardActions)`
  height: auto;
  margin-top: auto;
`;

const StyledReactTagInput = styled(ReactTagInput)`
  margin-bottom: 15px;
`;

let contentChangeTime = 0;
let titleChangeTime = 0;
let tagsChangeTime = 0;

export default function MemoCard(props: MemoCardProps): JSX.Element {
  const { tags, title, content } = props;

  const classes = useMemoCardStyle();

  const [editCardOpen, setEditCardOpen] = useState(false);

  const handleEditCardOpen = () => {
    setEditCardOpen(true);
  };

  const handleEditCardClose = () => {
    setEditCardOpen(false);
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const [editorCardContentEditorState, setContentEditorState] = useState(
    EditorState.createWithContent(
      convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: props.id + 'c',
            text: content,
            type: 'unstyled',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
            data: {},
          },
        ],
      })
    )
  );

  const [editorCardTitleEditorState, setTitleEditorState] = useState(
    EditorState.createWithContent(
      convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: props.id + 't',
            text: title,
            type: 'unstyled',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
            data: {},
          },
        ],
      })
    )
  );

  const [uploadingState, setUploadingState] = useState<boolean>(false);

  const onContentChanged = async (newtEditorState: EditorState) => {
    let beforeText = '';
    for (const b of editorCardContentEditorState
      .getCurrentContent()
      .getBlocksAsArray()) {
      beforeText = (beforeText + '\n' + b.getText()).trim();
    }

    let afterText = '';
    for (const b of newtEditorState.getCurrentContent().getBlocksAsArray()) {
      afterText = (afterText + '\n' + b.getText()).trim();
    }

    if (beforeText != afterText) {
      contentChangeTime++;

      const currentChangeTimes = contentChangeTime;

      (async (thisTimeChangeTimes) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (thisTimeChangeTimes != contentChangeTime) {
          return;
        }

        setUploadingState(true);

        await firebase
          .firestore()
          .collection('files')
          .doc(firebase.auth().currentUser?.uid)
          .collection('userFiles')
          .doc(props.id)
          .set(
            { content: afterText, lastEditTime: new Date() },
            { merge: true }
          );

        console.log(`送信内容 = ${afterText}`);

        setUploadingState(false);
      })(currentChangeTimes);
    }
    setContentEditorState(newtEditorState);
  };

  const onTitleChange = async (newTitleEditorState: EditorState) => {
    const regExp = /\n|\r/g;

    let beforeTitle = '';
    for (const b of editorCardTitleEditorState
      .getCurrentContent()
      .getBlocksAsArray()) {
      beforeTitle = (beforeTitle + '\n' + b.getText()).trimLeft();
    }

    beforeTitle = beforeTitle.replace(regExp, ' ');

    let afterTitle = '';
    for (const b of newTitleEditorState
      .getCurrentContent()
      .getBlocksAsArray()) {
      afterTitle = (afterTitle + '\n' + b.getText()).trimLeft();
    }

    //afterTitle = afterTitle.replace('\n', ' ');
    const lines = afterTitle.match(regExp)?.length;
    console.log('lines = ' + lines);

    afterTitle = afterTitle.replace(regExp, ' ');

    const editerstate = EditorState.push(
      newTitleEditorState,
      ContentState.createFromText(afterTitle),
      'change-block-data'
    );

    let fixedNewTitleEditorState: EditorState;

    if (!lines) {
      fixedNewTitleEditorState = newTitleEditorState;
    } else {
      fixedNewTitleEditorState = EditorState.moveFocusToEnd(editerstate);
    }

    /* convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: props.id + 't',
            text: afterTitle,
            type: 'unstyled',
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
            data: {},
          },
        ],
      }) */

    if (afterTitle != beforeTitle) {
      titleChangeTime++;

      const currentChangeTimes = titleChangeTime;

      (async (thisTimeChangeTimes: number) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (thisTimeChangeTimes != titleChangeTime) {
          return;
        }

        setUploadingState(true);

        await firebase
          .firestore()
          .collection('files')
          .doc(firebase.auth().currentUser?.uid)
          .collection('userFiles')
          .doc(props.id)
          .set(
            { title: afterTitle, lastEditTime: new Date() },
            { merge: true }
          );

        console.log(`送信内容 = ${afterTitle}`);

        setUploadingState(false);
      })(currentChangeTimes);
    }
    setTitleEditorState(fixedNewTitleEditorState);
  };

  const deleteDoc = async () => {
    await firebase
      .firestore()
      .collection('files')
      .doc(firebase.auth().currentUser?.uid)
      .collection('userFiles')
      .doc(props.id)
      .delete();
  };

  const updateDocTags = async (newTags: string[]) => {
    await firebase
      .firestore()
      .collection('files')
      .doc(firebase.auth().currentUser?.uid)
      .collection('userFiles')
      .doc(props.id)
      .set({ tags: newTags } as { tags: string[] }, { merge: true });
  };

  const [inputTags, setInputTags] = useState(tags);

  if (JSON.stringify(tags) !== JSON.stringify(inputTags)) {
    tagsChangeTime++;

    const currentChangeTime = tagsChangeTime;

    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (currentChangeTime != tagsChangeTime) {
        return;
      }

      console.log('新規内容 = ' + inputTags);
      updateDocTags(inputTags);
    })();
  }

  return (
    <>
      <div onClick={handleEditCardOpen}>
        <StyledMemoCard variant="elevation">
          <CardContent>
            <Typography
              className={classes.tagnames}
              color="textSecondary"
              gutterBottom
            >
              {tags.map((e) => '#' + e).join(' ') || null}
            </Typography>
            <Typography className={classes.title} variant="h5" component="h2">
              {title}
            </Typography>
            <Typography
              className={classes.memocontent}
              variant="body2"
              component="p"
            >
              {content}
            </Typography>
          </CardContent>
          <StyledCardActions>
            <StyledIconButton
              onClick={async (e) => {
                e.stopPropagation();

                handleDeleteDialogOpen();
              }}
            >
              <Delete />
            </StyledIconButton>
          </StyledCardActions>
        </StyledMemoCard>
      </div>

      {/* 削除ダイアログ */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>{`"${props.title}"を削除しますか?`}</DialogTitle>
        <DialogContent>この動作はやり直す事ができません</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>キャンセル</Button>
          <Button onClick={deleteDoc}>削除</Button>
        </DialogActions>
      </Dialog>

      {/* 編集カード */}
      <Modal
        className={classes.memoModal}
        open={editCardOpen}
        onClose={handleEditCardClose}
      >
        <div tabIndex={-1}>
          {uploadingState ? <LinearProgress /> : null}
          <Card
            variant="elevation"
            className={classes.editCardPaper}
            tabIndex={-1}
          >
            <div className={classes.editCardTagnames}>
              <StyledReactTagInput
                tags={inputTags}
                onChange={(e) => setInputTags(e)}
                placeholder="input & enter"
                removeOnBackspace={true}
                editable={true}
                validator={(value) =>
                  !inputTags.includes(value) && value.trim() !== ''
                }
              />
            </div>
            <div className={classes.editCardTitle}>
              <Editor
                editorState={editorCardTitleEditorState}
                onChange={onTitleChange}
                placeholder="タイトルなし"
                keyBindingFn={(e) =>
                  e.key === 'Enter' ? 'disabled' : getDefaultKeyBinding(e)
                }
              />
            </div>
            <div className={classes.editCardContent}>
              <Editor
                editorState={editorCardContentEditorState}
                onChange={onContentChanged}
                placeholder="本文なし"
              />
            </div>
          </Card>
        </div>
      </Modal>
    </>
  );
}
