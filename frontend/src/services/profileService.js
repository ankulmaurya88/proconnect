import apiRequest from "./api";

// Profile
async function getMyProfile() {
  return await apiRequest("/profiles/me/", {
    method: "GET",
  });
}

async function updateMyProfile(profileData) {
  return await apiRequest("/profiles/me/", {
    method: "PATCH",
    body: JSON.stringify(profileData),
  });
}

// Skills
async function getSkills() {
  return await apiRequest("/profiles/skills/", {
    method: "GET",
  });
}

async function addSkill(skillData) {
  return await apiRequest("/profiles/skills/", {
    method: "POST",
    body: JSON.stringify(skillData),
  });
}

async function deleteSkill(skillId) {
  return await apiRequest(`/profiles/skills/${skillId}/`, {
    method: "DELETE",
  });
}

// Education
async function getEducation() {
  return await apiRequest("/profiles/education/", {
    method: "GET",
  });
}

async function addEducation(educationData) {
  return await apiRequest("/profiles/education/", {
    method: "POST",
    body: JSON.stringify(educationData),
  });
}

async function updateEducation(educationId, educationData) {
  return await apiRequest(`/profiles/education/${educationId}/`, {
    method: "PATCH",
    body: JSON.stringify(educationData),
  });
}

async function deleteEducation(educationId) {
  return await apiRequest(`/profiles/education/${educationId}/`, {
    method: "DELETE",
  });
}

// Experience
async function getExperience() {
  return await apiRequest("/profiles/experience/", {
    method: "GET",
  });
}

async function addExperience(experienceData) {
  return await apiRequest("/profiles/experience/", {
    method: "POST",
    body: JSON.stringify(experienceData),
  });
}

async function updateExperience(experienceId, experienceData) {
  return await apiRequest(`/profiles/experience/${experienceId}/`, {
    method: "PATCH",
    body: JSON.stringify(experienceData),
  });
}

async function deleteExperience(experienceId) {
  return await apiRequest(`/profiles/experience/${experienceId}/`, {
    method: "DELETE",
  });
}

// Projects
async function getProjects() {
  return await apiRequest("/profiles/projects/", {
    method: "GET",
  });
}

async function addProject(projectData) {
  return await apiRequest("/profiles/projects/", {
    method: "POST",
    body: JSON.stringify(projectData),
  });
}

async function updateProject(projectId, projectData) {
  return await apiRequest(`/profiles/projects/${projectId}/`, {
    method: "PATCH",
    body: JSON.stringify(projectData),
  });
}

async function deleteProject(projectId) {
  return await apiRequest(`/profiles/projects/${projectId}/`, {
    method: "DELETE",
  });
}

export {
  getMyProfile,
  updateMyProfile,

  getSkills,
  addSkill,
  deleteSkill,

  getEducation,
  addEducation,
  updateEducation,
  deleteEducation,

  getExperience,
  addExperience,
  updateExperience,
  deleteExperience,

  getProjects,
  addProject,
  updateProject,
  deleteProject,
};