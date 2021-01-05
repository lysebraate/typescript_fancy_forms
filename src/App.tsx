import React from 'react';
import './App.css';
import Form from './Form';

function App() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Hello World</h1>
        <p className="subtitle">
          My first website with <strong>Bulma</strong>!
        </p>
        <Form />
      </div>
    </section>
  );
}

export default App;
