import * as React from "react";
import * as ReactDOM from "react-dom";
import BrainSvg from "./brain.svg";
import Tooltip from "@material-ui/core/Tooltip";

function Content() {
  const [count, setCount] = React.useState(0);
  const [ticked, setTicked] = React.useState(0);

  React.useEffect(() => {
    window.chrome.storage.sync.get("websites", function({ websites }) {
      websites.forEach(({ name, count }) => {
        if (location.href.includes(name)) {
          setCount(count);
        }
      });
    });

    window.chrome.storage.sync.get(
      "ticked",
      ({ ticked: storedTicked = {} }) => {
        const stored = storedTicked[getToday()];
        if (stored) {
          setTicked(stored);
        }
      }
    );
  }, []);

  // Update storage when ticked amount changes
  React.useEffect(() => {
    window.chrome.storage.sync.get(
      "ticked",
      ({ ticked: storedTicked = {} }) => {
        window.chrome.storage.sync.set({
          ticked: {
            ...storedTicked,
            [getToday()]: ticked
          }
        });
      }
    );
  }, [ticked]);

  const onTick = checked => {
    if (checked) {
      setTicked(ticked + 1);
    } else {
      setTicked(ticked - 1);
    }
  };

  function getToday() {
    var newDate = new Date();
    var day = newDate.getDate();
    var monthIndex = newDate.getMonth();
    var year = newDate.getFullYear();
    return `${day}${monthIndex}${year}`;
  }

  return (
    <Tooltip title={`${ticked} articles read today!`} placement="top">
      <div
        style={{
          position: "fixed",
          display: "flex",
          alignItems: "center",
          right: "0px",
          bottom: "0px",
          padding: "16px",
          borderTopLeftRadius: "6px",
          backgroundColor: "rgba(90, 90, 90, 0.1)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <BrainSvg
            style={{ marginRight: "4px", width: "35px", height: "35px" }}
          />
        </div>
        {Array.from({ length: count }).map((val, index) => (
          <input
            key={index}
            type={"checkbox"}
            checked={index < ticked}
            style={{ marginLeft: "4px", fontSize: "16px" }}
            onChange={e => {
              onTick(e.target.checked);
            }}
          />
        ))}
      </div>
    </Tooltip>
  );
}

var newNode = document.createElement("div");
document.body.appendChild(newNode);
ReactDOM.render(<Content />, newNode);
