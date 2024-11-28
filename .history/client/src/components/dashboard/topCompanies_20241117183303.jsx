import React from 'react';
import Fptlogo from '../icons/Fpt.png';
import Cmclogo from '../icons/Fpt.png';
import Fpt from '../icons/Fpt.png';
import Fpt from '../icons/Fpt.png';

const TopCompanies = () => {
    const companies = [
        { logo: Fptlogo, name: 'FPT Software', field: 'Phát triển Phần mềm', growth: '+100%' },
        { logo: '/logos/cmc.png', name: 'CMC Corporation', field: 'Tích hợp hệ thống', growth: '+95%' },
        { logo: '/logos/nashtech.png', name: 'NashTech', field: 'Phát triển phần mềm', growth: '+89%' },
        { logo: '/logos/viettel.png', name: 'Viettel', field: 'Viễn thông', growth: '+79%' },
    ];

    const styles = {
        container: {
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            width: '100%',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
        },
        title: {
            fontSize: '18px',
            fontWeight: 'bold',
        },
        sortButton: {
            backgroundColor: '#F5F0FF',
            color: '#48038C',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
        },
        tableHeader: {
            textAlign: 'left',
            color: '#888',
            borderBottom: '1px solid #f0f0f0',
            padding: '10px 0',
        },
        row: {
            display: 'flex',
            alignItems: 'center',
            padding: '15px 0',
            borderBottom: '1px solid #f0f0f0',
        },
        logo: {
            width: '40px',
            height: '40px',
            marginRight: '10px',
            borderRadius: '50%',
        },
        name: {
            fontWeight: 'bold',
            color: '#333',
        },
        field: {
            color: '#555',
        },
        growth: {
            color: '#16C098',
            fontWeight: 'bold',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>Top Công Ty Mua Bài</h3>
                <button style={styles.sortButton}>
                    Sắp xếp <span style={{ marginLeft: '5px' }}>⚙️</span>
                </button>
            </div>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader}>Tên công ty</th>
                        <th style={styles.tableHeader}>Lĩnh vực</th>
                        <th style={styles.tableHeader}>Mức tăng</th>
                    </tr>
                </thead>
                <tbody>
                    {companies.map((company, index) => (
                        <tr key={index} style={styles.row}>
                            <td style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={company.logo} alt={`${company.name} logo`} style={styles.logo} />
                                <span style={styles.name}>{company.name}</span>
                            </td>
                            <td>
                                <span style={styles.field}>{company.field}</span>
                            </td>
                            <td>
                                <span style={styles.growth}>{company.growth}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TopCompanies;
