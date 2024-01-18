import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f0f0f0', position: 'fixed', bottom: 0, width: '100%' }}>
      &copy; {currentYear} Developed by Protyasha Roy
    </footer>
  );
};

export default Footer;
