import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import FloatingActionButton from "./FloatingActionButton";

import cashier from "../assets/images/cashier.png";


export default function FloatingCashierButton() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  const hideButtonOnPaths = ["/pos"];
  const shouldHideButton = hideButtonOnPaths.includes(location.pathname);

  return (

    <div>
      {!shouldHideButton && (
        <FloatingActionButton
          onClick={() => navigate(`/pos`)}
          tooltip={t("pos.title")}
          content={<img src={cashier} alt="Cashier" />}
          position="bottom-20" />
      )}
    </div>
  );
}