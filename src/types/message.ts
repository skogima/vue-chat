import { Sender } from "./sender";

export interface Message {
  content: string;
  timestamp: Date;
  sender: Sender;
  isFromSender: boolean;
  to: string;
};
