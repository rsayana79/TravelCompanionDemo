export interface Message {
  currentUserID: number
  senderId: number;
  senderUserName: string;
  recipientId: number;
  recipientUserName: string;
  content: string;
  dateRead?: Date;
  messageSent: Date;
}