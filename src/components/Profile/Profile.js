import React, { Component} from 'react';
import swal from 'sweetalert2';

import classes from './Profile.module.css';
import placeholderImage from '../../assets/images/p37605.png';

class Profile extends Component {
    state = {}

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

    render(){
        let attachedClasses = [classes.Profile, classes.Close];
        if (this.props.show){
            attachedClasses = [classes.Profile, classes.Open];
        }
        return (
            <div className={attachedClasses.join(' ')}>
                <div className={classes.ProfileTabBar}>
                    <i className='fa fa-arrow-left ' onClick={this.props.hideProfile}/>
                    <span>Profile</span>
                </div>
                <div className={classes.ProfileImageContainer}>
                    <div className={classes.ProfileImage}>
                        <img src={placeholderImage} alt='' />
                        <span className={classes.ChangeImage}>
                            <span className={classes.CameraIcon}><i className='fa fa-camera' /></span>
                        <span className={classes.ChangeImageText}>Change Profile Photo</span>
                    </span>
                    </div>
                </div>
                <div className={classes.Names}>
                    <span className={classes.Name}>Abubakar Ibrahim</span>
                    <span className={classes.Username}>@abkr08</span>
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

export default Profile;