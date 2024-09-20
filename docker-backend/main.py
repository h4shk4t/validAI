from flask import Flask, request, jsonify
import os
from flask_cors import CORS
import subprocess

app = Flask(__name__)
PORT=8000
id_counter = 0
CORS(app)

def generate_tree(directory):
    global id_counter
    tree = []
    for entry in os.listdir(directory):
        path = os.path.join(directory, entry)
        node = {"id": str(id_counter), "name": entry, "path": path}
        id_counter += 1
        if os.path.isdir(path):
            node["children"] = generate_tree(path)
        tree.append(node)
    return tree


@app.route("/file-tree", methods=["GET"])
def file_tree():
    file_path = request.args.get("file_path")
    file_path = f"./repos/{file_path}"
    if not os.path.exists(file_path):
        return jsonify({"error": "file_path does not exist"}), 404

    tree = generate_tree(file_path)
    return jsonify(tree), 200


@app.route("/update-file", methods=["POST"])
def update_file():
    data = request.get_json()
    file_path = data.get("file_path")
    value = data.get("value")

    if not file_path or not value:
        return jsonify({"error": "file_path and value are required"}), 400

    # Update the file with the value
    try:
        with open(file_path, "w") as file:
            file.write(value)
        return jsonify({"message": "File updated successfully"}), 200
    except FileNotFoundError:
        return jsonify({"error": "file_path does not exist"}), 404


@app.route("/get-file", methods=["GET"])
def get_file():
    file_path = request.args.get("file_path")
    if not file_path:
        return jsonify({"error": "file_path is required"}), 400

    try:
        with open(file_path, "r") as file:
            content = file.read()
        return jsonify({"content": content}), 200
    except FileNotFoundError:
        return jsonify({"error": "file_path does not exist"}), 404


@app.route("/delete-file", methods=["DELETE"])
def delete_file():
    file_path = request.args.get("file_path")
    if not file_path:
        return jsonify({"error": "file_path is required"}), 400

    try:
        os.remove(file_path)
        return jsonify({"message": "File deleted successfully"}), 200
    except FileNotFoundError:
        return jsonify({"error": "file_path does not exist"}), 404


@app.route("/delete-folder", methods=["DELETE"])
def delete_folder():
    folder_path = request.args.get("folder_path")
    if not folder_path:
        return jsonify({"error": "folder_path is required"}), 400

    try:
        os.rmdir(folder_path)
        return jsonify({"message": "Folder deleted successfully"}), 200
    except FileNotFoundError:
        return jsonify({"error": "folder_path does not exist"}), 404


@app.route("/create-folder", methods=["POST"])
def create_folder():
    data = request.get_json()
    folder_path = data.get("folder_path")
    if not folder_path:
        return jsonify({"error": "folder_path is required"}), 400

    try:
        os.makedirs(folder_path)
        return jsonify({"message": "Folder created successfully"}), 200
    except FileExistsError:
        return jsonify({"error": "folder already exists"}), 409
    

@app.route("/create-file", methods=["POST"])
def create_file():
    data = request.get_json()
    file_path = data.get("file_path")
    if not file_path:
        return jsonify({"error": "file_path is required"}), 400

    try:
        with open(file_path, "w") as file:
            file.write("")
        return jsonify({"message": "File created successfully"}), 200
    except FileExistsError:
        return jsonify({"error": "file already exists"}), 409


@app.route("/clone-repo", methods=["POST"])
def clone_repo():
    data = request.get_json()
    repo_name = data.get("repo_name")
    user_name = data.get("user_name")
    token = data.get("token")
    if not repo_name or not user_name or not token:
        return jsonify({"error": "repo_name, user_name and token are required"}), 400
    url = f"https://{user_name}:{token}@github.com/{user_name}/{repo_name}.git"
    os.system(f"git clone {url} ./repos/{repo_name}")

    return jsonify({"message": "Repo cloned successfully"}), 200


@app.route("/run-command", methods=["POST"])
def run_command():
    data = request.get_json()
    command = data.get("command")
    if not command:
        return jsonify({"error": "command is required"}), 400

    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    if result.returncode == 0:
        return jsonify({"output": result.stdout}), 200
    else:
        return jsonify({"output": result.stderr}), 400


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=PORT)
