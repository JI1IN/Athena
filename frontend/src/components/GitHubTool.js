import React, { useState, useEffect } from 'react';
import { useDocumentTitle } from './utils/useDocumentTitle';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import '../App.css';
import axios from "axios";
const FONT_STYLES = [
  { fontFamily: "'Courier New', Courier, monospace", color: '#f1e05a' },
  { fontFamily: "'Roboto', sans-serif", color: '#3572A5' },
  { fontFamily: "'Georgia', serif", color: '#b07219' },
  { fontFamily: "'Arial Black', Gadget, sans-serif", color: '#2b7489' },
  { fontFamily: "'Comic Sans MS', cursive, sans-serif", color: '#701516' },
  { fontFamily: "'Fira Code', monospace", color: '#ff79c6' },
  { fontFamily: "'Lobster', cursive", color: '#e83e8c' },
  { fontFamily: "'Playfair Display', serif", color: '#6f42c1' },
  { fontFamily: "'Bebas Neue', sans-serif", color: '#00bcd4' },
  { fontFamily: "'Anton', sans-serif", color: '#4caf50' },
  { fontFamily: "'Raleway', sans-serif", color: '#03a9f4' },
  { fontFamily: "'Merriweather', serif", color: '#ff5722' },
  { fontFamily: "'Oswald', sans-serif", color: '#795548' },
  { fontFamily: "'Space Mono', monospace", color: '#9c27b0' },
  { fontFamily: "'Pacifico', cursive", color: '#ff9800' },
  { fontFamily: "'Orbitron', sans-serif", color: '#009688' },
  { fontFamily: "'Caveat', cursive", color: '#8bc34a' },
  { fontFamily: "'DM Serif Display', serif", color: '#607d8b' },
  { fontFamily: "'Amatic SC', cursive", color: '#f06292' },
  { fontFamily: "'Cinzel', serif", color: '#ffb300' },
  { fontFamily: "'Titillium Web', sans-serif", color: '#5c6bc0' },
  { fontFamily: "'Zilla Slab', serif", color: '#26c6da' },
  { fontFamily: "'Inconsolata', monospace", color: '#00acc1' },
  { fontFamily: "'Alegreya', serif", color: '#ff7043' },
  { fontFamily: "'Quicksand', sans-serif", color: '#cddc39' },
];

const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  TypeScript: '#2b7489',
  Ruby: '#701516',
  PHP: '#4F5D95',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Go: '#00ADD8',
  Shell: '#89e051',
  Swift: '#ffac45',
  Kotlin: '#F18E33',
  Rust: '#dea584',
  HTML: '#e34c26',
  CSS: '#563d7c',
  ObjectiveC: '#438eff',
  Scala: '#c22d40',
  Dart: '#00B4AB',
  Vue: '#41b883',
  Unknown: '#999999',
};

const GRAY_COLOR = '#999999';

