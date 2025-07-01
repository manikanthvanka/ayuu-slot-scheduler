export const generateScheduleReport = (
  filteredAppointments: any[],
  selectedDate: string,
  doctorFilter: string
) => {
  const printContent = `
    APPOINTMENT SCHEDULE REPORT
    
    Date: ${selectedDate || 'All Dates'}
    Doctor: ${doctorFilter || 'All Doctors'}
    
    ${filteredAppointments.map(apt => `
    Patient: ${apt.patientName}
    MR Number: ${apt.mrNumber}
    Doctor: ${apt.doctorName}
    Time: ${apt.appointmentTime}
    Type: ${apt.appointmentType}
    Status: ${apt.status}
    Phone: ${apt.phone}
    -------------------
    `).join('')}
    
    Generated on: ${new Date().toLocaleString()}
  `;

  const blob = new Blob([printContent], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Schedule_Report_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const getDateLabel = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};