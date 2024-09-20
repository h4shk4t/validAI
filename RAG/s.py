from llama_index.core import (
    QueryBundle,
    Settings,
    StorageContext,
    load_index_from_storage,
)
from llama_index.core.retrievers import BaseRetriever
from llama_index.core.retrievers.fusion_retriever import (
    FUSION_MODES,
    QueryFusionRetriever,
)
from llama_index.core.schema import NodeWithScore, TextNode
from llama_index.retrievers.bm25 import BM25Retriever
from llama_index.vector_stores.faiss import FaissVectorStore

# from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.embeddings.openai import OpenAIEmbedding

embed_model = OpenAIEmbedding(
    api_base="https://api.red-pill.ai/v1",
    api_key="sk-42oA7mOer5JPI5vND4BUwz0sKkoiMDwuQzN23n0OXd0gXv3z",
    model="text-embedding-3-large",
)

embeddings = embed_model.get_text_embedding(
    "Open AI new Embeddings models is great."
)
print(embeddings[:5])
vector_store = FaissVectorStore.from_persist_dir("./index_store/")
storage_context = StorageContext.from_defaults(
    vector_store=vector_store, persist_dir="./index_store/"
)
index = load_index_from_storage(storage_context=storage_context)
vector_retriever = index.as_retriever(similarity_top_k=10)
bm25_retriever = BM25Retriever.from_defaults(
    docstore=index.docstore, similarity_top_k=10
)
retriever = QueryFusionRetriever(
    [
        vector_retriever,
        bm25_retriever,
    ],
    similarity_top_k=10,
    num_queries=1,
    mode=FUSION_MODES.RECIPROCAL_RANK,
    use_async=True,
    verbose=True,
)

nodes_with_scores = retriever.retrieve("hello world")
results: list[NodeWithScore] = []
for node in nodes_with_scores:
    results.append(
        NodeWithScore(
            node=TextNode(
                text=node.get_text(),
                id_=node.id_,
            )
        ),
        score=node.score,
    )
