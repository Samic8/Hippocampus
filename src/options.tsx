import React, { useEffect, useState } from "react";
import * as ReactDOM from "react-dom";

function App() {
  const [websites, setWebsites] = useState([]);
  const [newWebsite, setNewWebsite] = useState({
    name: "",
    count: 1
  });

  useEffect(() => {
    window.chrome.storage.sync.get("websites", function({
      websites: storedWebsites
    }) {
      setWebsites(storedWebsites || []);
    });
  }, []);

  const updateWebsite = (index, newValues) => {
    websites[index] = { ...websites[index], ...newValues };
  };

  const onClickSave = () => {
    window.chrome.storage.sync.set({ websites });
  };

  const onAddNew = () => {
    setWebsites([...websites, newWebsite]);
    setNewWebsite({ name: "", count: 1 });
  };

  return (
    <div className="App">
      <header className="App-header">
        <table>
          <tbody>
            {websites.map((website, index) => (
              <tr>
                <td>
                  <input
                    value={website.name}
                    onChange={e =>
                      updateWebsite(index, { name: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    value={website.count}
                    onChange={e =>
                      updateWebsite(index, { count: e.target.value })
                    }
                  />
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <input
                  value={newWebsite.name}
                  onChange={e =>
                    setNewWebsite({ ...newWebsite, name: e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  value={newWebsite.count}
                  onChange={e =>
                    setNewWebsite({ ...newWebsite, count: e.target.value })
                  }
                />
              </td>
              <td>
                <button onClick={onAddNew}>Add New</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button onClick={onClickSave}>Save Config</button>
      </header>
    </div>
  );
}

var mountNode = document.getElementById("app");
ReactDOM.render(<App />, mountNode);
