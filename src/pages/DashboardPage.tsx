import { useEffect, useState } from "react";
import UserRegisterCard from "../components/UserRegisterCard";
import type { Registrant } from "../libs/Registrant";

const STORAGE_KEY = "registrants";

export default function DashboardPage() {
  const [registrants, setRegistrants] = useState<Registrant[]>([]);

  useEffect(() => {
    const storedRegistrants = localStorage.getItem(STORAGE_KEY);

    if (storedRegistrants) {
      setRegistrants(JSON.parse(storedRegistrants));
    }
  }, []);

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>

      {registrants.length === 0 ? (
        <div className="alert alert-info mt-3">
          No registrants yet.
        </div>
      ) : (
        <div className="row mt-3">
          {registrants.map((registrant) => (
            <div
              key={registrant.id}
              className="mb-4 w-100 row-md-6"
            >
              <UserRegisterCard registrant={registrant} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}