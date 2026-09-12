import type { Registrant } from "../libs/Registrant";

export default function UserRegisterCard({
  registrant,
}: {
  registrant: Registrant;
}) {
  const gender =
    registrant.gender === "male"
      ? "👨 Male"
      : registrant.gender === "female"
        ? "👩 Female"
        : registrant.gender;

  return (
    <div className="card p-3 mb-3 w-100">
      <div className="card-body">
        <h5 className="card-title">{registrant.fullName}</h5>

        <p className="card-text mb-1">
          <strong>ID:</strong> {registrant.id}
        </p>

        <p className="card-text mb-1">
          <strong>Gender:</strong> {gender}
        </p>

        <p className="card-text mb-1">
          <strong>Plan:</strong> {registrant.plan}
        </p>

        <p className="card-text mb-0">
          <strong>Total:</strong> {registrant.total.toLocaleString()} THB
        </p>

        {registrant.extraItems && registrant.extraItems.length > 0 ? (
          <div className="row g-2 mb-2">
            {registrant.extraItems.map((item) => (
              <div className="col-md-4 col-sm-6" key={item}>
                <div className="card h-100">
                  <div className="card-body text-center p-2">
                    <p className="card-text mb-0"> {item} </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted mb-2"> No extra items </p>
        )}
        
      </div>
    </div>
  );
}
