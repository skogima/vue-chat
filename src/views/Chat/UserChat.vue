<template>
  <chat-container
    :messages="messages"
    :contacts="contacts"
    :selectedContact="selectedContact"
    @onContactClick="handleContactChanged"
  >
    <template v-slot:user-info>
      <div class="user-photo">
        <img
          src="https://i1.wp.com/terracoeconomico.com.br/wp-content/uploads/2019/01/default-user-image.png?ssl=1"
          alt="Imagem do usuário"
        />
      </div>
      <span>{{ user.name }}</span>
    </template>

    <template v-slot:chat-header>
      <span>{{ selectedContact.name }}</span>
      <span style="font-style: italic" v-if="!selectedContact.id"
        >Selecione um contato para iniciar uma conversa</span
      >
    </template>

    <template v-slot:chat-input>
      <input
        ref="messageInput"
        @keydown.enter="sendMessage"
        type="text"
        v-model="message"
        placeholder="Digite sua mensagem..."
        :disabled="!selectedContact.id"
      />
      <button @click="sendMessage" :disabled="message.length === 0">
        Enviar
      </button>
    </template>
  </chat-container>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import ChatContainer from "@/components/Chat/Container.vue";
import SocketChat from "./SocketChat";
@Component({
  components: {
    ChatContainer,
  },
})
export default class UserChat extends SocketChat {
  async created() {
    this.user = {
      id: 1,
      name: "Usuário 1",
      chatUsername: "user1",
      entityType: "user",
    };
    this.contacts = [
      {
        id: 1,
        name: "Equipamento 1",
        chatUsername: "equipment1",
        entityType: "equipment",
      },
      {
        id: 2,
        name: "Equipamento 2",
        chatUsername: "equipment2",
        entityType: "equipment",
      },
    ];
    this.selectedContact = this.contacts[0];

    await this.fetchMessages();
  }
}
</script>

<style scoped>
.user-photo {
  border-radius: 50%;
  width: 56px;
  height: 56px;
  overflow: hidden;
}

.user-photo img {
  width: 100%;
}

button {
  background: #056162;
  color: #fff;
  padding: 16px 24px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  opacity: 0.8;
}

button:disabled {
  cursor: default;
  opacity: 0.5;
}

input {
  background: #eceff1;
  padding: 16px 8px;
  width: 100%;
  margin: 0px 32px;
  border-radius: 4px;
}
</style>
