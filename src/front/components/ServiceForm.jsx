import { useEffect, useState } from "react";

const RAW_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:3001";

const API_BASE_URL = RAW_BACKEND_URL.endsWith("/api")
  ? RAW_BACKEND_URL
  : `${RAW_BACKEND_URL.replace(/\/$/, "")}/api`;

const emptyServiceForm = {
  vehicle_id: "",
  employee_id: "",
  title: "",
  description: "",
  service_type: "repair",
  status: "pending",
  priority: "normal",
  entry_mileage: "",
  observations: ""
};

const SERVICE_TYPES = [
  { value: "repair", label: "Repair" },
  { value: "maintenance", label: "Maintenance" },
  { value: "diagnostic", label: "Diagnostic" },
  { value: "inspection", label: "Inspection" },
  { value: "bodywork", label: "Bodywork" },
  { value: "painting", label: "Painting" },
  { value: "cleaning", label: "Cleaning" },
  { value: "detailing", label: "Detailing" },
  { value: "other", label: "Other" }
];

const SERVICE_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "diagnosis", label: "Diagnosis" },
  { value: "budget_pending", label: "Budget pending" },
  { value: "waiting_parts", label: "Waiting parts" },
  { value: "in_repair", label: "In repair" },
  { value: "ready_to_deliver", label: "Ready to deliver" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" }
];

const SERVICE_PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" }
];

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

function buildUrl(path) {
  return `${API_BASE_URL}${path}`;
}

function getVehicleLabel(vehicle) {
  const vehicleName = `${vehicle.brand || ""} ${vehicle.model || ""}`.trim();
  const plate = vehicle.plate ? ` · ${vehicle.plate}` : "";
  const customer = vehicle.customer_name ? ` · ${vehicle.customer_name}` : "";

  return `${vehicleName || "Vehicle"}${plate}${customer}`;
}

function getMechanicLabel(mechanic) {
  const fullName = `${mechanic.first_name || ""} ${mechanic.last_name || ""}`.trim();
  const email = mechanic.email ? ` · ${mechanic.email}` : "";

  return `${fullName || "Mechanic"}${email}`;
}

