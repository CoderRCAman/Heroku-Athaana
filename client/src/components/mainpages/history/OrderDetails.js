import { useState, useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import UserAPI from "../../../api/UserAPI";
import OrderedProdModal from "../status/OrderedProdModal";
import "../status/status.css";
import Loading from "../utlis/loading/Loading";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export default function Status() {
  const state = useContext(GlobalState);

  const [token] = state.token;
  const userState = UserAPI(token);
  const [order] = userState.order;
  const [action, setAction] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [additional, setAdditional] = useState({});
  var reversedOrder = order.slice().reverse();
  const [address, setAddress] = useState({});
  const [loading, setLoading] = useState(false);

  // const [isUpdate, setIsUpdate] = useState({
  //   ok: false,
  //   id: "",
  // });

  function trigerView(
    prods,
    address,
    shipPrice,
    netPay,
    status,
    id,
    date,
    offer
  ) {
    setOpenModal(true);
    setAddress(address);
    setProducts(prods);
    const priceDetail = {
      shippingPrice: shipPrice,
      netPayable: netPay,
      status: status,
      date: date,
      id: id,
      offer: offer,
    };
    setAdditional(priceDetail);
  }
  function DisplayLocalDate(date) { 
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zonedDate = utcToZonedTime(date, timeZone);
    const dateFormattedPattern = "d-M-yyyy";
    return format(zonedDate, dateFormattedPattern, {
      timeZone: timeZone,
    });
  }

  return (
    <div className="status_container">
      <OrderedProdModal
        setOpenModal={setOpenModal}
        openModal={openModal}
        address={{ ...address }}
        products={[...products]}
        additional={{ ...additional }}
      />
      {action !== 0 && (
        <p style={{ textAlign: "center", padding: "5px", fontWeight: "500" }}>
          {" "}
          {action} Order Needs Action
        </p>
      )}
      <table>
        <thead>
          <tr>
            <th>Order Id</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reversedOrder.map((item) => (
            <tr
              key={item._id}
              className={
                item.status === "Placed"
                  ? "placed"
                  : item.status === "On the way"
                  ? "on_the_way"
                  : item.status === "Delivered"
                  ? "delivered"
                  : "cancelled"
              }
            >
              <td>{item.order_id}</td>
              <td>{item.status}</td>
              <td>{DisplayLocalDate(item.date)}</td>
              <td>
                <button
                  style={{
                    backgroundColor: "#1D4ED8",
                    padding: "5px",
                    color: "#fff",
                    borderRadius: "5px",
                  }}
                  onClick={() =>
                    trigerView(
                      item.products,
                      item.address,
                      item.shipping_price,
                      item.net_paybale,
                      item.status,
                      item.order_id,
                      item.date,
                      item.offer
                    )
                  }
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
