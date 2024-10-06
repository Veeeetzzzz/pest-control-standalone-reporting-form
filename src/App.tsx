import React from 'react';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './components/authConfig';
import PestControlForm from './components/PestControlForm';

const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <div className="App">
        <PestControlForm />
      </div>
    </MsalProvider>
  );
}

export default App;
