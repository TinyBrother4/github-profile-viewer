const form = document.getElementById("search-form");
const input = document.getElementById("username-input");
const profile = document.getElementById("profile");
const repos = document.getElementById("repos");

const API = "https://api.github.com/users/";

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = input.value.trim();

    profile.innerHTML = "Loading...";
    repos.innerHTML = "";

    try {
        const user = await fetchJSON(API + username);
        renderProfile(user);

        const repoData = await fetchJSON(API + username + "/repos?sort=updated");
        renderRepos(repoData);
    } catch {
        profile.innerHTML = "<p>User not found.</p>";
    }
});

async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error();
    return res.json();
}

function renderProfile(user) {
    profile.innerHTML = `
        <div class="profile-card">
            <img src="${user.avatar_url}" />
            <div>
                <h2>${user.name || user.login}</h2>
                <p>${user.bio || "No bio"}</p>
                <p>
                    ⭐ ${user.public_repos} Repos · 
                    👥 ${user.followers} Followers · 
                    👤 ${user.following} Following
                </p>
                <a href="${user.html_url}" target="_blank">View on GitHub</a>
            </div>
        </div>
    `;
}

function renderRepos(repoList) {
    repos.innerHTML = "<h2>Repositories</h2>";

    repoList.slice(0, 10).forEach(repo => {
        repos.innerHTML += `
            <div class="repo">
                <a href="${repo.html_url}" target="_blank">
                    <strong>${repo.name}</strong>
                </a>
                <p>${repo.description || "No description"}</p>
                <small>⭐ ${repo.stargazers_count}</small>
            </div>
        `;
    });
}
