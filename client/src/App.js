import React, { useState, useEffect } from "react"
import APIHelper from "./APIHelper.js"
import { 
  TextField , 
  Button, 
  Typography, 
  Box,
  ListItem,
  ListItemText,
  Container, 
 } from '@mui/material';


const styles = {
  root:{
    marginTop: "40px",
  },
  inputBox:{
    marginTop: "30px",
  },
   input:{
    width: " 100%",
    marginBottom: "10px",
    backgroundColor: "white",
  },
  button: {
    margin: "20px 0",
    float: "right",
    width: "100%",
  },
  completed: {
    textDecoration: "line-through",
    opacity: 0.5,
  },
  deleteButton: {
    color: "#fff",
    backgroundColor: "#d9534f",
    borderColor: "#d43f3a",
    '&:hover': {
      background: "#B6534F",
    },
  },
};

const App = () => {

  const [items, setItems] = useState([])
  const [item, setItem] = useState("")

  useEffect(() => {
    const fetchItemsAndSetItems = async () => {
      const items = await APIHelper.getAllItems()
      setItems(items)
    }
    fetchItemsAndSetItems()
  }, [])

  const createItem = async e => {
    e.preventDefault()
    const newItem = await APIHelper.createItem(item)
    setItems([...items, newItem])
  }
  const handleKeyPress = async e =>{
    if (e.key === "Enter"){
      const newItem = await APIHelper.createItem(item)
      setItems([...items, newItem])
    }
  }
  const deleteItem = async (e, id) => {
    try {
      e.stopPropagation()
      await APIHelper.deleteItem(id)
      setItems(items.filter(({ _id: i }) => id !== i))
    } catch (err) {}
  }

  const updateItem = async (e, id) => {
    e.stopPropagation()
    const payload = {
      completed: !items.find(item => item._id === id).completed,
    }
    const updatedTodo = await APIHelper.updateItem(id, payload)
    setItems(items.map(item => (item._id === id ? updatedTodo : item)))
  }
  
  return (
    <Container maxWidth="sm" sx={styles.root} >
      <Typography variant="h4">Shopping List</Typography>
      <Box style={styles.inputBox}>
        <TextField 
              id="item-input" 
              label="Item" 
              variant="outlined"  
              placeholder="Insert your item"
              type="text"
              value={item}
              onChange={({ target }) => setItem(target.value)}
              onKeyPress={handleKeyPress}
              sx={styles.input}

            />
        <Button type="submit" variant="contained" onClick={createItem} sx={styles.button}>Add</Button>
      </Box>
      <Box>
        {items.map(({ _id, itemName, completed }, i) => (
          <Box key={i}>
            <ListItem 
              alignItems="flex-start"
              secondaryAction={
              <Button 
              color="error"
              onClick={e => deleteItem(e, _id)}
              sx={styles.deleteButton}>
                Delete
              </Button>
            }>
              <ListItemText
                primary={itemName}
                sx={completed ? styles.completed : ""}
              />
            </ListItem>
          </Box>
        ))}
      </Box>
    </Container>
  )
}

export default App;