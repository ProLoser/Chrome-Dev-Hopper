import { useStorage } from "@plasmohq/storage/hook"
import { useCallback, useState } from "react"
import "./options.css"

const PLACEHOLDERS = [
  {
    name: 'Production',
    regex: 'example\\.com',
    replace: 'example.com',
  },
  {
    name: 'Staging',
    regex: 'test\\.com',
    replace: 'test.com',
  },
  {    
    name: 'Localhost',
    regex: 'localhost:3000',
    replace: 'localhost:3000',
  }
]

const newProject = () => ({ name: "", environments: [{ name: "", regex: "", base: "" }, { name: "", regex: "", base: "" }] })
const DEFAULT_PROJECTS = [newProject()]

export default function OptionsIndex() {
  const [projects, setStore, {
    setRenderValue
  }] = useStorage("projects", DEFAULT_PROJECTS)
  const [saved, setSaved] = useState(false)

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...projects]
    newProjects[index][field] = value
    // setProjects(newProjects)
    setRenderValue(newProjects)
  }

  const handleEnvChange = (projIndex, envIndex, field, value) => {
    const newProjects = [...projects]
    newProjects[projIndex].environments[envIndex][field] = value
    // setProjects(projects)
    setRenderValue(newProjects)
  }

  const addProject = () => {
    // setProjects([...projects, newProject()])
    setRenderValue([...projects, newProject()])
  }

  const removeProject = (index) => {
    const newProjects = projects.filter((_, i) => i !== index)
      // setProjects(newProjects)
    setRenderValue(newProjects)
  }

  const addEnvironment = (projIndex) => {
    const newProjects = [...projects]
    newProjects[projIndex].environments.push({ name: "", regex: "", base: "" })
    // setProjects(projects)
    setRenderValue(newProjects)
  }

  const removeEnvironment = (projIndex, envIndex) => {
    const newProjects = [...projects]
    newProjects[projIndex].environments = newProjects[projIndex].environments.filter(
      (_, i) => i !== envIndex
    )
    // setProjects(projects)
    setRenderValue(newProjects)
  }

  const submitHandler = useCallback((e) => {
    e.preventDefault()

    // setProjects(projects)
    setStore(projects)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [projects])

  return (
    <form className="options-container" id="options" onSubmit={submitHandler}>
      <header>
        <button type="submit" className="right">
          Save <span className="r">&#x2714;</span>
        </button>
        <button type="button" onClick={addProject}>
          <span className="l">&#10010;</span> Add Project
        </button>
        {saved && <p className="alert">Changes Saved</p>}
      </header>

      <ul className="projects">
        {projects.length === 0 && (
          <li className="center">
            <p>No projects found. Add a project to get started.</p>

            <button type="button" onClick={addProject}>
              <span className="l">&#10010;</span> Add Project
            </button>
          </li>
        )}
        {projects.map((project, projIndex) => (
          <li key={projIndex}>
            <label>
              <button type="button" className="left" onClick={() => removeProject(projIndex)}>
                &#10060;
              </button>
              <input
                placeholder="My Project"
                value={project.name}
                onChange={(e) => handleProjectChange(projIndex, "name", e.target.value)}
                required
              />
              <strong>Project</strong>
            </label>
            <ul className="environments">
              {project.environments.map((env, envIndex) => (
                <li key={envIndex}>
                  <label>
                    <button
                      type="button"
                      className="left"
                      onClick={() => removeEnvironment(projIndex, envIndex)}>
                      &#10060;
                    </button>
                    <input
                      value={env.name}
                      placeholder={PLACEHOLDERS[envIndex]?.name ?? "Environment Name"}
                      onChange={(e) =>
                        handleEnvChange(projIndex, envIndex, "name", e.target.value)
                      }
                      required
                    />
                    Environment
                  </label>
                  <label>
                    <input
                      value={env.regex}
                      placeholder={PLACEHOLDERS[envIndex]?.regex ?? "example\\.com:3000/"}
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
                      placeholder={PLACEHOLDERS[envIndex]?.replace ?? "example.com:3000/"}
                      onChange={(e) =>
                        handleEnvChange(projIndex, envIndex, "base", e.target.value)
                      }
                      required
                    />
                    Replacement
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
    </form>
  )
}
