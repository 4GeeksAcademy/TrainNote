import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { Dialog, DialogContent, DialogActions, DialogTitle, Button, Typography, TextField, MenuItem, Snackbar, Alert } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { HeaderApp4 } from "../components/HeaderApp4";

const getCategoryIcon = (category) => {
    switch (category) {
        case 'milk': return <i className="fas fa-tint"></i>;
        case 'sleep': return <i className="fas fa-moon"></i>;
        case 'diaper': return <i className="fas fa-baby"></i>;
        case 'medicine': return <i className="fas fa-capsules"></i>;
        case 'exercise': return <i className="fas fa-running"></i>;
        default: return <i className="fas fa-star text-warning"></i>;
    }
};

const getCategoryColor = (category) => {
    switch (category) {
        case 'milk': return '#4FC3F7';
        case 'sleep': return '#7986CB';
        case 'diaper': return '#FFB74D';
        case 'medicine': return '#E57373';
        case 'exercise': return '#81C784';
        default: return 'var(--color-primario)';
    }
};

export const FamiliaRutina = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
    
    const [task, setTask] = useState("");
    const [time, setTime] = useState(dayjs());
    const [category, setCategory] = useState("");
    const [list, setList] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [openTimeModal, setOpenTimeModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [errors, setErrors] = useState({ task: false, category: false });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (id && token) {
            fetch(`${apiUrl}/api/rutinas/${id}/actividades`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setList(data.sort((a, b) => a.time.localeCompare(b.time)));
                }
            })
            .catch(err => console.error(err));
        }
    }, [id, apiUrl]);

    const handleAddTask = () => {
        const newTaskError = task.trim() === "";
        const newCategoryError = category === "";
        setErrors({ task: newTaskError, category: newCategoryError });

        if (!newTaskError && !newCategoryError) {
            const token = localStorage.getItem("token");
            const nuevaActividad = {
                text: task,
                time: time.format("HH:mm"),
                category: category,
            };

            fetch(`${apiUrl}/api/rutinas/${id}/actividades`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(nuevaActividad)
            })
            .then(res => res.json())
            .then(data => {
                setList([...list, data].sort((a, b) => a.time.localeCompare(b.time)));
                setTask("");
                setCategory("");
                setSnackbar({ open: true, message: "Actividad añadida", severity: "success" });
            });
        }
    };

    const handleOpenEdit = (item) => {
        setEditingItem({ ...item, time: dayjs(`2024-01-01 ${item.time}`) });
        setOpenEditModal(true);
    };

    const handleUpdateTask = () => {
        const token = localStorage.getItem("token");
        const updatedData = {
            text: editingItem.text,
            time: editingItem.time.format("HH:mm"),
            category: editingItem.category
        };

        fetch(`${apiUrl}/api/actividades/${editingItem.id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatedData)
        })
        .then(res => res.json())
        .then(data => {
            setList(list.map(item => item.id === editingItem.id ? data : item).sort((a, b) => a.time.localeCompare(b.time)));
            setOpenEditModal(false);
            setSnackbar({ open: true, message: "Actualizado", severity: "info" });
        });
    };

    return (
        <div className="w-100 h-100 d-flex flex-column bg-white">
            <HeaderApp4 showBackButton={true} onBackClick={() => navigate("/rutinas", { replace: true })} />

            <div className="flex-grow-1 overflow-auto p-3">
                <div className="bg-light p-3 rounded-4 mb-4 shadow-sm border">
                    <input 
                        type="text" 
                        className={`form-control mb-2 border-0 shadow-sm ${errors.task ? 'is-invalid' : ''}`} 
                        placeholder="Ej: Biberón" 
                        value={task} 
                        onChange={(e) => setTask(e.target.value)} 
                    />
                    
                    <button className="btn btn-white w-100 mb-2 shadow-sm d-flex justify-content-between align-items-center" onClick={() => setOpenTimeModal(true)}>
                        <span className="small fw-bold">Hora: {time.format("HH:mm")}</span>
                        <i className="far fa-clock text-primary"></i>
                    </button>

                    <select className={`form-select mb-2 border-0 shadow-sm ${errors.category ? 'is-invalid' : ''}`} value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="" disabled>CATEGORÍA</option>
                        <option value="milk">ALIMENTACIÓN</option>
                        <option value="sleep">DESCANSO</option>
                        <option value="diaper">CAMBIO DE PAÑAL</option>
                        <option value="medicine">MEDICINA</option>
                        <option value="exercise">EJERCICIO</option>
                    </select>

                    <button className="btn w-100 text-white fw-bold" style={{ backgroundColor: "var(--color-primario)", borderRadius: "12px" }} onClick={handleAddTask}>
                        AÑADIR ACTIVIDAD
                    </button>
                </div>

                <div className="pb-4">
                    {list.length === 0 ? (
                        <div className="text-center py-5 opacity-25">
                            <i className="fas fa-list fa-3x mb-2"></i>
                            <p>Sin actividades aún</p>
                        </div>
                    ) : (
                        list.map((item) => (
                            <div key={item.id} className="card mb-2 border-0 shadow-sm rounded-4 overflow-hidden" style={{ borderLeft: `5px solid ${getCategoryColor(item.category)}` }}>
                                <div className="d-flex align-items-center p-3">
                                    <div className="me-3 fs-4" style={{ color: getCategoryColor(item.category) }}>
                                        {getCategoryIcon(item.category)}
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="m-0 fw-bold">{item.text}</h6>
                                        <small className="text-muted">{item.time}</small>
                                    </div>
                                    <button className="btn btn-sm px-3 fw-bold text-white" style={{ backgroundColor: getCategoryColor(item.category), borderRadius: "10px" }} onClick={() => handleOpenEdit(item)}>
                                        EDITAR
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} fullWidth maxWidth="xs">
                <DialogTitle className="text-center fw-bold">Editar Actividad</DialogTitle>
                <DialogContent>
                    <TextField label="Nombre" fullWidth margin="normal" value={editingItem?.text || ""} onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })} />
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                        <StaticTimePicker 
                            displayStaticWrapperAs="mobile" 
                            value={editingItem?.time || dayjs()} 
                            onChange={(val) => setEditingItem({ ...editingItem, time: val })} 
                            slotProps={{ actionBar: { actions: [] } }}
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions className="p-3">
                    <Button onClick={() => setOpenEditModal(false)}>Cerrar</Button>
                    <Button variant="contained" onClick={handleUpdateTask} style={{ backgroundColor: "var(--color-primario)" }}>Guardar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openTimeModal} onClose={() => setOpenTimeModal(false)}>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                        <StaticTimePicker 
                            displayStaticWrapperAs="mobile" 
                            value={time} 
                            onChange={(val) => setTime(val)} 
                            slotProps={{ actionBar: { actions: [] } }}
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions className="pb-3 justify-content-center">
                    <Button variant="contained" className="w-75" onClick={() => setOpenTimeModal(false)} style={{ backgroundColor: "var(--color-primario)", borderRadius: "50px" }}>OK</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </div>
    );
};