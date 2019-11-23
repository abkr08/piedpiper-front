import React, {Component} from 'react'; 
import classes from './SideDrawer.module.css';
import axios from '../../../Axios';
import { connect } from 'react-redux';
import JoinableRooms from './JoinableRooms/JoinableRooms';  
import * as actionCreators from '../../../store/actions/actionIndex';
import Input from '../Input/Input';
import Button from '../Button/Button'


class SideDrawer extends Component {
    state = {
        showCreateForm: false,
        showNewChatForm: false,
        groupName: '',
        participants: [],
        potentialParticipants: [],
        newGroupChatParticipants: {},
        privateChatParticipant: '',
        joinableRooms: [],
        ShowJoinableRoomsList: false,
        touched: false,
        isValid: false
    }
    createNewGroupHandler = () => {
        let potentialParticipants = this.props.user.rooms.filter(user => user.isPrivate && user.name !== this.props.userId);
        let chatParticipants = {};
        potentialParticipants.forEach(pp => chatParticipants[pp.name] = false);
        this.setState(prevState => {
            return {
            showCreateForm: !prevState.showCreateForm, 
            potentialParticipants, 
            ShowJoinableRoomsList: false,
            showNewChatForm: false,
            newGroupChatParticipants: chatParticipants 
            }
        });
        
    }
    onChange = (event) => {
        // let valid = false; 
        // if (this.state[name] !== ""){
        //     valid = true;
        // }
        this.setState({[event.target.name]: event.target.value});
        
    }
    onCreateNewGroup = event => {
        event.preventDefault();
        let obj = {...this.state.newGroupChatParticipants};
        let participants = Object.keys(obj).filter(j => obj[j]);
        this.props.onCreateNewGroup({participants, name: this.state.groupName});
        this.setState({groupName: '', newGroupChatParticipants: {}});
    }
    startNewChatHandler = () => {
        this.setState(prevState => {
            return {
            showNewChatForm: !prevState.showNewChatForm, 
            ShowJoinableRoomsList: false, 
            showCreateForm: false
        }})
        
    }
    onStartNewChat = event => {
        event.preventDefault();
        let data = {chatParticipant: this.state.privateChatParticipant};
        this.props.onStartNewChat(data);
    }
    joinGroup = () => {
        this.props.user.getJoinableRooms()
        .then(rooms => {
            this.setState(prevState => {
                return {
                    joinableRooms: rooms, 
                    ShowJoinableRoomsList: !prevState.ShowJoinableRoomsList,
                    showCreateForm: false,
                    showNewChatForm: false
                }
            });
            
        })
        .catch(err => {
            console.log(`Error getting joinable rooms: ${err}`)
        })
    }
    onPPChange = event => {
        let { name, checked } = event.target;
        let groupParticipants = {...this.state.newGroupChatParticipants};
        groupParticipants[name] = checked;
        this.setState({newGroupChatParticipants: groupParticipants});
    } 
    render (){
        let attachedClasses = [classes.SideDrawer, classes.Close];
        if (this.props.show){
            attachedClasses = [classes.SideDrawer, classes.Open];
        }
       return  (
        <div className={attachedClasses.join(' ')}>
            <div className={classes.divs} onClick={this.createNewGroupHandler}>Create a new group</div>
            <form onSubmit={this.onCreateNewGroup} style={{display: this.state.showCreateForm ? 'block' : 'none'}}>
                <Input 
                elementType='input'
                elementConfig={{placeholder: 'Enter group name', type: 'text'}}
                value={this.state.groupName}
                invalid={this.state.isTouched && !this.state.isValid}
                shouldValidate={true}
                touched={this.state.isTouched}
                name='groupName'
                changed={ event => this.onChange(event, 'groupName')}
            />
                <h3>Add participants</h3>
                {this.state.potentialParticipants.map((pp, i) => {
                    return (
                        <span key={i} className={classes.PP}>
                            <input onChange={this.onPPChange} type="checkbox" name={pp.name} checked={this.state.newGroupChatParticipants[pp.name]}/>
                            <label htmlFor={pp.name}>{pp.name}</label>
                        </span>
                    )
                })}
                
                <Button /*disabled={!this.state.groupName  && 
                !Object.keys(this.state.newGroupChatParticipants).map(key => {
                    return this.state.newGroupChatParticipants[key]
                }).includes(true)}*/ btnType='Success'>Create</Button>
            </form>
            <div className={classes.divs} onClick={this.joinGroup}>Join a group</div>
            <span style={{display: this.state.ShowJoinableRoomsList ? 'block' : 'none'}} className={classes.RoomsList}>
                <JoinableRooms joinableRooms={this.state.joinableRooms} />  
            </span>
            <div className={classes.divs} onClick={this.startNewChatHandler}>Start a new chat</div>
            <form onSubmit={this.onStartNewChat} style={{display: this.state.showNewChatForm ? 'block' : 'none'}}>
                <input onChange={this.onChange} type='text' name='privateChatParticipant' placeholder='Who do you wanna chat with?' />    
                <button>Submit</button>
            </form>
        </div>
        );
    
}
}
const mapStateToProps = state => {
    return {
        token: state.auth.token,
        userId: state.auth.userId
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onCreateNewGroup: data => dispatch(actionCreators.createNewGroup(data)),
        onStartNewChat: data => dispatch(actionCreators.startNewChat(data)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SideDrawer);