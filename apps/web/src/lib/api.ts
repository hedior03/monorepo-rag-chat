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
      headers: {
        'Content-Type': 'application/json',
      },
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

type MessageInsert = {
  content: string;
  role: string;
  conversationId?: number;
};

export class MessageApi {
  public readonly ROOT_QUERY_KEY = 'messages';

  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await fetch(
      `${BASE_URL}/api/conversations/${conversationId}/messages`,
    );

    return response.json();
  }

  async createMessage(
    conversationId: string | undefined,
    message: string,
  ): Promise<Message> {
    const messageInsert: MessageInsert = {
      content: message,
      role: 'user',
      conversationId: conversationId
        ? Number.parseInt(conversationId)
        : undefined,
    };

    const response = await fetch(`${BASE_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageInsert),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error: ${response.status} - ${errorText}`);
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
  }
}

export type DocumentSimilarity = {
  similarity: number;
  documentId: number;
  content: string;
  metadata: Record<string, any>;
};

export class DocumentApi {
  public readonly ROOT_QUERY_KEY = 'documents';

  async uploadDocument(content: string, filename: string): Promise<number[]> {
    const response = await fetch(`${BASE_URL}/api/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, filename }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error: ${response.status} - ${errorText}`);
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
  }

  async queryDocuments(
    query: string,
    topK?: number,
  ): Promise<DocumentSimilarity[]> {
    const response = await fetch(`${BASE_URL}/api/documents/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, topK }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error: ${response.status} - ${errorText}`);
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
  }
}
