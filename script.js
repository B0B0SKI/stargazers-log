function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderError(message) {
  const list = document.querySelector("#starred");
  if (!list) {
    return;
  }

  list.innerHTML = `<li class="empty" role="status">${escapeHtml(message)}</li>`;
}

function renderEvents(events) {
  const list = document.querySelector("#starred");

  if (!list) {
    return;
  }

  if (!Array.isArray(events) || events.length === 0) {
    renderError("No starred repositories to show yet.");
    return;
  }

  list.innerHTML = events
    .map((event) => {
      const name = typeof event.name === "string" && event.name.trim() ? event.name : "Unnamed repository";
      const starred = typeof event.starred === "string" && event.starred.trim() ? event.starred : "an unknown date";
      const description = typeof event.description === "string" && event.description.trim()
        ? event.description
        : "No description provided.";
      const url = typeof event.url === "string" && event.url.trim() ? event.url : `https://github.com/${name}`;

      return `
        <li class="star-item">
          <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(name)}</a>
          <p>${escapeHtml(description)}</p>
          <span>Starred ${escapeHtml(starred)}</span>
        </li>
      `;
    })
    .join("");
}

async function loadEvents() {
  const list = document.querySelector("#starred");

  if (!list) {
    return;
  }

  list.innerHTML = '<li class="empty" role="status">Loading starred repositories…</li>';

  try {
    const response = await fetch("events.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const events = await response.json();
    renderEvents(events);
  } catch (error) {
    console.error("Failed to load starred repositories:", error);
    renderError("Unable to load starred repositories right now.");
  }
}

document.addEventListener("DOMContentLoaded", loadEvents);
