import React, { useState } from "react";
import axios from "axios";
import { axiosWithAuth } from "../utils/axiosWithAuth";

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [colorAdd, setColorAdd] = useState(initialColor)

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = e => {
    e.preventDefault();
    axiosWithAuth()
    .put(`http://localhost:5000/api/colors/${colorToEdit.id}`, colorToEdit)
    .then(() => {
      axiosWithAuth()
      .get('http://localhost:5000/api/colors')
      .then(res => updateColors(res.data))
      .catch(err => console.log(err))
      setEditing(false)
    })
    .catch(err => console.log(err))
  };
  const addColor = e => {
    e.preventDefault();
    axiosWithAuth()
    .post('http://localhost:5000/api/colors', colorAdd)
    .then(res => {
      updateColors([...colors, colorAdd])
    })
  }

  const deleteColor = color => {
   axiosWithAuth()
   .delete(`http://localhost:5000/api/colors/${color.id}`)
   .then(() => {
     axiosWithAuth()
     .get('http://localhost:5000/api/colors')
     .then(res => updateColors(res.data))
     .catch(err => console.log(err))
     setEditing(false)
   })
  };

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={e => {
                    e.stopPropagation();
                    deleteColor(color)
                  }
                }>
                  x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <h4>Add Color</h4>
      <form id='addColorForm'>
      <input
            type="text"
            name="name"
            className='addInput'
            placeholder='Color Name'
            value={colorAdd.color}
            onChange={e => setColorAdd({...colorAdd, color: e.target.value})}
          />
          <input
            type="text"
            name="hex"
            className='addInput'
            placeholder='Hex Code'
            value={colorAdd.code.hex}
            onChange={e => setColorAdd({...colorAdd, code:{ hex: e.target.value}})}
          />
          <button id='addColorBtn' onClick={addColor}>Add Color</button>
      </form>
    </div>
  );
};

export default ColorList;
