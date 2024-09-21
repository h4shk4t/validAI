import os
import faiss
import shutil
from dotenv import load_dotenv
from llama_index.core import Document, Settings, StorageContext, VectorStoreIndex
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.schema import BaseNode
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.vector_stores.faiss import FaissVectorStore
from llama_index.core.retrievers.fusion_retriever import (
    QueryFusionRetriever,
    FUSION_MODES,
)
from llama_index.core import load_index_from_storage
from llama_index.retrievers.bm25 import BM25Retriever
from llama_index.vector_stores.faiss import FaissVectorStore

load_dotenv()


index_store = os.environ["INDEX_STORE"]


Settings.embed_model = OpenAIEmbedding(
    api_base="https://api.red-pill.ai/v1",
    api_key=os.environ["API_KEY"],
    model="text-embedding-3-large",
)


def search(query: str):
    vector_store = FaissVectorStore.from_persist_dir(index_store)
    storage_context = StorageContext.from_defaults(
        vector_store=vector_store, persist_dir=index_store
    )

    index = load_index_from_storage(storage_context=storage_context)
    vector_retriever = index.as_retriever(similarity_top_k=10, verbose=True)
    bm25_retriever = BM25Retriever.from_defaults(
        docstore=index.docstore, similarity_top_k=10, verbose=True
    )
    hybrid_retriever = QueryFusionRetriever(
        [vector_retriever, bm25_retriever],
        similarity_top_k=5,
        num_queries=1,
        mode=FUSION_MODES.RECIPROCAL_RANK,
        # highly semantic search gives best results
        retriever_weights=[0.8, 0.2],
        use_async=True,
        verbose=True,
    )
    results = hybrid_retriever.retrieve(query)
    nodes = []
    for result in results:
        nodes.append(
            {"text": result.node.text, "file_path": result.node.metadata["file_path"]}
        )

    return nodes


def get_markdown_github(link: str, index_name: str) -> str:
    """
    Clones a GitHub repository and copies markdown files to a new directory.
    Returns the directory where markdown files are stored.
    """
    # Extract repository name from link
    repo_name = link.split("github.com/")[1].strip("/")
    repo_name = repo_name.split("/")[1]

    # Clone repository
    os.system(f"git clone {link}")

    # Create distribution directory
    dist_directory = f"{index_name}_dist"
    os.makedirs(dist_directory, exist_ok=True)

    # Copy markdown files
    i = 0
    for root, _, files in os.walk(repo_name):
        for file in files:
            if file.endswith(".md") or file.endswith(".mdx"):
                file_path = os.path.join(root, file)
                shutil.copy(file_path, dist_directory)
                i += 1

    print(f"Number of document files for ingestion: {i}")

    # Remove cloned repository
    os.system(f"rm -rf {repo_name}")

    return dist_directory


def split_text(text: str, file_path: str) -> list[BaseNode]:
    """
    Splits the text into chunks and returns a list of BaseNode objects with metadata.
    """
    splitter = SentenceSplitter(chunk_size=500, chunk_overlap=0)
    nodes = splitter.get_nodes_from_documents([Document(text=text)])

    for node in nodes:
        node.metadata = {"file_path": f"./{file_path}"}

    return nodes


def process_markdown(path: str) -> list[BaseNode]:
    """
    Processes markdown files in the specified directory by splitting them into nodes.
    Returns a list of nodes.
    """
    nodes = []
    for file in os.listdir(path):
        file_path = os.path.join(path, file)
        try:
            with open(file_path, "r") as f:
                text = f.read()
                nodes.extend(split_text(text, file_path))
        except FileNotFoundError:
            print(f"File not found: {file_path}")
        except Exception as e:
            print(f"An error occurred while processing {file_path}: {e}")

    return nodes


def add_docs_to_index(link: str, index_name: str) -> None:
    dist_directory = get_markdown_github(link, index_name)
    print("Processing markdown files...")
    nodes = process_markdown(dist_directory)
    print("Adding documents to index...")
    vector_store = FaissVectorStore.from_persist_dir(index_store)
    print("Vector store loaded")
    storage_context = StorageContext.from_defaults(
        vector_store=vector_store, persist_dir=index_store
    )
    print("Storage context created")
    index = load_index_from_storage(storage_context=storage_context)
    index.insert_nodes(nodes)
    print("Documents added to index")
    index.storage_context.persist(index_store)
    print("Index persisted")
