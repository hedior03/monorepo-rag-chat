import { useMutation, useQuery } from '@tanstack/react-query';
import { type Message, MessageApi } from '~/lib/api';

const messageApi = new MessageApi();

export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: [messageApi.ROOT_QUERY_KEY, conversationId],
    queryFn: () => messageApi.getMessages(conversationId),
  });
};

export type UseCreateMessageProps = {
  conversationId?: string;
  onSuccess?: (message: Message) => void;
};

export const useCreateMessage = ({
  conversationId,
  onSuccess,
}: UseCreateMessageProps = {}) => {
  return useMutation({
    mutationKey: [messageApi.ROOT_QUERY_KEY, conversationId],
    mutationFn: (message: string) =>
      messageApi.createMessage(conversationId, message),
    onSuccess,
  });
};
