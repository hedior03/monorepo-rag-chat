export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  conversationId: string;
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

export class ConversationApi {
  public readonly ROOT_QUERY_KEY = 'conversations';

  async createConversation() {
    const response = await fetch(`${BASE_URL}/api/conversations`, {
      method: 'POST',
    });

    return response.json();
  }

  async getConversation(id: string): Promise<Conversation> {
    const response = await fetch(`${BASE_URL}/api/conversations/${id}`);

    return response.json();
  }

  async getConversations(): Promise<Conversation[]> {
    const response = await fetch(`${BASE_URL}/api/conversations`);

    return response.json();
  }

  async deleteConversation(id: string) {
    await fetch(`${BASE_URL}/api/conversations/${id}`, {
      method: 'DELETE',
    });
  }
}

export class MessageApi {
  public readonly ROOT_QUERY_KEY = 'messages';

  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await fetch(
      `${BASE_URL}/api/conversations/${conversationId}/messages`,
    );

    return response.json();
  }

  async createMessage(
    conversationId: string,
    message: string,
  ): Promise<Message> {
    const response = await fetch(
      `${BASE_URL}/api/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        body: JSON.stringify({ message }),
      },
    );

    return response.json();
  }
}
