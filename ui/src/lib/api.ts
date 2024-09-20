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

export const deleteFile = async (filePath: string) => {
  const res = await axios.delete(
    `${backend}/delete-file?file_path=${filePath}`
  );
  return res.data;
};
