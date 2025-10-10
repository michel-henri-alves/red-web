import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next'
// import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";



import Payment from './Payment';


export default function PaymentPage() {

  const { t } = useTranslation();
  // const location = useLocation();
  // const { total } = location.state || {};

  const [searchParams] = useSearchParams();
  const total = searchParams.get("total");

  console.log("323423423 {}", total);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">💰 {t('payment.title')}</h1>
      <Payment total={Number(total)} />
    </div>
  )

}
