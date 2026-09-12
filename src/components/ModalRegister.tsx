import { useState } from "react";
import type { Registrant } from "../libs/Registrant";

type RegisterForm = {
  fname: string;
  lname: string;
  plan: string;
  gender: string;
  extraItems: string[];
  agree: boolean;
};

// ---- แผนการวิ่ง ----
const plans = [
  { id: "funrun", label: "Fun run 5.5 Km", price: 500 },
  { id: "mini", label: "Mini Marathon 10 Km", price: 800 },
  { id: "half", label: "Half Marathon 21 Km", price: 1200 },
  { id: "full", label: "Full Marathon 42.195 Km", price: 1500 },
];

// ---- สินค้าเสริม ----
const extraItems = [
  { id: "bottle", label: "Bottle 🍼", price: 200 },
  { id: "shoes", label: "Shoes 👟", price: 600 },
  { id: "cap", label: "Cap 🧢", price: 400 },
];

export default function ModalRegister() {
  const [form, setForm] = useState<RegisterForm>({
    fname: "",
    lname: "",
    plan: "",
    gender: "",
    extraItems: [],
    agree: false,
  });

  const [errors, setErrors] = useState({
    fname: false,
    lname: false,
    plan: false,
    gender: false,
    extraItems: false,
    agree: false,
  });

  const updateForm = (
    key: keyof RegisterForm,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: false,
    }));
  };

  const handleExtraItemChange = (id: string) => {
    setForm((prev) => {
      const alreadySelected = prev.extraItems.includes(id);

      const newExtraItems = alreadySelected
        ? prev.extraItems.filter((item) => item !== id)
        : [...prev.extraItems, id];

      return {
        ...prev,
        extraItems: newExtraItems,
      };
    });

    setErrors((prev) => ({
      ...prev,
      extraItems: false,
    }));
  };

  const computeTotalPayment = () => {
    let total = 0;

    const selectedPlan = plans.find((p) => p.id === form.plan);

    if (selectedPlan) {
      total += selectedPlan.price;
    }

    // Extra item price
    const selectedExtras = extraItems.filter((item) =>
      form.extraItems.includes(item.id)
    );

    const extraTotal = selectedExtras.reduce(
      (sum, item) => sum + item.price,
      0
    );

    total += extraTotal;

    // 20% discount when ALL extra items are selected
    if (form.extraItems.length === extraItems.length) {
      total *= 0.8;
    }

    return total;
  };

  const registerBtnOnClick = () => {
    const newErrors = {
      fname: form.fname.trim() === "",
      lname: form.lname.trim() === "",
      plan: form.plan === "",
      gender: form.gender === "",
      extraItems: form.extraItems.length > extraItems.length,
      agree: !form.agree,
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(
      (isError) => isError
    );

    if (hasError) {
      return;
    }

    const total = computeTotalPayment();

    const newRegistrant: Registrant = {
      id: Date.now(),
      fullName: `${form.fname} ${form.lname}`,
      gender: form.gender,
      plan: plans.find((p) => p.id === form.plan)?.label ?? "",
      extraItems: extraItems .filter((item) => form.extraItems.includes(item.id)) .map((item) => item.label),
      total: total,
    };
    const storedRegistrants = localStorage.getItem("registrants");
    const registrants: Registrant[] = storedRegistrants
      ? JSON.parse(storedRegistrants)
      : [];
    registrants.push(newRegistrant);
    localStorage.setItem("registrants", JSON.stringify(registrants));

    alert(
      `Registration complete.\nPlease pay money for ${total.toLocaleString()} THB.`
    );
  };

  const totalPayment = computeTotalPayment();

  return (
    <div
      className="modal fade"
      id="modalregister"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="modalregisterLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">
              Register CMU Marathon 🏃‍♂️
            </h5>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body">

            {/* First name / Last name */}
            <div className="d-flex gap-2">

              <div className="flex-fill">
                <label className="form-label">
                  First name
                </label>

                <input
                  className={`form-control ${
                    errors.fname ? "is-invalid" : ""
                  }`}
                  value={form.fname}
                  onChange={(e) =>
                    updateForm("fname", e.target.value)
                  }
                />

                {errors.fname && (
                  <div className="invalid-feedback">
                    Please enter your first name
                  </div>
                )}
              </div>

              <div className="flex-fill">
                <label className="form-label">
                  Last name
                </label>

                <input
                  className={`form-control ${
                    errors.lname ? "is-invalid" : ""
                  }`}
                  value={form.lname}
                  onChange={(e) =>
                    updateForm("lname", e.target.value)
                  }
                />

                {errors.lname && (
                  <div className="invalid-feedback">
                    Please enter your last name
                  </div>
                )}
              </div>

            </div>

            {/* Plan */}
            <div className="mt-2">
              <label className="form-label">
                Plan
              </label>

              <select
                className={`form-select ${
                  errors.plan ? "is-invalid" : ""
                }`}
                value={form.plan}
                onChange={(e) =>
                  updateForm("plan", e.target.value)
                }
              >
                <option value="">
                  Please select..
                </option>

                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label} ({p.price.toLocaleString()} THB)
                  </option>
                ))}
              </select>

              {errors.plan && (
                <div className="invalid-feedback">
                  Please select a running plan
                </div>
              )}
            </div>

            {/* Gender */}
            <div className="mt-2">
              <label className="form-label">
                Gender
              </label>

              <div>
                <input
                  className="me-2 form-check-input"
                  type="radio"
                  name="gender"
                  checked={form.gender === "male"}
                  onChange={() =>
                    updateForm("gender", "male")
                  }
                />

                Male 👨

                <input
                  className="mx-2 form-check-input"
                  type="radio"
                  name="gender"
                  checked={form.gender === "female"}
                  onChange={() =>
                    updateForm("gender", "female")
                  }
                />

                Female 👩

                {errors.gender && (
                  <div className="text-danger mt-1">
                    Please select gender
                  </div>
                )}
              </div>
            </div>

            {/* Extra Items */}
            <div className="mt-2">
              <label className="form-label">
                Extra Item(s)
              </label>

              {extraItems.map((item) => (
                <div key={item.id}>
                  <input
                    className="me-2 form-check-input"
                    type="checkbox"
                    checked={form.extraItems.includes(item.id)}
                    onChange={() =>
                      handleExtraItemChange(item.id)
                    }
                  />

                  <label className="form-check-label">
                    {item.label} (
                    {item.price.toLocaleString()} THB)
                  </label>
                </div>
              ))}

              {errors.extraItems && (
                <div className="text-danger mt-1">
                  Please select at least one extra item
                </div>
              )}

              {/* Discount */}
              {form.extraItems.length === extraItems.length && (
                <span className="text-success d-block mt-1">
                  ✓ 20% Discounted
                </span>
              )}
            </div>

            {/* Promotion */}
            <div
              className="alert alert-primary mt-3"
              role="alert"
            >
              Promotion 📢 Buy all items to get 20% Discount
            </div>

            {/* Total */}
            <div className="fw-bold fs-5">
              Total Payment:{" "}
              {totalPayment.toLocaleString()} THB
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">

            <div>
              <input
                className={`me-2 form-check-input ${
                  errors.agree ? "is-invalid" : ""
                }`}
                type="checkbox"
                checked={form.agree}
                onChange={(e) =>
                  updateForm("agree", e.target.checked)
                }
              />

              I agree to the terms and conditions

              {errors.agree && (
                <div className="text-danger">
                  You must agree to the terms and conditions
                </div>
              )}
            </div>

            <button
              type="button"
              className="btn btn-success my-2"
              onClick={registerBtnOnClick}
            >
              Register
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}