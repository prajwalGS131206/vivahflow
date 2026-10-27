import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
 Bell, CalendarDays, Check, ChevronDown, ChevronRight, CircleHelp,
Clock3, IndianRupee, LayoutDashboard, Menu, Plus, ClipboardList,
  Search, Settings, Sparkles, Utensils, Users, X, CheckCircle2,
  MapPin, Heart, ArrowUpRight, CalendarCheck, UserRoundCheck,
} from "lucide-react";

type RSVP = "Confirmed" | "Pending" | "Declined";
type Guest = {
  id: number;
  name: string;
  group: string;
  people: number;
  rsvp: RSVP;
  arrived: boolean;
};

const seedGuests: Guest[] = [
  { id: 1, name: "Rahul Sharma", group: "Groom's family", people: 4, rsvp: "Confirmed", arrived: true },
  { id: 2, name: "Priya Reddy", group: "Bride's family", people: 3, rsvp: "Confirmed", arrived: true },
  { id: 3, name: "Arjun Kumar", group: "Groom's family", people: 5, rsvp: "Pending", arrived: false },
  { id: 4, name: "Ananya Rao", group: "Bride's family", people: 2, rsvp: "Confirmed", arrived: false },
  { id: 5, name: "Vikram Shetty", group: "Groom's family", people: 6, rsvp: "Declined", arrived: false },
  { id: 6, name: "Meera Nair", group: "Bride's family", people: 4, rsvp: "Confirmed", arrived: true },
  { id: 7, name: "Karthik Iyer", group: "Groom's family", people: 3, rsvp: "Pending", arrived: false },
  { id: 8, name: "Divya Menon", group: "Bride's family", people: 2, rsvp: "Confirmed", arrived: false },
];

type Page = "Overview" | "Guests" | "Events" | "Check-in" | "Food & budget";

const navItems: { label: Page; icon: typeof LayoutDashboard }[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Guests", icon: Users },
  { label: "Events", icon: CalendarDays },
  { label: "Check-in", icon: UserRoundCheck },
  { label: "Food & budget", icon: Utensils },
];

