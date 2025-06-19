'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Chat from './Chat';
import { CookieConsentBanner } from '@/components/cookieConsentBanner';

export default function HomeClient() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);
  const [initialMessages, setInitialMessages] = useState<any[]>([]);
  const [initialConversationId, setInitialConversationId] = useState<string | undefined>(undefined);
  const [chatAccess, setChatAccess] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        window.location.href = '/auth';
        return;
      }

      // Fetch conversations
      const resConvo = await fetch('/api/conversations');
      const conversationsData = await resConvo.json();
      setConversations(conversationsData);

      // Fetch messages for first conversation
      let firstConversationId;
      let messages = [];
      if (conversationsData.length > 0) {
        firstConversationId = conversationsData[0].conversationId;
        setInitialConversationId(firstConversationId);
        const resMessages = await fetch(`/api/messages?conversationId=${firstConversationId}`);
        messages = await resMessages.json();
        setInitialMessages(messages);
      }

      // Fetch chat access
      const resAccess = await fetch(`/api/chat-access?userId=${user.id}`);
      const chatAccessData = await resAccess.json();
      setChatAccess(chatAccessData);

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <>
      <CookieConsentBanner />
      <Chat
        initialUserId={user.id}
        initialEmail={user.email}
        initialConversations={conversations}
        initialMessages={initialMessages}
        initialConversationId={initialConversationId}
        initialChatAccess={chatAccess}
      />
    </>
  );
}
