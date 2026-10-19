const statusElement = document.querySelector("#status");
const usersCount = document.querySelector("#users-count");
const postsCount = document.querySelector("#posts-count");
const usersList = document.querySelector("#users-list");
const postsList = document.querySelector("#posts-list");
const reloadButton = document.querySelector("#reload-button");

function showNames(listElement, items, getName) {
  listElement.replaceChildren();

  items.slice(0, 5).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = getName(item);
    listElement.append(li);
  });
}

async function loadDashboard() {
  reloadButton.disabled = true;
  statusElement.textContent = "Loading data…";

  try {
    // Both network requests start before Promise.all waits for them.
    const [usersResponse, postsResponse] = await Promise.all([
      fetch("https://jsonplaceholder.typicode.com/users"),
      fetch("https://jsonplaceholder.typicode.com/posts")
    ]);

    // fetch() does not reject just because the server returned 404 or 500.
    if (!usersResponse.ok) {
      throw new Error(`Users request failed: HTTP ${usersResponse.status}`);
    }
    if (!postsResponse.ok) {
      throw new Error(`Posts request failed: HTTP ${postsResponse.status}`);
    }

    const [users, posts] = await Promise.all([
      usersResponse.json(),
      postsResponse.json()
    ]);

    usersCount.textContent = String(users.length);
    postsCount.textContent = String(posts.length);
    showNames(usersList, users, (user) => `${user.name} (${user.email})`);
    showNames(postsList, posts, (post) => post.title);
    statusElement.textContent = "Success — both data sources loaded.";
  } catch (error) {
    statusElement.textContent = `Error: ${error.message}`;
  } finally {
    reloadButton.disabled = false;
  }
}

reloadButton.addEventListener("click", loadDashboard);
loadDashboard();
