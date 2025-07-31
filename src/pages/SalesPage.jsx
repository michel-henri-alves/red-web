import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next'

import BarcodeReader from '../components/BarcodeReader';


export default function SalesPage() {

  const { t } = useTranslation();

  const handleScan = (code) => {
    console.log('Código recebido no app:', code);
    // Ex: buscar produto, validar, etc.
  };


  return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">💵💳 {t('sales.title')}</h1>
        <BarcodeReader onScan={handleScan} />
      </div>
    )
  
}
