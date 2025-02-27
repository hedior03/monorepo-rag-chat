import { createFileRoute, Outlet } from '@tanstack/react-router';
import ChatsSidebar from '~/components/ChatsSidebar';
import { useTheme } from '~/components/theme-provider';
import { SidebarInset, SidebarTrigger } from '~/components/ui/sidebar';
import { ThemeToggle } from '~/components/ui/theme-toggle';
import { ConversationApi } from '~/lib/api';
import {
  useConversations,
  useDeleteConversation,
} from '~/lib/hooks/conversations';
import { queryClient } from '~/lib/providers/app-client-provider';
import { Button } from '~/components/ui/button';
import { FileUpIcon, Loader2 } from 'lucide-react';
import { useUploadDocument } from '~/lib/hooks/documents';
import { handleDocumentUpload } from '~/lib/handle-upload-document';

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
  const deleteConversationMutation = useDeleteConversation();
  const uploadDocumentMutation = useUploadDocument();
  const onUploadDocument = () =>
    handleDocumentUpload(uploadDocumentMutation.mutate);

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
      <ChatsSidebar conversations={conversationsQuery.data ?? []} />
      <div className="min-h-screen bg-background text-foreground w-full">
        <SidebarInset>
          <div className="flex flex-row justify-between items-center gap-4 w-full p-2 border-b border-accent">
            <SidebarTrigger />
            <div className="flex flex-row items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="icon"
                onClick={onUploadDocument}
                disabled={uploadDocumentMutation.isPending}
                title="Upload Document"
              >
                {uploadDocumentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileUpIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex flex-col justify-between h-full overflow-hidden">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </>
  );
}
