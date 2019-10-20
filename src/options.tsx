import * as React from "react";
import * as ReactDOM from "react-dom";
import BrainSvg from "./brain.svg";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";

import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";

import "./options.css";

function App() {
  const [websites, setWebsites] = React.useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  React.useEffect(() => {
    window.chrome.storage.sync.get("websites", function({
      websites: storedWebsites
    }) {
      setWebsites(storedWebsites || []);
    });
  }, []);

  const updateWebsite = (index, newValues) => {
    const updated = [...websites];
    updated[index] = { ...websites[index], ...newValues };
    setWebsites(updated);
    setHasUnsavedChanges(true);
  };

  const onClickSave = () => {
    window.chrome.storage.sync.set({ websites }, () => {
      setHasUnsavedChanges(false);
    });
  };

  const deleteRow = index => {
    const updated = [...websites];
    updated.splice(index, 1);
    setWebsites(updated);
    setHasUnsavedChanges(true);
  };

  document.body.style.backgroundColor = "rgb(40, 44, 52)";

  return (
    <Paper className="mx-auto max-w-md mt-16">
      <header className="flex items-center p-4">
        <BrainSvg
          style={{ marginRight: "8px", width: "35px", height: "35px" }}
        />
        <h1 className="text-lg font-bold">Hippocampus</h1>
      </header>
      <p className="px-4">
        Be deliberate about where you spend your time on the internet. Set some
        goals for articles to read each day.
      </p>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <div className="font-bold text-md">Website</div>
            </TableCell>
            <TableCell>
              <div className="font-bold text-md">Daily Article Goal</div>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...websites, { name: "", count: 1 }].map((website, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  placeholder="website name"
                  value={website.name}
                  onChange={e => updateWebsite(index, { name: e.target.value })}
                />
              </TableCell>
              <TableCell>
                <NumberInput
                  value={website.count}
                  onChange={e =>
                    updateWebsite(index, { count: e.target.value })
                  }
                />
              </TableCell>
              <TableCell>
                {website.name && (
                  <IconButton
                    onClick={() => deleteRow(index)}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex p-4">
        <Button
          className="ml-auto"
          variant="contained"
          color={"primary"}
          onClick={onClickSave}
          disabled={!hasUnsavedChanges}
        >
          Save
        </Button>
      </div>
    </Paper>
  );
}

function NumberInput({ value, onChange }) {
  return (
    <TextField
      id="standard-number"
      value={value}
      onChange={onChange}
      type="number"
      margin="normal"
    />
  );
}

var mountNode = document.getElementById("app");
ReactDOM.render(<App />, mountNode);
