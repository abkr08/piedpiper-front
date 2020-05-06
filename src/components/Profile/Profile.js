import React, { Component} from 'react';
import { connect } from 'react-redux';
import swal from 'sweetalert2';

import * as actionCreators from '../../store/actions/actionIndex';
import TabBar from '../UI/TabBar/TabBar';
import classes from './Profile.module.css';
import AvatarEditor from './AvatarEditor';
import ProfileImageModal from './ProfileImageModal/ProfileImageModal';
import Modal from '../../containers/Modal/Modal';
import OptionsDropbar from '../UI/OptionsDropbar/OptionsDropbar';



class Profile extends Component {
    state = {
        image: this.props.user.profile.displayImage, 
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

    updateProfilePicture = e => {
        const { updateProfile } = this.props;
        const src = window.URL.createObjectURL(this.inputRef.files[0])
        this.setState({ image: src, file: this.inputRef.files[0] }, () => {
            if (this.state.file !== null){
                let formData = new FormData();
                formData.append('displayImage', this.state.file);
                updateProfile(formData);
            }
        });
    }

    hideOptions = () => {
        this.setState({showOptions: false, position:{}})
    }

    viewPhoto = () => {

    }

    takePhoto = () => {

    }
    uploadPhoto = () => {

    }

    deletePhoto = () => {

    }


    render(){
        const { hideProfile, user, show } = this.props;
        const { fullName, username } = user;
        const { showOptions, showModal, image, position } = this.state;
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
                        <img src={this.state.image} alt='' />
                        <Modal show={showModal}>
                            <ProfileImageModal image={image}/>
                        </Modal>
                        
                        {/* <AvatarEditor image={this.state.image}/> */}
                        <span className={classes.ChangeImage}>
                            <span className={classes.CameraIcon}><i className='fa fa-camera' /></span>
                            <input type='file' style={{ display: 'none'}} accept="image/*" ref={ input => this.inputRef = input} onChange={this.updateProfilePicture}/>
                        <span className={classes.ChangeImageText}>Change Profile Photo</span>
                    </span>
                    </div>
                </div>
                {options}
                <div className={classes.Names}>
                    <span className={classes.Name}>{fullName}</span>
                    <span className={classes.Username}>{`@${username}`}</span>
                </div>
                <hr />
                <div className={classes.About}>
                    <h3>Intro</h3>
                    <hr />
                    <span>Write awesome things About Yourself here.</span>
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
    user: state.auth.user
})

const mapDispatchToProps = dispatch => ({
    updateProfile: data => dispatch(actionCreators.updateProfile(data))
})
export default connect(mapStateToProps, mapDispatchToProps)(Profile);