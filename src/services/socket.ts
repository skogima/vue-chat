import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

const sock = new SockJS(process.env.VUE_APP_CHAT_URL);
const stomp = Stomp.over(sock, {
    debug: false,
});

export default stomp;