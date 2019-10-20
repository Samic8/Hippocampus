import * as React from "react";
import * as ReactDOM from "react-dom";

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
    <div
      style={{
        position: "fixed",
        right: "0px",
        bottom: "0px",
        padding: "16px"
      }}
    >
      logo:
      {Array.from({ length: count }).map((val, index) => (
        <input
          key={index}
          type={"checkbox"}
          checked={index < ticked}
          onChange={e => {
            onTick(e.target.checked);
          }}
        />
      ))}
    </div>
  );
}

var newNode = document.createElement("div");
document.body.appendChild(newNode);
ReactDOM.render(<Content />, newNode);
