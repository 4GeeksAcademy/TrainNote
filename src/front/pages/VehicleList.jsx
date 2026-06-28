import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Car, Search, Plus, Copy, FileSpreadsheet, FileText, 
    TableProperties, Eye, FilterX, Menu, Pencil, Trash2 
} from "lucide-react";
import * as XLSX from "xlsx";
import "./Vehicle-List.css";

const COLUMNS = [
    { key: 'license_plate', label: 'Plate' },
    { key: 'vin', label: 'VIN' },
    { key: 'brand', label: 'Brand' },
    { key: 'model', label: 'Model' },
    { key: 'version', label: 'Version' },
    { key: 'year', label: 'Year' },
    { key: 'fuel', label: 'Fuel' },
    { key: 'power', label: 'Power' },
    { key: 'displacement', label: 'Displacement' },
    { key: 'color', label: 'Color' },
    { key: 'mileage', label: 'Mileage' },
    { key: 'registration_date', label: 'Registration Date' },
    { key: 'actions', label: 'Actions' }
];

const INITIAL_VISIBILITY = {
    license_plate: true, vin: true, brand: true, model: true, 
    version: true, year: false, fuel: false, power: false, 
    displacement: false, color: false, mileage: false, 
    registration_date: false, actions: true
};

export default function VehicleList() {
    const [data, setData] = useState([{ id: 1, license_plate: "1234-ABC", vin: "VF1R123456789", brand: "Toyota", model: "Corolla", version: "Hybrid", year: 2023, fuel: "Hybrid", power: "122", displacement: "1800", color: "White", mileage: "15000", registration_date: "2023-01-15" }]);
    const [globalSearch, setGlobalSearch] = useState("");
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState(INITIAL_VISIBILITY);
    const [editingVehicle, setEditingVehicle] = useState(null);

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Vehicles");
        XLSX.writeFile(wb, "Vehicles.xlsx");
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        alert("Data copied to clipboard!");
    };
    
    const [columnFilters, setColumnFilters] = useState(
        COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: "" }), {})
    );

    const handleSave = (e) => {
        e.preventDefault();
        setData(data.map(v => v.id === editingVehicle.id ? editingVehicle : v));
        setEditingVehicle(null);
    };

    const handleDelete = (id) => {
        if(window.confirm("Are you sure?")) setData(data.filter(v => v.id !== id));
    };

    const handleColumnFilterChange = (column, value) => {
        setColumnFilters((prev) => ({ ...prev, [column]: value }));
        setCurrentPage(1);
    };

    const handleToggleColumn = (column) => {
        setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
    };

    const handleClearFilters = () => {
        setGlobalSearch("");
        setColumnFilters(COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: "" }), {}));
        setCurrentPage(1);
    };

    const filteredData = useMemo(() => {
        return data.filter((row) => {
            const matchesGlobal = Object.values(row).some((val) => 
                String(val).toLowerCase().includes(globalSearch.toLowerCase())
            );
            const matchesFilters = Object.keys(columnFilters).every(key => 
                !columnFilters[key] || String(row[key] || "").toLowerCase().includes(columnFilters[key].toLowerCase())
            );
            return matchesGlobal && matchesFilters;
        });
    }, [data, globalSearch, columnFilters]);

    const paginatedData = useMemo(() => {
        if (recordsPerPage === -1) return filteredData;
        const startIndex = (currentPage - 1) * recordsPerPage;
        return filteredData.slice(startIndex, startIndex + recordsPerPage);
    }, [filteredData, currentPage, recordsPerPage]);

    const totalPages = recordsPerPage === -1 ? 1 : Math.max(1, Math.ceil(filteredData.length / recordsPerPage));

    return (
        <div className="d-flex flex-column h-100">
            <header className="bg-orange d-flex align-items-center px-3" style={{ height: "56px", backgroundColor: "#e65100" }}>
                <Menu size={24} className="text-white" />
            </header>
        <div className="container-fluid mt-4 px-4 app-vehicle-container">
            <div className="d-flex align-items-center mb-4">
                <Car className="me-2 text-secondary" size={32} />
                <h2 className="header-title m-0">Vehicle List</h2>
            </div>

            <div className="row mb-3 g-2">
                <div className="col-md-10">
                    <div className="input-group">
                        <span className="input-group-text bg-white"><Search size={18} className="text-muted" /></span>
                        <input type="text" className="form-control" placeholder="Search vehicles by any field" value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} />
                    </div>
                </div>
                <div className="col-md-2">
                    <button className="btn btn-orange w-100"><Plus size={18} /> Add Vehicle</button>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                <div className="d-flex gap-2 mb-3">
                    <button onClick={copyToClipboard} className="btn btn-orange-action btn-sm"><Copy size={14}/> Copy</button>
                    <button onClick={exportToExcel} className="btn btn-orange-action btn-sm"><FileSpreadsheet size={14}/> Excel</button>
                    <button className="btn btn-orange-action btn-sm"><FileText size={14}/> CSV</button>
        
                    <div className="position-relative">
                        <button onClick={() => setShowOptionsDropdown(!showOptionsDropdown)} className="btn btn-orange-action btn-sm"><TableProperties size={14} /> Table Options</button>
                        {showOptionsDropdown && (
                            <div className="dropdown-menu show shadow p-2 position-absolute start-0 mt-1 backend-dropdown">
                                <div className="fw-bold p-1"><Eye size={14} /> Show / Hide Columns</div>
                                {COLUMNS.filter(c => c.key !== 'actions').map((col) => (
                                    <label key={col.key} className="dropdown-item style-cursor">
                                        <input type="checkbox" checked={visibleColumns[col.key]} onChange={() => handleToggleColumn(col.key)} /> {col.label}
                                    </label>
                                ))}
                                <button onClick={handleClearFilters} className="dropdown-item text-danger"><FilterX size={14} /> Clear Filters</button>
                            </div>
                        )}
                    </div>
                </div>
                <select className="form-select form-select-sm w-auto" value={recordsPerPage} onChange={(e) => { setRecordsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                    <option value={10}>10 records</option>
                    <option value={100}>100 records</option>
                    <option value={500}>500 records</option>
                    <option value={-1}>All records</option>
                </select>
            </div>

            {/* Tabla */}
            <div className="card shadow-sm vehicle-card-wrapper">
                <div className="card-body p-3 overflow-auto">
                    <table className="table table-bordered align-middle m-0 vehicle-workshop-table">
                        <thead>
                            <tr>
                                {COLUMNS.map(col => visibleColumns[col.key] && <th key={col.key}>{col.label}</th>)}
                            </tr>
                            <tr className="search-row">
                                {COLUMNS.map(col => visibleColumns[col.key] && (
                                    <td key={`search-${col.key}`}>
                                        {col.key !== 'actions' && (
                                            <input type="text" className="form-control form-control-sm" placeholder={`Search ${col.label.toLowerCase()}`} value={columnFilters[col.key]} onChange={(e) => handleColumnFilterChange(col.key, e.target.value)} />
                                        )}
                                    </td>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((row) => (
                                <tr key={row.id}>
                                    {visibleColumns.license_plate && <td>{row.license_plate}</td>}
                                    {visibleColumns.vin && <td>{row.vin}</td>}
                                    {visibleColumns.brand && <td>{row.brand}</td>}
                                    {visibleColumns.model && <td>{row.model}</td>}
                                    {visibleColumns.version && <td>{row.version}</td>}
                                    {visibleColumns.year && <td>{row.year}</td>}
                                    {visibleColumns.fuel && <td>{row.fuel}</td>}
                                    {visibleColumns.power && <td>{row.power} CV</td>}
                                    {visibleColumns.displacement && <td>{row.displacement} cc</td>}
                                    {visibleColumns.color && <td>{row.color}</td>}
                                    {visibleColumns.mileage && <td>{row.mileage} km</td>}
                                    {visibleColumns.registration_date && <td>{row.registration_date}</td>}
                                    {visibleColumns.actions && (
                                        <td className="text-center">
                                            <button 
                                            className="action-icon-btn action-edit" 
                                            onClick={() => setEditingVehicle(row)} 
                                        >
                                            <Pencil size={18} fill="currentColor" />
                                        </button>
                                            <button className="action-icon-btn action-delete" onClick={() => handleDelete(row.id)}><Trash2 size={18} /></button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            

            <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted">Showing {paginatedData.length} of {filteredData.length} entries</div>
                <nav>
                    <ul className="pagination pagination-sm m-0">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button></li>
                        <li className="page-item active"><button className="page-link">{currentPage}</button></li>
                        <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}><button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>Next</button></li>
                    </ul>
                </nav>
            </div>
        </div>
        </div>
    );
    {editingVehicle && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between align-items-center p-3 border-bottom">
                                <h5 className="m-0">Edit Vehicle</h5>
                                <button className="btn-close" onClick={() => setEditingVehicle(null)}></button>
                            </div>
                            <form onSubmit={handleSave}>
                                <div className="modal-body p-4 row">
                                    {COLUMNS_CONFIG.map(col => (
                                        <div className="col-md-6 mb-3" key={col.key}>
                                            <label className="form-label">{col.label}</label>
                                            <input className="form-control" value={editingVehicle[col.key] || ""} 
                                                onChange={e => setEditingVehicle({...editingVehicle, [col.key]: e.target.value})} />
                                        </div>
                                    ))}
                                </div>
                                <div className="modal-footer p-3 bg-light">
                                    <button type="submit" className="btn btn-orange w-100">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
}
