import { SendHorizontal } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { z } from 'zod';

const createMessageSchema = z.object({
  content: z.object({
    type: z.literal('text'),
    text: z.string(),
  }),
  role: z.literal('user'),
});

type FormValues = z.infer<typeof createMessageSchema>;

interface InputMessageProps {
  onSubmit: (content: string) => void | Promise<void>;
  isLoading?: boolean;
}

export default function InputMessage({
  onSubmit,
  isLoading = false,
}: InputMessageProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      content: {
        type: 'text',
        text: '',
      },
      role: 'user',
    },
  });

  function handleSubmit(data: FormValues) {
    onSubmit(data.content.text);
    form.reset({
      content: {
        type: 'text',
        text: '',
      },
      role: 'user',
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full items-center space-x-2 gap-2 px-2"
      >
        <FormField
          control={form.control}
          name="content.text"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder="Type your message..."
                  autoComplete="off"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          <SendHorizontal className="size-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </Form>
  );
}
