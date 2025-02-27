import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
export const Route = createFileRoute('/_conversation/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
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
  );
}
