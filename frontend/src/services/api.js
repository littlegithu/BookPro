export const API_BASE = '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('bookpro_token')
  const url = `${API_BASE}${path}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };
  const res = await fetch(url, config);
  if (!res.ok) {
    const text = await res.text();
    let error = { message: res.statusText, status: res.status };
    try {
      const parsed = JSON.parse(text);
      error = { message: parsed.error || parsed.message || res.statusText, status: res.status, ...parsed };
    } catch {
      error.message = "Please check your information and try again";
    }
    if (res.status === 502 || res.status === 500) {
      error.message = "Please check your information and try again";
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
    specialties: specialtiesList || [],
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
    'Scheduled': 'scheduled',
    'Checked In': 'checked-in',
    'Completed': 'completed',
    'Cancelled': 'cancelled',
    'Pending': 'pending',
    'Called': 'called',
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
    record: a.record || null,
    appointment_date: a.appointment_date,
    appointment_time: a.appointment_time,
    patient_id: a.patient_id,
    doctor_id: a.doctor_id,
    hospital_id: a.hospital_id,
    notes: a.notes || '',
    room: a.room || null,
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
    profile_image: u.profile_image || null,
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

export async function fetchDoctorSearchSuggestions(query) {
  const data = await request(`/doctors/search/suggestions?q=${encodeURIComponent(query)}`)
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

export async function fetchHospital(id) {
  const data = await request(`/hospitals/${id}`);
  return transformHospital(data);
}

export async function fetchAppointments(patientId) {
  const data = await request('/appointments');
  if (Array.isArray(data)) {
    let result = data.map(transformAppointment);
    if (patientId != null) {
      result = result.filter(a => a.patient_id === patientId);
    }
    return result;
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

export async function fetchAdminDashboard() {
  return request('/admin/dashboard');
}

export async function fetchAdminDoctors() {
  const data = await request('/admin/doctors');
  if (Array.isArray(data)) {
    return data.map(transformDoctor);
  }
  return [];
}

export async function createAdminDoctor(data) {
  return request('/admin/doctors', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminDoctor(id, data) {
  return request(`/admin/doctors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAdminDoctor(id) {
  return request(`/admin/doctors/${id}`, {
    method: 'DELETE',
  });
}

