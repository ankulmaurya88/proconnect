import { useEffect, useState } from "react";

import {
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
} from "../services/profileService";
import "../styles/Profile.css";

function Profile() {
  // -------------------------
  // Profile State
  // -------------------------

  const [profile, setProfile] = useState(null);

  const [profileForm, setProfileForm] = useState({
    headline: "",
    location: "",
    about: "",
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);


  // -------------------------
  // Skills State
  // -------------------------

  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState("");


  // -------------------------
  // Education State
  // -------------------------

  const [education, setEducation] = useState([]);

  const [educationForm, setEducationForm] = useState({
    institution: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  const [editingEducationId, setEditingEducationId] = useState(null);


  // -------------------------
  // Experience State
  // -------------------------

  const [experience, setExperience] = useState([]);

  const [experienceForm, setExperienceForm] = useState({
    company: "",
    title: "",
    employment_type: "",
    location: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: "",
  });

  const [editingExperienceId, setEditingExperienceId] = useState(null);


  // -------------------------
  // Projects State
  // -------------------------

  const [projects, setProjects] = useState([]);

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    technologies: "",
    project_url: "",
    github_url: "",
    start_date: "",
    end_date: "",
  });

  const [editingProjectId, setEditingProjectId] = useState(null);


  // -------------------------
  // General UI State
  // -------------------------

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  // -------------------------
  // Load Profile Data
  // -------------------------

  useEffect(function () {
    async function loadProfileData() {
      try {
        setLoading(true);
        setError("");

        const [
          profileData,
          skillsData,
          educationData,
          experienceData,
          projectsData,
        ] = await Promise.all([
          getMyProfile(),
          getSkills(),
          getEducation(),
          getExperience(),
          getProjects(),
        ]);

        setProfile(profileData);

        setProfileForm({
          headline: profileData.headline || "",
          location: profileData.location || "",
          about: profileData.about || "",
        });

        setSkills(skillsData || []);

        setEducation(educationData.results || []);
        setExperience(experienceData.results || []);
        setProjects(projectsData.results || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadProfileData();
  }, []);


  // -------------------------
  // Profile Handlers
  // -------------------------

  function handleProfileChange(event) {
    const { name, value } = event.target;

    setProfileForm(function (currentData) {
      return {
        ...currentData,
        [name]: value,
      };
    });
  }


  async function handleProfileSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const updatedProfile = await updateMyProfile(profileForm);

      setProfile(updatedProfile);
      setIsEditingProfile(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }


  // -------------------------
  // Skill Handlers
  // -------------------------

  async function handleAddSkill(event) {
    event.preventDefault();

    if (!skillName.trim()) {
      return;
    }

    try {
      setError("");

      const newSkill = await addSkill({
        name: skillName.trim(),
      });

      setSkills(function (currentSkills) {
        return [...currentSkills, newSkill];
      });

      setSkillName("");
    } catch (error) {
      setError(error.message);
    }
  }


  async function handleDeleteSkill(skillId) {
    try {
      setError("");

      await deleteSkill(skillId);

      setSkills(function (currentSkills) {
        return currentSkills.filter(function (skill) {
          return skill.id !== skillId;
        });
      });
    } catch (error) {
      setError(error.message);
    }
  }


  // -------------------------
  // Education Handlers
  // -------------------------

  function handleEducationChange(event) {
    const { name, value } = event.target;

    setEducationForm(function (currentData) {
      return {
        ...currentData,
        [name]: value,
      };
    });
  }


  async function handleEducationSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (editingEducationId) {
        const updatedEducation = await updateEducation(
          editingEducationId,
          educationForm
        );

        setEducation(function (currentEducation) {
          return currentEducation.map(function (item) {
            if (item.id === editingEducationId) {
              return updatedEducation;
            }

            return item;
          });
        });

        setEditingEducationId(null);
      } else {
        const newEducation = await addEducation(educationForm);

        setEducation(function (currentEducation) {
          return [...currentEducation, newEducation];
        });
      }

      setEducationForm({
        institution: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
        description: "",
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }


  function handleEditEducation(item) {
    setEditingEducationId(item.id);

    setEducationForm({
      institution: item.institution || "",
      degree: item.degree || "",
      field_of_study: item.field_of_study || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      description: item.description || "",
    });
  }


  async function handleDeleteEducation(educationId) {
    try {
      setError("");

      await deleteEducation(educationId);

      setEducation(function (currentEducation) {
        return currentEducation.filter(function (item) {
          return item.id !== educationId;
        });
      });
    } catch (error) {
      setError(error.message);
    }
  }


  function cancelEducationEdit() {
    setEditingEducationId(null);

    setEducationForm({
      institution: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      description: "",
    });
  }

    // -------------------------
  // Experience Handlers
  // -------------------------

  function handleExperienceChange(event) {
    const { name, value, type, checked } = event.target;

    setExperienceForm(function (currentData) {
      return {
        ...currentData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  }


  async function handleExperienceSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (editingExperienceId) {
        const updatedExperience = await updateExperience(
          editingExperienceId,
          experienceForm
        );

        setExperience(function (currentExperience) {
          return currentExperience.map(function (item) {
            if (item.id === editingExperienceId) {
              return updatedExperience;
            }

            return item;
          });
        });

        setEditingExperienceId(null);
      } else {
        const newExperience = await addExperience(
          experienceForm
        );

        setExperience(function (currentExperience) {
          return [...currentExperience, newExperience];
        });
      }

      setExperienceForm({
        company: "",
        title: "",
        employment_type: "",
        location: "",
        start_date: "",
        end_date: "",
        is_current: false,
        description: "",
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }


  function handleEditExperience(item) {
    setEditingExperienceId(item.id);

    setExperienceForm({
      company: item.company || "",
      title: item.title || "",
      employment_type: item.employment_type || "",
      location: item.location || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      is_current: item.is_current || false,
      description: item.description || "",
    });
  }


  async function handleDeleteExperience(experienceId) {
    try {
      setError("");

      await deleteExperience(experienceId);

      setExperience(function (currentExperience) {
        return currentExperience.filter(function (item) {
          return item.id !== experienceId;
        });
      });
    } catch (error) {
      setError(error.message);
    }
  }


  function cancelExperienceEdit() {
    setEditingExperienceId(null);

    setExperienceForm({
      company: "",
      title: "",
      employment_type: "",
      location: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
    });
  }


  // -------------------------
  // Project Handlers
  // -------------------------

  function handleProjectChange(event) {
    const { name, value } = event.target;

    setProjectForm(function (currentData) {
      return {
        ...currentData,
        [name]: value,
      };
    });
  }


  async function handleProjectSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (editingProjectId) {
        const updatedProject = await updateProject(
          editingProjectId,
          projectForm
        );

        setProjects(function (currentProjects) {
          return currentProjects.map(function (project) {
            if (project.id === editingProjectId) {
              return updatedProject;
            }

            return project;
          });
        });

        setEditingProjectId(null);
      } else {
        const newProject = await addProject(projectForm);

        setProjects(function (currentProjects) {
          return [...currentProjects, newProject];
        });
      }

      setProjectForm({
        title: "",
        description: "",
        technologies: "",
        project_url: "",
        github_url: "",
        start_date: "",
        end_date: "",
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }


  function handleEditProject(project) {
    setEditingProjectId(project.id);

    setProjectForm({
      title: project.title || "",
      description: project.description || "",
      technologies: project.technologies || "",
      project_url: project.project_url || "",
      github_url: project.github_url || "",
      start_date: project.start_date || "",
      end_date: project.end_date || "",
    });
  }


  async function handleDeleteProject(projectId) {
    try {
      setError("");

      await deleteProject(projectId);

      setProjects(function (currentProjects) {
        return currentProjects.filter(function (project) {
          return project.id !== projectId;
        });
      });
    } catch (error) {
      setError(error.message);
    }
  }


  function cancelProjectEdit() {
    setEditingProjectId(null);

    setProjectForm({
      title: "",
      description: "",
      technologies: "",
      project_url: "",
      github_url: "",
      start_date: "",
      end_date: "",
    });
  }


  // -------------------------
  // Loading / Error
  // -------------------------

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error && !profile) {
    return <p>{error}</p>;
  }


  // -------------------------
  // UI
  // -------------------------

  // return (
  //   <div className="profile-page">
  //     <h1>Profile</h1>

  //     {error && <p>{error}</p>}


  //     {/* =========================
  //         Profile
  //     ========================= */}

  //     {/* <section> */}
  //     <section className="profile-section">  
  //       <h2>Profile Information</h2>

  //       {!isEditingProfile ? (
  //         <div>
  //           <p>
  //             <strong>Headline:</strong> {profile.headline}
  //           </p>

  //           <p>
  //             <strong>Location:</strong> {profile.location}
  //           </p>

  //           <p>
  //             <strong>About:</strong> {profile.about}
  //           </p>

  //           <button
  //             type="button"
  //             onClick={function () {
  //               setIsEditingProfile(true);
  //             }}
  //           >
  //             Edit Profile
  //           </button>
  //         </div>
  //       ) : (
  //         <form onSubmit={handleProfileSubmit}>
  //           <div>
  //             <label htmlFor="headline">
  //               Headline
  //             </label>

  //             <input
  //               id="headline"
  //               name="headline"
  //               value={profileForm.headline}
  //               onChange={handleProfileChange}
  //             />
  //           </div>

  //           <div>
  //             <label htmlFor="location">
  //               Location
  //             </label>

  //             <input
  //               id="location"
  //               name="location"
  //               value={profileForm.location}
  //               onChange={handleProfileChange}
  //             />
  //           </div>

  //           <div>
  //             <label htmlFor="about">
  //               About
  //             </label>

  //             <textarea
  //               id="about"
  //               name="about"
  //               value={profileForm.about}
  //               onChange={handleProfileChange}
  //             />
  //           </div>

  //           <button
  //             type="submit"
  //             disabled={saving}
  //           >
  //             {saving ? "Saving..." : "Save Changes"}
  //           </button>

  //           <button
  //             type="button"
  //             onClick={function () {
  //               setIsEditingProfile(false);
  //             }}
  //           >
  //             Cancel
  //           </button>
  //         </form>
  //       )}
  //     </section>


  //     {/* =========================
  //         Skills
  //     ========================= */}

  //     <section>
  //       <h2>Skills</h2>

  //       {skills.length === 0 ? (
  //         <p>No skills added yet.</p>
  //       ) : (
  //         <ul className="skills-list">
  //           {skills.map(function (skill) {
  //             return (
  //               <li className="skill-item" key={skill.id}>
  //                 {skill.name}

  //                 <button
  //                   type="button"
  //                   onClick={function () {
  //                     handleDeleteSkill(skill.id);
  //                   }}
  //                 >
  //                   Delete
  //                 </button>
  //               </li>
  //             );
  //           })}
  //         </ul>
  //       )}

  //       <form onSubmit={handleAddSkill}>
  //         <input
  //           type="text"
  //           placeholder="Enter skill"
  //           value={skillName}
  //           onChange={function (event) {
  //             setSkillName(event.target.value);
  //           }}
  //         />

  //         <button type="submit">
  //           Add Skill
  //         </button>
  //       </form>
  //     </section>

            



  //     {/* =========================
  //         Education
  //     ========================= */}

  //     <section>
  //       <h2>Education</h2>

  //       {education.length === 0 ? (
  //         <p>No education added yet.</p>
  //       ) : (
  //         <div>
  //           {education.map(function (item) {
  //             return (
  //               <div key={item.id}>
  //                 <h3>{item.degree}</h3>

  //                 <p>{item.institution}</p>

  //                 <p>{item.field_of_study}</p>

  //                 <p>
  //                   {item.start_date} - {item.end_date}
  //                 </p>

  //                 <p>{item.description}</p>

  //                 <button
  //                   type="button"
  //                   onClick={function () {
  //                     handleEditEducation(item);
  //                   }}
  //                 >
  //                   Edit
  //                 </button>

  //                 <button
  //                   type="button"
  //                   onClick={function () {
  //                     handleDeleteEducation(item.id);
  //                   }}
  //                 >
  //                   Delete
  //                 </button>
  //               </div>
  //             );
  //           })}
  //         </div>
  //       )}

  //       <h3>
  //         {editingEducationId
  //           ? "Edit Education"
  //           : "Add Education"}
  //       </h3>

  //       <form onSubmit={handleEducationSubmit}>
  //         <input
  //           type="text"
  //           name="institution"
  //           placeholder="Institution"
  //           value={educationForm.institution}
  //           onChange={handleEducationChange}
  //         />

  //         <input
  //           type="text"
  //           name="degree"
  //           placeholder="Degree"
  //           value={educationForm.degree}
  //           onChange={handleEducationChange}
  //         />

  //         <input
  //           type="text"
  //           name="field_of_study"
  //           placeholder="Field of Study"
  //           value={educationForm.field_of_study}
  //           onChange={handleEducationChange}
  //         />

  //         <input
  //           type="date"
  //           name="start_date"
  //           value={educationForm.start_date}
  //           onChange={handleEducationChange}
  //         />

  //         <input
  //           type="date"
  //           name="end_date"
  //           value={educationForm.end_date}
  //           onChange={handleEducationChange}
  //         />

  //         <textarea
  //           name="description"
  //           placeholder="Description"
  //           value={educationForm.description}
  //           onChange={handleEducationChange}
  //         />

  //         <button
  //           type="submit"
  //           disabled={saving}
  //         >
  //           {saving
  //             ? "Saving..."
  //             : editingEducationId
  //               ? "Update Education"
  //               : "Add Education"}
  //         </button>

  //         {editingEducationId && (
  //           <button
  //             type="button"
  //             onClick={cancelEducationEdit}
  //           >
  //             Cancel
  //           </button>
  //         )}
  //       </form>
  //     </section>


  //     {/* =========================
  //         Experience
  //     ========================= */}

  //     <section>
  //       <h2>Experience</h2>

  //       {experience.length === 0 ? (
  //         <p>No experience added yet.</p>
  //       ) : (
  //         <div>
  //           {experience.map(function (item) {
  //             return (
  //               <div key={item.id}>
  //                 <h3>{item.title}</h3>

  //                 <p>
  //                   <strong>Company:</strong> {item.company}
  //                 </p>

  //                 <p>
  //                   <strong>Employment Type:</strong>{" "}
  //                   {item.employment_type}
  //                 </p>

  //                 <p>
  //                   <strong>Location:</strong> {item.location}
  //                 </p>

  //                 <p>
  //                   {item.start_date} -{" "}
  //                   {item.is_current
  //                     ? "Present"
  //                     : item.end_date}
  //                 </p>

  //                 <p>{item.description}</p>

  //                 <button
  //                   type="button"
  //                   onClick={function () {
  //                     handleEditExperience(item);
  //                   }}
  //                 >
  //                   Edit
  //                 </button>

  //                 <button
  //                   type="button"
  //                   onClick={function () {
  //                     handleDeleteExperience(item.id);
  //                   }}
  //                 >
  //                   Delete
  //                 </button>
  //               </div>
  //             );
  //           })}
  //         </div>
  //       )}

  //       <h3>
  //         {editingExperienceId
  //           ? "Edit Experience"
  //           : "Add Experience"}
  //       </h3>

  //       <form onSubmit={handleExperienceSubmit}>
  //         <input
  //           type="text"
  //           name="company"
  //           placeholder="Company"
  //           value={experienceForm.company}
  //           onChange={handleExperienceChange}
  //         />

  //         <input
  //           type="text"
  //           name="title"
  //           placeholder="Job Title"
  //           value={experienceForm.title}
  //           onChange={handleExperienceChange}
  //         />

  //         <input
  //           type="text"
  //           name="employment_type"
  //           placeholder="Employment Type"
  //           value={experienceForm.employment_type}
  //           onChange={handleExperienceChange}
  //         />

  //         <input
  //           type="text"
  //           name="location"
  //           placeholder="Location"
  //           value={experienceForm.location}
  //           onChange={handleExperienceChange}
  //         />

  //         <label>
  //           Start Date
  //         </label>

  //         <input
  //           type="date"
  //           name="start_date"
  //           value={experienceForm.start_date}
  //           onChange={handleExperienceChange}
  //         />

  //         <label>
  //           End Date
  //         </label>

  //         <input
  //           type="date"
  //           name="end_date"
  //           value={experienceForm.end_date}
  //           onChange={handleExperienceChange}
  //           disabled={experienceForm.is_current}
  //         />

  //         <label>
  //           <input
  //             type="checkbox"
  //             name="is_current"
  //             checked={experienceForm.is_current}
  //             onChange={handleExperienceChange}
  //           />

  //           Currently working here
  //         </label>

  //         <textarea
  //           name="description"
  //           placeholder="Description"
  //           value={experienceForm.description}
  //           onChange={handleExperienceChange}
  //         />

  //         <button
  //           type="submit"
  //           disabled={saving}
  //         >
  //           {saving
  //             ? "Saving..."
  //             : editingExperienceId
  //               ? "Update Experience"
  //               : "Add Experience"}
  //         </button>

  //         {editingExperienceId && (
  //           <button
  //             type="button"
  //             onClick={cancelExperienceEdit}
  //           >
  //             Cancel
  //           </button>
  //         )}
  //       </form>
  //     </section>


  //     {/* =========================
  //         Projects
  //     ========================= */}

  //     <section>
  //       <h2>Projects</h2>

  //       {projects.length === 0 ? (
  //         <p>No projects added yet.</p>
  //       ) : (
  //         <div>
  //           {projects.map(function (project) {
  //             return (
  //               <div key={project.id}>
  //                 <h3>{project.title}</h3>

  //                 <p>{project.description}</p>

  //                 <p>
  //                   <strong>Technologies:</strong>{" "}
  //                   {project.technologies}
  //                 </p>

  //                 {project.project_url && (
  //                   <p>
  //                     <a
  //                       href={project.project_url}
  //                       target="_blank"
  //                       rel="noreferrer"
  //                     >
  //                       Project
  //                     </a>
  //                   </p>
  //                 )}

  //                 {project.github_url && (
  //                   <p>
  //                     <a
  //                       href={project.github_url}
  //                       target="_blank"
  //                       rel="noreferrer"
  //                     >
  //                       GitHub
  //                     </a>
  //                   </p>
  //                 )}

  //                 <p>
  //                   {project.start_date} -{" "}
  //                   {project.end_date}
  //                 </p>

  //                 <button
  //                   type="button"
  //                   onClick={function () {
  //                     handleEditProject(project);
  //                   }}
  //                 >
  //                   Edit
  //                 </button>

  //                 <button
  //                   type="button"
  //                   onClick={function () {
  //                     handleDeleteProject(project.id);
  //                   }}
  //                 >
  //                   Delete
  //                 </button>
  //               </div>
  //             );
  //           })}
  //         </div>
  //       )}

  //       <h3>
  //         {editingProjectId
  //           ? "Edit Project"
  //           : "Add Project"}
  //       </h3>

  //       <form onSubmit={handleProjectSubmit}>
  //         <input
  //           type="text"
  //           name="title"
  //           placeholder="Project Title"
  //           value={projectForm.title}
  //           onChange={handleProjectChange}
  //         />

  //         <textarea
  //           name="description"
  //           placeholder="Project Description"
  //           value={projectForm.description}
  //           onChange={handleProjectChange}
  //         />

  //         <input
  //           type="text"
  //           name="technologies"
  //           placeholder="Technologies"
  //           value={projectForm.technologies}
  //           onChange={handleProjectChange}
  //         />

  //         <input
  //           type="url"
  //           name="project_url"
  //           placeholder="Project URL"
  //           value={projectForm.project_url}
  //           onChange={handleProjectChange}
  //         />

  //         <input
  //           type="url"
  //           name="github_url"
  //           placeholder="GitHub URL"
  //           value={projectForm.github_url}
  //           onChange={handleProjectChange}
  //         />

  //         <label>
  //           Start Date
  //         </label>

  //         <input
  //           type="date"
  //           name="start_date"
  //           value={projectForm.start_date}
  //           onChange={handleProjectChange}
  //         />

  //         <label>
  //           End Date
  //         </label>

  //         <input
  //           type="date"
  //           name="end_date"
  //           value={projectForm.end_date}
  //           onChange={handleProjectChange}
  //         />

  //         <button
  //           type="submit"
  //           disabled={saving}
  //         >
  //           {saving
  //             ? "Saving..."
  //             : editingProjectId
  //               ? "Update Project"
  //               : "Add Project"}
  //         </button>

  //         {editingProjectId && (
  //           <button
  //             type="button"
  //             onClick={cancelProjectEdit}
  //           >
  //             Cancel
  //           </button>
  //         )}
  //       </form>
  //     </section>
  //   </div>
  // );

return (
  <div className="profile-page">
    <h1>Profile</h1>

    {error && <p className="error-message">{error}</p>}

    {/* =========================
        Profile
    ========================= */}

    <section className="profile-section">
      <h2>Profile Information</h2>

      {!isEditingProfile ? (
        <div className="profile-info">
          <p>
            <strong>Headline:</strong> {profile.headline}
          </p>

          <p>
            <strong>Location:</strong> {profile.location}
          </p>

          <p>
            <strong>About:</strong> {profile.about}
          </p>

          <button
            type="button"
            onClick={function () {
              setIsEditingProfile(true);
            }}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form
          className="profile-form"
          onSubmit={handleProfileSubmit}
        >
          <div>
            <label htmlFor="headline">
              Headline
            </label>

            <input
              id="headline"
              name="headline"
              value={profileForm.headline}
              onChange={handleProfileChange}
            />
          </div>

          <div>
            <label htmlFor="location">
              Location
            </label>

            <input
              id="location"
              name="location"
              value={profileForm.location}
              onChange={handleProfileChange}
            />
          </div>

          <div>
            <label htmlFor="about">
              About
            </label>

            <textarea
              id="about"
              name="about"
              value={profileForm.about}
              onChange={handleProfileChange}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={function () {
              setIsEditingProfile(false);
            }}
          >
            Cancel
          </button>
        </form>
      )}
    </section>

    {/* =========================
        Skills
    ========================= */}

    <section className="profile-section">
      <h2>Skills</h2>

      {skills.length === 0 ? (
        <p>No skills added yet.</p>
      ) : (
        <ul className="skills-list">
          {skills.map(function (skill) {
            return (
              <li
                className="skill-item"
                key={skill.id}
              >
                {skill.name}

                <button
                  type="button"
                  onClick={function () {
                    handleDeleteSkill(skill.id);
                  }}
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <form
        className="profile-form"
        onSubmit={handleAddSkill}
      >
        <input
          type="text"
          placeholder="Enter skill"
          value={skillName}
          onChange={function (event) {
            setSkillName(event.target.value);
          }}
        />

        <button type="submit">
          Add Skill
        </button>
      </form>
    </section>

    {/* =========================
        Education
    ========================= */}

    <section className="profile-section">
      <h2>Education</h2>

      {education.length === 0 ? (
        <p>No education added yet.</p>
      ) : (
        <div>
          {education.map(function (item) {
            return (
              <div
                className="item-card"
                key={item.id}
              >
                <h3>{item.degree}</h3>

                <p>{item.institution}</p>

                <p>{item.field_of_study}</p>

                <p>
                  {item.start_date} - {item.end_date}
                </p>

                <p>{item.description}</p>

                <div className="item-actions">
                  <button
                    type="button"
                    onClick={function () {
                      handleEditEducation(item);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={function () {
                      handleDeleteEducation(item.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <h3>
        {editingEducationId
          ? "Edit Education"
          : "Add Education"}
      </h3>

      <form
        className="profile-form"
        onSubmit={handleEducationSubmit}
      >
        <input
          type="text"
          name="institution"
          placeholder="Institution"
          value={educationForm.institution}
          onChange={handleEducationChange}
        />

        <input
          type="text"
          name="degree"
          placeholder="Degree"
          value={educationForm.degree}
          onChange={handleEducationChange}
        />

        <input
          type="text"
          name="field_of_study"
          placeholder="Field of Study"
          value={educationForm.field_of_study}
          onChange={handleEducationChange}
        />

        <input
          type="date"
          name="start_date"
          value={educationForm.start_date}
          onChange={handleEducationChange}
        />

        <input
          type="date"
          name="end_date"
          value={educationForm.end_date}
          onChange={handleEducationChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={educationForm.description}
          onChange={handleEducationChange}
        />

        <button
          type="submit"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : editingEducationId
              ? "Update Education"
              : "Add Education"}
        </button>

        {editingEducationId && (
          <button
            type="button"
            onClick={cancelEducationEdit}
          >
            Cancel
          </button>
        )}
      </form>
    </section>
    {/* =========================
        Experience
    ========================= */}

    <section className="profile-section">
      <h2>Experience</h2>

      {experience.length === 0 ? (
        <p>No experience added yet.</p>
      ) : (
        <div>
          {experience.map(function (item) {
            return (
              <div
                className="item-card"
                key={item.id}
              >
                <h3>{item.title}</h3>

                <p>
                  <strong>Company:</strong>{" "}
                  {item.company}
                </p>

                <p>
                  <strong>Employment Type:</strong>{" "}
                  {item.employment_type}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {item.location}
                </p>

                <p>
                  {item.start_date} -{" "}
                  {item.is_current
                    ? "Present"
                    : item.end_date}
                </p>

                <p>{item.description}</p>

                <div className="item-actions">
                  <button
                    type="button"
                    onClick={function () {
                      handleEditExperience(item);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={function () {
                      handleDeleteExperience(item.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <h3>
        {editingExperienceId
          ? "Edit Experience"
          : "Add Experience"}
      </h3>

      <form
        className="profile-form"
        onSubmit={handleExperienceSubmit}
      >
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={experienceForm.company}
          onChange={handleExperienceChange}
        />

        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={experienceForm.title}
          onChange={handleExperienceChange}
        />

        <input
          type="text"
          name="employment_type"
          placeholder="Employment Type"
          value={experienceForm.employment_type}
          onChange={handleExperienceChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={experienceForm.location}
          onChange={handleExperienceChange}
        />

        <label>
          Start Date
        </label>

        <input
          type="date"
          name="start_date"
          value={experienceForm.start_date}
          onChange={handleExperienceChange}
        />

        <label>
          End Date
        </label>

        <input
          type="date"
          name="end_date"
          value={experienceForm.end_date}
          onChange={handleExperienceChange}
          disabled={experienceForm.is_current}
        />

        <label>
          <input
            type="checkbox"
            name="is_current"
            checked={experienceForm.is_current}
            onChange={handleExperienceChange}
          />

          Currently working here
        </label>

        <textarea
          name="description"
          placeholder="Description"
          value={experienceForm.description}
          onChange={handleExperienceChange}
        />

        <button
          type="submit"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : editingExperienceId
              ? "Update Experience"
              : "Add Experience"}
        </button>

        {editingExperienceId && (
          <button
            type="button"
            onClick={cancelExperienceEdit}
          >
            Cancel
          </button>
        )}
      </form>
    </section>

    {/* =========================
        Projects
    ========================= */}

    <section className="profile-section">
      <h2>Projects</h2>

      {projects.length === 0 ? (
        <p>No projects added yet.</p>
      ) : (
        <div>
          {projects.map(function (project) {
            return (
              <div
                className="item-card"
                key={project.id}
              >
                <h3>{project.title}</h3>

                <p>{project.description}</p>

                <p>
                  <strong>Technologies:</strong>{" "}
                  {project.technologies}
                </p>

                {project.project_url && (
                  <p>
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Project
                    </a>
                  </p>
                )}

                {project.github_url && (
                  <p>
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  </p>
                )}

                <p>
                  {project.start_date} -{" "}
                  {project.end_date}
                </p>

                <div className="item-actions">
                  <button
                    type="button"
                    onClick={function () {
                      handleEditProject(project);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={function () {
                      handleDeleteProject(project.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <h3>
        {editingProjectId
          ? "Edit Project"
          : "Add Project"}
      </h3>

      <form
        className="profile-form"
        onSubmit={handleProjectSubmit}
      >
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={projectForm.title}
          onChange={handleProjectChange}
        />

        <textarea
          name="description"
          placeholder="Project Description"
          value={projectForm.description}
          onChange={handleProjectChange}
        />

        <input
          type="text"
          name="technologies"
          placeholder="Technologies"
          value={projectForm.technologies}
          onChange={handleProjectChange}
        />

        <input
          type="url"
          name="project_url"
          placeholder="Project URL"
          value={projectForm.project_url}
          onChange={handleProjectChange}
        />

        <input
          type="url"
          name="github_url"
          placeholder="GitHub URL"
          value={projectForm.github_url}
          onChange={handleProjectChange}
        />

        <label>
          Start Date
        </label>

        <input
          type="date"
          name="start_date"
          value={projectForm.start_date}
          onChange={handleProjectChange}
        />

        <label>
          End Date
        </label>

        <input
          type="date"
          name="end_date"
          value={projectForm.end_date}
          onChange={handleProjectChange}
        />

        <button
          type="submit"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : editingProjectId
              ? "Update Project"
              : "Add Project"}
        </button>

        {editingProjectId && (
          <button
            type="button"
            onClick={cancelProjectEdit}
          >
            Cancel
          </button>
        )}
      </form>
    </section>
  </div>
);

}

export default Profile;









// import { useEffect, useState } from "react";
// import {
//   getMyProfile,updateMyProfile, 
//   getSkills, addSkill, deleteSkill,
//   getEducation,addEducation,updateEducation,deleteEducation,
//   getExperience,addExperience,updateExperience,deleteExperience,
//   getProjects,addProject,updateProject,deleteProject,
// } from "../services/profileService";

// function Profile() {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(function () {
//     async function loadProfile() {
//       try {
//         const data = await getMyProfile();
//         setProfile(data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadProfile();
//   }, []);

//   async function handleGetSkills() {
//   try {
//     const skills = await getSkills();

//     console.log("Skills:", skills);
//   } catch (error) {
//     console.error("Skills error:", error.message);
//   }
// }

//   async function handleTestUpdate() {
//     try {
//       const updatedProfile = await updateMyProfile({
//         headline: "Senior Full Stack Developer",
//         location: "Bengaluru",
//         about: "Building scalable applications with Django and React.",
//       });

//       setProfile(updatedProfile);
//     } catch (error) {
//       setError(error.message);
//     }
//   }

//   async function handleAddSkill() {
//   try {
//     const skill = await addSkill({
//       name: "React",
//     });

//     console.log("Added skill:", skill);
//   } catch (error) {
//     console.error("Add skill error:", error.message);
//   }
// }
// async function handleDeleteSkill() {
//   try {
//     const skills = await getSkills();

//     if (skills.length === 0) {
//       console.log("No skills to delete.");
//       return;
//     }

//     const skillId = skills[0].id;

//     const response = await deleteSkill(skillId);

//     console.log("Delete skill status:", response);
//   } catch (error) {
//     console.error("Delete skill error:", error.message);
//   }
// }


// async function handleGetEducation() {
//   try {
//     const education = await getEducation();

//     console.log("Education:", education);
//   } catch (error) {
//     console.error("Education error:", error.message);
//   }
// }



// async function handleAddEducation() {
//   try {
//     const education = await addEducation({
//       institution: "ABC University",
//       degree: "B.Tech",
//       field_of_study: "Computer Science",
//       start_date: "2021-08-01",
//       end_date: "2025-06-30",
//       description: "Computer Science and Artificial Intelligence",
//     });

//     console.log("Added education:", education);
//   } catch (error) {
//     console.error("Add education error:", error.message);
//   }
// }

// async function handleUpdateEducation() {
//   try {
//     const education = await updateEducation(2, {
//       description: "Updated education information.",
//     });

//     console.log("Updated education:", education);
//   } catch (error) {
//     console.error("Update education error:", error.message);
//   }
// }


// async function handleDeleteEducation() {
//   try {
//     const education = await getEducation();

//     if (education.results.length === 0) {
//       console.log("No education to delete.");
//       return;
//     }

//     const educationId = education.results[0].id;

//     await deleteEducation(educationId);

//     console.log("Education deleted:", educationId);
//   } catch (error) {
//     console.error("Delete education error:", error.message);
//   }
// }

// async function handleGetExperience() {
//   try {
//     const experience = await getExperience();

//     console.log("Experience:", experience);
//   } catch (error) {
//     console.error("Experience error:", error.message);
//   }
// }


// async function handleAddExperience() {
//   try {
//     const experience = await addExperience({
//       company: "Tech Company",
//       title: "Software Developer Intern",
//       employment_type: "Internship",
//       location: "Remote",
//       start_date: "2025-01-01",
//       end_date: "2025-06-30",
//       is_current: false,
//       description: "Worked on Django REST APIs.",
//     });

//     console.log("Created Experience:", experience);
//   } catch (error) {
//     console.error("Add experience error:", error.message);
//   }
// }

// async function handleGetExperience() {
//   try {
//     const experience = await getExperience();

//     console.log("Experience:", experience);
//   } catch (error) {
//     console.error("Experience error:", error.message);
//   }
// }



// async function handleUpdateExperience() {
//   try {
//     const experience = await updateExperience(1, {
//       title: "Software Developer",
//       description: "Building Django REST APIs and React applications.",
//     });

//     console.log("Updated Experience:", experience);
//   } catch (error) {
//     console.error("Update experience error:", error.message);
//   }
// }

// async function handleDeleteExperience() {
//   try {
//     await deleteExperience(1);

//     console.log("Experience deleted: 1");
//   } catch (error) {
//     console.error("Delete experience error:", error.message);
//   }
// }


// async function handleGetProjects() {
//   try {
//     const projects = await getProjects();

//     console.log("Projects:", projects);
//   } catch (error) {
//     console.error("Projects error:", error.message);
//   }
// }



// async function handleAddProject() {
//   try {
//     const project = await addProject({
//       title: "ProConnect",
//       description: "A professional networking platform built with Django and React.",
//       technologies: "Django, DRF, React, JavaScript",
//       project_url: "https://example.com",
//       github_url: "https://github.com/example/proconnect",
//       start_date: "2026-01-01",
//       end_date: "2026-06-30",
//     });

//     console.log("Created Project:", project);
//   } catch (error) {
//     console.error("Add project error:", error.message);
//   }
// }


// async function handleUpdateProject() {
//   try {
//     const project = await updateProject(2, {
//       title: "ProConnect Platform",
//       description: "A full-stack professional networking platform.",
//       technologies: "Django, DRF, React, JavaScript",
//     });

//     console.log("Updated Project:", project);
//   } catch (error) {
//     console.error("Update project error:", error.message);
//   }
// }


// async function handleDeleteProject() {
//   try {
//     await deleteProject(2);

//     console.log("Project deleted: 2");
//   } catch (error) {
//     console.error("Delete project error:", error.message);
//   }
// }
//   if (loading) {
//     return <p>Loading profile...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   return (
//     <div>
//       <h1>Profile</h1>

//       <p>Headline: {profile.headline}</p>
//       <p>Location: {profile.location}</p>
//       <p>About: {profile.about}</p>

//       <button onClick={handleGetProjects}>
//   Test Delete Project
// </button>
//     </div>
//   );
// }

// export default Profile;