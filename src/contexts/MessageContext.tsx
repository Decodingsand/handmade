
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Message } from '../types';
import { messages as allMessages } from '../data/mockData';
import { useUser } from './UserContext';
import { toast } from '@/components/ui/use-toast';

interface MessageContextType {
  messages: Message[];
  sendMessage: (sellerId: string, content: string) => void;
  getMessagesBetween: (sellerId: string) => Message[];
  unreadMessageCount: number;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  useEffect(() => {
    if (currentUser) {
      // Filter messages for current user
      const userMessages = allMessages.filter(
        msg => msg.buyerId === currentUser.id || msg.sellerId === currentUser.id
      );
      setMessages(userMessages);
      
      // Count unread messages
      const unreadCount = userMessages.filter(
        msg => msg.buyerId === currentUser.id && !msg.read
      ).length;
      setUnreadMessageCount(unreadCount);
    } else {
      setMessages([]);
      setUnreadMessageCount(0);
    }
  }, [currentUser]);

  const sendMessage = (sellerId: string, content: string) => {
    if (!currentUser) return;
    
    const newMessage: Message = {
      id: `msg${Date.now()}`,
      buyerId: currentUser.id,
      sellerId: sellerId,
      content: content,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    // Add to in-memory messages
    allMessages.push(newMessage);
    
    // Update state
    setMessages(prev => [...prev, newMessage]);
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the seller.",
    });
  };

  const getMessagesBetween = (sellerId: string) => {
    if (!currentUser) return [];
    
    return messages.filter(
      msg => 
        (msg.buyerId === currentUser.id && msg.sellerId === sellerId) ||
        (msg.sellerId === currentUser.id && msg.buyerId === sellerId)
    ).sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  };

  return (
    <MessageContext.Provider value={{
      messages,
      sendMessage,
      getMessagesBetween,
      unreadMessageCount,
    }}>
      {children}
    </MessageContext.Provider>
  );
};
