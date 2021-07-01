<template>
  <div class="chat-messages" ref="chatMessages" @scroll="handleScroll">
    <button
      @click="scrollToBottom"
      class="fab btn-scroll-bottom"
      v-if="showScrollButton"
    >
      <v-icon>mdi-chevron-down</v-icon>
    </button>

    <div :key="name" v-for="(value, name) in messages">
      <div class="message-day">
        <span>{{ name | dateFormat }}</span>
      </div>
      <div
        :key="message.id"
        class="message"
        :class="message.isFromSender && 'self'"
        v-for="message in value"
      >
        <chat-message :message="message" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ChatMessage from "@/components/Chat/Message.vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Messages } from "@/types/messages";

@Component({
  components: {
    ChatMessage,
  },
  filters: {
    dateFormat(value: string) {
      if (new Date().toLocaleDateString() === value) {
        return "Hoje";
      }

      return value;
    },
  },
})
export default class MessageList extends Vue {
  @Prop() messages?: Messages;

  showScrollButton = false;
  alwaysScrollToBottom = true;

  $refs!: {
    chatMessages: HTMLDivElement;
  };

  mounted() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight;
  }

  handleScroll() {
    const { scrollHeight, scrollTop, offsetHeight } = this.$refs.chatMessages;
    const scrollBottom = scrollHeight - scrollTop - offsetHeight;
    this.showScrollButton = scrollBottom > 100;
    this.alwaysScrollToBottom = !this.showScrollButton;
  }

  @Watch("messages", { deep: true })
  handleMessageChanged() {
    if (this.alwaysScrollToBottom) {
      this.$nextTick(function () {
        this.scrollToBottom();
      });
    }
  }
}
</script>

<style scoped>
.chat-messages {
  flex: 1 1 0;
  position: relative;
  overflow-y: scroll;
  padding: 8px 60px;
}

.fab {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0px 0px 1rem rgba(0, 0, 0, 0.1);
}

.btn-scroll-bottom {
  position: fixed;
  right: 24px;
  bottom: 100px;
  background: #fff;
}

.message-day {
  position: sticky;
  position: -webkit-sticky;
  top: 0px;
  text-align: center;
}

.message-day span {
  padding: 4px 12px;
  font-size: 14px;
  border-radius: 8px;
  color: #777;
  background: rgba(255, 255, 255, 0.9);
}

.message {
  display: flex;
  margin: 6px 12px;
}

.self {
  justify-content: flex-end;
}

.message div {
  max-width: 75%;
  display: flex;
  flex-direction: column;
  padding: 10px 12px;
  padding-bottom: 4px;
  border-radius: 8px;
  background: #056162;
  color: #fff;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
}

.self > div {
  background: #fff;
  color: #000;
}
</style>
