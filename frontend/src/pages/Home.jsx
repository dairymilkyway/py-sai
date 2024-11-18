import { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    InputAdornment,
    CircularProgress,
    Card,
    CardContent,
    Snackbar,
    Alert,
    Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import api from "../api";
import "../styles/Home.css";

const Home = () => {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [editing, setEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [noteId, setNoteId] = useState(null);
    const [darkMode, setDarkMode] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => setNotes(res.data))
            .catch((err) => alert(err));
    };

    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then(() => {
                setSnackbarMessage("Note deleted!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
                getNotes();
            })
            .catch(() => {
                setSnackbarMessage("Failed to delete note!");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            });
    };

    const createNote = (e) => {
        e.preventDefault();
        if (noteId) {
            api
                .put(`/api/notes/update/${noteId}/`, { title, content })
                .then(() => {
                    setSnackbarMessage("Note updated!");
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                    getNotes();
                    setEditing(false);
                })
                .catch(() => {
                    setSnackbarMessage("Failed to update note!");
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                });
        } else {
            api
                .post("/api/notes/", { title, content })
                .then(() => {
                    setSnackbarMessage("Note created!");
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                    getNotes();
                    setEditing(false);
                })
                .catch(() => {
                    setSnackbarMessage("Failed to create note!");
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                });
        }
    };

    const handleNoteClick = (note) => {
        setNoteId(note.id);
        setTitle(note.title);
        setContent(note.content);
        setEditing(true);
    };

    const filteredNotes = notes.filter((note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const renderDashboard = () => (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#0ea5e9" }}>
                Welcome!
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: "1.5rem", color: "#94a3b8" }}>
                Start creating notes to organize your thoughts. Here’s an inspirational quote:
            </Typography>
            <Card sx={{ backgroundColor: "#172a45", marginBottom: "1.5rem", padding: "1rem" }}>
                <CardContent>
                    <Typography variant="h6" sx={{ color: "#0ea5e9", fontWeight: "bold" }}>
                        "The secret of getting ahead is getting started."
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#94a3b8", marginTop: "0.5rem" }}>
                        – Mark Twain
                    </Typography>
                </CardContent>
            </Card>
            <Box sx={{ marginBottom: "2rem", textAlign: "center" }}>
                <CircularProgress variant="determinate" value={(notes.length % 10) * 10} size={80} />
                <Typography variant="body1" sx={{ marginTop: "0.5rem", color: "#94a3b8" }}>
                    Progress: {notes.length % 10}/10 Notes
                </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: "#94a3b8" }}>
                Why not add a new note and make progress today?
            </Typography>
        </Box>
    );

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                fontFamily: "'Poppins', sans-serif",
                backgroundColor: darkMode ? "#0b192f" : "#f0f4f8",
                color: darkMode ? "#fff" : "#333",
                transition: "background-color 0.3s, color 0.3s",
            }}
        >
            <Box
                sx={{
                    width: "25%",
                    backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                    padding: "1.5rem",
                    boxShadow: darkMode ? "0 4px 10px rgba(0, 0, 0, 0.6)" : "0 4px 10px rgba(0, 0, 0, 0.1)",
                    borderRight: darkMode ? "none" : "1px solid #ccc",
                    borderRadius: "8px 0 0 8px",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                    <TextField
                        placeholder="Search notes..."
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: "#94a3b8" }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                color: darkMode ? "#fff" : "#333",
                                backgroundColor: darkMode ? "#172a45" : "#f9f9f9",
                                "& fieldset": {
                                    borderColor: darkMode ? "#475569" : "#ddd",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#0ea5e9",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#0ea5e9",
                                },
                            },
                            "& .MuiInputBase-input::placeholder": {
                                color: darkMode ? "#94a3b8" : "#aaa",
                            },
                        }}
                    />
                    <Box sx={{ display: "flex", alignItems: "center", marginLeft: "1rem" }}>
                        <Typography variant="body2" sx={{ color: darkMode ? "#94a3b8" : "#555", marginRight: "0.5rem" }}>
                            {darkMode ? "Dark Mode" : "Light Mode"}
                        </Typography>
                        <Switch
                            checked={darkMode}
                            onChange={toggleDarkMode}
                            color="primary"
                            inputProps={{ "aria-label": "dark mode toggle" }}
                        />
                    </Box>
                </Box>
                <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                        backgroundColor: "#0ea5e9",
                        "&:hover": { backgroundColor: "#0284c7" },
                        marginBottom: "1rem",
                        fontFamily: "'Poppins', sans-serif",
                    }}
                    onClick={() => {
                        setNoteId(null);
                        setTitle("");
                        setContent("");
                        setEditing(true);
                    }}
                >
                    Create Note
                </Button>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: "bold",
                        color: "#0ea5e9",
                        marginBottom: "1rem",
                    }}
                >
                    My Notes
                </Typography>
                <Box sx={{ overflowY: "auto", maxHeight: "70vh" }}>
                    {filteredNotes.map((note) => (
                        <Paper
                            key={note.id}
                            onClick={() => handleNoteClick(note)}
                            sx={{
                                padding: "1rem",
                                marginBottom: "1rem",
                                backgroundColor: darkMode ? "#172a45" : "#fff",
                                cursor: "pointer",
                                transition: "transform 0.2s ease",
                                "&:hover": { transform: "scale(1.05)" },
                                position: "relative",
                            }}
                        >
                            {/* Delete Icon */}
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "8px",
                                    right: "8px",
                                    cursor: "pointer",
                                    color: "#ff6b6b",
                                    "&:hover": { color: "#e63946" },
                                }}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering the parent onClick
                                    deleteNote(note.id);
                                }}
                            >
                                <CloseIcon />
                            </Box>

                            {/* Note Title */}
                            <Typography variant="h6" sx={{ color: "#0ea5e9", fontWeight: "bold" }}>
                                {note.title}
                            </Typography>

                            {/* Note Content */}
                            <Typography variant="body2" sx={{ color: "#94a3b8", marginTop: "0.5rem" }}>
                                {note.content.substring(0, 100)}...
                            </Typography>

                            {/* Note Creation Date */}
                            <Typography variant="caption" sx={{ color: "#94a3b8", marginTop: "0.5rem", display: "block" }}>
                                Created on: {new Date(note.created_at).toLocaleDateString()} at {new Date(note.created_at).toLocaleTimeString()}
                            </Typography>
                        </Paper>
                    ))}
                </Box>

            </Box>
            <Box
                sx={{
                    flex: 1,
                    padding: "2rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                }}
            >
                {editing ? (
                    <form
                        onSubmit={createNote}
                        style={{
                            width: "100%",
                            maxWidth: "600px",
                        }}
                    >
                        <TextField
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            variant="outlined"
                            label="Title"
                            sx={{
                                marginBottom: "1.5rem",
                                "& .MuiOutlinedInput-root": {
                                    color: darkMode ? "#fff" : "#333",
                                    backgroundColor: darkMode ? "#172a45" : "#f9f9f9",
                                    "& fieldset": {
                                        borderColor: darkMode ? "#475569" : "#ddd",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#0ea5e9",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#0ea5e9",
                                    },
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            variant="outlined"
                            label="Content"
                            sx={{
                                marginBottom: "1.5rem",
                                "& .MuiOutlinedInput-root": {
                                    color: darkMode ? "#fff" : "#333",
                                    backgroundColor: darkMode ? "#172a45" : "#f9f9f9",
                                    "& fieldset": {
                                        borderColor: darkMode ? "#475569" : "#ddd",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#0ea5e9",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#0ea5e9",
                                    },
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            startIcon={<SaveIcon />}
                            sx={{
                                backgroundColor: "#0ea5e9",
                                "&:hover": { backgroundColor: "#0284c7" },
                            }}
                        >
                            {noteId ? "Update Note" : "Save Note"}
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            sx={{
                                marginTop: "1rem",
                                color: "#475569",
                                borderColor: "#475569",
                                "&:hover": {
                                    borderColor: "#0ea5e9",
                                    color: "#0ea5e9",
                                },
                            }}
                            onClick={() => setEditing(false)}
                        >
                            Cancel
                        </Button>
                    </form>
                ) : (
                    renderDashboard()
                )}
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Home;
