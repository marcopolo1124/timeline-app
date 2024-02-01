import './App.css';

import { TimeLine } from './components/Timeline';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>TimeLine App</h1>
        <ul>
          <li>Focus on the timeline and press left arrow and right arrow to pan</li>
          <li>Zoom using the range slider on the top right</li>
          <li>Select a clip to draw on by clicking on the button with the clip name</li>
          <li>When in draw mode, you cannot drag the play head</li>
          <li>To stop draw mode, click the none button</li>
          <li>You can drag and drop the play head</li>
          
        </ul>
        <TimeLine />
      </header>
    </div>
  );
}

export default App;