function App() {
  const [page, setPage] = useState<Page>("Overview");
  const [guests, setGuests] = useState<Guest[]>(seedGuests);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [group, setGroup] = useState("Groom's family");
  const [people, setPeople] = useState("2");
  const [mobileNav, setMobileNav] = useState(false);

  const confirmed = guests.filter((guest) => guest.rsvp === "Confirmed");
  const confirmedPeople = confirmed.reduce((sum, guest) => sum + guest.people, 0);
  const arrivedPeople = guests.filter((guest) => guest.arrived).reduce((sum, guest) => sum + guest.people, 0);
  const pendingHouseholds = guests.filter((guest) => guest.rsvp === "Pending").length;

  const visibleGuests = useMemo(() => guests.filter((guest) => {
    const queryMatch = `${guest.name} ${guest.group}`.toLowerCase().includes(search.toLowerCase());
    const filterMatch = filter === "All"
      || guest.rsvp === filter
      || (filter === "Arrived" && guest.arrived)
      || (filter === "Not arrived" && !guest.arrived);
    return queryMatch && filterMatch;
  }), [guests, search, filter]);

  function addGuest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const count = Number(people);
    if (!name.trim() || !Number.isInteger(count) || count < 1 || count > 30) return;
    setGuests((current) => [...current, {
      id: Date.now(), name: name.trim(), group, people: count, rsvp: "Pending", arrived: false,
    }]);
    setName("");
    setPeople("2");
    setShowAdd(false);
  }

  function updateGuest(id: number, patch: Partial<Guest>) {
    setGuests((current) => current.map((guest) => guest.id === id ? { ...guest, ...patch } : guest));
  }

  function navigate(next: Page) {
    setPage(next);
    setMobileNav(false);
    setSearch("");
    setFilter("All");
  }

  const plannedGuests = 400;
  const mealCost = 250;
  const plannedBudget = plannedGuests * mealCost;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark">V</div>
          <div><div className="brand-name">vivahflow<span>.</span></div><div className="brand-subtitle">WEDDING INTELLIGENCE</div></div>
          <button className="mobile-close icon-button" aria-label="Close menu" onClick={() => setMobileNav(false)}><X size={18} /></button>
        </div>

        <div className="sidebar-label">WORKSPACE</div>
        <button className="workspace-switch">
          <span className="workspace-symbol">✦</span>
          <span className="workspace-copy"><strong>Priya & Arjun</strong><small>Wedding workspace</small></span>
          <ChevronDown size={15} />
        </button>

        <div className="sidebar-label menu-label">MENU</div>
        <nav className="nav-list" aria-label="Main navigation">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-link ${page === label ? "active" : ""}`} onClick={() => navigate(label)}>
              <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
              {label === "Guests" && <span className="nav-badge">{guests.length}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card"><Sparkles size={18} /><strong>Your wedding, organised.</strong><p>Every guest. Every moment. One place.</p></div>
          <div className="profile-row"><div className="profile-avatar">A</div><div className="profile-copy"><strong>Wedding Admin</strong><small>Demo workspace</small></div><Settings size={16} className="profile-settings" /></div>
        </div>
      </aside>

      {mobileNav && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu icon-button" aria-label="Open menu" onClick={() => setMobileNav(true)}><Menu size={20} /></button>
          <div className="breadcrumb">Workspace <ChevronRight size={13} /> <strong>{page}</strong></div>
          <div className="topbar-actions"><span className="demo-badge"><i /> DEMO DATA</span><button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /></button><div className="profile-avatar top-avatar">A</div></div>
        </header>

        <div className="page-content">
          {page === "Overview" && <>
            <section className="page-intro">
              <div><div className="eyebrow">TUESDAY, 27 OCTOBER 2026</div><h1>Good afternoon <span>✦</span></h1><p>Here's what's happening with Priya & Arjun's wedding.</p></div>
              <button className="primary-button" onClick={() => setShowAdd(true)}><Plus size={16} /> Add guests</button>
            </section>

            <section className="wedding-banner">
              <div className="banner-flower">✳</div>
              <div className="banner-copy"><span className="banner-kicker">THE BIG DAY</span><h2>Priya <em>&</em> Arjun</h2><p>Celebrating a beautiful beginning together.</p><div className="banner-meta"><span><CalendarDays size={14} /> 15 November 2026</span><span><MapPin size={14} /> Bengaluru, Karnataka</span></div></div>
              <div className="banner-date"><span>NOV</span><strong>15</strong><small>2026</small></div>
            </section>

            <section className="section-title-row"><div><h2>Guest overview</h2><p>Your wedding at a glance</p></div><button className="subtle-link" onClick={() => navigate("Guests")}>View guest list <ArrowUpRight size={14} /></button></section>

            <section className="stats-grid">
              <StatCard label="Total invited" value="400" note="Across both families" icon={<Users size={17} />} tone="plum" />
              <StatCard label="Confirmed guests" value={String(confirmedPeople)} note="People in confirmed households" icon={<CheckCircle2 size={17} />} tone="green" />
              <StatCard label="Arrived so far" value={String(arrivedPeople)} note={`${Math.max(0, confirmedPeople - arrivedPeople)} confirmed people not checked in`} icon={<UserRoundCheck size={17} />} tone="blue" />
              <StatCard label="RSVP pending" value={String(pendingHouseholds)} note="Households needing follow-up" icon={<Clock3 size={17} />} tone="amber" />
            </section>

            <section className="two-column-grid">
              <div className="panel attendance-panel">
                <div className="panel-heading"><div><h3>Guest attendance</h3><p>Progress based on current demo records</p></div><span className="live-badge"><i /> LIVE DEMO</span></div>
                <div className="attendance-numbers"><div><strong>{arrivedPeople}</strong><span>People arrived</span></div><div><strong>{confirmedPeople}</strong><span>Confirmed people</span></div><div><strong>{Math.max(0, plannedGuests - confirmedPeople)}</strong><span>Not confirmed</span></div></div>
                <div className="progress-track"><div style={{ width: `${Math.min(100, arrivedPeople / plannedGuests * 100)}%` }} /></div>
                <div className="progress-legend"><span>{Math.round(arrivedPeople / plannedGuests * 100)}% of invitee target arrived</span><span>{plannedGuests} invited</span></div>
                <div className="info-note"><CircleHelp size={15} /><span>Check-in changes update these demo figures immediately.</span></div>
              </div>

              <div className="panel catering-panel"><div className="panel-heading"><div><h3>Catering estimate</h3><p>Illustrative planning figures</p></div><span className="metric-icon amber"><Utensils size={18} /></span></div><div className="metric-label">ESTIMATED FOOD BUDGET</div><div className="budget-total">{formatRupees(plannedBudget)}</div><p className="metric-description">400 planned meals × ₹250 per meal</p><div className="thin-divider" /><div className="budget-row"><span>Confirmed meal estimate</span><strong>{formatRupees(confirmedPeople * mealCost)}</strong></div><div className="budget-row"><span>Potential difference</span><strong className="green-text">{formatRupees(Math.max(0, plannedBudget - confirmedPeople * mealCost))}</strong></div><p className="disclaimer">Not guaranteed savings. Caterer minimums and final attendance apply.</p></div>
            </section>

            <section className="panel table-panel"><div className="panel-heading table-panel-heading"><div><h3>Guest check-in</h3><p>Manage arrivals at a glance</p></div><button className="outline-button" onClick={() => navigate("Guests")}>All guests <ChevronRight size={14} /></button></div><GuestTable guests={visibleGuests.slice(0, 5)} onArrival={(guest) => updateGuest(guest.id, { arrived: !guest.arrived })} onRSVP={(guest, rsvp) => updateGuest(guest.id, { rsvp, arrived: rsvp === "Declined" ? false : guest.arrived })} /></section>
          </>}

          {page === "Guests" && <>
            <PageIntro eyebrow="WEDDING WORKSPACE" title="Guest management" description="Organise invitees and keep track of every RSVP." action={<button className="primary-button" onClick={() => setShowAdd(true)}><Plus size={16} /> Add guest</button>} />
            <section className="stats-grid compact-stats"><StatCard label="Households" value={String(guests.length)} note="Sample records" icon={<Users size={17} />} tone="plum" /><StatCard label="Confirmed people" value={String(confirmedPeople)} note="Across confirmed households" icon={<CheckCircle2 size={17} />} tone="green" /><StatCard label="Arrived people" value={String(arrivedPeople)} note="Marked as arrived" icon={<UserRoundCheck size={17} />} tone="blue" /><StatCard label="Pending RSVPs" value={String(pendingHouseholds)} note="Need a response" icon={<Clock3 size={17} />} tone="amber" /></section>
            <section className="panel table-panel"><div className="guest-toolbar"><div><h3>All guests</h3><p>Search, filter and update sample guest records</p></div><label className="search-box"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search guests..." /></label><select className="filter-select" value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter guests">{["All", "Confirmed", "Pending", "Declined", "Arrived", "Not arrived"].map((option) => <option key={option}>{option}</option>)}</select></div><GuestTable guests={visibleGuests} onArrival={(guest) => updateGuest(guest.id, { arrived: !guest.arrived })} onRSVP={(guest, rsvp) => updateGuest(guest.id, { rsvp, arrived: rsvp === "Declined" ? false : guest.arrived })} /><div className="table-foot">Showing {visibleGuests.length} of {guests.length} sample households. Demo changes reset on refresh.</div></section>
          </>}

          {page === "Check-in" && <>
            <PageIntro eyebrow="WEDDING DAY" title="Guest check-in" description="Mark arrivals manually. QR scanning is planned for a later phase." />
            <section className="stats-grid"><StatCard label="People arrived" value={String(arrivedPeople)} note="Across checked-in households" icon={<CheckCircle2 size={17} />} tone="green" /><StatCard label="Confirmed people" value={String(confirmedPeople)} note="Expected from RSVPs" icon={<Users size={17} />} tone="plum" /><StatCard label="Households remaining" value={String(guests.filter((guest) => !guest.arrived && guest.rsvp === "Confirmed").length)} note="Confirmed but not checked in" icon={<Clock3 size={17} />} tone="amber" /><StatCard label="Arrival progress" value={`${Math.round(arrivedPeople / Math.max(confirmedPeople, 1) * 100)}%`} note="Of confirmed people" icon={<UserRoundCheck size={17} />} tone="blue" /></section>
            <section className="panel table-panel"><div className="guest-toolbar"><div><h3>Check-in desk</h3><p>Use the button beside each household.</p></div><label className="search-box"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a guest..." /></label></div><GuestTable guests={visibleGuests} onArrival={(guest) => updateGuest(guest.id, { arrived: !guest.arrived })} onRSVP={(guest, rsvp) => updateGuest(guest.id, { rsvp, arrived: rsvp === "Declined" ? false : guest.arrived })} /></section>
          </>}

          {page === "Events" && <>
            <PageIntro eyebrow="CELEBRATION SCHEDULE" title="Wedding events" description="Plan attendance for each function separately." />
            <section className="events-grid"><EventCard day="14" month="NOV" title="Mehendi & Sangeet" time="14 Nov · 5:00 PM" place="Family celebration" /><EventCard day="15" month="NOV" title="Wedding ceremony" time="15 Nov · 9:00 AM" place="Wedding venue · Bengaluru" /><EventCard day="15" month="NOV" title="Wedding reception" time="15 Nov · 7:00 PM" place="Reception venue · Bengaluru" /></section>
            <div className="panel info-panel"><CircleHelp size={17} /><span>These are sample events. Per-event RSVP and meal tracking will be connected to a database in a later phase.</span></div>
          </>}

          {page === "Food & budget" && <>
            <PageIntro eyebrow="COST INTELLIGENCE" title="Food & budget" description="Understand your catering assumptions before committing." />
            <section className="stats-grid"><StatCard label="Planned meals" value="400" note="Illustrative plan" icon={<Utensils size={17} />} tone="plum" /><StatCard label="Cost per meal" value="₹250" note="Demo assumption" icon={<IndianRupee size={17} />} tone="blue" /><StatCard label="Planned budget" value={formatRupees(plannedBudget)} note="Meals × cost per meal" icon={<ClipboardList size={17} />} tone="green" /><StatCard label="Confirmed estimate" value={formatRupees(confirmedPeople * mealCost)} note="Based on sample RSVPs" icon={<CalendarCheck size={17} />} tone="amber" /></section>
            <section className="panel budget-explanation"><h3>How the estimate works</h3><p>We multiply the planned meal count by an assumed per-meal cost. The confirmed estimate uses people counted in households marked Confirmed.</p><div className="budget-row"><span>Planned attendance</span><strong>400 people</strong></div><div className="budget-row"><span>Confirmed people in sample records</span><strong>{confirmedPeople}</strong></div><div className="budget-row"><span>Estimated confirmed meal cost</span><strong>{formatRupees(confirmedPeople * mealCost)}</strong></div><p className="disclaimer">This is not a prediction of actual attendance or guaranteed savings. Caterer minimums, event-specific meals and the final headcount matter.</p></section>
          </>}

          <footer className="page-footer"><span>Made for meaningful celebrations <Heart size={12} fill="currentColor" /> VivahFlow</span><span>DEMO VERSION · CHANGES ARE NOT SAVED AFTER REFRESH</span></footer>
        </div>
      </main>

      {showAdd && <div className="modal-scrim" onMouseDown={() => setShowAdd(false)}><form className="guest-modal" onSubmit={addGuest} onMouseDown={(event) => event.stopPropagation()}><div className="modal-heading"><div><div className="eyebrow">GUEST DIRECTORY</div><h2>Add a household</h2></div><button type="button" className="icon-button" aria-label="Close" onClick={() => setShowAdd(false)}><X size={19} /></button></div><label>Contact or household name<input autoFocus required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Rohan Sharma" /></label><label>Family group<select value={group} onChange={(event) => setGroup(event.target.value)}><option>Groom's family</option><option>Bride's family</option><option>Friends</option><option>Colleagues</option><option>Other</option></select></label><label>Number of people<input type="number" min="1" max="30" required value={people} onChange={(event) => setPeople(event.target.value)} /></label><p className="modal-help">Demo only: new records are held in memory and reset on refresh.</p><div className="modal-actions"><button type="button" className="outline-button" onClick={() => setShowAdd(false)}>Cancel</button><button type="submit" className="primary-button"><Plus size={15} /> Add household</button></div></form></div>}
    </div>
  );
}

function formatRupees(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <section className="page-intro"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</section>;
}

function StatCard({ label, value, note, icon, tone }: { label: string; value: string; note: string; icon: ReactNode; tone: string }) {
  return <article className="stat-card"><div className="stat-card-top"><span>{label}</span><span className={`metric-icon ${tone}`}>{icon}</span></div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></article>;
}

function GuestTable({ guests, onArrival, onRSVP }: { guests: Guest[]; onArrival: (guest: Guest) => void; onRSVP: (guest: Guest, rsvp: RSVP) => void }) {
  if (guests.length === 0) return <div className="empty-state">No guests match your search.</div>;
  return <div className="table-scroll"><table className="guest-table"><thead><tr><th>GUEST / HOUSEHOLD</th><th>FAMILY GROUP</th><th>PEOPLE</th><th>RSVP STATUS</th><th>ARRIVAL</th><th>ACTION</th></tr></thead><tbody>{guests.map((guest) => <tr key={guest.id}><td><div className="guest-identity"><div className="guest-initials">{guest.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div><div><strong>{guest.name}</strong><small>Guest #{String(guest.id).slice(-4)}</small></div></div></td><td><span className="family-text">{guest.group}</span></td><td><strong>{guest.people}</strong></td><td><select aria-label={`RSVP status for ${guest.name}`} className={`rsvp-select ${guest.rsvp.toLowerCase()}`} value={guest.rsvp} onChange={(event) => onRSVP(guest, event.target.value as RSVP)}><option>Confirmed</option><option>Pending</option><option>Declined</option></select></td><td><span className={`arrival-text ${guest.arrived ? "arrived" : ""}`}><i />{guest.arrived ? "Arrived" : "Not arrived"}</span></td><td><button disabled={guest.rsvp === "Declined"} className={`check-in-button ${guest.arrived ? "is-checked" : ""}`} onClick={() => onArrival(guest)}>{guest.arrived ? <><Check size={13} /> Undo</> : <><UserRoundCheck size={13} /> Check in</>}</button></td></tr>)}</tbody></table></div>;
}

function EventCard({ day, month, title, time, place }: { day: string; month: string; title: string; time: string; place: string }) {
  return <article className="panel event-card"><div className="event-date"><span>{month}</span><strong>{day}</strong></div><div><h3>{title}</h3><p><Clock3 size={13} /> {time}</p><p><MapPin size={13} /> {place}</p><span className="upcoming-badge">Upcoming event</span></div></article>;
}

export default App;