export function ServiceForm({ onServiceCreated }) {
  const [formData, setFormData] = useState(emptyServiceForm);
  const [vehicles, setVehicles] = useState([]);
  const [mechanics, setMechanics] = useState([]);

  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadOptions = async () => {
    try {
      setIsLoadingOptions(true);
      setError("");

      const [vehiclesResponse, mechanicsResponse] = await Promise.all([
        fetch(buildUrl("/vehicles"), {
          method: "GET",
          headers: getAuthHeaders()
        }),
        fetch(buildUrl("/mechanics"), {
          method: "GET",
          headers: getAuthHeaders()
        })
      ]);

      const vehiclesData = await vehiclesResponse.json();
      const mechanicsData = await mechanicsResponse.json();

      if (!vehiclesResponse.ok) {
        throw new Error(
          vehiclesData.error ||
            vehiclesData.message ||
            "Could not load vehicles."
        );
      }

      if (!mechanicsResponse.ok) {
        throw new Error(
          mechanicsData.error ||
            mechanicsData.message ||
            "Could not load mechanics."
        );
      }

      setVehicles(vehiclesData.vehicles || []);
      setMechanics(mechanicsData.mechanics || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));

    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!formData.vehicle_id) {
      setError("Please select a vehicle.");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a service title.");
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        vehicle_id: Number(formData.vehicle_id),
        employee_id: formData.employee_id ? Number(formData.employee_id) : null,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        service_type: formData.service_type,
        status: formData.status,
        priority: formData.priority,
        entry_mileage: formData.entry_mileage
          ? Number(formData.entry_mileage)
          : null,
        observations: formData.observations.trim() || null
      };

      const response = await fetch(buildUrl("/services"), {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Could not create service ticket."
        );
      }

      setFormData(emptyServiceForm);
      setSuccessMessage("Service ticket created successfully.");

      if (onServiceCreated) {
        onServiceCreated(data.service);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="bg-white border rounded-4 shadow-sm p-4 mb-4">
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
        <div>
          <p className="text-uppercase text-muted small fw-semibold mb-2">
            Service tickets
          </p>

          <h2 className="h4 fw-bold mb-2">
            Create repair ticket
          </h2>

          <p className="text-muted mb-0">
            Create a new repair or maintenance task and assign it to a mechanic.
          </p>
        </div>

       
      </div>

      {error && (
        <div className="alert alert-danger rounded-4" role="alert">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success rounded-4" role="alert">
          {successMessage}
        </div>
      )}

      {vehicles.length === 0 && (
        <div className="alert alert-warning rounded-4">
          No vehicles found. Create a customer and a vehicle before creating a
          service ticket.
        </div>
      )}

      {mechanics.length === 0 && (
        <div className="alert alert-warning rounded-4">
          No mechanics found. Create a mechanic account before assigning tickets.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <label className="form-label fw-semibold" htmlFor="vehicle_id">
              Vehicle
            </label>

            <select
              id="vehicle_id"
              name="vehicle_id"
              className="form-select py-2 px-3"
              value={formData.vehicle_id}
              onChange={handleInputChange}
              required
              disabled={vehicles.length === 0}
            >
              <option value="">Select a vehicle</option>

              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {getVehicleLabel(vehicle)}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-lg-6">
            <label className="form-label fw-semibold" htmlFor="employee_id">
              Assigned mechanic
            </label>

            <select
              id="employee_id"
              name="employee_id"
              className="form-select py-2 px-3"
              value={formData.employee_id}
              onChange={handleInputChange}
              disabled={mechanics.length === 0}
            >
              <option value="">Unassigned</option>

              {mechanics.map((mechanic) => (
                <option key={mechanic.id} value={mechanic.id}>
                  {getMechanicLabel(mechanic)}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-lg-8">
            <label className="form-label fw-semibold" htmlFor="title">
              Title
            </label>

            <input
              id="title"
              type="text"
              name="title"
              className="form-control py-2 px-3"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Example: Engine diagnosis"
              required
            />
          </div>

          <div className="col-12 col-lg-4">
            <label className="form-label fw-semibold" htmlFor="entry_mileage">
              Entry mileage
            </label>

            <input
              id="entry_mileage"
              type="number"
              name="entry_mileage"
              className="form-control py-2 px-3"
              value={formData.entry_mileage}
              onChange={handleInputChange}
              placeholder="120000"
              min="0"
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label fw-semibold" htmlFor="service_type">
              Service type
            </label>

            <select
              id="service_type"
              name="service_type"
              className="form-select py-2 px-3"
              value={formData.service_type}
              onChange={handleInputChange}
            >
              {SERVICE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label fw-semibold" htmlFor="status">
              Initial status
            </label>

            <select
              id="status"
              name="status"
              className="form-select py-2 px-3"
              value={formData.status}
              onChange={handleInputChange}
            >
              {SERVICE_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label fw-semibold" htmlFor="priority">
              Priority
            </label>

            <select
              id="priority"
              name="priority"
              className="form-select py-2 px-3"
              value={formData.priority}
              onChange={handleInputChange}
            >
              {SERVICE_PRIORITIES.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold" htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              className="form-control py-2 px-3"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Describe the customer complaint or the requested work."
            ></textarea>
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold" htmlFor="observations">
              Observations
            </label>

            <textarea
              id="observations"
              name="observations"
              className="form-control py-2 px-3"
              value={formData.observations}
              onChange={handleInputChange}
              rows="3"
              placeholder="Internal notes for the workshop team."
            ></textarea>
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="btn btn-dark w-100 py-3 fw-bold"
              disabled={isSaving || vehicles.length === 0}
            >
              {isSaving ? "Creating ticket..." : "Create service ticket"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}