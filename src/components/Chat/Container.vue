<template>
  <div class="chat-container">
    <div class="chat-contacts">
      <div class="contacts-header">
        <slot name="user-info"></slot>
      </div>
      <contact-list @onContactClick="onContactClick" :contacts="contacts" />
    </div>
    <div class="chat-area">
      <div class="chat-header">
        <slot name="chat-header" />
      </div>
      <message-list :messages="messages" />
      <div class="chat-input">
        <slot name="chat-input"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import MessageList from "@/components/Chat/MessageList.vue";
import ContactList from "@/components/Chat/ContactList.vue";
import { Component, Prop } from "vue-property-decorator";
import { Messages } from "@/types/messages";
import { Contact } from "@/types/contact";

@Component({
  components: {
    MessageList,
    ContactList,
  },
})
export default class ChatContainer extends Vue {
  @Prop() readonly messages?: Messages;
  @Prop() readonly contacts!: Array<Contact>;
  @Prop() readonly selectedContact?: Contact;

  message = "";

  onContactClick(contact: Contact) {
    this.$emit("onContactClick", contact);
  }
}
</script>

<style scoped>
.chat-container {
  height: 100vh;
  width: 100%;
  display: flex;
  border: 1px solid #eee;
}

.chat-header {
  height: 80px;
  padding: 16px;
  background: #fff;
  display: flex;
  align-items: center;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #eceff1;
}

.chat-messages {
  flex: 1;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  padding: 8px;
}

.chat-input {
  padding: 8px;
  background: #fff;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.contacts-header {
  height: 80px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.contacts-header > * {
  margin: 0px 8px;
}

.chat-contacts {
  flex: 0.3;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #eee;
  background: #fff;
}
</style>
