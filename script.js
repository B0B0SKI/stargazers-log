async function loadStars() {
  const list = document.getElementById('stars-list');

  if (!list) {
    return;
  }

  try {
    const response = await fetch('events.json');

    if (!response.ok) {
      throw new Error('Unable to load data');
    }

    const events = await response.json();

    if (!Array.isArray(events) || events.length === 0) {
      list.innerHTML = '<li class="empty">No starred repositories yet.</li>';
      return;
    }

    list.innerHTML = events
      .map(
        (event) => `
          <li class="star-item">
            <a href="${event.url}" target="_blank" rel="noopener noreferrer">
              ${event.owner}/${event.name}
            </a>
            <p>${event.description}</p>
            <span>Starred on ${event.starredAt}</span>
          </li>
        `
      )
      .join('');
  } catch (error) {
    console.error(error);
    list.innerHTML = '<li class="empty">Unable to load starred repositories.</li>';
  }
}

document.addEventListener('DOMContentLoaded', loadStars);
