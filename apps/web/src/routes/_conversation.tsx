import { createFileRoute, Outlet } from '@tanstack/react-router';
import ChatsSidebar from '~/components/ChatsSidebar';
import InputMessage from '~/components/components/InputMessage';
import { useTheme } from '~/components/theme-provider';
import { SidebarInset, SidebarTrigger } from '~/components/ui/sidebar';
import { ThemeToggle } from '~/components/ui/theme-toggle';
import { ConversationApi } from '~/lib/api';
import {
  useConversations,
  useCreateConversation,
  useDeleteConversation,
} from '~/lib/hooks/conversations';
import { queryClient } from '~/lib/providers/app-client-provider';

export const Route = createFileRoute('/_conversation')({
  component: HomeComponent,
  loader: async () => {
    const conversationApi = new ConversationApi();
    const conversations = await conversationApi.getConversations();

    queryClient.setQueryData([conversationApi.ROOT_QUERY_KEY], conversations);
    return null;
  },
});

function HomeComponent() {
  useTheme();

  const conversationsQuery = useConversations();
  const createConversationMutation = useCreateConversation();
  const deleteConversationMutation = useDeleteConversation();

  const handleCreateConversation = () => {
    createConversationMutation.mutate(undefined, {
      onSuccess: () => {
        conversationsQuery.refetch();
      },
    });
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversationMutation.mutate(id, {
      onSuccess: () => {
        conversationsQuery.refetch();
      },
    });
  };

  if (conversationsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (conversationsQuery.isError || !conversationsQuery.data) {
    return <div>Error</div>;
  }

  return (
    <>
      <ChatsSidebar conversations={conversationsQuery.data} />
      <div className="min-h-screen bg-background text-foreground w-full">
        <SidebarInset>
          <div className="flex flex-row justify-between items-center gap-4 w-full p-2 border-b border-accent">
            <SidebarTrigger />
            <ThemeToggle />
          </div>
          <div className="flex flex-col justify-between h-full overflow-hidden">
            <Outlet />
            <InputMessage onSubmit={() => {}} />
          </div>
        </SidebarInset>
      </div>
    </>
  );
}
