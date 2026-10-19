const link = "https://jsonplaceholder.typicode.com/posts";
let postsData = [];

async function getAllPosts() {
    try {
        const response = await axios.get(link);
        console.log(response);
        postsData = response.data;
        createTable();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function createTable() {    
    // Remove existing table if present to avoid duplicates
    const existing = document.querySelector('table');
    if (existing) existing.remove();

    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    ['ID', 'Title', 'Body', 'Actions'].forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.style.border = '1px solid black';
        th.style.padding = '8px';
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');

    postsData.forEach(post => {
        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = post.id;
        idCell.style.border = '1px solid black';
        idCell.style.padding = '8px';

        const titleCell = document.createElement('td');
        titleCell.textContent = post.title;
        titleCell.style.border = '1px solid black';
        titleCell.style.padding = '8px';

        const bodyCell = document.createElement('td');
        bodyCell.textContent = post.body;
        bodyCell.style.border = '1px solid black';
        bodyCell.style.padding = '8px';

        row.appendChild(idCell);
        row.appendChild(titleCell);
        row.appendChild(bodyCell);

        // Actions cell with Delete button
        const actionsCell = document.createElement('td');
        actionsCell.style.border = '1px solid black';
        actionsCell.style.padding = '8px';
        const updButton = document.createElement('button');
        updButton.textContent = 'Update';
        updButton.style.cursor = 'pointer';
        updButton.style.marginRight = '8px';
        updButton.addEventListener('click', () => {
            // Populate update form and show it
            showUpdateForm(post);
        });

        const delButton = document.createElement('button');
        delButton.textContent = 'Delete';
        delButton.style.cursor = 'pointer';
        delButton.addEventListener('click', async () => {
            // Remove row from DOM immediately
            row.remove();
            // Remove from local data
            postsData = postsData.filter(p => p.id !== post.id);
            try {
                await axios.delete(`${link}/${post.id}`);
                console.log(`Deleted post ${post.id}`);
            } catch (err) {
                console.error('Error deleting post:', err);
                // Optionally: re-add the post to local data and re-render
                // postsData.unshift(post);
                // createTable();
            }
        });

        actionsCell.appendChild(updButton);
        actionsCell.appendChild(delButton);
        row.appendChild(actionsCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    document.body.appendChild(table);
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const idInput = document.getElementById('postId');
    const userIdInput = document.getElementById('postUserId');
    const titleInput = document.getElementById('postTitle');
    const bodyInput = document.getElementById('postBody');

    const newPost = {
        id: Number(idInput.value),
        userId: Number(userIdInput.value),
        title: titleInput.value,
        body: bodyInput.value
    };

    try {
        const response = await axios.post(link, newPost);
        // jsonplaceholder returns the posted object (often with an id)
        const created = response.data;
        // Add to the start of the local array so it appears at the top
        postsData.unshift(created);
        createTable();
        event.target.reset();
    } catch (error) {
        console.error('Error creating post:', error);
    }
}

// Call the function when the page loads and bind the form
window.addEventListener('load', () => {
    getAllPosts();
    const form = document.getElementById('postForm');
    if (form) form.addEventListener('submit', handleFormSubmit);
    // Bind update form submit and cancel
    const updateForm = document.getElementById('updateForm');
    if (updateForm) updateForm.addEventListener('submit', handleUpdateSubmit);
    const cancelBtn = document.getElementById('cancelUpdate');
    if (cancelBtn) cancelBtn.addEventListener('click', () => {
        updateForm.style.display = 'none';
    });
});

function showUpdateForm(post) {
    const updateForm = document.getElementById('updateForm');
    if (!updateForm) return;
    document.getElementById('updPostId').value = post.id;
    document.getElementById('updPostUserId').value = post.userId || '';
    document.getElementById('updPostTitle').value = post.title || '';
    document.getElementById('updPostBody').value = post.body || '';
    updateForm.style.display = 'block';
    // Scroll to form for visibility
    updateForm.scrollIntoView({ behavior: 'smooth' });
}

async function handleUpdateSubmit(event) {
    event.preventDefault();
    const id = Number(document.getElementById('updPostId').value);
    const userId = Number(document.getElementById('updPostUserId').value);
    const title = document.getElementById('updPostTitle').value;
    const body = document.getElementById('updPostBody').value;

    const updatedPost = { id, userId, title, body };

    try {
        const response = await axios.put(`${link}/${id}`, updatedPost);
        const returned = response.data;
        // Update local array
        const index = postsData.findIndex(p => p.id === id);
        if (index !== -1) {
            postsData[index] = returned;
        } else {
            // If not found, add to top
            postsData.unshift(returned);
        }
        createTable();
        // hide form
        const updateForm = document.getElementById('updateForm');
        if (updateForm) updateForm.style.display = 'none';
    } catch (err) {
        console.error('Error updating post:', err);
    }
}
