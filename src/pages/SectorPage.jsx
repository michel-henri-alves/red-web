import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'

import SectorList from '../components/SectorList';

export default function SectorPage() {

  const { t } = useTranslation();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🌍 {t('sector.title')}</h1>
      <SectorList />
    </div>
  )
}
