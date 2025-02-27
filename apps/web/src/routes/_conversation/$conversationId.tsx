import { createFileRoute, useParams } from '@tanstack/react-router';
import { useConversation } from '~/lib/hooks/conversations';
import { MessageApi } from '~/lib/api';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

export const Route = createFileRoute('/_conversation/$conversationId')({
  component: ConversationComponent,
  validateSearch: (search) => {
    return {};
  },
  loader: async ({ params }) => {
    // If we have a conversation ID, we can preload the conversation data
    if (params.conversationId) {
      // You could preload conversation data here if needed
    }
    return null;
  },
});

function ConversationComponent() {
  const { conversationId } = useParams({
    from: '/_conversation/$conversationId',
  });

  console.log(conversationId);

  const [message, setMessage] = useState('');
  const messageApi = new MessageApi();

  // If conversationId is undefined, we're on the index route without a conversation
  const conversationQuery = useConversation(conversationId);

  const sendMessageMutation = useMutation({
    mutationFn: (text: string) =>
      messageApi.createMessage(conversationId, text),
    onSuccess: () => {
      setMessage('');
      conversationQuery.refetch();
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  // Loading state
  if (conversationQuery.isLoading) {
    return <div className="p-4">Loading conversation...</div>;
  }

  // Error state
  if (conversationQuery.isError || !conversationQuery.data) {
    return <div className="p-4">Error loading conversation</div>;
  }

  const conversation = conversationQuery.data;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">{conversation.title}</h1>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {conversation.messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground ml-auto'
                : 'bg-muted mr-auto'
            } max-w-[80%]`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-md"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            type="button"
            onClick={handleSendMessage}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            disabled={!message.trim() || sendMessageMutation.isPending}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
