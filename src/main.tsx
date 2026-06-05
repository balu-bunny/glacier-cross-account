import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import App from './App';
import './index.css';

// Wait for Amplify to configure before rendering the app
// This prevents the "already signed in" error that occurs when
// getCurrentUser() is called before Amplify is configured
async function initApp() {
  try {
    const response = await fetch('/amplify_outputs.json');
    const config = await response.json();
    Amplify.configure(config);
  } catch {
    console.warn('Amplify outputs not found. Backend may not be deployed yet.');
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
  );
}

initApp();

