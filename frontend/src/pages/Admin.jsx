import React, { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Button, Box, Container, Snackbar, Alert, Switch
} from '@mui/material';
import {
  FileDownload as FileDownloadIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { BarChart } from '@mui/x-charts';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { fetchTotalNotes, fetchTotalUsers, fetchNotesAllMonths, fetchUsersAllMonths } from '../api';
import '../styles/admin.css';

const googleDocsColors = {
  blue: '#1a73e8',
  green: '#34a853',
};

const AdminDashboard = () => {
  const [totalNotes, setTotalNotes] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [notesAllMonths, setNotesAllMonths] = useState([]);
  const [usersAllMonths, setUsersAllMonths] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    getNotes();
    getUsers();
  }, []);

  const getNotes = () => {
    fetchTotalNotes().then(response => setTotalNotes(response.total_notes)).catch(console.error);
    fetchNotesAllMonths().then(response => setNotesAllMonths(response || [])).catch(console.error);
  };

  const getUsers = () => {
    fetchTotalUsers().then(response => setTotalUsers(response.total_users)).catch(console.error);
    fetchUsersAllMonths().then(response => setUsersAllMonths(response || [])).catch(console.error);
  };

  const handleExportData = () => {
    const csvData = `Total Notes,${totalNotes}\nTotal Users,${totalUsers}\n`;
    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'dashboard_data.csv';
    link.click();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18).text('Admin Dashboard Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Total Notes: ${totalNotes}`, 20, 30);
    doc.text(`Total Users: ${totalUsers}`, 20, 40);
    doc.save('dashboard_report.pdf');
  };

  const handleDownloadReport = async () => {
    const contentToCapture = document.getElementById('dashboard-content');
    if (!contentToCapture) return;
  
    try {
      const canvas = await html2canvas(contentToCapture, { scale: 2 }); // Higher scale for better quality
      const imgData = canvas.toDataURL('image/png');
  
      const doc = new jsPDF('portrait', 'mm', 'a4'); // Use A4 size for a professional format
  
      // Add Title
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(24);
      doc.text('Admin Dashboard Report', 20, 20);
  
      // Add a divider line
      doc.setDrawColor(0, 0, 0); // Black color
      doc.line(20, 25, 190, 25);
  
      // Add Date
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(12);
      const currentDate = new Date().toLocaleDateString();
      doc.text(`Date: ${currentDate}`, 20, 35);
  
      // Add Summary Data Section
      doc.setFontSize(14);
      doc.text('Summary', 20, 50);
      doc.setFontSize(12);
      doc.text(`Total Notes: ${totalNotes}`, 20, 60);
      doc.text(`Total Users: ${totalUsers}`, 20, 70);
  
      // Add Charts Image
      doc.setFontSize(14);
      doc.text('Dashboard Overview', 20, 90);
      doc.addImage(imgData, 'PNG', 20, 100, 170, 100); // Adjust size and position
  
      // Footer
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text('Generated by Admin Dashboard', 20, 290);
  
      doc.save('dashboard_report.pdf');
  
      // Show success notification
      setSnackbarMessage('Report downloaded successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      // Show error notification
      setSnackbarMessage('Failed to generate report. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  

  // const handleDownloadReport = async () => {
  //   const contentToCapture = document.getElementById('dashboard-content');
  //   if (!contentToCapture) return;

  //   try {
  //     const canvas = await html2canvas(contentToCapture);
  //     const imgData = canvas.toDataURL('image/png');
  //     const doc = new jsPDF();

  //     doc.setFontSize(20);
  //     doc.text('Admin Dashboard Report', 14, 20);
  //     doc.addImage(imgData, 'PNG', 10, 30, 180, 160); // Adjust size/placement as needed
  //     doc.save('dashboard_report_screenshot.pdf');

  //     // Show success notification
  //     setSnackbarMessage('Report downloaded successfully!');
  //     setSnackbarSeverity('success');
  //     setSnackbarOpen(true);
  //   } catch (error) {
  //     // Show error notification
  //     setSnackbarMessage('Failed to generate report. Please try again.');
  //     setSnackbarSeverity('error');
  //     setSnackbarOpen(true);
  //   }
  // };

  const notesChartData = {
    xAxis: [{ scaleType: 'band', data: notesAllMonths.map(month => `Month ${month.month}`) }],
    series: [{ data: notesAllMonths.map(month => month.count), color: googleDocsColors.blue }]
  };

  const usersChartData = {
    xAxis: [{ scaleType: 'band', data: usersAllMonths.map(month => `Month ${month.month}`) }],
    series: [{ data: usersAllMonths.map(month => month.count), color: googleDocsColors.green }]
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Box id="dashboard-content" sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: darkMode ? '#0b192f' : '#f0f4f8',
      color: darkMode ? '#fff' : '#333',
      transition: 'background-color 0.3s, color 0.3s',
      padding: 4,
    }}>
      <Container maxWidth="lg">
        {/* Dark Mode Toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
          <Switch
            checked={darkMode}
            onChange={toggleDarkMode}
            color="primary"
            inputProps={{ "aria-label": "dark mode toggle" }}
          />
        </Box>

        {/* Cards */}
        <Grid container spacing={4} sx={{ marginBottom: 3 }}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{
              bgcolor: darkMode ? '#172a45' : '#ffffff',
              borderColor: darkMode ? '#475569' : '#ddd',
              padding: 3,
              boxShadow: darkMode ? '0 4px 12px rgba(0, 0, 0, 0.6)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: darkMode ? '#0ea5e9' : '#1a73e8' }}>Total Notes</Typography>
                <Typography variant="h4">{totalNotes}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{
              bgcolor: darkMode ? '#172a45' : '#ffffff',
              borderColor: darkMode ? '#475569' : '#ddd',
              padding: 3,
              boxShadow: darkMode ? '0 4px 12px rgba(0, 0, 0, 0.6)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: darkMode ? '#0ea5e9' : '#1a73e8' }}>Total Users</Typography>
                <Typography variant="h4">{totalUsers}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{
              bgcolor: darkMode ? '#172a45' : '#ffffff',
              borderColor: darkMode ? '#475569' : '#ddd',
              padding: 3,
              boxShadow: darkMode ? '0 4px 12px rgba(0, 0, 0, 0.6)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: darkMode ? '#0ea5e9' : '#1a73e8' }}>Total Notes Chart</Typography>
                <BarChart xAxis={notesChartData.xAxis} series={notesChartData.series} height={300} width={450} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{
              bgcolor: darkMode ? '#172a45' : '#ffffff',
              borderColor: darkMode ? '#475569' : '#ddd',
              padding: 3,
              boxShadow: darkMode ? '0 4px 12px rgba(0, 0, 0, 0.6)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: darkMode ? '#0ea5e9' : '#1a73e8' }}>Total Users Chart</Typography>
                <BarChart xAxis={usersChartData.xAxis} series={usersChartData.series} height={300} width={450} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Export Buttons */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportData}
            sx={{
              backgroundColor: '#0ea5e9',
              '&:hover': { backgroundColor: '#0284c7' },
              flex: 1,
              margin: '0 1rem',
            }}
          >
            Export Data
          </Button>
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleExportPDF}
            sx={{
              backgroundColor: '#0ea5e9',
              '&:hover': { backgroundColor: '#0284c7' },
              flex: 1,
              margin: '0 1rem',
            }}
          >
            Export PDF
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadReport}
            sx={{
              backgroundColor: '#0ea5e9',
              '&:hover': { backgroundColor: '#0284c7' },
              flex: 1,
              margin: '0 1rem',
            }}
          >
            Download Report
          </Button>
        </Grid>
      </Container>

      {/* Snackbar for Notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;
