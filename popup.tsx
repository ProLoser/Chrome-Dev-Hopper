import { useStorage } from "@plasmohq/storage/hook"
import { useEffect, useState } from "react"
import "./popup.css"

function IndexPopup() {
  const [projects, setProjects] = useStorage("projects", [])
  const [project, setProject] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        setError("Error getting active tab: " + chrome.runtime.lastError.message)
        return
      }
      const activeTab = tabs[0]
      if (!activeTab) {
          setError("Could not find active tab.")
          return
      }

      const foundProject = projects.find((p) =>
        p.environments.some((e) => new RegExp(e.regex).test(activeTab.url))
      )

      if (foundProject) {
        const updatedEnvironments = foundProject.environments.map((env) => {
          const match = activeTab.url.match(new RegExp(env.regex))
          if (match) {
            return { ...env, active: true }
          } else {
            const activeEnv = foundProject.environments.find(e => new RegExp(e.regex).test(activeTab.url));
            const activeMatch = activeTab.url.match(new RegExp(activeEnv.regex));
            return {
              ...env,
              url: activeTab.url.replace(activeMatch[0], env.base),
              active: false,
            }
          }
        })
        setProject({ ...foundProject, environments: updatedEnvironments })
      }
    })
  }, [projects])

  const openOptionsPage = () => {
    chrome.runtime.openOptionsPage()
  }

  const goToUrl = (url) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
            setError("Error getting active tab: " + chrome.runtime.lastError.message);
            return;
        }
        const activeTab = tabs[0];
        if (activeTab) {
            chrome.tabs.update(activeTab.id, { url });
            window.close();
        }
    });
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="popup-container">
      {project ? (
        <>
          <h3>
            {project.name}
            <a onClick={openOptionsPage} title="Options">&#x270e;</a>
          </h3>
          <ul>
            {project.environments.map((env, index) => (
              <li key={index}>
                <a
                  className={env.active ? "active" : ""}
                  title={env.url}
                  href={env.url}
                  onClick={(e) => {
                    e.preventDefault()
                    goToUrl(env.url)
                  }}>
                  {env.name}
                  <br />
                  <small>{env.url}</small>
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <center>
          <p>
            No matching project found for this URL.
          </p>
          <p>
            <button onClick={openOptionsPage} title="Options">
              <span className="l">&#10010;</span> Add Project
            </button>
          </p>
        </center>
      )}
    </div>
  )
}

export default IndexPopup