function GitHubTool() {
  useDocumentTitle('Athena • Home');
  const [username, setUsername] = useState('');
  const [userCards, setUserCards] = useState(() => {
  const stored = localStorage.getItem('athena_user_cards');
  try {
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [draggedCardId, setDraggedCardId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [fontIndex, setFontIndex] = useState(0);
  const [animationDone] = useState(false);

useEffect(() => {
  const interval = setInterval(() => {
    setFontIndex((prev) => (prev + 1) % FONT_STYLES.length);
  }, 2000);

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  const storedCards = localStorage.getItem('athena_user_cards');
  if (storedCards) {
    try {
      setUserCards(JSON.parse(storedCards));
    } catch (err) {
      console.error('Failed to parse saved cards:', err);
    }
  }
}, []);

useEffect(() => {
  localStorage.setItem('athena_user_cards', JSON.stringify(userCards));
}, [userCards]);



  async function fetchGitHubData(event) {
    event.preventDefault();
    if (!username.trim()) return;
    setError('');
    setLoading(true);

    try {
      const userRes = await axios.get(`http://localhost:8000/user/${username}`);
      const reposRes = await axios.get(`http://localhost:8000/user/${username}/repos`);
      const recentRes = await axios.get(`http://localhost:8000/user/${username}/repos/recent`);
      const starredRes = await axios.get(`http://localhost:8000/user/${username}/repos/starred`);

      const newCard = {
        id: Date.now(),
        userData: userRes.data,
        repos: reposRes.data,
        recentRepos: recentRes.data,
        topStarredRepos: starredRes.data,
        expanded: true,
        reposExpanded: true,
      };

      setUserCards((prev) => [newCard, ...prev]);
      setUsername('');
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('GitHub API rate limit exceeded. Please wait and try again later.');
      } else {
        setError('User not found or failed to fetch data.');
      }
    } finally {
      setLoading(false);
    }
  }

  function toggleCard(id) {
    setUserCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, expanded: !card.expanded } : card))
    );
  }

  function toggleRepos(id) {
    setUserCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, reposExpanded: !card.reposExpanded } : card
      )
    );
  }

  function routeToProfile(username) {
    window.open(`https://github.com/${username}`, '_blank');
  }

  function getColor(language) {
    return LANGUAGE_COLORS[language] || GRAY_COLOR;
  }

  function handleDragStart(e, id) {
    setDraggedCardId(id);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e, id) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverId(id);
  }

  function handleDrop(e, targetId) {
    e.preventDefault();
    setDragOverId(null);
    if (draggedCardId === targetId) return;

    const draggedIndex = userCards.findIndex((card) => card.id === draggedCardId);
    const targetIndex = userCards.findIndex((card) => card.id === targetId);

    if (draggedIndex < 0 || targetIndex < 0) return;

    const updatedCards = [...userCards];
    const [draggedCard] = updatedCards.splice(draggedIndex, 1);
    updatedCards.splice(targetIndex, 0, draggedCard);

    setUserCards(updatedCards);
    setDraggedCardId(null);
  }

  return (
      <div className="max-w-4xl mx-auto p-6">

        <h1
            className="text-6xl font-bold text-center mb-6 transition-all duration-300"
            style={
              animationDone
                  ? {fontFamily: 'Geist Mono, sans-serif', color: '#FFFFFF'}
                  : FONT_STYLES[fontIndex]
            }
        >
          Athena
        </h1>
        <p className="text-center mb-2">Start searching here - it's literally free</p>

        <form onSubmit={fetchGitHubData} className="flex items-center justify-center gap-2 mb-6">
          <div className="flex items-center bg-white rounded-full px-3 h-10 w-full max-w-md">
            <input
                type="search"
                name="search"
                placeholder="Search GitHub Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-grow text-sm focus:outline-none text-black"
            />
            <button type="submit" className="ml-2">
              <img src="/search.svg" alt="Search" className="w-5 h-5"/>
            </button>
          </div>
        </form>

        {loading && (
            <div className="card bg-base-100 shadow-xl p-6 border border-gray-300 rounded-lg text-center mb-5">
              <p className="text-lg font-semibold">Loading...</p>
            </div>
        )}

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {userCards.map((card) => {
          const languageCount = {};
          card.repos.forEach((repo) => {
            const lang = repo.language || 'Unknown';
            languageCount[lang] = (languageCount[lang] || 0) + 1;
          });
          const pieData = Object.entries(languageCount).map(([name, value]) => ({
            name,
            value,
          }));

          return (
              <div
                  key={card.id}
                  className={`mb-6 border rounded-lg overflow-hidden shadow cursor-move ${
                      dragOverId === card.id ? 'drag-over' : ''
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, card.id)}
                  onDragOver={(e) => handleDragOver(e, card.id)}
                  onDrop={(e) => handleDrop(e, card.id)}
                  onDragLeave={() => setDragOverId(null)}
              >
                <div
                    onClick={() => toggleCard(card.id)}
                    className="flex justify-between items-center cursor-pointer bg-base-300 px-4 py-3"
                >
                  <span className="font-semibold">{card.userData.login}</span>
                  <svg
                      className={`w-5 h-5 transform transition-transform duration-300 ${
                          card.expanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>

                <div
                    className={`transition-all duration-500 overflow-hidden ${
                        card.expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                  <div className="card bg-base-100 p-6">
                    <div className="flex items-center gap-4">
                      <img
                          src={card.userData.avatar_url}
                          alt="avatar"
                          className="rounded-full w-24 h-24 cursor-pointer"
                          onClick={() => routeToProfile(card.userData.login)}
                      />
                      <div>
                        <h2 className="text-2xl font-semibold">{card.userData.login}</h2>
                        <p className="text-sm text-gray-500">
                          Followers: {card.userData.followers} | Following: {card.userData.following} | Public
                          Repos:{' '}
                          {card.userData.public_repos}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-bold mb-2">Languages Used in Repositories</h3>
                      {pieData.length > 0 ? (
                          <div className="w-full h-80 md:h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius="60%"
                                    label
                                >
                                  {pieData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={getColor(entry.name)}/>
                                  ))}
                                </Pie>
                                <RechartsTooltip
                                    formatter={(value, name) => [`${value} repo(s)`, name]}
                                    wrapperStyle={{fontSize: '14px'}}
                                />
                                <Legend
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                    align="center"
                                    wrapperStyle={{fontSize: '12px'}}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                      ) : (
                          <p className="text-sm text-gray-500">No repositories found.</p>
                      )}
                    </div>

                    <div className="mt-6">
                      <div
                          className="flex justify-between items-center cursor-pointer bg-base-200 px-3 py-2 rounded"
                          onClick={() => toggleRepos(card.id)}
                      >
                        <h3 className="text-lg font-bold">Repositories</h3>
                        <svg
                            className={`w-5 h-5 transform transition-transform duration-300 ${
                                card.reposExpanded ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </div>

                      <div
                          className={`transition-all duration-500 overflow-hidden ${
                              card.reposExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                          }`}
                      >
                        {card.recentRepos.length === 0 && card.topStarredRepos.length === 0 ? (
                            <p className="text-sm text-gray-500 mt-2">No repositories found.</p>
                        ) : (
                            <div className="space-y-4 mt-4">
                              {card.recentRepos.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold mb-1">Recently Active</h4>
                                    <ul className="list-disc list-inside text-sm text-blue-600">
                                      {card.recentRepos.map((repo, index) => (
                                          <li key={`recent-${index}`}>
                                            <a
                                                href={repo.html_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="link link-hover text-blue-50"
                                            >
                                              {repo.name}
                                            </a>
                                          </li>
                                      ))}
                                    </ul>
                                  </div>
                              )}

                              {card.topStarredRepos.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold mb-1">Top Starred</h4>
                                    <ul className="list-disc list-inside text-sm text-yellow-400">
                                      {card.topStarredRepos.map((repo, index) => (
                                          <li key={`starred-${index}`}>
                                            <a
                                                href={repo.html_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="link link-hover text-yellow-300"
                                            >
                                              {repo.name} ({repo.stars} ⭐)
                                            </a>
                                          </li>
                                      ))}
                                    </ul>
                                  </div>
                              )}
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          );
        })}
      </div>
  );
}

export default GitHubTool;
