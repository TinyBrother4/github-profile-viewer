const form = document.getElementById("search-form");
const input = document.getElementById("username-input");
const profileSection = document.getElementById("profile");
const reposSection = document.getElementById("repos");

const GITHUB_API = "https://api.github.com/users/";

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = input.value.trim();
    if (!username) return;

    profileSection.innerHTML = "";
    reposSection.innerHTML = "";

    try {
        const user = await fetchUser(username);
        renderProfile(user);

        const repos = await fetchRepos(username);
        renderRepos(repos);
    } catch (error) {
        profileSection.innerHTML = `<p>User not found.</p>`;
    }
});

async function fetchUser(username) {
    const response = await fetch(`${GITHUB_API}${username}`);
    if (!response.ok) throw new Error("User not found");
    return response.json();
}

async function fetchRepos(username) {
    const response = await fetch(`${GITHUB_API}${username}/repos`);
    return response.json();
}

function renderProfile(user) {
    profileSection.innerHTML = `
        <div class="profile-card">
            <img src="${user.avatar_url}" alt="${user.login}" />
            <div>
                <h2>${user.name || user.login}</h2>
                <p>${user.bio || ""}</p>
                <p>Followers: ${user.followers} | Following: ${user.following}</p>
            </div>
        </div>
    `;
}

function renderRepos(repos) {
    reposSection.innerHTML = "<h2>Repositories</h2>";
    repos.forEach((repo) => {
        const div = document.createElement("div");
        div.className = "repo";
        div.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            <p>${repo.description || ""}</p>
        `;
        reposSection.appendChild(div);
    });
}
