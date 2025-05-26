import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Stagewise toolbar for development
if (import.meta.env.DEV) {
  import('@stagewise/toolbar-react').then(({ StagewiseToolbar }) => {
    const stagewiseConfig = {
      plugins: []
    };
    
    // Create a separate container for stagewise toolbar
    const toolbarContainer = document.createElement('div');
    toolbarContainer.id = 'stagewise-toolbar';
    document.body.appendChild(toolbarContainer);
    
    // Render stagewise toolbar in separate root
    const toolbarRoot = ReactDOM.createRoot(toolbarContainer);
    toolbarRoot.render(<StagewiseToolbar config={stagewiseConfig} />);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 