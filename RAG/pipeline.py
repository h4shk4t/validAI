import os
import sys
from llama_index.core import Document, Settings, StorageContext, VectorStoreIndex
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.schema import BaseNode
from llama_index.vector_stores.faiss import FaissVectorStore
import faiss
from llama_index.embeddings.openai import OpenAIEmbedding

Settings.embed_model = OpenAIEmbedding(
    api_base="https://api.red-pill.ai/v1",
    api_key="sk-42oA7mOer5JPI5vND4BUwz0sKkoiMDwuQzN23n0OXd0gXv3z",
    model="text-embedding-3-large",
)


def get_markdown(link: str):
    # Get the name of everything after https:// as the directory name and wget all the files in that only
    directory_name = link.split("https://")[1].strip("/")
    print(f"The directory name is {directory_name}")
    os.system(f"wget -r -A html,htm -P {directory_name} {link}")

    dist_directory = f"{directory_name}_dist"
    os.makedirs(dist_directory, exist_ok=True)

    os.system(
        f"counter=1; "
        f'find {directory_name} -name "*.html" -type f | '
        f"while read -r file; do "
        f'html-to-markdown "$file" -o "{dist_directory}"; '
        f'mv "{dist_directory}/index.html.md" "{dist_directory}/$counter.md"; '
        f"counter=$((counter + 1)); "
        f"done"
    )

    return dist_directory


def process_markdown(path: str):
    nodes = []
    for file in os.listdir(path):
        file_path = os.path.join(path, file)
        try:
            with open(file_path, "r") as f:
                text = f.read()
                nodes.extend(split_text(text))
        except FileNotFoundError:
            print(f"File not found: {file_path}")
        except Exception as e:
            print(f"An error occurred while processing {file_path}: {e}")

    return nodes


def split_text(text: str) -> list[BaseNode]:
    splitter = SentenceSplitter(chunk_size=200, chunk_overlap=0)
    nodes = splitter.get_nodes_from_documents([Document(text=text)])
    return nodes


def pipeline(link: str, dimensions: int = 3072):
    dir = get_markdown(link)
    # nodes = process_markdown(dir)
    # faiss_index = faiss.IndexFlatIP(dimensions)
    # vector_store = FaissVectorStore(faiss_index=faiss_index)
    # storage_context = StorageContext.from_defaults(vector_store=vector_store)
    # index = VectorStoreIndex(nodes, storage_context=storage_context)
    # index.storage_context.persist(f"./index_store/{dir}")


# Example usage
pipeline("https://docs.near.org/")

lighthouseapi = "7f144aa9.464d6f4dbf964899887df0138a0651b5"
