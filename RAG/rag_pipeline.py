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
from llama_index.core.retrievers.fusion_retriever import QueryFusionRetriever, FUSION_MODES
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
    model="text-embedding-3-large"
)


def get_markdown(link: str) -> str:
    """
    Downloads HTML files from the provided link and converts them to markdown.
    Returns the directory where markdown files are stored.
    """
    # Extract directory name from link
    directory_name = link.split("https://")[1].strip("/")
    
    # Download HTML files
    os.system(f"wget -r -A html,htm -P {directory_name} {link}")

    # Create distribution directory
    dist_directory = f"{directory_name}_dist"
    os.makedirs(dist_directory, exist_ok=True)

    # Convert HTML files to markdown
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
            if file.endswith(".md"):
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
        node.metadata = {"file_path": f"{file_path}"}

    return nodes


def pipeline(link: str, dimensions: int = 3072, index_name: str = None) -> None:
    """
    Executes the complete pipeline:
    - Downloads markdown files from GitHub
    - Processes them into nodes
    - Creates a FAISS index and stores it
    """
    dir = get_markdown_github(link, index_name)
    nodes = process_markdown(dir)

    faiss_index = faiss.IndexFlatIP(dimensions)
    vector_store = FaissVectorStore(faiss_index=faiss_index)

    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    index = VectorStoreIndex(nodes, storage_context=storage_context)

    index.storage_context.persist(f"./index_store/{index_name if index_name else dir}")


def main():
    """
    Main function to handle argument parsing and execution of the pipeline and search.
    """
    parser = argparse.ArgumentParser(description="Process a GitHub repo, create an index, and search it.")

    # Add arguments
    parser.add_argument(
        '--repo-link',
        type=str,
        required=True,
        help="Link to the GitHub repository containing markdown files."
    )
    parser.add_argument(
        '--index-name',
        type=str,
        required=True,
        help="Name for the saved FAISS index."
    )
    parser.add_argument(
        '--query',
        type=str,
        required=True,
        help="Search query for the index."
    )
    parser.add_argument(
        '--dimensions',
        type=int,
        default=3072,
        help="Number of dimensions for the FAISS index."
    )

    # Parse the arguments
    args = parser.parse_args()

    # Run the pipeline with the provided repository link and index name
    pipeline(args.repo_link, dimensions=args.dimensions, index_name=args.index_name)

    # Modify the search function to take query and index name
    search_with_args(args.index_name, args.query)


def search_with_args(index_name: str, query: str) -> None:
    """
    Searches the FAISS index for the provided query and prints metadata of the top results.
    """
    vector_store = FaissVectorStore.from_persist_dir(f"./index_store/{index_name}")
    storage_context = StorageContext.from_defaults(
        vector_store=vector_store, persist_dir=f"./index_store/{index_name}"
    )

    index = load_index_from_storage(storage_context=storage_context)
    vector_retriever = index.as_retriever(similarity_top_k=10, verbose=True)
    bm25_retriever = BM25Retriever.from_defaults(
        docstore=index.docstore, similarity_top_k=10, verbose=True
    )
    hybrid_retriever = QueryFusionRetriever(
        [
            vector_retriever,
            bm25_retriever
        ],
        similarity_top_k=5,
        num_queries=1,
        mode=FUSION_MODES.RECIPROCAL_RANK,
        # highly semantic search gives best results
        retriever_weights=[0.9, 0.1],
        use_async=True,
        verbose=True
    )
    results = hybrid_retriever.retrieve(query)
    for result in results:
        print(result.node.metadata)
        print(result.node.text)



def merge():
    filepath1 = "./nethermind_dist"
    filepath2 = "./near_dist"
    filepath3 = "./phala_dist"
    # open all thee files in these directories and read the markdown content iteratively and add in nodes
    nodes = []
    for file in os.listdir(filepath1):
        file_path = os.path.join(filepath1, file)
        try:
            with open(file_path, "r") as f:
                text = f.read()
                nodes.extend(split_text(text, file_path))
        except FileNotFoundError:
            print(f"File not found: {file_path}")
        except Exception as e:
            print(f"An error occurred while processing {file_path}: {e}")
    
    for file in os.listdir(filepath2):
        file_path = os.path.join(filepath2, file)
        try:
            with open(file_path, "r") as f:
                text = f.read()
                nodes.extend(split_text(text, file_path))
        except FileNotFoundError:
            print(f"File not found: {file_path}")
        except Exception as e:
            print(f"An error occurred while processing {file_path}: {e}")
    
    for file in os.listdir(filepath3):
        file_path = os.path.join(filepath3, file)
        try:
            with open(file_path, "r") as f:
                text = f.read()
                nodes.extend(split_text(text, file_path))
        except FileNotFoundError:
            print(f"File not found: {file_path}")
        except Exception as e:
            print(f"An error occurred while processing {file_path}: {e}")
            
    faiss_index = faiss.IndexFlatIP(3072)
    vector_store = FaissVectorStore(faiss_index=faiss_index)

    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    index = VectorStoreIndex(nodes, storage_context=storage_context)
    index.storage_context.persist(f"./index_store/")
    
    
if __name__ == "__main__":
    main()