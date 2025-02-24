import { useMutation, useQuery } from '@tanstack/react-query';
import { MessageApi } from '../api';

const messageApi = new MessageApi();

export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: [messageApi.ROOT_QUERY_KEY, conversationId],
    queryFn: () => messageApi.getMessages(conversationId),
  });
};

export const useCreateMessage = (conversationId: string) => {
  return useMutation({
    mutationKey: [messageApi.ROOT_QUERY_KEY, conversationId],
    mutationFn: (message: string) =>
      messageApi.createMessage(conversationId, message),
  });
};
