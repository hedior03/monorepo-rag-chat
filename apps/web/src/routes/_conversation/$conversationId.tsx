import { createFileRoute, useParams } from '@tanstack/react-router';
import { useConversation } from '~/lib/hooks/conversations';
import InputMessage from '~/components/components/InputMessage';
import { Message } from '~/components/components/message';
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary';
import { useCreateMessage } from '~/lib/hooks/messages';

export const Route = createFileRoute('/_conversation/$conversationId')({
  component: ConversationComponent,
  errorComponent: DefaultCatchBoundary,
});

function ConversationComponent() {
  const { conversationId } = useParams({
    from: '/_conversation/$conversationId',
  });

  const conversationQuery = useConversation(conversationId);
  const sendMessageMutation = useCreateMessage({
    conversationId,
    onSuccess: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await conversationQuery.refetch();
    },
  });

  if (conversationQuery.isLoading) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center">
        <p>Loading conversation...</p>
      </div>
    );
  }
  const conversation = conversationQuery.data;

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col-reverse flex-1 overflow-y-auto p-4 gap-4">
        {conversation.messages.map((message) => (
          <Message
            key={message.id}
            userRole={message.role}
            content={message.content}
          />
        ))}
      </div>
      <div className="p-4 border-t ">
        <InputMessage
          onSubmit={sendMessageMutation.mutate}
          isLoading={sendMessageMutation.isPending}
        />
      </div>
    </div>
  );
}
