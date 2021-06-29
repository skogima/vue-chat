import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Message as StompMessage } from "webstomp-client";
import socket from "@/services/socket";
import { Message, Contact, Messages, User } from "@/types";

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

  setupSocket() {
    socket.connect({}, () => {
      socket.subscribe(
        `/topic/chat/${this.user.name}`,
        this.handleMessageReceived
      );
    });
  }

  handleContactChanged(contact: Contact) {
    this.selectedContact = contact;
  }

  addMessageToChat(message: Message) {
    const date = message.timestamp.toLocaleDateString();
    const dateMessages = this.messages[date] || [];
    dateMessages.push(message);
    this.$set(this.messages, date, dateMessages);
  }

  handleMessageReceived(stompMessage: StompMessage) {
    const message = JSON.parse(stompMessage.body);
    message.timestamp = new Date();
    message.isFromSender = false;
    message.id = Math.floor(Math.random() * 1000000);
    this.addMessageToChat(message);
  }

  sendMessage() {
    const timestamp = new Date();

    try {
      const message: Message = {
        to: this.selectedContact.name,
        content: this.message,
        timestamp: timestamp,
        isFromSender: true,
        sender: this.user.senderType,
      };

      socket.send("/chat", JSON.stringify(message));
      this.addMessageToChat(message);
      this.message = "";
    } catch {
      console.log("Não foi possível enviar a mensagem");
    }
  }
}
