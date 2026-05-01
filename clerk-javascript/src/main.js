import { Clerk } from '@clerk/clerk-js';

const pubKey = "pk_test_cHJlbWl1bS1tdWxsZXQtOC5jbGVyay5hY2NvdW50cy5kZXYk";
const clerk = new Clerk(pubKey);

async function startApp() {
  await clerk.load();

  if (clerk.user) {
    // Render the App UI
    document.getElementById('app').innerHTML = `
      <div style="max-width: 600px; margin: auto; padding: 20px;">
        <button id="logout">Sign Out</button>
        <h2>📩 AI Complaint Generator</h2>
        <p>Logged in as: ${clerk.user.primaryEmailAddress.emailAddress}</p>
        <textarea id="experience" style="width: 100%; height: 100px;"></textarea>
        <button id="generate">Generate Email</button>
        <div id="output" style="margin-top: 20px; white-space: pre-wrap; background: #eee; padding: 10px;"></div>
      </div>
    `;

    document.getElementById('logout').onclick = () => clerk.signOut();
    document.getElementById('generate').onclick = sendToAI;

  } else {
    // Render the Login UI
    document.getElementById('app').innerHTML = `<div id="sign-in"></div>`;
    clerk.mountSignIn(document.getElementById('sign-in'));
  }
}

async function sendToAI() {
  const text = document.getElementById('experience').value;
  document.getElementById('output').innerText = "🤖 Thinking...";
  
  const response = await fetch('http://localhost:3000/generate-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ experience: text })
  });
  const data = await response.json();
  document.getElementById('output').innerText = data.email || data.error;
}

startApp();