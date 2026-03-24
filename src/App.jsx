import "./App.css";
import Barplot from "./Barplot";

const data = [
  { country: "United States", students: 68 },
  { country: "France", students: 21 },
  { country: "United Kingdom", students: 21 },
  { country: "Germany", students: 20 },
  { country: "Switzerland", students: 13 },
  { country: "Spain", students: 10 },
  { country: "Netherlands", students: 9 },
  { country: "India", students: 9 },
  { country: "Singapore", students: 8 },
  { country: "Ireland", students: 8 },
  { country: "Sweden", students: 7 },
  { country: "Australia", students: 7 },
  { country: "Canada", students: 6 },
  { country: "Finland", students: 5 },
  { country: "Mexico", students: 4 },
  { country: "Brazil", students: 4 },
  { country: "Saudi Arabia", students: 3 },
  { country: "Romania", students: 3 },
  { country: "Philippines", students: 3 },
  { country: "New Zealand", students: 3 },
];

const width = 500;
const height = 400;
const barColor = "#1b4445";
const barHighlightColor = "#3e8b5f";
const labelColor = "#374151";
const labelHighlightColor = "#020617";

function App() {
  return (
    <Barplot
      data={data}
      width={width}
      height={height}
      barColor={barColor}
      barHighlightColor={barHighlightColor}
      labelColor={labelColor}
      labelHighlightColor={labelHighlightColor}
    />
  );
}

export default App;
