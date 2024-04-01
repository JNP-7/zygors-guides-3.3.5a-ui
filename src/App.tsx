import GuidesWorkspace from "./components/GuidesWorkspace/GuidesWorkspace";
import "./styles/main.scss";

export function isBlank(text: string | null | undefined): boolean {
  switch (typeof text) {
    case "string":
      return text.length <= 0;
    case "number":
    case "bigint":
    case "boolean":
    case "symbol":
    case "undefined":
    case "object":
    case "function":
      return true;
  }
}

function App() {
  return (
    <>
      <GuidesWorkspace></GuidesWorkspace>
    </>
  );
}

export default App;
