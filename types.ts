
export interface Message {
  id: string;
  sender: string;
  preview: string;
  time: string;
  unread: boolean;
  avatar: string;
}

export interface Notification {
  id: string;
  app: string;
  title: string;
  content: string;
  time: string;
}

export type ScreenType = 'Home' | 'Messages' | 'Settings' | 'Phone';
export type PhoneTab = 'Keypad' | 'Recents' | 'Contacts';
