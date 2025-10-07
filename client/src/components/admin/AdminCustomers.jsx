// File name: AdminCustomers
// File name with extension: AdminCustomers.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\admin\AdminCustomers.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\admin

import { useEffect, useState } from "react";
import { customFetch } from "../../utils";
import { toast } from "react-toastify";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [limit, setLimit] = useState({ lower: 0, upper: 10 });
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const resp = await customFetch.get("/customer");
      const data = resp?.data ?? [];
      // support either { customers: [...] } or raw array
      const list = Array.isArray(data.customers)
        ? data.customers
        : Array.isArray(data)
        ? data
        : [];
      setCustomers(list);
    } catch (err) {
      console.error("Fetch customers error:", err);
      toast.error("Unable to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary" />
      </div>
    );
  }

  const pageCount = Math.ceil(customers.length / 10);

  return (
    <div className="mt-8">
      <h4 className="capitalize mb-4">total customers : {customers.length}</h4>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th className="hidden sm:block">Pincode</th>
            </tr>
          </thead>
          <tbody>
            {customers.slice(limit.lower, limit.upper).map((cust) => {
              const id = cust.customer_id ?? cust.id ?? JSON.stringify(cust);
              const {
                name = "-",
                address = "-",
                phone_number = "-",
                email = "-",
                pincode = "-"
              } = cust;
              return (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{email}</td>
                  <td>{String(address).substring(0, 30)}</td>
                  <td>{phone_number}</td>
                  <td className="hidden sm:block">{pincode}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          className="btn-sm rounded outline disabled:opacity-50"
          disabled={limit.lower === 0}
          onClick={() => {
            setLimit((p) => ({
              lower: Math.max(0, p.lower - 10),
              upper: Math.max(10, p.upper - 10)
            }));
          }}
        >
          Back
        </button>

        <button
          className="btn-sm rounded outline disabled:opacity-50"
          disabled={limit.upper >= customers.length}
          onClick={() => {
            if (limit.upper >= customers.length) {
              toast.info("No more customers");
              return;
            }
            setLimit((p) => ({ lower: p.lower + 10, upper: p.upper + 10 }));
          }}
        >
          Next
        </button>

        <div className="ml-auto text-sm text-gray-500">
          Page {Math.floor(limit.lower / 10) + 1} of {pageCount || 1}
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
