export interface Message {
    senderId: number;
    senderUserName: string;    
    recipientId: number;
    recipientUserName: string;    
    content: string;
    dateRead?: Date;
    messageSent: Date;
  }