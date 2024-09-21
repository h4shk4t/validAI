import io
from lighthouseweb3 import Lighthouse
from dotenv import load_dotenv
import os
import tempfile

load_dotenv()

lh = Lighthouse(token=os.environ["LIGHTHOUSE_KEY"])


def upload(content: str) -> str:
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(content.encode("utf-8"))
        temp_file_path = temp_file.name
    
    upload_response = lh.upload(source=temp_file_path)
    return upload_response["data"]["Hash"]
    
