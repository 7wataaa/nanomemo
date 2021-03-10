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
  Paper,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import {
  convertFromRaw,
  Editor,
  EditorState,
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
    minHeight: '200px',
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
`;

const StyledCardActions = styled(CardActions)`
  position: sticky;
  right: 0;
  bottom: 0;
  height: auto;
  margin-top: auto;
  display: flex;
  flex-direction: row-reverse;
`;

const StyledCardContent = styled(Typography)`
  width: 100%;
  height: 100%;
  overflow-wrap: break-word;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const StyledCardTitle = styled(Typography)`
  margin-bottom: 12px;
`;

const StyledEditCardContent = styled.div`
  width: 100%;

  overflow-wrap: break-word;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const StyledReactTagInput = styled(ReactTagInput)`
  margin-bottom: 0px;
`;

const StyledDeleteDialogPaper = styled(Paper)`
  min-width: 500px;
`;

const StyledModal = styled(Modal)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1ch;
`;

const StyledEditCard = styled(Card)`
  width: 500px;
  min-height: 200px;
  background-color: ${(props) => props.theme.palette.background.paper};
  box-shadow: ${(props) => props.theme.shadows[9]};
  padding: 2ch;
  overflow: auto;
`;

const line = /\n|\r/g;

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

  const [editCardContentEditorState, setContentEditorState] = useState(
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

  const [editCardTitleEditorState, setTitleEditorState] = useState(
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

  const onContentChanged = async (newEditorState: EditorState) => {
    console.log('honbun');
    const beforeText = editCardContentEditorState
      .getCurrentContent()
      .getPlainText();

    const afterText = newEditorState.getCurrentContent().getPlainText();

    if (beforeText !== afterText) {
      contentChangeTime++;

      const currentChangeTimes = contentChangeTime;

      (async (thisTimeChangeTimes) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (thisTimeChangeTimes !== contentChangeTime) {
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

        console.log(`honnbun送信内容 = ${afterText}`);

        setUploadingState(false);
      })(currentChangeTimes);
    }
    setContentEditorState(newEditorState);
  };

  const onTitleChange = async (newTitleEditorState: EditorState) => {
    console.log('title');

    const beforeTitle = editCardTitleEditorState
      .getCurrentContent()
      .getPlainText()
      .replace(line, ' ');

    const afterTitle = newTitleEditorState
      .getCurrentContent()
      .getPlainText()
      .replace(line, ' ');

    if (afterTitle !== beforeTitle) {
      titleChangeTime++;

      const currentChangeTimes = titleChangeTime;

      (async (thisTimeChangeTimes: number) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (thisTimeChangeTimes !== titleChangeTime) {
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

    if (line.test(newTitleEditorState.getCurrentContent().getPlainText())) {
      setTitleEditorState(
        EditorState.moveFocusToEnd(
          EditorState.createWithContent(
            convertFromRaw({
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
            })
          )
        )
      );
      return;
    }

    setTitleEditorState(newTitleEditorState);
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

      if (currentChangeTime !== tagsChangeTime) {
        return;
      }

      console.log('新規tag内容 = ' + inputTags);
      updateDocTags(inputTags);
    })();
  }

  return (
    <>
      <StyledMemoCard variant="elevation" onClick={handleEditCardOpen}>
        <CardContent>
          <StyledCardTitle color="textSecondary">
            {tags.map((e) => '#' + e).join(' ') || null}
          </StyledCardTitle>
          <Typography className={classes.title} variant="h5" component="h2">
            {title}
          </Typography>
          <StyledCardContent variant="body2">{content}</StyledCardContent>
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

      {/* 削除ダイアログ */}
      <Dialog
        PaperComponent={StyledDeleteDialogPaper}
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>{`"${props.title}"を削除しますか?`}</DialogTitle>
        <DialogContent>この動作はやり直す事ができません</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>キャンセル</Button>
          <Button onClick={deleteDoc}>削除</Button>
        </DialogActions>
      </Dialog>

      {/* 編集カード */}
      <StyledModal open={editCardOpen} onClose={handleEditCardClose}>
        <>
          {uploadingState ? <LinearProgress /> : null}
          <StyledEditCard
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
                editorState={editCardTitleEditorState}
                onChange={onTitleChange}
                placeholder="タイトルなし"
                keyBindingFn={(e) =>
                  e.key === 'Enter' ? 'disabled' : getDefaultKeyBinding(e)
                }
              />
            </div>
            <StyledEditCardContent>
              <Editor
                editorState={editCardContentEditorState}
                onChange={onContentChanged}
                placeholder="本文なし"
              />
            </StyledEditCardContent>
          </StyledEditCard>
        </>
      </StyledModal>
    </>
  );
}
