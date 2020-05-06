import React from 'react'
import AvatarEditor from 'react-avatar-editor'
import classes from './ImageEditor.module.css';

const imageEditor = ({ image, setEditorRef, scaleValue}) => (
  (
    <AvatarEditor
    className={classes.AvatarEditor}
    image={image}
    ref={setEditorRef}
    border={10}
    borderRadius={100}
    color={[0, 0, 0, 0.65]}
    scale={scaleValue}
    rotate={0}
    />
  )
)


export default imageEditor;