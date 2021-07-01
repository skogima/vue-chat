import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Message as StompMessage } from "webstomp-client";
import api from "@/services/api";
import socket from "@/services/socket";
import { Message, Contact, Messages, User } from "@/types";
import { groupBy } from "@/helpers";

@Component
export default class SocketChat extends Vue {
  user: User = {} as User;
  message = "";
  messages: Messages = {} as Messages;
  selectedContact: Contact = {} as Contact;
  contacts: Array<Contact> = [];

  $refs!: {
    messageInput: HTMLInputElement;
  };

  mounted() {
    this.setupSocket();

    this.$refs.messageInput.focus();
  }

  get equipmentId() {
    return this.user.entityType === "equipment"
      ? this.user.id
      : this.selectedContact.id;
  }

  get userId() {
    return this.user.entityType === "user"
      ? this.user.id
      : this.selectedContact.id;
  }

  async fetchMessages() {
    const { data: chatMessages } = await api.get<Array<Message>>("/messages", {
      params: {
        userId: this.userId,
        equipmentId: this.equipmentId,
      },
    });

    const messages: Array<Message> = chatMessages.map((item) => {
      return {
        ...item,
        timestamp: new Date(item.timestamp),
        isFromSender: this.user.chatUsername === item.sender,
      };
    });

    this.messages = groupBy(messages, (message) =>
      message.timestamp.toLocaleDateString()
    );
  }

  setupSocket() {
    socket.connect({}, () => {
      socket.subscribe(
        `/topic/chat/${this.user.chatUsername}`,
        this.handleMessageReceived
      );
    });
  }

  changeSocketSubscription(oldContactName: string, newContactName: string) {
    socket.unsubscribe(`/topic/chat/${oldContactName}`);
    socket.subscribe(`/topic/chat/${newContactName}`, this.handleMessageReceived);
  }

  handleContactChanged(contact: Contact) {
    this.selectedContact = contact;
    this.fetchMessages();
  }

  addMessageToChat(message: Message) {
    const date = message.timestamp.toLocaleDateString();
    const dateMessages = this.messages[date] || [];
    dateMessages.push(message);
    this.$set(this.messages, date, dateMessages);
  }

  handleMessageReceived(stompMessage: StompMessage) {
    const message = JSON.parse(stompMessage.body) as Message;
    if (this.selectedContact.chatUsername !== `${message.sender}`) {
      return;
    }
    message.isFromSender = false;
    message.timestamp = new Date(message.timestamp);
    this.addMessageToChat(message);
  }

  sendMessage() {
    const timestamp = new Date();

    try {
      const message: Omit<Message, "isFromSender"> = {
        equipmentId: this.equipmentId,
        userId: this.userId,
        content: this.message,
        timestamp: timestamp,
        sender: this.user.chatUsername,
        to: this.selectedContact.chatUsername,
      };

      socket.send("/chat", JSON.stringify(message));
      this.addMessageToChat({ ...message, isFromSender: true });
      this.message = "";
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        console.log(e);
      }
    }
  }
}
