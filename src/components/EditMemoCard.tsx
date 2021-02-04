import { Card, makeStyles, LinearProgress } from '@material-ui/core';
import React, { useState } from 'react';
import { MemoCardProps } from './MemoCard';
import { convertFromRaw, Editor, EditorState } from 'draft-js';
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

export default function EditMemoCard(props: {
  memoData: MemoCardProps;
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

  const [isWritingState, setIsWritingState] = useState(false);

  const onContentChanged = async (newContentEditorState: EditorState) => {
    console.log('onChageが動いたってよ');

    if (
      //フォーカスの場所関係で何かしら起きてて全部通ってしまう
      contentEditorState.getCurrentContent() ==
      newContentEditorState.getCurrentContent()
    ) {
      console.log('koko');
    }
    //setcontentEditorState(newContentEditorState);
    /* 
    await new Promise((resolve) => setTimeout(resolve, 3 * 1000));

    setIsWritingState(true);

    await new Promise((resolve) => setTimeout(resolve, 1 * 1000));

    setIsWritingState(false); */
  };

  return (
    <div>
      {isWritingState ? <LinearProgress /> : null}
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
