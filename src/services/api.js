export const API_BASE = '/api';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  const res = await fetch(url, config);
  if (!res.ok) {
    const text = await res.text();
    let error = { message: res.statusText };
    try {
      const parsed = JSON.parse(text);
      error = { message: parsed.error || parsed.message || res.statusText, ...parsed };
    } catch {
      // keep default error
    }
    return Promise.reject(error);
  }
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function transformDoctor(d) {
  const specialtiesList = d.specialties ? d.specialties.split(',').map(s => s.trim()).filter(Boolean) : []
  return {
    id: d.id,
    name: `${d.first_name} ${d.last_name}`,
    specialty: d.specialty || 'General Practice',
    experience: `${d.years_practice || 0} years`,
    hours: d.working_hours || '',
    rating: d.rating || 0,
    reviews: d.reviews || 0,
    tags: [],
    availability: d.available ? 'Available Today' : 'Unavailable',
    hospital_name: d.hospital_name || '',
    hospital_location: d.hospital_location || '',
    hospital_phone: d.hospital_phone || '',
    bio: d.bio || '',
    specialties: specialtiesList,
    phone: d.phone || '',
    email: d.email || '',
    fee: d.fee || 0,
    duration: d.duration || 0,
    profile_image: d.profile_image || '',
    languages: d.languages || '',
    education: d.education || '',
    certifications: d.certifications || '',
    working_days: d.working_days || '',
    consultation_type: d.consultation_type || 'Physical',
    verification_status: d.verification_status || 'Verified',
    hospital_ids: d.hospital_ids || '',
  };
}

export function transformAppointment(a) {
  const dateObj = a.appointment_date ? new Date(a.appointment_date) : null;
  const dateStr = dateObj
    ? dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';
  const timeStr = a.appointment_time || (dateObj ? dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '');
  const statusMap = {
    'Scheduled': 'confirmed',
    'Completed': 'completed',
    'Cancelled': 'cancelled',
  };
  const doctor = a.doctor || {};
  return {
    id: a.id,
    doctorName: doctor.first_name && doctor.last_name ? `${doctor.first_name} ${doctor.last_name}` : 'Doctor',
    specialty: doctor.specialty || 'General Practice',
    date: dateStr,
    time: timeStr,
    status: statusMap[a.status] || a.status,
    reason: a.notes || '',
    record: null,
    appointment_date: a.appointment_date,
    appointment_time: a.appointment_time,
    patient_id: a.patient_id,
    doctor_id: a.doctor_id,
    hospital_id: a.hospital_id,
    notes: a.notes || '',
  };
}

export function transformHospital(h) {
  return {
    id: h.id,
    name: h.name,
    location: h.address || '',
    phone: h.phone || '',
    address: h.address || '',
    email: h.email || '',
    website: h.website || '',
  };
}

export function transformPatient(p) {
  return {
    id: p.id,
    first_name: p.first_name,
    last_name: p.last_name,
    email: p.email,
    phone: p.phone,
    name: `${p.first_name} ${p.last_name}`,
    dob: p.dob,
    gender: p.gender,
    address: p.address,
  };
}

export function transformUser(u) {
  return {
    id: u.id,
    first_name: u.first_name,
    last_name: u.last_name,
    email: u.email,
    phone: u.phone,
    name: `${u.first_name} ${u.last_name}`,
  };
}

export async function loginUser(data) {
  return request('/users/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function registerUser(data) {
  return request('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchDoctors() {
  const data = await request('/doctors');
  if (Array.isArray(data)) {
    return data.map(transformDoctor);
  }
  return [];
}

export async function fetchDoctorsByHospital(hospitalName) {
  const data = await request(`/doctors?hospital_name=${encodeURIComponent(hospitalName)}`);
  if (Array.isArray(data)) {
    return data.map(transformDoctor);
  }
  return [];
}

export async function fetchDoctor(id) {
  const data = await request(`/doctors/${id}`)
  return transformDoctor(data)
}

export async function fetchDoctorReviews(doctorId) {
  const data = await request(`/doctors/${doctorId}/reviews`)
  if (Array.isArray(data)) {
    return data
  }
  return []
}

export async function fetchHospitals() {
  const data = await request('/hospitals');
  if (Array.isArray(data)) {
    return data.map(transformHospital);
  }
  return [];
}

export async function fetchAppointments() {
  const data = await request('/appointments');
  if (Array.isArray(data)) {
    return data.map(transformAppointment);
  }
  return [];
}

export async function createAppointment(data) {
  const payload = {
    appointment_date: data.appointment_date,
    appointment_time: data.appointment_time || '00:00:00',
    status: 'Scheduled',
    patient_id: data.patient_id,
    doctor_id: data.doctor_id,
    hospital_id: data.hospital_id,
    notes: data.notes || '',
  };
  const result = await request('/appointments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return transformAppointment(result);
}

export async function cancelAppointment(id) {
  await request(`/appointments/${id}`, {
    method: 'DELETE',
  });
}

export async function updateUser(id, data) {
  const result = await request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return transformUser(result);
}

export async function fetchUserByEmail(email) {
  const data = await request('/users');
  if (Array.isArray(data)) {
    return data.find(u => u.email === email) || null;
  }
  return null;
}

export async function fetchPatientByEmail(email) {
  const data = await request('/patients');
  if (Array.isArray(data)) {
    return data.find(p => p.email === email) || null;
  }
  return null;
}

export async function fetchPatient(id) {
  const data = await request(`/patients/${id}`);
  return transformPatient(data);
}
