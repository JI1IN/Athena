import React, { useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0', '#FF3333'];

function App() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState('');

  async function fetchGitHubData() {
    setError('');
    setUserData(null);
    setRepos([]);

    try {
      const userRes = await axios.get(`http://localhost:8000/user/${username}`);
      setUserData(userRes.data);

      const reposRes = await axios.get(`http://localhost:8000/user/${username}/repos`);
      setRepos(reposRes.data);
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
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>Athena: GitHub Analytics</h1>
      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ padding: 8, fontSize: 16 }}
      />
      <button onClick={fetchGitHubData} style={{ marginLeft: 10, padding: '8px 16px', fontSize: 16 }}>
        Search
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {userData && (
        <div style={{ marginTop: 20 }}>
          <h2>{userData.login}</h2>
          <img src={userData.avatar_url} alt="avatar" width={100} />
          <p>Followers: {userData.followers} | Following: {userData.following} | Public Repos: {userData.public_repos}</p>

          <h3>Languages Used in Repos</h3>
          {pieData.length > 0 ? (
            <PieChart width={400} height={400}>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <p>No repositories found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
