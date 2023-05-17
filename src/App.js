import { useEffect, useState } from "react";

import "./App.css";

function App() {
  const [users, setUsers] = useState({
    data: [],
    isLoading: false,
  });
  const [posts, setPosts] = useState({
    data: [],
    isLoading: false,
  });
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isEditMode, setEditMode] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  async function fetchPosts() {
    let responseJson = [];
    try {
      setPosts({
        ...posts,
        isLoading: true,
      });
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      responseJson = await response.json();
    } catch (ex) {
      console.log(ex);
    } finally {
      setPosts({
        data: responseJson,
        isLoading: false,
      });
    }
  }

  async function fetchUsers() {
    let responseJson = [];
    try {
      setUsers({
        ...users,
        isLoading: true,
      });
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      responseJson = await response.json();
    } catch (ex) {
      console.log(ex);
    } finally {
      setUsers({
        data: responseJson,
        isLoading: false,
      });
    }
  }
  async function deleteUser(id) {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${id}`,
      {
        method: "DELETE",
      }
    );
    console.log(response);
  }

  async function deletePost(id) {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      {
        method: "DELETE",
      }
    );
    console.log(response);
  }

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);

  async function createPost() {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        title: title,
        body: body,
      }),
    });
    const responseJson = await response.json();
    console.log(responseJson);
  }

  async function editPost() {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${selectedPostId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          title: title,
          body: body,
        }),
      }
    );
    const responseJson = await response.json();
    console.log(responseJson);

    setTitle("");
    setBody("");
    setSelectedPostId(null);
    setEditMode(false);
  }

  async function createOrEditPost(event) {
    event.preventDefault();

    if (isEditMode) {
      await editPost();
    } else {
      await createPost();
    }
  }

  async function onButtonButtonClick(id, title, body) {
    setTitle(title);
    setBody(body);
    setEditMode(true);
    setSelectedPostId(id);
  }

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={createOrEditPost}>
          <input
            required
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter post title"
          ></input>
          <input
            required
            type="text"
            placeholder="Enter post body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
          ></input>
          <input type="submit"></input>
        </form>
        {posts.isLoading ? (
          <div>Posts Loading....</div>
        ) : (
          posts.data.map((post) => (
            <div key={post.id}>
              {post.title}{" "}
              <button onClick={() => deletePost(post.id)}>Delete</button>
              <button
                onClick={() =>
                  onButtonButtonClick(post.id, post.title, post.body)
                }
              >
                Edit
              </button>
            </div>
          ))
        )}

        <br />
        <br />
        <br />
        <br />
        {users.isLoading ? (
          <div>Users loading...</div>
        ) : (
          users.data.map((user) => (
            <div key={user.id}>
              {user.email}{" "}
              <button onClick={() => deleteUser(user.id)}>Delete</button>
            </div>
          ))
        )}
      </header>
    </div>
  );
}

export default App;
