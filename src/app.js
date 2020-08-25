const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepoId(req, res, next) {
  const { id } = req.body;

  if(!isUuid(id)){
    return res.status(400).json({ error: 'Invalid ID.'});
  }

  return next();

}

function validateLikesInitialize(req, res, next) {
  const { likes } = req.body;

  if(likes > 0){
    return res.status(400).json({ error: 'Invalid number of likes.'})
  }
  return next();

}

app.get("/repositories", (request, response) => {
    
  return response.json(repositories);
});

app.post("/repositories", validateLikesInitialize, (request, response) => {
  const { title, url, techs, likes } = request.body;
  
  
  // const techsArray = techs.split(', ');

  const project = { id: uuid(), title, url, techs, likes};

  repositories.push(project);

  return response.json(project);




});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  
  const repoIndex = repositories.findIndex(repo => repo.id == id);

  if(repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found'});
  }

  // const techsArray = techs.split(', ');
  const newRepo = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes,
  };

  repositories[repoIndex] = newRepo;
  return response.json(newRepo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id == id);

  if(repoIndex < 0){
    return response.status(400).json({ error: 'Repository not found'});

  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();


});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id == id);

  if(repoIndex < 0){
    return response.status(400).json({ error: 'Repository not found'});

  }

  const newRepo = {
    id,
    title: repositories[repoIndex].title,
    url: repositories[repoIndex].url,
    techs: repositories[repoIndex].techs,
    likes: repositories[repoIndex].likes + 1,
  }

  repositories[repoIndex] = newRepo;

  return response.json(newRepo);


});

module.exports = app;
