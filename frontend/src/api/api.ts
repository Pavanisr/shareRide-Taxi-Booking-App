// api.ts
export const BASE_URL = "http://192.168.1.9:5000/api"; // your backend

// ----------------- Helper -----------------
const handleResponse = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

// (rest of your API functions stay EXACTLY the same)


// ----------------- Passenger APIs -----------------
export const passengerSignup = async (formData: FormData) => {
  const res = await fetch(`${BASE_URL}/passenger/register`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(res);
};

export const passengerLogin = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/passenger/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
};

export const passengerEditProfile = async (token: string, formData: FormData) => {
  const res = await fetch(`${BASE_URL}/passenger/edit-profile`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return handleResponse(res);
};

export const passengerDeleteProfile = async (token: string) => {
  const res = await fetch(`${BASE_URL}/passenger/delete-profile`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

export const createRide = async (
  token: string,
  pickup_city: string,
  destination_city: string,
  seats: number,
  date_time: string
) => {
  const res = await fetch(`${BASE_URL}/passenger/create-ride`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ pickup_city, destination_city, seats, date_time }),
  });
  return handleResponse(res);
};

export const getAvailableRides = async (token: string, pickup: string, destination: string) => {
  const res = await fetch(`${BASE_URL}/passenger/rides?pickup=${pickup}&destination=${destination}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

export const joinRide = async (token: string, ride_id: number) => {
  const res = await fetch(`${BASE_URL}/passenger/join-ride`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ride_id }),
  });
  return handleResponse(res);
};

export const unjoinRide = async (token: string, ride_id: number) => {
  const res = await fetch(`${BASE_URL}/passenger/unjoin-ride`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ride_id }),
  });
  return handleResponse(res);
};

// ----------------- Driver APIs -----------------
export const driverSignup = async (formData: FormData) => {
  const res = await fetch(`${BASE_URL}/driver/register`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(res);
};

export const driverLogin = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/driver/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
};

export const getDriverProfile = async (token: string) => {
  const res = await fetch(`${BASE_URL}/driver/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

export const editDriverProfile = async (token: string, formData: FormData) => {
  const res = await fetch(`${BASE_URL}/driver/edit-profile`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return handleResponse(res);
};

export const getAvailableRidesForDriver = async (token: string) => {
  const res = await fetch(`${BASE_URL}/driver/available-rides`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

export const acceptRide = async (token: string, ride_id: number) => {
  const res = await fetch(`${BASE_URL}/driver/accept-ride`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ride_id }),
  });
  return handleResponse(res);
};

export const rejectRide = async (token: string, ride_id: number) => {
  const res = await fetch(`${BASE_URL}/driver/reject-ride`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ride_id }),
  });
  return handleResponse(res);
};

export const startRide = async (token: string, ride_id: number) => {
  const res = await fetch(`${BASE_URL}/driver/start-ride`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ride_id }),
  });
  return handleResponse(res);
};

export const completeRide = async (token: string, ride_id: number) => {
  const res = await fetch(`${BASE_URL}/driver/complete-ride`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ride_id }),
  });
  return handleResponse(res);
};
