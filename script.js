import {
    ref,
    set,
    onValue,
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
import { initFirebase } from "./firebaseConfig.js";

/**
 * Global variables, available to every function!
 */
let app;
let analytics;
let database;

/**
 * Format Date object to a unique key to be stored on database.
 * @param {Date} dateObject - The date object.
 * @returns {string} The formatted date
 */
const formatDateToKey = (dateObject) => {
    const formattedDate =
        `${dateObject.getUTCFullYear()}-` +
        `${dateObject.getUTCMonth() + 1}-` +
        `${dateObject.getUTCDate()}-` +
        `${dateObject.getUTCHours()}-` +
        `${dateObject.getUTCMinutes()}-` +
        `${dateObject.getUTCSeconds()}-` +
        `${dateObject.getUTCMilliseconds()}`;

    return formattedDate;
};

/**
 * Create the HTMLElement for each message.
 * @param {Object} msgContent - The message object
 * @returns {HTMLElement} The HTMLElement for each message.
 */
const createMessageElement = (msgContent) => {
    // Create a DIV.
    const divElement = document.createElement("div");
    divElement.classList.add("msg");

    // Create a P for timestamp.
    const timestampElement = document.createElement("p");
    timestampElement.classList.add("msg-timestamp");
    timestampElement.innerText = msgContent.timestamp;
    divElement.appendChild(timestampElement);

    // Create a P for actual message.
    const contentElement = document.createElement("p");
    contentElement.classList.add("msg-content");
    contentElement.classList.add("chat-bubble");
    contentElement.innerText = msgContent.msg;
    divElement.appendChild(contentElement);

    // Create a P for the sender name.
    const userElement = document.createElement("p");
    userElement.classList.add("msg-user");
    userElement.classList.add("chat-bubble");
    userElement.innerText = msgContent.from;
    divElement.appendChild(userElement);

    return divElement;
};

/**
 * Clear all messages from the chatBox.
 */
const clearMessages = () => {
    const chatBoxElement = document.getElementById("chatBox");

    // While we can get child-elements, keep removing them.
    while (chatBoxElement.firstElementChild) {
        chatBoxElement.firstElementChild.remove();
    }
};

/**
 * Update the messages which are displayed on the screen.
 * @param {Object} messages - The messages from database, as key-value object.
 * eg. {
 *  2022-01-01-00-00-00: {
 *   timestamp: Date,
 *   from: 'Jakub',
 *   msg: 'Hello'
 *  },
 *  ...
 * }
 */
const updateMessages = (messages) => {
    const chatBoxElement = document.getElementById("chatBox");

    // We actually ignore all the unique keys, we only get all the message contents.
    const messagesAsArray = Object.values(messages);

    // Sort by datetime
    messagesAsArray.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    // For each message, create the HTML element and add it to our box.
    messagesAsArray.forEach((message) => {
        const htmlElement = createMessageElement(message);

        chatBoxElement.appendChild(htmlElement);
    });
};

/**
 * Initialise the message watcher. This listens to new messages in the database.
 * When it receives a new message, it does something.
 */
const initMessageWatcher = () => {
    // Which directory do we want to monitor.
    const dir = "messages";

    // On value-change in the database, clear existing messages, print all (new) messages again.
    onValue(ref(database, dir), (snapshot) => {
        const data = snapshot.val();

        clearMessages();
        updateMessages(data);
    });
};

/**
 * Write the message to database.
 * @param {Date} timestamp - The timestamp when the message was sent.
 * @param {string} from - The sender of the message.
 * @param {string} message - The actual message sent.
 */
const writeMessage = (timestamp, from, message) => {
    // Create an Object of how we want to store the data on the database.
    const objToSave = {
        timestamp: timestamp.toUTCString(),
        from,
        msg: message,
    };

    // Create the unique KEY to distinguish this message.
    const formattedDate = formatDateToKey(timestamp);

    // Where we want to store in the database.
    const dir = `messages/${formattedDate}`;

    // Save to database.
    set(ref(database, dir), objToSave);
};

/**
 * On 'Send' Button Click event handler. Do something when the button is clicked.
 * @param {MouseEvent | KeyboardEvent} event - The onClick event.
 */
const onSendButtonClick = (event) => {
    // If the event has keyCode (is keyboard event) AND the key is not 13 (Enter), ignore.
    if (event.keyCode && event.keyCode !== 13) {
        return;
    }

    const nameElement = document.getElementById("nameInput");
    const messageElement = document.getElementById("msgInput");

    const nameVal = nameElement.value;
    const messageVal = messageElement.value;

    const timestampDate = new Date();

    // Save the new message to database.
    writeMessage(timestampDate, nameVal, messageVal);

    // Empty the message, you have sent it now.
    messageElement.value = null;
};

/**
 * The main function, executed ONCE at the start of the program.
 */
const main = () => {
    // Populate the global variables at the top with the result of initFirebase().
    [app, analytics, database] = initFirebase();

    // Start listening for new messages.
    initMessageWatcher();

    // Add event-listeners. On submit button click or 'Enter' key, send message.
    document
        .getElementById("msgSubmit")
        .addEventListener("click", onSendButtonClick);
    document
        .getElementById("msgInput")
        .addEventListener("keydown", onSendButtonClick);
};

main();
