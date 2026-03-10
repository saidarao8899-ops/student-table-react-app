import React, { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", age: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setTimeout(() => {
      const initialData = [
        { name: "John", email: "john@gmail.com", age: 20 },
        { name: "Sara", email: "sara@gmail.com", age: 22 }
      ];
      setStudents(initialData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name || !form.email || !form.age) {
      alert("All fields are required");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(form.email)) {
      alert("Invalid Email");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (editingIndex !== null) {
      const updated = [...students];
      updated[editingIndex] = form;
      setStudents(updated);
      setEditingIndex(null);
    } else {
      setStudents([...students, form]);
    }

    setForm({ name: "", email: "", age: "" });
  };

  const handleEdit = (index) => {
    setForm(students[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete?")) {
      const updated = students.filter((_, i) => i !== index);
      setStudents(updated);
    }
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const downloadExcel = () => {
    const rows = filteredStudents.length ? filteredStudents : students;

    const header = "Name,Email,Age\n";
    const csv = rows
      .map((s) => `${s.name},${s.email},${s.age}`)
      .join("\n");

    const blob = new Blob([header + csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
  };

  return (
    <div className="container">

      <h2>Students Table</h2>

      <input
        type="text"
        placeholder="Search student"
        onChange={(e) => setSearch(e.target.value)}
      />

      <button onClick={downloadExcel}>Download Excel</button>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />

        <button type="submit">
          {editingIndex !== null ? "Update Student" : "Add Student"}
        </button>

      </form>

      {loading ? (
        <p>Loading students...</p>
      ) : (
        <table>

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.age}</td>
                <td>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      )}
    </div>
  );
}

export default App;