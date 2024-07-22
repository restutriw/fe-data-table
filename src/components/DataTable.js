import React, { useState, useEffect } from 'react';
import { Container, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const KaryawanTable = () => {
  const [data, setData] = useState([]);
  const [deletedIds, setDeletedIds] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/karyawan')
      .then(response => {
        setData(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSave = async () => {
    // Data yang baru ditambahin yang tanpa ID
    const creates = data
      .filter(row => !row.id)
      .map(row => ({
        nama: row.nama,
        role: row.role,
        status_pekerjaan: row.status_pekerjaan
      }));
    
    // Update data
    const updates = data
      .filter(row => row.id) 
      .map(row => ({
        id: row.id,
        karyawan: {
          nama: row.nama,
          role: row.role,
          status_pekerjaan: row.status_pekerjaan
        }
      }));
  
    // Hapus data
    const deletes = deletedIds;
  
    const bulkCRUDRequest = {
      creates,
      updates,
      deletes
    };
  
    console.log('Bulk CRUD Request:', bulkCRUDRequest);
  
    try {
      const response = await axios.post('http://localhost:8080/api/karyawan/bulk-crud', bulkCRUDRequest);
      console.log('Data saved successfully:', response.data);
      setDeletedIds([]);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  

  const handleDelete = (id) => {
    setData(data.filter(row => row.id !== id));
    setDeletedIds([...deletedIds, id]);
  };

  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  const handleAddRow = () => {
    setData([...data, { nama: '', role: '', status_pekerjaan: '' }]);
  };

  return (
    <Container>
      <Button onClick={handleSave} variant="contained" color="primary" style={{ marginBottom: '20px', marginRight: '10px' }}>
        Simpan
      </Button>
      <Button onClick={handleAddRow} variant="contained" color="secondary" style={{ marginBottom: '20px' }}>
        Tambah Data
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status Pekerjaan</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={row.id || index}>
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
                <TableCell>
                  <Button onClick={() => handleDelete(row.id)} color="secondary">Hapus</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default KaryawanTable;
