import { Card, makeStyles, LinearProgress } from '@material-ui/core';
import React, { useState } from 'react';
import { MemoCardProps } from './MemoCard';
import { convertFromRaw, Editor, EditorState } from 'draft-js';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'draft-js/dist/Draft.css';

const useStyle = makeStyles((theme) => ({
  paper: {
    width: '500px',
    minHeight: '500px',
    height: 'auto',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[9],
    padding: '2ch',
  },
  tagnames: {
    color: theme.palette.text.secondary,
    fontSize: 14,
  },
  title: {
    fontSize: theme.typography.h5.fontSize,
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

let changeTimes = 0;

export default function EditMemoCard(props: {
  memoData: MemoCardProps;
  forwardRef?: React.Ref<HTMLDivElement>;
}): JSX.Element {
  const classes = useStyle();

  const initContentData = convertFromRaw({
    entityMap: {},
    blocks: [
      {
        key: props.memoData.id + 'c',
        text: props.memoData.content,
        type: 'unstyled',
        depth: 0,
        entityRanges: [],
        inlineStyleRanges: [],
        data: {},
      },
    ],
  });

  const initTitleData = convertFromRaw({
    entityMap: {},
    blocks: [
      {
        key: props.memoData.id + 't',
        text: props.memoData.title,
        type: 'unstyled',
        depth: 0,
        entityRanges: [],
        inlineStyleRanges: [],
        data: {},
      },
    ],
  });

  const initContentState = EditorState.createWithContent(initContentData);
  const initTitleState = EditorState.createWithContent(initTitleData);

  const [contentEditorState, setcontentEditorState] = useState(
    initContentState
  );
  const [titleEditorState, settitleEditorState] = useState(initTitleState);

  const [uploadingState, setUploadingState] = useState<boolean>(false);

  const onContentChanged = async (newContentEditorState: EditorState) => {
    let beforeText = '';
    for (const b of contentEditorState.getCurrentContent().getBlocksAsArray()) {
      beforeText = (beforeText + '\n' + b.getText()).trim();
    }

    let afterText = '';
    for (const b of newContentEditorState
      .getCurrentContent()
      .getBlocksAsArray()) {
      afterText = (afterText + '\n' + b.getText()).trim();
    }

    if (beforeText != afterText) {
      changeTimes++;

      const currentChangeTimes = changeTimes;

      (async (thisTimeChangeTimes) => {
        await new Promise((resolve) => setTimeout(resolve, 2 * 1000));

        if (thisTimeChangeTimes != changeTimes) {
          console.log(
            `呼び出されたときの変更回数(${thisTimeChangeTimes})と現在の変更回数(${changeTimes})が異なるため棄却`
          );
          return;
        }

        console.log('データを送信中...');
        setUploadingState(true);

        //データ送信
        //await new Promise((resolve) => setTimeout(resolve, 1 * 1000));
        await firebase
          .firestore()
          .collection('files')
          .doc(firebase.auth().currentUser?.uid)
          .collection('userFiles')
          .doc(props.memoData.id)
          .set({ content: afterText }, { merge: true });

        console.log(`送信内容 = ${afterText}`);

        setUploadingState(false);
      })(currentChangeTimes);
    }
    setcontentEditorState(newContentEditorState);
  };

  return (
    <div ref={props.forwardRef} tabIndex={-1}>
      {uploadingState ? <LinearProgress /> : null}
      <Card variant="elevation" className={classes.paper}>
        <div className={classes.tagnames}>{props.memoData.tags.join(' ')}</div>
        <div className={classes.title}>
          <Editor
            editorState={titleEditorState}
            onChange={settitleEditorState}
          />
        </div>
        <div className={classes.memocontent}>
          <Editor
            editorState={contentEditorState}
            onChange={onContentChanged}
            onBlur={() => {
              console.log('onBlurが動いたらしい');
            }}
          />
        </div>
      </Card>
    </div>
  );
}
