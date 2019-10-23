import * as React from "react";
import * as ReactDOM from "react-dom";
import BrainSvg from "./brain.svg";
import Tooltip from "@material-ui/core/Tooltip";

function Content() {
  const [count, setCount] = React.useState(0);
  const [ticked, setTicked] = React.useState(0);
  const [websiteName, setWebsiteName] = React.useState(0);
  const [timePeriod, setTimePeriod] = React.useState("daily");

  React.useEffect(() => {
    window.chrome.storage.sync.get("websites", function({ websites }) {
      websites.forEach(({ name, count }) => {
        if (location.href.includes(name)) {
          setCount(count);
          setWebsiteName(name);
        }
      });
    });
  }, []);

  React.useEffect(() => {
    window.chrome.storage.sync.get(
      ["ticked", "timePeriod"],
      ({ ticked: storedTicked = {}, timePeriod = "daily" }) => {
        const stored = storedTicked[websiteName];
        if (!stored) return;
        const storedForPeriod =
          stored[timePeriod === "daily" ? getToday() : getStartOfWeek()];
        if (storedForPeriod) {
          setTicked(storedForPeriod);
          setTimePeriod(timePeriod);
        }
      }
    );
  }, [websiteName]);

  const onTick = checked => {
    let newTicked = ticked;
    if (checked) {
      newTicked++;
    } else {
      newTicked--;
    }

    setTicked(newTicked);

    // Update storage when ticked amount changes
    window.chrome.storage.sync.get(
      ["ticked", "timePeriod"],
      ({ ticked: storedTicked = {}, timePeriod = "daily" }) => {
        window.chrome.storage.sync.set({
          ticked: {
            ...storedTicked,
            [websiteName]: {
              ...(timePeriod === "daily" ? { [getToday()]: newTicked } : {}),
              ...(timePeriod === "weekly"
                ? { [getStartOfWeek()]: newTicked }
                : {})
            }
          }
        });
      }
    );
  };

  function getToday(newDate = new Date()) {
    var day = newDate.getDate();
    var monthIndex = newDate.getMonth();
    var year = newDate.getFullYear();
    return `${day}${monthIndex}${year}`;
  }

  function getStartOfWeek() {
    const d = new Date();
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(d.setDate(diff));
    return getToday(monday);
  }

  if (!websiteName || !location.href.includes(websiteName)) {
    return null;
  }

  return (
    <Tooltip
      title={`${ticked} ${websiteName} articles read ${
        timePeriod === "daily" ? "today" : "this week"
      }!`}
      placement="left"
    >
      <div
        style={{
          position: "fixed",
          display: "flex",
          alignItems: "center",
          right: "0px",
          bottom: "0px",
          padding: "16px",
          borderTopLeftRadius: "6px",
          backgroundColor: "rgb(40, 44, 52)",
          boxShadow: "0px 0px 7px #3e3d3d24",
          borderTop: "1px solid grey",
          borderLeft: "1px solid grey",
          zIndex: 10
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
