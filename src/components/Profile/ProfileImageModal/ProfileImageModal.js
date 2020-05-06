import React, {Component} from 'react';
import classes from './ProfileImageModal.module.css';
import ImageEditor from '../ImageEditor/ImageEditor';
import { getSVG } from '../../../shared/utility';


class ProfileImageModal extends Component {
    state = {
        selectedImage: null,
        file: null,
        scaleValue: 1,
    }

    reselect = () => {
        this.inputRef.click();
    }

    updateSelectedImage = () => {
        const src = window.URL.createObjectURL(this.inputRef.files[0])
        this.setState({ selectedImage: src, file: this.inputRef.files[0] })
    }

    saveImage = () => {
        const { username } = this.props;
        if(this.editor != null){
            const canvas = this.editor.getImage();
            let dataURL = canvas.toBlob(blob => {
                let fileName = username + new Date().getTime() + '.jpg';
                let file = new File( [blob], fileName, { type: 'image/jpeg' } );
                this.props.updateDisplayImage(file);
            }, 'image/jpeg', 0.5);
        }
    }

    zoomIn = () => {
        this.setState(prevState => {
            return { scaleValue: prevState.scaleValue + 0.2}
        })
    }
    zoomOut = () => {
        this.setState(prevState => {
            if(prevState.scaleValue > 1){
                return { scaleValue: prevState.scaleValue - 0.2}
            }
            return;
        })
    }

    setEditorRef = editor => this.editor = editor
    render(){
        const { selectedImage, scaleValue } = this.state;
        const {image, cancelImageUpdate } = this.props;
    return (
            <div className={classes.ProfileImageModal}>
            <header className={classes.Header}>
                <span>
                    <span onClick={cancelImageUpdate}>{getSVG('close', 'white', 24, 24)}</span>
                    <p>Drag the image to adjust</p>
                </span>
                <span className={classes.Reselect} onClick={this.reselect}>
                    <span>{getSVG('reselect', 'white', 24, 24)}</span>
                    <span>Upload</span>
                    <input type='file' style={{ display: 'none'}} accept="image/*" ref={ input => this.inputRef = input} onChange={this.updateSelectedImage}/>
                </span>
            </header>
            <div className={classes.AvatarContainer}>
                <ImageEditor 
                image={selectedImage || image}
                setEditorRef={this.setEditorRef}
                scaleValue={scaleValue}

                />
                <span className={classes.SubmitImage} onClick={this.saveImage}>
                    {getSVG('checkmark', 'white', 30, 30)}
                </span>
                <span className={classes.Scale}>
                    <span onClick={this.zoomIn}>{getSVG('plus', 'black', 28, 28)}</span>
                    <span onClick={this.zoomOut}>{getSVG('minus', 'black', 28, 28)}</span>
                </span>
            </div>
            <footer className={classes.footer}></footer>
            </div>
        
    )
}
}

export default ProfileImageModal;