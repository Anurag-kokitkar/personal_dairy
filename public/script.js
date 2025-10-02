const API_URL = "http://localhost:5000/diary";
let editId = null;

// Fetch all entries
async function fetchEntries() {
  const res = await fetch(API_URL);
  const entries = await res.json();
  renderEntries(entries);
}

// Render entries list
function renderEntries(entries) {
  const list = document.getElementById("entriesList");
  list.innerHTML = "";

  entries.forEach(entry => {
    const li = document.createElement("li");
    const date = new Date(entry.date).toLocaleString();
    li.innerHTML = `
      <strong>${entry.title}</strong> <em>(${date})</em><br>
      ${entry.content}<br>
      <button onclick="editEntry('${entry._id}')">Edit</button>
      <button onclick="deleteEntry('${entry._id}')">Delete</button>
    `;
    list.appendChild(li);
  });
}

// Add or update entry
async function submitEntry(e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  if (editId) {
    await fetch(`${API_URL}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content })
    });
    editId = null;
  } else {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content })
    });
  }

  document.getElementById("diaryForm").reset();
  fetchEntries();
}

// Delete entry
async function deleteEntry(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchEntries();
}

// Edit entry
async function editEntry(id) {
  const res = await fetch(API_URL);
  const entries = await res.json();
  const entry = entries.find(e => e._id === id);

  document.getElementById("title").value = entry.title;
  document.getElementById("content").value = entry.content;

  editId = id;
}

// Search entries
async function searchEntries() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return fetchEntries();

  const res = await fetch(`${API_URL}/search?q=${query}`);
  const entries = await res.json();
  renderEntries(entries);
}

// Event listener
document.getElementById("diaryForm").addEventListener("submit", submitEntry);

// Initial fetch
fetchEntries();
