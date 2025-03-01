import { ConversationApi } from '~/lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';

const conversationApi = new ConversationApi();

export const useConversations = (refetchInterval?: number) => {
  return useQuery({
    queryKey: [conversationApi.ROOT_QUERY_KEY],
    queryFn: () => conversationApi.getConversations(),
    throwOnError: true,
    refetchInterval: refetchInterval,
  });
};

export const useConversation = (id: string) => {
  return useQuery({
    queryKey: [conversationApi.ROOT_QUERY_KEY, id],
    queryFn: () => conversationApi.getConversation(id),
    throwOnError: true,
    refetchInterval: 2000,
  });
};

export const useCreateConversation = () => {
  return useMutation({
    mutationFn: () => conversationApi.createConversation(),
    throwOnError: true,
  });
};

export const useDeleteConversation = () => {
  return useMutation({
    mutationKey: [conversationApi.ROOT_QUERY_KEY],
    mutationFn: (id: string) => conversationApi.deleteConversation(id),
    throwOnError: true,
  });
};
