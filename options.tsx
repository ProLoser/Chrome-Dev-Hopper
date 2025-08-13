import { useStorage } from "@plasmohq/storage/hook"
import { useState } from "react"
import "./options.css"

function OptionsIndex() {
  const [projects, setProjects] = useStorage("projects", [])
  const [saved, setSaved] = useState(false)

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...projects]
    newProjects[index][field] = value
    setProjects(newProjects)
  }

  const handleEnvChange = (projIndex, envIndex, field, value) => {
    const newProjects = [...projects]
    newProjects[projIndex].environments[envIndex][field] = value
    setProjects(newProjects)
  }

  const addProject = () => {
    setProjects([...projects, { name: "", environments: [{ name: "", regex: "", base: "" }] }])
  }

  const removeProject = (index) => {
    const newProjects = projects.filter((_, i) => i !== index)
    setProjects(newProjects)
  }

  const addEnvironment = (projIndex) => {
    const newProjects = [...projects]
    newProjects[projIndex].environments.push({ name: "", regex: "", base: "" })
    setProjects(newProjects)
  }

  const removeEnvironment = (projIndex, envIndex) => {
    const newProjects = [...projects]
    newProjects[projIndex].environments = newProjects[projIndex].environments.filter(
      (_, i) => i !== envIndex
    )
    setProjects(newProjects)
  }

  const saveProjects = () => {
    setProjects(projects)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="options-container">
      <header>
        <button onClick={saveProjects} className="right">
          Save <span className="r">&#x2714;</span>
        </button>
        <button onClick={addProject}>
          <span className="l">&#10010;</span> Add Project
        </button>
        {saved && <p className="alert">Changes Saved</p>}
      </header>

      <ul className="projects">
        {projects.map((project, projIndex) => (
          <li key={projIndex}>
            <label>
              <input
                placeholder="Example"
                value={project.name}
                onChange={(e) => handleProjectChange(projIndex, "name", e.target.value)}
                required
              />
              <a className="left trash" onClick={() => removeProject(projIndex)}>
                <img src="/icons/trash.png" alt="Delete" />
              </a>
              <strong>Project</strong>
            </label>
            <ul className="environments">
              {project.environments.map((env, envIndex) => (
                <li key={envIndex}>
                  <label>
                    <input
                      value={env.name}
                      placeholder="Production, Staging, Local"
                      onChange={(e) =>
                        handleEnvChange(projIndex, envIndex, "name", e.target.value)
                      }
                      required
                    />
                     <a
                      className="left trash"
                      onClick={() => removeEnvironment(projIndex, envIndex)}>
                      <img src="/icons/trash.png" alt="Delete" />
                    </a>
                    Name
                  </label>
                  <label>
                    <input
                      value={env.regex}
                      placeholder="example\.com:3000/"
                      onChange={(e) =>
                        handleEnvChange(projIndex, envIndex, "regex", e.target.value)
                      }
                      required
                    />
                    RegExp
                  </label>
                  <label>
                    <input
                      value={env.base}
                      placeholder="example.com:3000/"
                      onChange={(e) =>
                        handleEnvChange(projIndex, envIndex, "base", e.target.value)
                      }
                      required
                    />
                    Replace URL
                  </label>
                </li>
              ))}
            </ul>
            <p className="center">
              <button onClick={() => addEnvironment(projIndex)} type="button">
                New Environment <span className="r">&#10010;</span>
              </button>
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default OptionsIndex
