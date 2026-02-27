import { Button } from "@rajkumarganesan93/uicontrols";
import { timeAgo } from "@rajkumarganesan93/uifunctions";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Total Contacts", value: "1,247", change: "+12%" },
  { label: "Active Shipments", value: "83", change: "+5%" },
  { label: "Pending Invoices", value: "29", change: "-3%" },
  { label: "Revenue (MTD)", value: "$284,500", change: "+18%" },
];

const recentActivity = [
  { text: "New contact added: John Doe", time: new Date(Date.now() - 5 * 60000) },
  { text: "Shipment #1042 delivered", time: new Date(Date.now() - 2 * 3600000) },
  { text: "Invoice INV-2026-089 paid", time: new Date(Date.now() - 5 * 3600000) },
  { text: "Shipment #1043 created", time: new Date(Date.now() - 86400000) },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-bg-paper rounded-lg p-5 border border-grey-300">
            <p className="text-sm text-text-secondary mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
            <p className={`text-sm mt-1 ${stat.change.startsWith("+") ? "text-success" : "text-error"}`}>
              {stat.change} from last month
            </p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-paper rounded-lg p-5 border border-grey-300">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            {recentActivity.map((item, i) => (
              <li key={i} className="flex justify-between items-center border-b border-grey-200 pb-2 last:border-0">
                <span className="text-sm text-text-primary">{item.text}</span>
                <span className="text-xs text-text-secondary">{timeAgo(item.time)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-bg-paper rounded-lg p-5 border border-grey-300">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button label="New Contact" variant="contained" color="primary" onClick={() => navigate("/contacts/new")} />
            <Button label="New Shipment" variant="contained" color="info" onClick={() => navigate("/freight/new")} />
            <Button label="New Invoice" variant="contained" color="success" onClick={() => navigate("/books/new")} />
            <Button label="View Reports" variant="outlined" color="secondary" />
          </div>
        </div>
      </div>
    </div>
  );
}
