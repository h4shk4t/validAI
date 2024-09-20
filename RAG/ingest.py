from llama_index.core import Document, Settings, StorageContext, VectorStoreIndex
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.schema import BaseNode
from llama_index.vector_stores.faiss import FaissVectorStore
import faiss


def split_text(text: str) -> list[BaseNode]:
    splitter = SentenceSplitter(chunk_size=200, chunk_overlap=0)
    nodes = splitter.get_nodes_from_documents([Document(text=text)])


Settings.embed_model = OpenAIEmbedding(
    api_base="https://api.red-pill.ai/v1",
    api_key="sk-42oA7mOer5JPI5vND4BUwz0sKkoiMDwuQzN23n0OXd0gXv3z",
    model="text-embedding-3-large",
)

nodes = []
faiss_index = faiss.IndexFlatIP(3072)
vector_store = FaissVectorStore(faiss_index=faiss_index)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex(nodes, storage_context=storage_context)

index.storage_context.persist("./index_store/")
