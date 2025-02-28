import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getStructuredResponse } from './structure-response';
import { z } from 'zod';
import * as ai from 'ai';
import type { JSONValue } from 'ai';

vi.mock('ai', () => {
  return {
    generateObject: vi.fn(),
  };
});

describe('getStructuredResponse', () => {
  const testSchema = z.object({
    name: z.string(),
    value: z.number(),
  });

  const mockModel = {
    id: 'test-model',
    invoke: vi.fn(),
  } as unknown as ai.LanguageModelV1;

  const baseOptions = {
    prompt: 'Generate a test object',
    schema: testSchema,
    model: mockModel,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns object on successful generation', async () => {
    const mockObject = { name: 'Test', value: 42 };

    vi.mocked(ai.generateObject).mockResolvedValueOnce({
      object: mockObject,
    } as unknown as ai.GenerateObjectResult<JSONValue>);

    const result = await getStructuredResponse(baseOptions);

    expect(result).toEqual(mockObject);
    expect(ai.generateObject).toHaveBeenCalledTimes(1);
  });

  it('retries on failed generation and succeeds', async () => {
    vi.mocked(ai.generateObject).mockResolvedValueOnce({
      object: null,
    } as unknown as ai.GenerateObjectResult<JSONValue>);

    const mockObject = { name: 'Success', value: 100 };
    vi.mocked(ai.generateObject).mockResolvedValueOnce({
      object: mockObject,
    } as unknown as ai.GenerateObjectResult<JSONValue>);

    const result = await getStructuredResponse(baseOptions);

    expect(result).toEqual(mockObject);
    expect(ai.generateObject).toHaveBeenCalledTimes(2);
  });

  it('throws error when all attempts fail', async () => {
    vi.mocked(ai.generateObject).mockResolvedValue({
      object: null,
    } as unknown as ai.GenerateObjectResult<JSONValue>);

    await expect(
      getStructuredResponse({
        ...baseOptions,
        maxAttempts: 2,
      }),
    ).rejects.toThrow('Failed to generate structured data');

    expect(ai.generateObject).toHaveBeenCalledTimes(2);
  });

  it('uses default maxAttempts (3) when not specified', async () => {
    vi.mocked(ai.generateObject).mockResolvedValue({
      object: null,
    } as unknown as ai.GenerateObjectResult<JSONValue>);

    await expect(getStructuredResponse(baseOptions)).rejects.toThrow();

    expect(ai.generateObject).toHaveBeenCalledTimes(3);
  });
});
