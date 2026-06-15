import { useState } from "react";
import UserLayout, { UserScreen } from "./UserLayout";
import UserDashboard from "./UserDashboard";
import UserMonthlyCards from "./UserMonthlyCards";
import UserMyVehicles from "./UserMyVehicles";
import UserSupport from "./UserSupport";
import UserRegulations from "./UserRegulations";

interface UserAppProps {
  userName: string;
  onLogout: () => void;
}

function renderScreen(screen: UserScreen, userName: string) {
  switch (screen) {
    case "dashboard":
      return <UserDashboard userName={userName} />;

    case "monthly-cards":
      return <UserMonthlyCards />;

    case "my-vehicles":
      return <UserMyVehicles />;

    case "regulations":
      return <UserRegulations />;

    case "support":
      return <UserSupport />;

    default:
      return <UserDashboard userName={userName} />;
  }
}

export default function UserApp({ userName, onLogout }: UserAppProps) {
  const [screen, setScreen] = useState<UserScreen>("dashboard");
  return (
    <UserLayout currentScreen={screen} onNavigate={setScreen} onLogout={onLogout} userName={userName}>
      {renderScreen(screen, userName)}
    </UserLayout>
  );
}
