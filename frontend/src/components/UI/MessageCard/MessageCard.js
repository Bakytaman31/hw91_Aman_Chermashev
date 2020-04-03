import React from 'react';
import store from "../../../store/configureStore";

let styles = {
    border: "2px solid #ccc",
    borderRadius: "4px",
    float: "left",
    width: "40%"
};

const MessageCard = props => {
    if (store.getState().users.user.username === props.username) {
        styles = {
            border: "2px solid #ccc",
            borderRadius: "4px",
            float: "right",
            width: "40%"
        }
    }
    return (
        <div style={styles}>
            <p style={{borderBottom: "2px solid #ccc"}}>{props.username}</p>
            <p>{props.message}</p>
        </div>
    );
};

export default MessageCard;