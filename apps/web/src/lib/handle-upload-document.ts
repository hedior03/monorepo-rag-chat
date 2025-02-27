import { toast } from 'sonner';

export const handleDocumentUpload = async (
  mutateFn: ({
    content,
    filename,
  }: {
    content: string;
    filename: string;
  }) => void,
) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.txt,.md';

  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      mutateFn({ content, filename: file.name });
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error('Failed to read document');
    }
  };

  input.click();
};
