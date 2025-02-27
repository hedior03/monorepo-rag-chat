import { createFileRoute, useRouter } from '@tanstack/react-router';
import InputMessage from '~/components/components/InputMessage';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useCreateMessage } from '~/lib/hooks/messages';
export const Route = createFileRoute('/_conversation/')({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();

  const createMessageMutation = useCreateMessage({
    onSuccess: (message) => {
      router.navigate({
        to: '/$conversationId',
        params: { conversationId: message.conversationId },
      });
    },
  });

  return (
    <>
      <div className="flex flex-col h-full items-center justify-center">
        <Card className="w-2/3 h-1/4">
          <CardHeader>
            <CardTitle>Welcome to the RAG Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This is a chatbot that uses a RAG (Retrieval-Augmented Generation)
              model to answer questions.
            </p>
          </CardContent>
        </Card>
      </div>

      <InputMessage onSubmit={createMessageMutation.mutate} />
    </>
  );
}
