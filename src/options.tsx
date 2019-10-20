import * as React from "react";
import * as ReacTableCellOM from "react-dom";
import BrainSvg from "./brain.svg";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";

import "./options.css";

function App() {
  const [websites, setWebsites] = React.useState([]);
  const [newWebsite, setNewWebsite] = React.useState({
    name: "",
    count: 1
  });

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
  };

  const onClickSave = () => {
    window.chrome.storage.sync.set({ websites });
  };

  const onAddNew = () => {
    setWebsites([...websites, newWebsite]);
    setNewWebsite({ name: "", count: 1 });
  };

  document.body.style.backgroundColor = "rgb(40, 44, 52)";

  return (
    <Paper className="mx-auto max-w-md mt-16">
      <header className="flex items-center px-4 pt-4">
        <BrainSvg
          style={{ marginRight: "8px", width: "35px", height: "35px" }}
        />
        <h1 className="text-lg font-bold">Hippocampus</h1>
      </header>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <div className="font-bold text-md">Website</div>
            </TableCell>
            <TableCell>
              <div className="font-bold text-md">Daily Article Goal</div>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {websites.map((website, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
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
              <TableCell></TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <TextField
                value={newWebsite.name}
                onChange={e =>
                  setNewWebsite({ ...newWebsite, name: e.target.value })
                }
              />
            </TableCell>
            <TableCell>
              <NumberInput
                value={newWebsite.count}
                onChange={e =>
                  setNewWebsite({
                    ...newWebsite,
                    count: parseInt(e.target.value)
                  })
                }
              />
            </TableCell>
            <TableCell>
              <Button onClick={onAddNew}>Add New</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="flex p-4">
        <Button
          className="ml-auto"
          variant="contained"
          color="primary"
          onClick={onClickSave}
        >
          Save Config
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
ReacTableCellOM.render(<App />, mountNode);
