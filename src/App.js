import React, { useState, useEffect } from "react";
import api from "./services/api";
import { Input, Button, Chip } from "@material-ui/core";
import ChipInput from "material-ui-chip-input";

import "./styles.css";

function App() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [techs, setTechs] = useState([]);
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
      const response = await api.post("repositories", { title, url, techs });
      console.log(response.data);
      setRepos([...repos, response.data]);
      setTitle("");
      setUrl("");
      setTechs([]);
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
    <div className="container">
      <div className="repos-container">
        <h2>Meus repositórios</h2>
        {repos.length === 0 && (
          <div className="no-repo-message">
            <p>Não há repositórios cadastrados</p>
          </div>
        )}
        <ul data-testid="repository-list">
          {repos.map((repo, index) => (
            <li key={index}>
              <div className="repo-data-container">
                <h4>{repo.title}</h4>
                <a href={repo.url}>{repo.url}</a>
                <div className="chip-container">
                  {repo.techs.map((tech, ind) => (
                    <Chip key={ind} size="small" label={tech} />
                  ))}
                </div>
              </div>
              <div className="button-container">
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleRemoveRepository(repo.id, index)}
                >
                  Remover
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="add-repo-container">
        <h2>Adicionar repositório</h2>
        <div className="add-repo-form">
          <Input
            placeholder="Nome do repositório"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="URL do repositório"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <ChipInput
            placeholder="Tecnologias"
            value={techs}
            blurBehavior="add"
            onAdd={(chip) => setTechs([...techs, chip])}
            onDelete={(_chip, index) =>
              setTechs(techs.filter((t, i) => i !== index))
            }
            newChipKeyCodes={[9, 13, 186, 188]}
          />
          <Button variant="contained" onClick={handleAddRepository}>
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
