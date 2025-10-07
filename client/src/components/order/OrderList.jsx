// File name: OrderList
// File name with extension: OrderList.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\order\OrderList.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\order

// import { useLoaderData } from 'react-router-dom';
import day from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useGlobalContext } from "../../context";
import { formatPrice } from "../../utils";
day.extend(advancedFormat);

const OrdersList = ({ payments }) => {
  const { customer } = useGlobalContext();
  // const { meta, orders } = useLoaderData();
  return (
    <div className="mt-8">
      <h4 className="capitalize mb-4">total orders : {payments.length}</h4>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Product</th>
              <th>Cost</th>
              <th className="hidden sm:block">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => {
              const id = payment.payment_id;
              const { payment_date, total_amount, names, num } = payment;
              const { address, phone_number } = customer;
              const date = day(payment_date).format(" MMM Do, YYYY ");

              return (
                <tr key={id}>
                  <td>{names}</td>
                  <td>{address}</td>
                  <td>{num}</td>
                  {/* <td>{total_amount/100}</td> */}
                  <td>{formatPrice(total_amount)}</td>
                  <td className="hidden sm:block">{date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersList;
