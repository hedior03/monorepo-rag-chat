import { toast } from 'sonner';
import { DocumentApi } from '~/lib/api';
import type { DocumentSimilarity } from '~/lib/api';
import { useMutation } from '@tanstack/react-query';

export type DocumentUploadResponse = number[];

export type DocumentQueryParams = {
  query: string;
  topK?: number;
};

const documentApi = new DocumentApi();

export const useUploadDocument = () => {
  return useMutation<
    DocumentUploadResponse,
    Error,
    { content: string; filename: string }
  >({
    mutationKey: [documentApi.ROOT_QUERY_KEY, 'upload'],
    mutationFn: ({
      content,
      filename,
    }: { content: string; filename: string }) =>
      documentApi.uploadDocument(content, filename),
    throwOnError: false,
    onSuccess: () => {
      toast.success('Document uploaded successfully');
    },
    onError: (error) => {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    },
  });
};

export const useQueryDocuments = () => {
  return useMutation<DocumentSimilarity[], Error, DocumentQueryParams>({
    mutationKey: [documentApi.ROOT_QUERY_KEY, 'query'],
    mutationFn: ({ query, topK }: DocumentQueryParams) =>
      documentApi.queryDocuments(query, topK),
    throwOnError: false,
  });
};
