import React, { useState, useEffect } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  // -----------------------
  // READ: GET ALL TOYS
  // -----------------------
  useEffect(() => {
    fetch("http://localhost:3001/toys")
      .then((res) => res.json())
      .then((data) => setToys(data))
      .catch((err) => console.error("Error fetching toys:", err));
  }, []);

  // -----------------------
  // CREATE: ADD TOY
  // -----------------------
  function handleAddToy(newToy) {
    fetch("http://localhost:3001/toys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newToy, likes: 0 }),
    })
      .then((res) => res.json())
      .then((createdToy) => {
        setToys((prev) => [...prev, createdToy]);
      });
  }

  // -----------------------
  // UPDATE: LIKE TOY
  // -----------------------
  function handleLikeToy(toy) {
    fetch(`http://localhost:3001/toys/${toy.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: toy.likes + 1 }),
    })
      .then((res) => res.json())
      .then((updatedToy) => {
        setToys((prev) =>
          prev.map((t) => (t.id === updatedToy.id ? updatedToy : t))
        );
      });
  }

  // -----------------------
  // DELETE: DONATE TOY
  // -----------------------
  function handleDeleteToy(id) {
    fetch(`http://localhost:3001/toys/${id}`, {
      method: "DELETE",
    }).then(() => {
      setToys((prev) => prev.filter((toy) => toy.id !== id));
    });
  }

  function handleClick() {
    setShowForm((prev) => !prev);
  }

  return (
    <>
      <Header />

      {showForm && <ToyForm onAddToy={handleAddToy} />}

      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>

      <ToyContainer
        toys={toys}
        onLikeToy={handleLikeToy}
        onDeleteToy={handleDeleteToy}
      />
    </>
  );
}

export default App;