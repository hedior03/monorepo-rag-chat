import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  rerankDocuments,
  scoreDocumentsWithAI,
  processRerankedDocuments,
} from '@/api/services/ai';
import { generateObject } from 'ai';
import { myProvider } from '@/api/lib/ai/models';
import { generateRerankingPrompt } from '@/api/lib/ai/prompts';

vi.mock('ai', () => ({
  generateObject: vi.fn(),
}));

vi.mock('@/api/lib/ai/models', () => ({
  myProvider: {
    languageModel: vi.fn(),
  },
  chatModels: [{ id: 'chat-model-small' }],
}));

vi.mock('@/api/lib/ai/prompts', () => ({
  generateRerankingPrompt: vi.fn(),
}));

describe('Document reranking functions', () => {
  const mockQuery = 'test query';
  const mockDocuments = [
    { content: 'document 1', filename: 'file1.txt' },
    { content: 'document 2', filename: 'file2.txt' },
    { content: 'document 3', filename: 'file3.txt' },
  ];

  const mockScoredDocuments = [
    { documentContent: 'document 1', relevanceScore: 8 },
    { documentContent: 'document 2', relevanceScore: 5 },
    { documentContent: 'document 3', relevanceScore: 0 },
    { documentContent: 'unknown document', relevanceScore: 7 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(generateRerankingPrompt).mockReturnValue('mocked prompt');

    vi.mocked(myProvider.languageModel).mockReturnValue('mocked model' as any);

    vi.mocked(generateObject).mockResolvedValue({
      object: {
        documents: mockScoredDocuments,
      },
    } as any);
  });

  describe('scoreDocumentsWithAI', () => {
    it('should call generateObject with the correct parameters and return scored documents', async () => {
      const result = await scoreDocumentsWithAI(mockQuery, mockDocuments);

      expect(generateRerankingPrompt).toHaveBeenCalledWith(
        mockQuery,
        mockDocuments,
      );
      expect(myProvider.languageModel).toHaveBeenCalledWith('chat-model-small');
      expect(generateObject).toHaveBeenCalledWith({
        prompt: 'mocked prompt',
        model: 'mocked model',
        schema: expect.any(Object),
        maxRetries: 3,
      });

      expect(result).toEqual(mockScoredDocuments);
    });
  });

  describe('processRerankedDocuments', () => {
    it('should process, filter, and sort documents correctly', () => {
      const result = processRerankedDocuments(
        mockScoredDocuments,
        mockDocuments,
      );

      expect(result).toHaveLength(2);
      expect(result[0].content).toBe('document 1');
      expect(result[0].relevanceScore).toBe(8);
      expect(result[1].content).toBe('document 2');
      expect(result[1].relevanceScore).toBe(5);

      expect(
        result.find((doc) => doc.content === 'document 3'),
      ).toBeUndefined();

      expect(
        result.find((doc) => doc.content === 'unknown document'),
      ).toBeUndefined();
    });
  });

  describe('rerankDocuments', () => {
    it('should rerank documents based on relevance scores', async () => {
      const result = await rerankDocuments(mockQuery, mockDocuments);

      expect(result).toHaveLength(2);
      expect(result[0].content).toBe('document 1');
      expect(result[0].relevanceScore).toBe(8);
      expect(result[1].content).toBe('document 2');
      expect(result[1].relevanceScore).toBe(5);

      expect(
        result.find((doc) => doc.content === 'document 3'),
      ).toBeUndefined();

      expect(
        result.find((doc) => doc.content === 'unknown document'),
      ).toBeUndefined();
    });
  });
});
