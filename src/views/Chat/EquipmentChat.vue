<template>
  <chat-container
    :messages="messages"
    :contacts="contacts"
    :selectedContact="selectedContact"
    @onContactClick="handleContactChanged"
  >
    <template v-slot:user-info>
      <div class="equipment-select">
        <v-select
          flat
          :items="equipments"
          item-text="name"
          item-value="id"
          v-model="selectedEquipmentId"
        />
      </div>
    </template>

    <template v-slot:chat-header>
      <span style="font-style: italic" v-if="!selectedContact.id"
        >Selecione um contato para iniciar uma conversa</span
      >
      <template v-else>
        <div class="user-photo">
          <img
            src="https://i1.wp.com/terracoeconomico.com.br/wp-content/uploads/2019/01/default-user-image.png?ssl=1"
            alt="Imagem do usuário"
          />
        </div>
        <span>{{ selectedContact.name }}</span>
      </template>
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
      <button
        class="btn-send"
        @click="sendMessage"
        :disabled="message.length === 0"
      >
        Enviar
      </button>
    </template>
  </chat-container>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import ChatContainer from "@/components/Chat/Container.vue";
import { Contact } from "@/types/contact";
import SocketChat from "./SocketChat";

@Component({
  components: {
    ChatContainer,
  },
})
export default class EquipmentChat extends SocketChat {
  selectedEquipmentId = 1;
  selectedEquipmen = {};
  equipments: Array<Contact> = [];

  created() {
    this.contacts = [{ id: 1, name: "Usuário 1" }];
    this.selectedContact = this.contacts[0];

    this.equipments = [
      { id: 1, name: "Equipamento 1" },
      { id: 2, name: "Equipamento 2" },
    ];

    this.selectedEquipmentId = 1;
    this.user = { name: this.equipments[0].name, senderType: "equipment" };
  }

  @Watch("selectedEquipmentId")
  handleSelectedEquipmentIdChanged() {
    const equip = this.equipments.find(
      (item) => item.id === this.selectedEquipmentId
    );
    if (equip) {
      this.user = {
        name: equip.name,
        senderType: "equipment",
      };
    }
  }
}
</script>

<style scoped>
.btn-send {
  background: #056162;
  color: #fff;
  padding: 16px 24px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.btn-send:hover {
  opacity: 0.8;
}

.btn-send:disabled {
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

.user-photo {
  margin-right: 8px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
}

.user-photo img {
  width: 100%;
}

.equipment-select {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.v-select-slot::after {
  display: none;
}

.v-select-slot::before {
  display: none;
}
</style>
