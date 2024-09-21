import axios from "axios";

const backend = import.meta.env.VITE_BACKEND_URI;

export const getFileTree = async (folderPath: string) => {
  const res = await axios.get(`${backend}/file-tree?file_path=${folderPath}`);
  return res.data;
};

export const getFileContent = async (filePath: string) => {
  const res = await axios.get(`${backend}/get-file?file_path=${filePath}`);
  return res.data.content;
};

export const createFile = async (filePath: string) => {
  const res = await axios.post(
    `${backend}/create-file`,
    {
      file_path: filePath,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
};

export const saveFile = async (filePath: string, content: string) => {
  const res = await axios.post(
    `${backend}/update-file`,
    {
      file_path: filePath,
      value: content,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
}

export const cloneRepo = async (user_name: string, repo_name: string, token: string) => {
  const res = await axios.post(
    `${backend}/clone-repo`,
    {
      user_name,
      repo_name,
      token,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
}

export const deleteFile = async (filePath: string) => {
  const res = await axios.delete(
    `${backend}/delete-file?file_path=${filePath}`
  );
  return res.data;
};
