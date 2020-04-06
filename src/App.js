import React, { useState, useEffect } from "react";
import api from "./services/api";

import "./styles.css";

function App() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [techs, setTechs] = useState("");
  const [repos, setRepos] = useState([]);

  const getRepos = async () => {
    const response = await api.get("repositories");
    setRepos(response.data);
  };

  useEffect(() => {
    getRepos();
  }, []);

  async function handleAddRepository(event) {
    event.preventDefault();
    try {
      const response = await api.post("repositories", {
        title,
        url,
        techs: techs.split(","),
      });
      setRepos([...repos, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleRemoveRepository(repo_id, index) {
    try {
      const response = await api.delete(`repositories/${repo_id}`);
      const newRepos = repos.filter((_repo, i) => i !== index);
      setRepos(newRepos);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repos.map((repo, index) => (
          <li key={index}>
            {repo.title}
            <button onClick={() => handleRemoveRepository(repo.id, index)}>
              Remover
            </button>
          </li>
        ))}
      </ul>
      <div>
        <h2>Adicionar repositório</h2>
        <form onSubmit={handleAddRepository}>
          <input
            placeholder="Nome do repositório"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            placeholder="URL do repositório"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <input
            placeholder="Tecnologias do repositório (separados por vírgula)"
            value={techs}
            onChange={(e) => setTechs(e.target.value)}
          />
          <button type="submit">Adicionar</button>
        </form>
      </div>
    </div>
  );
}

export default App;
