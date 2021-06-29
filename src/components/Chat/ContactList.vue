<template>
  <div class="contact-list">
    <small v-if="contacts.length === 0">Não há contatos para exibir</small>
    <div
      class="contact"
      :style="contact.id === selectedContactId && 'background: #eceff1;'"
      v-for="contact in contacts"
      :key="contact.id"
      @click="onContactClick(contact)"
    >
      <span class="contact-name">{{ contact.name }}</span>
      <small class="contact-last-message">10:00</small>
    </div>
  </div>
</template>

<script lang="ts">
import { Contact } from "@/types/contact";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ContactList extends Vue {
  @Prop() readonly contacts!: Array<Contact>;

  selectedContactId = 1;

  onContactClick(contact: Contact) {
    this.selectedContactId = contact.id;
    this.$emit("onContactClick", contact);
  }
}
</script>

<style scoped>
small {
  margin-top: 16px;
  font-style: italic;
  text-align: center;
}

.contact-list {
  display: flex;
  flex-direction: column;
}

.contact {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.contact:hover {
  background: #eceff1;
}

.contact-last-message {
  color: #777;
  font-size: 0.7rem;
}
</style>
