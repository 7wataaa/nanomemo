import React, { useState } from 'react';
import {
  makeStyles,
  Card,
  Typography,
  CardContent,
  Modal,
  CardActionArea,
  LinearProgress,
} from '@material-ui/core';
import { convertFromRaw, Editor, EditorState } from 'draft-js';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { setTimeout } from 'timers';

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

let changeTimes = 0;

export default function MemoCard(props: MemoCardProps): JSX.Element {
  const classes = useMemoCardStyle();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    //TODO idのdocを読み込んで表示させる

    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const document = firebase
        .firestore()
        .collection('files')
        .doc(firebase.auth().currentUser?.uid)
        .collection('userFiles')
        .doc(props.id);

      const { title: newTitle, content: newContent, tags: newTags } = (
        await document.get()
      ).data() as { title: string; content: string; tags: string[] };

      setContentState(newContent);
      setTitleState(newTitle);
      setTagsState(newTags);

      console.log('内容の更新完了');
    })();

    console.log('koko');

    setOpen(false);
  };

  const [titleState, setTitleState] = useState(props.title);

  const [contentState, setContentState] = useState(props.content);

  const [tagsState, setTagsState] = useState(props.tags);

  const [editorCardContentEditorState, setcontentEditorState] = useState(
    EditorState.createWithContent(
      convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: props.id + 'c',
            text: contentState,
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

  const [editorCardTitleEditorState, settitleEditorState] = useState(
    EditorState.createWithContent(
      convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: props.id + 't',
            text: titleState,
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
      changeTimes++;

      const currentChangeTimes = changeTimes;

      (async (thisTimeChangeTimes) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (thisTimeChangeTimes != changeTimes) {
          return;
        }

        setUploadingState(true);

        await firebase
          .firestore()
          .collection('files')
          .doc(firebase.auth().currentUser?.uid)
          .collection('userFiles')
          .doc(props.id)
          .set({ content: afterText }, { merge: true });

        console.log(`送信内容 = ${afterText}`);

        setUploadingState(false);
      })(currentChangeTimes);
    }
    setcontentEditorState(newtEditorState);
  };

  return (
    <>
      <div onClick={handleOpen}>
        <GridMemoCard
          id={props.id}
          tags={tagsState}
          title={titleState}
          content={contentState}
        />
      </div>
      <Modal className={classes.memoModal} open={open} onClose={handleClose}>
        <div tabIndex={-1}>
          {uploadingState ? <LinearProgress /> : null}
          <Card variant="elevation" className={classes.editCardPaper}>
            <div className={classes.editCardTagnames}>
              {tagsState.join(' ')}
            </div>
            <div className={classes.editCardTitle}>
              <Editor
                editorState={editorCardTitleEditorState}
                onChange={settitleEditorState}
              />
            </div>
            <div className={classes.editCardContent}>
              <Editor
                editorState={editorCardContentEditorState}
                onChange={onContentChanged}
              />
            </div>
          </Card>
        </div>
      </Modal>
    </>
  );
}

const GridMemoCard = (props: MemoCardProps): JSX.Element => {
  const classes = useMemoCardStyle();

  return (
    <Card className={classes.card} variant="elevation">
      <CardActionArea className={classes.aria}>
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
      </CardActionArea>
    </Card>
  );
};
