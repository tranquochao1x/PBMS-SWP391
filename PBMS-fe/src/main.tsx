
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import PaymentSuccess from "./app/components/payment/PaymentSuccess.tsx";
  import PaymentCancel from "./app/components/payment/PaymentCancel.tsx";
  import "./styles/index.css";

  const pathname = window.location.pathname;

  let RootComponent: React.FC;
  if (pathname === "/payment/success") {
    RootComponent = PaymentSuccess;
  } else if (pathname === "/payment/cancel") {
    RootComponent = PaymentCancel;
  } else {
    RootComponent = App;
  }

  createRoot(document.getElementById("root")!).render(<RootComponent />);
  