export async function registerHospital(data) {
  return request('/hospitals/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function registerDoctor(data) {
  return request('/doctors/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function registerStaff(data) {
  return request('/staff/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function loginStaff(data) {
  return request('/staff/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function loginHospital(data) {
  return request('/hospital/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchHospitalDashboard() {
  const data = await request('/hospital/dashboard');
  return data;
}

export async function fetchStaffDashboard() {
  const data = await request('/staff/dashboard');
  return data;
}

export async function fetchStaffPatients(searchQuery) {
  const params = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : '';
  const data = await request(`/staff/patients${params}`);
  if (Array.isArray(data)) {
    return data.map(transformPatient);
  }
  return [];
}

export async function checkInPatient(appointmentId) {
  return request('/staff/check-in', {
    method: 'POST',
    body: JSON.stringify({ appointment_id: appointmentId }),
  });
}

export async function fetchStaffQueue() {
  return request('/staff/queue');
}

export async function fetchStaffAppointments(params) {
  const queryParams = params ? new URLSearchParams(params).toString() : '';
  const data = await request(`/staff/appointments${queryParams ? '?' + queryParams : ''}`);
  if (Array.isArray(data)) {
    return data.map(transformAppointment);
  }
  return [];
}

export async function fetchStaffDoctorsAvailability() {
  return request('/staff/doctors/availability');
}

export async function fetchDepartments() {
  return request('/staff/departments');
}

export async function fetchStaffReports() {
  return request('/staff/reports');
}

export async function fetchStaffProfile() {
  return request('/staff/profile');
}

export async function updateStaffProfile(data) {
  return request('/staff/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function createStaffPatient(data) {
  return request('/staff/patients/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchStaffPatient(id) {
  return request(`/staff/patients/${id}`);
}

export async function callNextPatient() {
  return request('/staff/queue/action', {
    method: 'POST',
    body: JSON.stringify({ action: 'call_next' }),
  });
}

export async function markPatientComplete(appointmentId) {
  return request('/staff/queue/action', {
    method: 'POST',
    body: JSON.stringify({ action: 'mark_complete', appointment_id: appointmentId }),
  });
}

export async function fetchDoctorDashboard() {
  return request('/doctor/dashboard');
}

export async function fetchDoctorAppointments(params) {
  const queryParams = params ? new URLSearchParams(params).toString() : '';
  return request(`/doctor/appointments${queryParams ? '?' + queryParams : ''}`);
}

export async function fetchDoctorAppointment(id) {
  return request(`/doctor/appointments/${id}`);
}

export async function updateDoctorAppointment(id, data) {
  return request(`/doctor/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function cancelDoctorAppointment(id) {
  return request(`/doctor/appointments/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchDoctorPatients(searchQuery) {
  const params = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : '';
  const data = await request(`/doctor/patients${params}`);
  return data;
}

export async function fetchDoctorPatient(id) {
  return request(`/doctor/patients/${id}`);
}

export async function fetchDoctorMedicalRecords(searchQuery) {
  const params = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : '';
  return request(`/doctor/medical-records${params}`);
}

export async function fetchDoctorMedicalRecord(id) {
  return request(`/doctor/medical-records/${id}`);
}

export async function createDoctorMedicalRecord(data) {
  return request('/doctor/medical-records', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateDoctorMedicalRecord(id, data) {
  return request(`/doctor/medical-records/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteDoctorMedicalRecord(id) {
  return request(`/doctor/medical-records/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchDoctorPrescriptions(searchQuery) {
  const params = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : '';
  return request(`/doctor/prescriptions${params}`);
}

export async function fetchDoctorPrescription(id) {
  return request(`/doctor/prescriptions/${id}`);
}

export async function createDoctorPrescription(data) {
  return request('/doctor/prescriptions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateDoctorPrescription(id, data) {
  return request(`/doctor/prescriptions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function cancelPrescription(id) {
  return request(`/doctor/prescriptions/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchDoctorSchedule() {
  return request('/doctor/schedule/today');
}

export async function fetchDoctorScheduleSlots() {
  return request('/doctor/availability/schedule');
}

export async function createDoctorScheduleSlot(data) {
  return request('/doctor/availability/schedule', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateDoctorScheduleSlot(id, data) {
  return request(`/doctor/availability/schedule/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteDoctorScheduleSlot(id) {
  return request(`/doctor/availability/schedule/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchDoctorAvailability() {
  return request('/doctor/availability/settings');
}

export async function updateDoctorAvailability(data) {
  return request('/doctor/availability/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getDoctorReviews() {
  return request('/doctor/reviews');
}

export async function fetchDoctorNotifications(unreadOnly = false) {
  const params = unreadOnly ? '?unread_only=true' : '';
  return request(`/doctor/notifications${params}`);
}

export async function markNotificationRead(id, isRead = true) {
  return request(`/doctor/notifications/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ is_read: isRead }),
  });
}

export async function deleteNotification(id) {
  return request(`/doctor/notifications/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchDoctorDocuments(docType) {
  const params = docType ? `?doc_type=${encodeURIComponent(docType)}` : '';
  return request(`/doctor/documents${params}`);
}

export async function uploadDoctorDocument(data) {
  return request('/doctor/documents', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteDoctorDocument(id) {
  return request(`/doctor/documents/${id}`, {
    method: 'DELETE',
  });
}

export async function updateDoctorDocument(id, data) {
  return request(`/doctor/documents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function fetchDoctorProfile() {
  return request('/doctor/profile');
}

export async function updateDoctorProfile(data) {
  return request('/doctor/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function fetchDoctorAnalytics() {
  return request('/doctor/analytics');
}

export async function fetchDoctorHospitals() {
  return request('/doctor/hospitals');
}

export async function initiateMpesaStkPush(data) {
  return request('/api/payments/mpesa/stkpush', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function sendEmail(data) {
  return request('/api/notifications/email', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function sendAppointmentNotification(data) {
  return request('/api/notifications/appointment', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function sendPrescriptionNotification(data) {
  return request('/api/notifications/prescription', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchDoctorMessages(folder = 'inbox') {
  const key = `bookpro_messages_${folder}`;
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

export async function sendDoctorMessage(data) {
  const inbox = JSON.parse(localStorage.getItem('bookpro_messages_inbox') || '[]');
  const sent = JSON.parse(localStorage.getItem('bookpro_messages_sent') || '[]');
  const now = new Date().toISOString();
  const message = {
    id: Date.now(),
    ...data,
    created_at: now,
    is_read: false,
    folder: 'inbox',
  };
  inbox.unshift(message);
  localStorage.setItem('bookpro_messages_inbox', JSON.stringify(inbox));
  return message;
}

export async function deleteDoctorMessage(id, folder) {
  const key = `bookpro_messages_${folder}`;
  const messages = JSON.parse(localStorage.getItem(key) || '[]');
  const updated = messages.filter(m => m.id !== id);
  localStorage.setItem(key, JSON.stringify(updated));
  return { success: true };
}

export async function archiveDoctorMessage(id, fromFolder = 'inbox') {
  const sourceKey = `bookpro_messages_${fromFolder}`;
  const targetKey = 'bookpro_messages_archived';
  const source = JSON.parse(localStorage.getItem(sourceKey) || '[]');
  const target = JSON.parse(localStorage.getItem(targetKey) || '[]');
  const message = source.find(m => m.id === id);
  if (message) {
    const archived = { ...message, folder: 'archived', archived_at: new Date().toISOString() };
    target.unshift(archived);
    localStorage.setItem(targetKey, JSON.stringify(target));
    const updatedSource = source.filter(m => m.id !== id);
    localStorage.setItem(sourceKey, JSON.stringify(updatedSource));
    return archived;
  }
  return null;
}

export async function markMessageRead(id, folder, isRead = true) {
  const key = `bookpro_messages_${folder}`;
  const messages = JSON.parse(localStorage.getItem(key) || '[]');
  const message = messages.find(m => m.id === id);
  if (message) {
    message.is_read = isRead;
    localStorage.setItem(key, JSON.stringify(messages));
    return message;
  }
  return null;
}

export async function createConsultation(data) {
  return request('/doctor/consultation', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchConsultation(appointmentId) {
  return request(`/doctor/consultation?appointment_id=${appointmentId}`);
}