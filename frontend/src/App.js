import React, { useState } from 'react';
import axios from 'axios';
import "./App.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0', '#FF3333'];

function App() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState('');
  const [recentRepos, setRecentRepos] = useState([]);

  async function fetchGitHubData() {
    setError('');
    setUserData(null);
    setRepos([]);

    try {
      const userRes = await axios.get(`http://localhost:8000/user/${username}`);
      setUserData(userRes.data);

      const reposRes = await axios.get(`http://localhost:8000/user/${username}/repos`);
      setRepos(reposRes.data);

      const recentRes = await axios.get(`http://localhost:8000/user/${username}/repos/recent`);
      setRecentRepos(recentRes.data);

    } catch (err) {
      setError('User not found or API rate limit exceeded');
    }
  }

  const languageCount = {};
  repos.forEach(repo => {
    const lang = repo.language || 'Unknown';
    languageCount[lang] = (languageCount[lang] || 0) + 1;
  });
  const pieData = Object.entries(languageCount).map(([name, value]) => ({ name, value }));

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Athena: GitHub Analytics</h1>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter GitHub username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="input input-bordered w-full sm:w-auto"
          />
          <button onClick={fetchGitHubData} className="btn btn-primary">
            Search
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {userData && (
          <div className="card bg-base-100 shadow-xl p-6">
            <div className="flex items-center gap-4">
              <img src={userData.avatar_url} alt="avatar" className="rounded-full w-24 h-24" />
              <div>
                <h2 className="text-2xl font-semibold">{userData.login}</h2>
                <p className="text-sm text-gray-500">
                  Followers: {userData.followers} | Following: {userData.following} | Public Repos: {userData.public_repos}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-bold mb-2">Languages Used in Repos</h3>
              {pieData.length > 0 ? (
                  <>
                  <PieChart width={400} height={400}>
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label
                    >
                      {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                      ))}
                    </Pie>

                    <Tooltip/>
                    <Legend/>
                  </PieChart>
            <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">Most Recently Active Repositories</h3>
        {recentRepos.length > 0 ? (
          <ul className="list-disc list-inside text-sm text-blue-600">
            {recentRepos.map((repo, index) => (
              <li key={index}>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-hover"
                >
                  {repo.name}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No recent repositories found.</p>
        )}
      </div>
                      </>
              ) : (
                  <p className="text-sm text-gray-500">No repositories found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
