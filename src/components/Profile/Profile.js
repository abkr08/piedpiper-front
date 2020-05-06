import React, { Component} from 'react';
import { connect } from 'react-redux';
import swal from 'sweetalert2';

import * as actionCreators from '../../store/actions/actionIndex';
import TabBar from '../UI/TabBar/TabBar';
import classes from './Profile.module.css';
import ProfileImageModal from './ProfileImageModal/ProfileImageModal';
import Modal from '../../containers/Modal/Modal';
import OptionsDropbar from '../UI/OptionsDropbar/OptionsDropbar';
import Spinner from '../UI/Spinner/Spinner';



class Profile extends Component {
    state = {
        // image: this.props.user.profile.displayImage,
        selectedImage: null,
        file: null,
        showModal: false,
        showOptions: false,
        position: {}
    }

    comingSoon = () => {
        swal.fire({
          title: 'Coming soon',
          icon: 'info',
          showCloseButton: true,
          focusConfirm: false,
          confirmButtonText:
            '<i class="fa fa-thumbs-up"></i> Great!'
        })
    }

    handleChangeProfilePicture = () => {
        // this.inputRef.click();
        // this.setState({ showOptions: true});
    }
    showOptions = event => {
        let pos = {...this.state.position};
        pos.x = event.clientX;
        pos.y = event.clientY;
        this.setState({showOptions: true, position: pos})
    }

    onImageSelected = e => {
        const src = window.URL.createObjectURL(this.inputRef.files[0])
        this.setState({ showModal: true, selectedImage: src, file: this.inputRef.files[0] })
    }

    updateProfilePicture = file => {
        const { updateProfile } = this.props;
        this.setState({ showModal: false})
            if (file !== null){
                let formData = new FormData();
                formData.append('displayImage', file);
                updateProfile(formData);
            }
    }

    cancelImageUpdate = () => {
        this.setState({ showModal: false })
    }

    hideOptions = () => {
        this.setState({showOptions: false, position:{}})
    }

    viewPhoto = () => {

    }

    takePhoto = () => {

    }
    uploadPhoto = () => {
        this.inputRef.click();
    }

    deletePhoto = () => {

    }


    render(){
        const { hideProfile, user, show, updatingProfileImage } = this.props;
        let updatingProfileImages = true;
        const { fullName, username, profile: { displayImage, bio } } = user;
        const { showOptions, showModal, position, selectedImage } = this.state;
        let attachedClasses = [classes.Profile, classes.Close];
        if (show){
            attachedClasses = [classes.Profile, classes.Open];
        }
        let options = null;
        if (showOptions){
            options = (
                <OptionsDropbar 
                show={showOptions}
                topOffset ={0}
                leftOffset ={0}
                options={[
                    {name: 'View photo', clickHandler: this.viewPhoto},
                    {name: 'Take photo', clickHandler: this.takePhoto},
                    {name: 'Upload photo', clickHandler: this.uploadPhoto},
                    {name: 'Delete Photo', clickHandler: this.deletePhoto}
                ]}
                position={position}
                hideOptions={this.hideOptions}
                />
            )
        }
        return (
            <div className={attachedClasses.join(' ')}>
                <TabBar goBack={hideProfile} tabName='Profile' />
                <div className={classes.ProfileImageContainer}>
                    <div className={classes.ProfileImage} onClick={this.showOptions}>
                        <img src={displayImage} alt='' />
                        {   updatingProfileImage && (
                                <span className={classes.Spinner}><Spinner /></span>
                            )
                        }
                        <span className={classes.ChangeImage}>
                            <span className={classes.CameraIcon}><i className='fa fa-camera' /></span>
                            <input type='file' style={{ display: 'none'}} accept="image/*" ref={ input => this.inputRef = input} onChange={this.onImageSelected}/>
                        <span className={classes.ChangeImageText}>Change Profile Photo</span>
                        </span>
                    </div>
                </div>
                <Modal show={showModal}>
                    <ProfileImageModal 
                        image={selectedImage}
                        updateDisplayImage={this.updateProfilePicture}
                        username={username}
                        cancelImageUpdate={this.cancelImageUpdate}
                    />
                </Modal>
                {options}
                <div className={classes.Names}>
                    <span className={classes.Name}>{fullName}</span>
                    <span className={classes.Username}>{`@${username}`}</span>
                </div>
                <hr />
                <div className={classes.About}>
                    <h3>Intro</h3>
                    <hr />
                    <span>{bio ? bio : 'Write awesome things About Yourself here.'}</span>
                </div>
                <hr />
                <div className={classes.SocialProfiles}>
                    <h3>Social Profiles</h3>
                    <hr />
                    <div className={classes.SocialIcons}>
                        <span onClick={this.comingSoon}><i className='fab fa-instagram' /></span>
                        <span onClick={this.comingSoon}><i className='fab fa-twitter' /></span>
                        <span onClick={this.comingSoon}><i className='fab fa-facebook' /></span>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.auth.user,
    updatingProfileImage: state.auth.updatingProfileImage
})

const mapDispatchToProps = dispatch => ({
    updateProfile: data => dispatch(actionCreators.updateProfile(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(Profile);