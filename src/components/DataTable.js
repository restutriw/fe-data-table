import React, { useState, useEffect } from 'react';
import { Container, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    // Fetch initial data from backend
    axios.get('http://localhost:8080/api/karyawan')
      .then(response => {
        setData(response.data);
        setOriginalData(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSave = () => {
    const updatedData = data.filter((row, index) => {
      return JSON.stringify(row) !== JSON.stringify(originalData[index]);
    });

    axios.post('http://localhost:8080/api/karyawan/bulk-crud', updatedData)
      .then(response => {
        console.log('Data saved successfully:', response.data);
        setOriginalData(data);
      })
      .catch(error => console.error('Error saving data:', error));
  };

  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  return (
    <Container>
      <Button onClick={handleSave} variant="contained" color="primary" style={{ marginBottom: '20px' }}>
        Simpan
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status Pekerjaan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>
                  <TextField
                    value={row.nama}
                    onChange={(e) => handleChange(index, 'nama', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.role}
                    onChange={(e) => handleChange(index, 'role', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.status_pekerjaan}
                    onChange={(e) => handleChange(index, 'status_pekerjaan', e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DataTable;
