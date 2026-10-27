
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { supabase } from "./supabase";

type RSVP = "confirmed" | "pending" | "declined";

type Guest = {
  id: string;
  household_name: string;
  contact_name: string | null;
  invited_count: number;
  rsvp_status: RSVP;
  attending_count: number;
  checked_in_count: number;
  created_at?: string;
};

export default function App() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState<"Overview" | "Guests" | "Check-in" | "Food & budget">("Overview");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [family, setFamily] = useState("Groom's family");
  const [count, setCount] = useState("2");

  const loadGuests = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: dbError } = await supabase
      .from("guests")
      .select("id, household_name, contact_name, invited_count, rsvp_status, attending_count, checked_in_count, created_at")
      .order("created_at", { ascending: false });

    if (dbError) {
      setError(`Could not load guests: ${dbError.message}`);
      setGuests([]);
    } else {
      setGuests((data ?? []) as Guest[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void loadGuests();
  }, [loadGuests]);

  const visibleGuests = useMemo(() => {
    const query = search.toLowerCase().trim();

    return guests.filter((guest) => {
      const nameMatches = `${guest.contact_name ?? ""} ${guest.household_name}`
        .toLowerCase()
        .includes(query);

      const arrived = guest.checked_in_count > 0;
      const filterMatches =
        filter === "all" ||
        guest.rsvp_status === filter ||
        (filter === "arrived" && arrived) ||
        (filter === "not-arrived" && !arrived);

      return nameMatches && filterMatches;
    });
  }, [guests, search, filter]);

  const confirmedPeople = guests.reduce(
    (sum, guest) => sum + (guest.rsvp_status === "confirmed" ? guest.attending_count : 0),
    0
  );

  const arrivedPeople = guests.reduce(
    (sum, guest) => sum + guest.checked_in_count,
    0
  );

  const pendingCount = guests.filter(
    (guest) => guest.rsvp_status === "pending"
  ).length;

  async function addGuest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const people = Number(count);

    if (!name.trim() || !Number.isInteger(people) || people < 1 || people > 1000) {
      setError("Enter a name and a valid number of guests.");
      return;
    }

    setSaving(true);
    setError("");

    const { error: insertError } = await supabase.from("guests").insert({
      household_name: `${family} — ${name.trim()}`,
      contact_name: name.trim(),
      invited_count: people,
      rsvp_status: "pending",
      attending_count: 0,
      checked_in_count: 0
    });

    if (insertError) {
      setError(`Could not save guest: ${insertError.message}`);
    } else {
      setName("");
      setCount("2");
      setShowForm(false);
      await loadGuests();
    }

    setSaving(false);
  }

  async function updateRsvp(guest: Guest, status: RSVP) {
    const attending = status === "confirmed" ? guest.invited_count : 0;

    const { error: updateError } = await supabase
      .from("guests")
      .update({
        rsvp_status: status,
        attending_count: attending,
        checked_in_count: status === "confirmed" ? guest.checked_in_count : 0
      })
      .eq("id", guest.id);

    if (updateError) {
      setError(`Could not update RSVP: ${updateError.message}`);
      return;
    }

    await loadGuests();
  }

  async function toggleCheckIn(guest: Guest) {
    if (guest.rsvp_status !== "confirmed") {
      setError("Confirm the RSVP before checking in this household.");
      return;
    }

    const nextCount =
      guest.checked_in_count > 0 ? 0 : guest.attending_count;

    const { error: updateError } = await supabase
      .from("guests")
      .update({ checked_in_count: nextCount })
      .eq("id", guest.id);

    if (updateError) {
      setError(`Could not update check-in: ${updateError.message}`);
      return;
    }

    await loadGuests();
  }

  const buttonStyle = (active = false) => ({
    background: active ? "#762d43" : "#ffffff",
    color: active ? "#ffffff" : "#34242a",
    border: "1px solid #eadfd9",
    borderRadius: 9,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 600 as const
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fbf8f5",
      color: "#34242a",
      fontFamily: "Arial, sans-serif"
    }}>
      <header style={{
        background: "#ffffff",
        padding: "20px 5%",
        borderBottom: "1px solid #eadfd9"
      }}>
        <div style={{
          fontFamily: "Georgia, serif",
          fontSize: 30,
          color: "#762d43",
          fontWeight: "bold"
        }}>
          VivahFlow<span style={{ color: "#d6b777" }}>.</span>
        </div>
        <div style={{ color: "#82747a", fontSize: 12, marginTop: 5 }}>
          WEDDING INTELLIGENCE · PRIYA &amp; ARJUN
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12
        }}>
          <div>
            <div style={{ color: "#762d43", fontSize: 11, letterSpacing: 2 }}>
              YOUR WEDDING, SIMPLIFIED
            </div>
            <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 500 }}>
              {page === "Overview" ? "Wedding overview" : page}
            </h1>
            <p style={{ color: "#82747a" }}>
              Manage guests, invitations, attendance and catering.
            </p>
          </div>

          <button style={buttonStyle(true)} onClick={() => {
            setPage("Guests");
            setShowForm(true);
          }}>
            + Add household
          </button>
        </div>

        <nav style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "20px 0" }}>
          {(["Overview", "Guests", "Check-in", "Food & budget"] as const).map((item) => (
            <button
              key={item}
              style={buttonStyle(page === item)}
              onClick={() => setPage(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        {error && (
          <div role="alert" style={{
            padding: 14,
            background: "#fff0f0",
            color: "#8b2430",
            borderRadius: 8,
            marginBottom: 16
          }}>
            {error}
            <button style={{ marginLeft: 12 }} onClick={() => setError("")}>Dismiss</button>
          </div>
        )}

        {page === "Overview" && (
          <section style={{
            padding: 30,
            borderRadius: 18,
            background: "linear-gradient(120deg, #572536, #925366)",
            color: "#ffffff",
            marginBottom: 20
          }}>
            <div style={{ color: "#e4c98d", letterSpacing: 2, fontSize: 11 }}>
              THE BIG DAY
            </div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 42, marginBottom: 8 }}>
              Priya <span style={{ color: "#e4c98d" }}>&amp;</span> Arjun
            </h2>
            <p>15 November 2026 · Bengaluru, Karnataka</p>
          </section>
        )}

        <section style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 24
        }}>
          {[
            ["Households", String(guests.length)],
            ["Confirmed people", String(confirmedPeople)],
            ["People checked in", String(arrivedPeople)],
            ["Pending RSVPs", String(pendingCount)]
          ].map(([label, value]) => (
            <div key={label} style={{
              padding: 20,
              background: "#ffffff",
              border: "1px solid #eadfd9",
              borderRadius: 12
            }}>
              <div style={{ color: "#82747a", fontSize: 13 }}>{label}</div>
              <div style={{ fontSize: 32, fontWeight: "bold", marginTop: 8 }}>{value}</div>
            </div>
          ))}
        </section>

        {(page === "Guests" || page === "Check-in") && (
          <section style={{
            background: "#ffffff",
            padding: 18,
            border: "1px solid #eadfd9",
            borderRadius: 12
          }}>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 16
            }}>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search guests..."
                style={{ flex: "1 1 220px", padding: 11, border: "1px solid #eadfd9", borderRadius: 8 }}
              />
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                style={{ padding: 10, border: "1px solid #eadfd9", borderRadius: 8 }}
              >
                <option value="all">All guests</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="declined">Declined</option>
                <option value="arrived">Arrived</option>
                <option value="not-arrived">Not arrived</option>
              </select>
              <button style={buttonStyle()} onClick={() => void loadGuests()}>Refresh</button>
            </div>

            {loading ? (
              <p>Loading guest records from Supabase...</p>
            ) : visibleGuests.length === 0 ? (
              <p style={{ color: "#82747a" }}>No guest records found. Add your first household.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 650 }}>
                  <thead>
                    <tr>
                      {["Contact", "Household / family", "Invited", "RSVP", "Check-in"].map((label) => (
                        <th key={label} style={{
                          textAlign: "left",
                          padding: 10,
                          color: "#82747a",
                          borderBottom: "1px solid #eadfd9"
                        }}>
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleGuests.map((guest) => (
                      <tr key={guest.id}>
                        <td style={{ padding: 10, borderBottom: "1px solid #f0e8e4" }}>
                          {guest.contact_name || "—"}
                        </td>
                        <td style={{ padding: 10, borderBottom: "1px solid #f0e8e4" }}>
                          {guest.household_name}
                        </td>
                        <td style={{ padding: 10, borderBottom: "1px solid #f0e8e4" }}>
                          {guest.invited_count}
                        </td>
                        <td style={{ padding: 10, borderBottom: "1px solid #f0e8e4" }}>
                          <select
                            value={guest.rsvp_status}
                            onChange={(event) => void updateRsvp(guest, event.target.value as RSVP)}
                            style={{ padding: 7, border: "1px solid #eadfd9", borderRadius: 7 }}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="declined">Declined</option>
                          </select>
                        </td>
                        <td style={{ padding: 10, borderBottom: "1px solid #f0e8e4" }}>
                          <button
                            disabled={guest.rsvp_status !== "confirmed"}
                            style={buttonStyle(guest.checked_in_count > 0)}
                            onClick={() => void toggleCheckIn(guest)}
                          >
                            {guest.checked_in_count > 0 ? "Undo check-in" : "Check in"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {page === "Food & budget" && (
          <section style={{ background: "#ffffff", border: "1px solid #eadfd9", borderRadius: 12, padding: 22 }}>
            <h2 style={{ fontFamily: "Georgia, serif" }}>Catering estimate</h2>
            <p style={{ color: "#82747a" }}>Illustrative planning figures; update them to match the actual wedding.</p>
            <p>Planned meals: <strong>400</strong></p>
            <p>Cost per meal: <strong>₹250</strong></p>
            <p>Planned catering budget: <strong>₹100,000</strong></p>
            <p>Confirmed people: <strong>{confirmedPeople}</strong></p>
            <p>Actual check-ins: <strong>{arrivedPeople}</strong></p>
          </section>
        )}
      </main>

      {showForm && (
        <div
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowForm(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "#24131dbb",
            display: "grid",
            placeItems: "center",
            padding: 16,
            zIndex: 10
          }}
        >
          <form
            onSubmit={(event) => void addGuest(event)}
            onMouseDown={(event) => event.stopPropagation()}
            style={{
              background: "#ffffff",
              borderRadius: 14,
              padding: 24,
              width: "min(100%, 440px)",
              boxSizing: "border-box"
            }}
          >
            <h2 style={{ fontFamily: "Georgia, serif" }}>Add a household</h2>

            <label style={{ display: "block", marginBottom: 14 }}>
              Contact name
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Rohan Sharma"
                style={{ display: "block", width: "100%", boxSizing: "border-box", padding: 11, marginTop: 6, border: "1px solid #eadfd9", borderRadius: 8 }}
              />
            </label>

            <label style={{ display: "block", marginBottom: 14 }}>
              Family group
              <select
                value={family}
                onChange={(event) => setFamily(event.target.value)}
                style={{ display: "block", width: "100%", padding: 11, marginTop: 6, border: "1px solid #eadfd9", borderRadius: 8 }}
              >
                <option>Groom's family</option>
                <option>Bride's family</option>
                <option>Friends</option>
                <option>Colleagues</option>
                <option>Other</option>
              </select>
            </label>

            <label style={{ display: "block", marginBottom: 18 }}>
              Number of people
              <input
                type="number"
                required
                min="1"
                max="1000"
                value={count}
                onChange={(event) => setCount(event.target.value)}
                style={{ display: "block", width: "100%", boxSizing: "border-box", padding: 11, marginTop: 6, border: "1px solid #eadfd9", borderRadius: 8 }}
              />
            </label>

            <div style={{ display: "flex", justifyContent: "end", gap: 10 }}>
              <button type="button" style={buttonStyle()} onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" disabled={saving} style={buttonStyle(true)}>
                {saving ? "Saving..." : "Save household"}
              </button>
            </div>
          </form>
        </div>
      )}

      <footer style={{ textAlign: "center", padding: 24, color: "#82747a", fontSize: 12 }}>
        VivahFlow · Wedding guest management · Use fictional data until access policies are secured.
      </footer>
    </div>
  );
}
