import React, { useState, SyntheticEvent } from 'react'
import Swal from 'sweetalert2';
import Spinner from '../Spinner';
import { HandleResult } from '../HandleResult';
import { Order } from '../../types';
import { useUpdateOrderStatusMutation } from '../../store/apiquery/OrderApiSlice';
import { useDeleteOrderMutation } from '../../store/apiquery/OrderApiSlice';
import { useGetAllOrderQuery } from '../../store/apiquery/OrderApiSlice';
import { ToastContainer, toast } from "react-toastify";


const UpdateOrders = ({Orders}: {Orders : Order}) => {

	const [updateData, setUpdateData] = useState(Orders);
	const [updateOrders, udpateResult] = useUpdateOrderStatusMutation();

  const orderID = Orders._id;
  console.log("After:", orderID);

  const [formData, setFormData] = useState({
    deliveryStatus: updateData.deliveryStatus,
  });

  const handleUpdateValue = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const status = formData.deliveryStatus.toString();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await updateOrders({orderID,status});

      if ('data' in result && result.data) {
        console.log('Order States Updated successfully');
        toast.success("Order States Updated successfully");
        setFormData({ deliveryStatus:''});
      } else if ('error' in result && result.error) {
        console.error('Order States Update failed', result.error);
        toast.error("Order States Update failed");
      }
    } catch (error) {
      console.error('Order States Update failed`', error);
      toast.error("Order States Update failed");
    }
  };
  

	return (
		<form action="" method="patch" className="checkout-service p-3" onSubmit={handleSubmit}>
			<input type="hidden" name="id" value={updateData._id} />
      <div>
          <label className='w-100'>
            <span>Order Status</span>
            <input type="text" name="deliveryStatus" value={formData.deliveryStatus} className="form-control w-100 rounded-0 p-2" placeholder='Orders Status' onChange={handleUpdateValue}/>
          </label>
        </div>
        <div className="mt-4">
          <ToastContainer/>
        </div>
			<div className='mt-3'>{udpateResult.isLoading ?
				<button className="fd-btn w-25 text-center border-0"><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
					Loading...</button> :
				<button className="fd-btn w-25 text-center border-0" type='submit'>UPDATE Orders status</button>
			}</div>
		</form>
	)


}

const ListOfOrders = ({ setOrders, setPage }: { setOrders: Function, setPage: Function }) => {

  const parseOrders = (Orders: Order) => {
    setOrders(Orders);
    setPage('add');
  }
  const { isLoading, data: OrdersList, isSuccess, isError } = useGetAllOrderQuery('api/orders');
  const [deleteOrders, deletedResult] = useDeleteOrderMutation();


  const deleteItem = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure to delete this Order ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((r) => {
      if (r.isConfirmed) {
        deleteOrders(id);
      }
    });
  }

  // search bar coding 
  const [searchInput, setSearchInput] = useState<string>('');

  let content: React.ReactNode;
  let count = 0;

  // Filter products based on the search input
  const filteredOrders = OrdersList?.content.filter((order: Order) =>
    order.deliveryStatus.toLowerCase().includes(searchInput.toLowerCase())
  );

  content = isLoading || isError
    ? null
    : isSuccess
      ? filteredOrders.map((Orders: Order) => {

        return (
          <tr className="p-3" key={Orders._id}>
            <td scope="row w-25">{++count}</td>
            <td className='fw-bold'>
                        <ul>
                            {Object.entries(Orders?.items).map(([productId, item]) => (
                            <li key={productId}>
                                Price: {item.price}, Qty: {item.qty}
                            </li>
                            ))}
                        </ul>
            </td>
            <td>{Orders.totalPrice}</td>
            <td>
                  <span style={{ color: Orders.deliveryStatus === 'COMPLETED' ? 'green' : 'red' }}>
                                {Orders?.deliveryStatus}
                  </span>
            </td>
            <td className='fw-bold d-flex gap-2 justify-content-center'>
              <a href="#" className='p-2 rounded-2 bg-secondary' onClick={(e) => parseOrders(Orders)} title='Edit'><i className="bi bi-pen"></i></a>
              <a href="#" className='p-2 rounded-2 bg-danger' title='Delete' onClick={(e) => deleteItem(Orders._id)}><i className="bi bi-trash"></i></a>
            </td>
          </tr>
        )
      })
      : null;

  return !isLoading ? (
      <div>
     {/* Add a search input field */}
     <div className="mb-3">
      <input
        type="text"
        placeholder="Search Orders"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
    </div>

    <div className="table-responsive">
      <table className="table table-default text-center table-bordered">
        <thead>
          <tr className='fd-bg-primary text-white'>
            <th scope="col" className='p-3'>N°</th>
            <th scope="col" className='p-3'>ITEMS</th>
            <th scope="col" className='p-3'>TOTAL</th>
            <th scope="col" className='p-3'>DELIVERY STATUS</th>
            <th scope="col">MANAGE</th>
          </tr>
        </thead>
        <tbody>
          {
            content
          }
        </tbody>
      </table>
      </div>
    </div>) : (<Spinner />
  );
}

const OrdersMain = () => {
  const [page, setPage] = useState('list');
  const [currentOrder, setCurrentOrder] = useState(null);

  const changeToList = () => { setPage('add'); setCurrentOrder(null) }
  const changeToAdd = () => { setPage('list'); }

  return (
    <div className='text-black'>
      <h4 className="fw-bold">Orders</h4>
      <div className="add-product my-3 d-flex justify-content-end">
				{
					// page === 'list' ?
					// 	<a href="#" className="fd-btn bg-secondary w-25 text-center rounded-3" onClick={changeToList}>ORDER REPORS</a> :
						<a href="#" className="fd-btn bg-secondary w-25 text-center rounded-3" onClick={changeToAdd}>ORDER LIST</a>
				}
			</div>
			<div className="subPartMain">
      {page === 'list' ? (
  <ListOfOrders setOrders={setCurrentOrder} setPage={setPage} />
    ) : currentOrder ? ( // Check if currentOrder is not null
      <UpdateOrders Orders={currentOrder} />
    ) : null}
			</div>
    </div>
  )
}

export default OrdersMain