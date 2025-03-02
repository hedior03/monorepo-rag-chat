# Architectural Decision Record

## Overview

This document outlines the key architectural decisions made for our RAG (Retrieval-Augmented Generation) chat application, explaining the reasoning behind my technical choices.

## Technology Stack

### Monorepo Structure

- **Decision**: Organize the project as a monorepo with separate packages for API and web client.
- **Rationale**:
  - Simplifies dependency management across frontend and backend
  - Enables code sharing where appropriate (`TODO` wasn't fully integrated for configuration issues)
  - Streamlines development workflow and CI/CD processes
  - Facilitates coordinated versioning
  - Shows a clear boundary between the FE, API

### Backend Technology

- **Decision**: Hono API with TypeScript
- **Rationale**:
  - Lightweight, high-performance framework with minimal overhead
  - Strong TypeScript support for type safety
  - Easy to deploy to various environments (serverless, containers, etc.)
  - Simple but powerful API design

### Frontend Technology

- **Decision**: React with Tanstack Router
- **Rationale**:
  - React's component model supports our UI requirements
  - Tanstack Router provides type-safe routing with excellent performance
  - Modern SPA approach enables smooth user experience with a great Developer Experience

### Database

- **Decision**: PostgreSQL with pgvector extension
- **Rationale**:
  - Robust, mature relational database for general data storage
  - pgvector extension provides native vector operations for embeddings
  - ACID compliance ensures data integrity
  - The `vector` type and vector similarity operations enable efficient semantic search
  - Avoids the complexity of maintaining separate vector and relational databases

## AI and RAG Architecture

### Document Processing

- **Decision**: Use recursive character text splitter with configurable chunk size and overlap
- **Rationale**:
  - Recursive splitter respects document structure when possible
  - Configurable parameters allow tuning for different document types
  - Overlap prevents loss of context at chunk boundaries
  - Balances between information density and retrieval granularity

### Embedding Model

- **Decision**: Use OpenAI's text-embedding-3-small
- **Rationale**:
  - High-quality embeddings with good semantic understanding
  - 1536-dimensional vectors provide sufficient detail for semantic search
  - Smaller model balances cost and performance
  - Widely tested and reliable for production use

### Vector Similarity Search

- **Decision**: Implement cosine similarity with hnsw index
- **Rationale**:
  - Cosine similarity is effective for semantic matching
  - HNSW (Hierarchical Navigable Small World) index in pgvector enables fast approximate nearest neighbor search

### Prompt Enhancement

- **Decision**: Add LLM-based prompt enhancement step before retrieval
- **Rationale**:
  - Bridges the vocabulary gap between user queries and document language
  - Improves retrieval quality by making queries more specific
  - Leverages conversation history for context-aware query refinement
  - Helps address the "language mismatch" problem in RAG systems

### Reranking

- **Decision**: Implement LLM-based reranking with relevance scoring
- **Rationale**:
  - Vector similarity alone may not capture all aspects of relevance
  - LLM can make nuanced judgments about document relevance to the query
  - Scoring system (0-10) provides fine-grained control over relevance thresholds
  - Two-stage retrieval (vector search + reranking) balances efficiency and accuracy

### Response Generation

- **Decision**: Use formatted prompt with reranked document context for final response
- **Rationale**:
  - Provides clear instructions to the LLM about how to use the document context
  - Maintains conversation history for coherent multi-turn interactions
  - Structured prompt template improves response consistency
  - Clear attribution of information to source documents

## Data Model

### Conversations and Messages

- **Decision**: Classic conversation/message schema with references between them
- **Rationale**:
  - Simple but effective model for chat history
  - Enables retrieval and display of past conversations
  - Clear relationship between conversations and their messages

### Document Storage

- **Decision**: Store document chunks with metadata and embeddings
- **Rationale**:
  - Storing chunks rather than whole documents enables precise retrieval
  - Metadata (including source document info) maintains context
  - Embedding storage enables fast vector similarity operations
  - Text hash helps with deduplication and versioning

## Scalability Considerations

### Embedding Computation

- **Decision**: Generate and store embeddings at document upload time
- **Rationale**:
  - One-time computation cost during ingestion rather than at query time
  - Enables fast retrieval during conversation
  - Embedding model selection balances quality and computational cost

### Document Chunking Strategy

- **Decision**: Conservative chunking with meaningful overlap
- **Rationale**:
  - Smaller chunks enable more precise context retrieval
  - Overlap ensures context isn't lost at chunk boundaries
  - Environment variables enable tuning for different document types

### Query Processing Pipeline

- **Decision**: Multi-stage processing with prompt enhancement, retrieval, reranking, and generation
- **Rationale**:
  - Each stage addresses specific challenges in RAG systems
  - Pipeline can be optimized or modified independently
  - Clear separation of concerns facilitates debugging and improvement
