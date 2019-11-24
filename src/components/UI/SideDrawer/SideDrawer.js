import React, {Component} from 'react'; 
import classes from './SideDrawer.module.css';
import { connect } from 'react-redux';
import JoinableRooms from './JoinableRooms/JoinableRooms';  
import * as actionCreators from '../../../store/actions/actionIndex';
import Input from '../Input/Input';
import Button from '../Button/Button';
import TabBar from '../TabBar/TabBar';


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
                <TabBar goBack={this.props.hideSideDrawer} tabName={this.props.actionType} />
            </div>
        )
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