import type { Conversation } from '../lib/api';

export type ConversationListProps = {
  conversations: Conversation[];
  onConversationClick: (conversationId: string) => void;
  onConversationDelete: (conversationId: string) => void;
  onConversationCreate: () => void;
};

export function ConversationList({
  conversations,
  onConversationClick,
  onConversationDelete,
  onConversationCreate,
}: ConversationListProps) {
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onConversationCreate}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        New Conversation
      </button>

      <ul className="space-y-2">
        {conversations?.map((conversation) => (
          <li
            key={conversation.id}
            className="flex items-center justify-between p-4 bg-white rounded shadow"
          >
            {/* <Link to={}></Link> */}
            <span>
              Conversation #{conversation.id}
              <span className="ml-2 text-sm text-gray-500">
                {new Date(conversation.createdAt).toLocaleString()}
              </span>
            </span>
            <button
              type="button"
              onClick={() => onConversationDelete(conversation.id)}
              className="px-3 py-1 text-sm text-red-500 hover:text-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
