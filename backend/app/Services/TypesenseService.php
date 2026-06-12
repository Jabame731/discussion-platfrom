<?php

namespace App\Services;

use App\Models\Protocol;
use App\Models\Thread;
use Illuminate\Support\Facades\Log;
use Typesense\Client;
use Typesense\Exceptions\ObjectNotFound;

class TypesenseService 
{
    private Client $client;

    public const PROTOCOLS_COLLECTION = 'protocols';
    public const THREADS_COLLECTION   = 'threads';

    public function __construct()
    {
        $this->client = new Client([
            'api_key' => config('typesense.api_key'),
            'nodes'   => [
                [
                    'host'     => config('typesense.host'),
                    'port'     => config('typesense.port'),
                    'protocol' => config('typesense.protocol'),
                ],
            ],
            'connection_timeout_seconds' => 5,
            'verify' => false,
        ]);
    }

    // Collection setup
    public function createProtocolsCollection(): void
    {
        try {
            $this->client->collections[self::PROTOCOLS_COLLECTION]->retrieve();
            // Already exists
        } catch (ObjectNotFound) {
            $this->client->collections->create([
                'name'   => self::PROTOCOLS_COLLECTION,
                'fields' => [
                    ['name' => 'id',              'type' => 'string'],
                    ['name' => 'title',           'type' => 'string'],
                    ['name' => 'content',         'type' => 'string'],
                    ['name' => 'tags',            'type' => 'string[]', 'facet' => true],
                    ['name' => 'author_name',     'type' => 'string'],
                    ['name' => 'status',          'type' => 'string',   'facet' => true],
                    ['name' => 'average_rating',  'type' => 'float'],
                    ['name' => 'reviews_count',   'type' => 'int32'],
                    ['name' => 'upvotes_count',   'type' => 'int32'],
                    ['name' => 'downvotes_count', 'type' => 'int32'],
                    ['name' => 'created_at',      'type' => 'int64',    'sort' => true],
                ],
                'default_sorting_field' => 'created_at',
            ]);
        }
    }

    public function createThreadsCollection(): void
    {
        try {
            $this->client->collections[self::THREADS_COLLECTION]->retrieve();
        } catch (ObjectNotFound) {
            $this->client->collections->create([
                'name'   => self::THREADS_COLLECTION,
                'fields' => [
                    ['name' => 'id',              'type' => 'string'],
                    ['name' => 'title',           'type' => 'string'],
                    ['name' => 'body',            'type' => 'string'],
                    ['name' => 'tags',            'type' => 'string[]', 'facet' => true],
                    ['name' => 'author_name',     'type' => 'string'],
                    ['name' => 'protocol_id',     'type' => 'int64',    'optional' => true],
                    ['name' => 'protocol_title',  'type' => 'string',   'optional' => true],
                    ['name' => 'status',          'type' => 'string',   'facet' => true],
                    ['name' => 'upvotes_count',   'type' => 'int32'],
                    ['name' => 'downvotes_count', 'type' => 'int32'],
                    ['name' => 'comments_count',  'type' => 'int32'],
                    ['name' => 'created_at',      'type' => 'int64',    'sort' => true],
                ],
                'default_sorting_field' => 'created_at',
            ]);
        }
    }

    // Index single documents
    public function indexProtocol(Protocol $protocol): void
    {
        try {
            $this->client->collections[self::PROTOCOLS_COLLECTION]
                ->documents
                ->upsert($this->protocolToDocument($protocol));
        } catch (\Throwable $e) {
            Log::error('Typesense indexProtocol error', ['id' => $protocol->id, 'error' => $e->getMessage()]);
        }
    }

    public function deleteProtocol(int $id): void
    {
        try {
            $this->client->collections[self::PROTOCOLS_COLLECTION]->documents[(string) $id]->delete();
        } catch (\Throwable $e) {
            Log::warning('Typesense deleteProtocol error', ['id' => $id, 'error' => $e->getMessage()]);
        }
    }

    public function indexThread(Thread $thread): void
    {
        try {
            $this->client->collections[self::THREADS_COLLECTION]
                ->documents
                ->upsert($this->threadToDocument($thread));
        } catch (\Throwable $e) {
            Log::error('Typesense indexThread error', ['id' => $thread->id, 'error' => $e->getMessage()]);
        }
    }

