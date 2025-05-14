
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Seller } from '@/types';
import { useMessages } from '@/contexts/MessageContext';

interface MessageFormProps {
  seller: Seller;
  onMessageSent?: () => void;
}

const MessageForm = ({ seller, onMessageSent }: MessageFormProps) => {
  const [message, setMessage] = useState('');
  const { sendMessage } = useMessages();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      sendMessage(seller.id, message);
      setMessage('');
      
      if (onMessageSent) {
        onMessageSent();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium">Message {seller.name}</h3>
      <Textarea
        placeholder={`Ask ${seller.name} about their ceramics...`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[120px]"
      />
      <Button 
        type="submit"
        className="bg-gray-600 hover:bg-ceramic-secondary"
        disabled={!message.trim()}
      >
        Send Message
      </Button>
    </form>
  );
};

export default MessageForm;
