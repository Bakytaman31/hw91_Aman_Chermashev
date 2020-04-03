import React, {Component} from 'react';
import {Button, Form, FormGroup, Input, Label} from "reactstrap";
import ReconnectingWebSocket from 'reconnecting-websocket'

import "./Chat.css";
import MessageCard from "../../components/UI/MessageCard/MessageCard";
import store from "../../store/configureStore";

class Chat extends Component {
    state = {
        messages: [],
        users: [],
        message: ''
    };

    componentDidMount() {
        this.websocket = new ReconnectingWebSocket(
            `ws://localhost:8000/chatApp?token=${store.getState().users.user.token}`,
            [],
            {debug: true, reconnectInterval: 3000}
        );

        this.websocket.onmessage = (message) => {
            try {
                const data = JSON.parse(message.data);
                switch (data.type) {
                    case'NEW_MESSAGE':
                        const newMessage= {
                            _id: data.message._id,
                            user: data.message.user,
                            message: data.message.message
                        };
                       this.setState({messages: [...this.state.messages, newMessage]});
                        console.log('good');
                        break;
                    case 'LAST_MESSAGES':
                        this.setState({messages: data.messages.reverse()});
                        break;
                    case 'USERS_ONLINE':
                        this.setState({users: data.users});
                        break;
                    default:
                        console.log('Nothing');
                }

            } catch (e) {
                console.log('Something went wrong', e);
            }
        };

        this.websocket.onclose = () => {
            this.websocket.send('ok');
        }
    };

    inputChangeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    sendMessage = event => {
        event.preventDefault();

        const obj = {
            type: 'CREATE_MESSAGE',
            message: this.state.message,
            user: store.getState().users.user._id
        };

        this.websocket.send(JSON.stringify(obj));
        this.setState({message: ''});
    };

    render() {
        return (
            <div>
                <div className="interface">
                    <div className="online">
                        Users Online:
                        {this.state.users.map(user => (
                            <p key={user._id}>{user.username}</p>
                        ))}
                    </div>

                    <div className="messages">
                        {this.state.messages.map(message => (
                            <MessageCard
                                key={message._id}
                                username={message.user.username}
                                message={message.message}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <Form onSubmit={this.sendMessage}>
                        <FormGroup>
                            <Label for="message">New message</Label>
                            <Input
                                type="text"
                                name="message"
                                id="message"
                                placeholder="Enter what you want to say"
                                value={this.state.message}
                                onChange={this.inputChangeHandler}
                            />
                        </FormGroup>
                        <Button type="submit">Submit</Button>
                    </Form>
                </div>
            </div>
        );
    }
}


export default Chat