    public function deleteThread(int $id): void
    {
        try {
            $this->client->collections[self::THREADS_COLLECTION]->documents[(string) $id]->delete();
        } catch (\Throwable $e) {
            Log::warning('Typesense deleteThread error', ['id' => $id, 'error' => $e->getMessage()]);
        }
    }
    
    // Bulk reindex
    public function reindexAll(): array
    {
        $results = ['protocols' => 0, 'threads' => 0, 'errors' => []];

        $this->createProtocolsCollection();
        $this->createThreadsCollection();

        Protocol::with('author')->chunk(100, function ($protocols) use (&$results) {
            foreach ($protocols as $protocol) {
                try {
                    $this->client->collections[self::PROTOCOLS_COLLECTION]
                        ->documents
                        ->upsert($this->protocolToDocument($protocol));
                    $results['protocols']++;
                } catch (\Throwable $e) {
                    $results['errors'][] = "Protocol {$protocol->id}: {$e->getMessage()}";
                }
            }
        });

        Thread::with(['author', 'protocol'])->chunk(100, function ($threads) use (&$results) {
            foreach ($threads as $thread) {
                try {
                    $this->client->collections[self::THREADS_COLLECTION]
                        ->documents
                        ->upsert($this->threadToDocument($thread));
                    $results['threads']++;
                } catch (\Throwable $e) {
                    $results['errors'][] = "Thread {$thread->id}: {$e->getMessage()}";
                }
            }
        });

        return $results;
    }

    // Search
    public function searchProtocols(string $query, array $options = []): array
    {
        $params = array_merge([
            'q'          => $query ?: '*',
            'query_by'   => 'title,content,tags',
            'sort_by'    => 'created_at:desc',
            'per_page'   => $options['per_page'] ?? 15,
            'page'       => $options['page'] ?? 1,
        ], $options);

        return $this->client->collections[self::PROTOCOLS_COLLECTION]
            ->documents
            ->search($params);
    }

    public function searchThreads(string $query, array $options = []): array
    {
        $params = array_merge([
            'q'        => $query ?: '*',
            'query_by' => 'title,body,tags',
            'sort_by'  => 'created_at:desc',
            'per_page' => $options['per_page'] ?? 15,
            'page'     => $options['page'] ?? 1,
        ], $options);

        return $this->client->collections[self::THREADS_COLLECTION]
            ->documents
            ->search($params);
    }
    

    // Document Serializers
    private function protocolToDocument(Protocol $protocol): array
    {
        $protocol->loadMissing('author');

        return [
            'id'              => (string) $protocol->id,
            'slug'            => $protocol->slug,
            'title'           => $protocol->title,
            'content'         => strip_tags($protocol->content),
            'tags'            => $protocol->tags ?? [],
            'author_name'     => $protocol->author?->name ?? 'Unknown',
            'status'          => $protocol->status,
            'average_rating'  => (float) $protocol->average_rating,
            'reviews_count'   => (int) $protocol->reviews_count,
            'upvotes_count'   => (int) $protocol->upvotes_count,
            'downvotes_count' => (int) $protocol->downvotes_count,
            'created_at'      => $protocol->created_at->timestamp,
        ];
    }

    private function threadToDocument(Thread $thread): array
    {
        $thread->loadMissing(['author', 'protocol']);

        return [
            'id'              => (string) $thread->id,
            'slug'            => $thread->slug,
            'title'           => $thread->title,
            'body'            => strip_tags($thread->body),
            'tags'            => $thread->tags ?? [],
            'author_name'     => $thread->author?->name ?? 'Unknown',
            'protocol_id'     => $thread->protocol_id ?? 0,
            'protocol_title'  => $thread->protocol?->title ?? '',
            'status'          => $thread->status,
            'upvotes_count'   => (int) $thread->upvotes_count,
            'downvotes_count' => (int) $thread->downvotes_count,
            'comments_count'  => (int) $thread->comments_count,
            'created_at'      => $thread->created_at->timestamp,
        ];
    }

}