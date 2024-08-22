"use client";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Button,
  Divider,
  Modal,
  Stack,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { Add, Delete, Remove, Search } from "@mui/icons-material";
import {
  collection,
  getDoc,
  setDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { query } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [isItemValid, setIsItemValid] = useState();
  const [searchTerm, setSearchTerm] = useState();

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity == 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();

      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const updateIttem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
  };

  const deleteItem = async (item) => {
    await deleteDoc(doc(collection(firestore, "inventory"), item));

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSearchOpen = () => setSearchOpen(true);
  const handleSearchClose = () => setSearchOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      {/* Add Item   */}
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
                setIsItemValid(true);
              }}
              error={isItemValid == false}
              helperText={isItemValid == false ? "Empty field" : ""}
            />
            <Button
              variant="outlined"
              onClick={() => {
                if (itemName !== "") {
                  addItem(itemName);
                  setItemName("");
                  handleClose();
                } else setIsItemValid(false);
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={() => {
          handleOpen();
        }}
      >
        Add New item
      </Button>
      {/* Information box */}
      <Box border="1px solid #000">
        {/* {inventory.forEach((item) => console.log(item))} */}
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          padding={1}
        >
          <Typography variant="h3" color="#333">
            Inventory Items
          </Typography>
          <Modal open={searchOpen} onClose={handleSearchClose}>
            <Box
              position="absolute"
              top="50%"
              left="50%"
              width={400}
              bgcolor="white"
              border="2px solid #000"
              boxShadow={24}
              p={4}
              display="flex"
              flexDirection="column"
              gap={3}
              sx={{
                transform: "translate(-50%, -50%)",
              }}
            >
              <Typography variant="h6">Search Item</Typography>
              <Stack width="100%" direction="row" gap={2}>
                <TextField variant="outlined" fullWidth />
                <Button variant="outlined">Search</Button>
              </Stack>
            </Box>
          </Modal>
          <IconButton
            onClick={() => {
              handleSearchOpen();
            }}
          >
            <Search />
          </IconButton>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="100px"
              display="grid"
              gridTemplateColumns="1fr 100px 200px"
              alignItems="center"
              bgcolor="#f0f0f0"
              padding={2}
            >
              <Typography variant="h4" color="#333" textAlign="left">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h4" color="#333" textAlign="left">
                {quantity}
              </Typography>
              <Stack
                direction="row"
                spacing={3}
                justifyContent="flex-end"
                divider={<Divider orientation="vertical" flexItem />}
              >
                <IconButton
                  onClick={() => {
                    addItem(name);
                  }}
                  aria-label="Add Item"
                >
                  <Add />
                </IconButton>
                <IconButton
                  onClick={() => {
                    removeItem(name);
                  }}
                  aria-label="Lower Item"
                >
                  <Remove />
                </IconButton>
                <IconButton
                  onClick={() => {
                    deleteItem(name);
                  }}
                  aria-label="Delete Item"
                >
                  <Delete />
                </IconButton>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
