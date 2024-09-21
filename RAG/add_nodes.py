import os
import faiss
import argparse
import shutil
from dotenv import load_dotenv, find_dotenv
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


# sample command to run the script
# python rag_pipeline.py --index-name near --repo-link https://github.com/near/docs --query "What is near network?"



load_dotenv(find_dotenv())

# Set OpenAI embedding model settings
Settings.embed_model = OpenAIEmbedding(
    api_base="https://api.red-pill.ai/v1",
    api_key=os.environ["API_KEY"],
    model="text-embedding-3-large",
)


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
  
def split_text(text: str, file_path: str) -> list[BaseNode]:
    """
    Splits the text into chunks and returns a list of BaseNode objects with metadata.
    """
    splitter = SentenceSplitter(chunk_size=500, chunk_overlap=0)
    nodes = splitter.get_nodes_from_documents([Document(text=text)])

    for node in nodes:
        node.metadata = {"file_path": f"./{file_path}"}

    return nodes
  
  
def something(link: str, index_name: str):
  dist_directory = get_markdown_github(link, index_name)
  nodes = process_markdown(dist_directory)
  vector_store = FaissVectorStore.from_persist_dir(os.environ["index_path"])
  storage_context = StorageContext.from_defaults(
      vector_store=vector_store, persist_dir=os.environ["index_path"]
  )
  index = load_index_from_storage(storage_context=storage_context)
  index.insert_nodes(nodes)
  index.storage_context.persist(os.environ["index_path"])

url = "https://github.com/morph-l2/morph-doc/"
url = url.strip("/")
print(url)
print(url.split("/")[-2])
something(url, url.split("/")[-2])