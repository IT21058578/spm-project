import { useState, useEffect, SyntheticEvent } from 'react'
import Header from './includes/Header'
import Footer from './includes/Footer'
import { Link, useNavigate } from 'react-router-dom'
import RoutePaths from '../config'
import { toggleLinkClass,removeItem } from '../Utils/Generals'
import { useUpdateUserMutation } from '../store/apiquery/usersApiSlice'
import Spinner from '../components/Spinner'
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks'
import LoadingButton from '../components/LoadingButton'
import { HandleResult } from '../components/HandleResult'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { useGetAllOrderQuery } from '../store/apiquery/OrderApiSlice'
import { Order } from '../types'
import { useDeleteOrderMutation } from '../store/apiquery/OrderApiSlice'
import { logoutCurrentUser } from '../store/userSlice'
import { UserType } from '../types'
import { getItem } from '../Utils/Generals'

const isLogged = getItem(RoutePaths.token);
const user = !isLogged ? null : JSON.parse(getItem("user") || "");

export const UserDashboard = () => {
    return (
        <div className="user-dashboard p-3 border border-2 text-black">
            <h3>Dashboard</h3>
            <p className="opacity-75">From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details</p>
        </div>
    )
}

export const UserOrders = () => {

    // let content: React.ReactHTMLElement<HTMLElement> = <></>;
    const { data:orders, isLoading, isError ,isSuccess } = useGetAllOrderQuery("api/orders");
    const [data, setData] = useState(user);

    // Filter reviews for the specific product
    const filteredOrders = orders?.content.filter((order: Order) => {order.createdBy === data._id
        console.log(order._id);
    }) || [];


      
    console.log('Filtered Orders:', filteredOrders);

    const [deleteOrder, deletedResult] = useDeleteOrderMutation();

    const deleteItem = (id: string) => {
		Swal.fire({
			title: 'Are you sure?',
			text: "Are you sure to delete this order ?",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((r) => {
			if (r.isConfirmed) {
				deleteOrder(id);
			}
		});
	}


    // useEffect(() => {

    //     commands ? commands.data.map((command: any) => {
    //         content = command
    //     }) : null;

    // }, [commands])

    let content: React.ReactNode;

	content = isLoading || isError
		? null
		: isSuccess
			// ? ordersList['data'].map((order: orderType) => {
			? orders?.content.map((order: Order) => {

				return (
					<tr className="p-3" key={order._id}>
						<td className='fw-bold'>{order?._id}</td>
						<td>
                        <ul>
                            {Object.entries(order?.items).map(([productId, item]) => (
                            <li key={productId}>
                                Price: {item.price}, Qty: {item.qty}
                            </li>
                            ))}
                        </ul>
                        </td>
						<td>Rs {order?.totalPrice.toFixed(2)}</td>
                        <td>
                            <span style={{ color: order.deliveryStatus === 'COMPLETED' ? 'green' : 'red' }}>
                                {order?.deliveryStatus}
                            </span>
                        </td>
                        <td className='fw-bold d-flex gap-2 justify-content-center'>
                        {order?.deliveryStatus === 'PENDING' && (
                            <a
                            href="#"
                            className='p-2 rounded-2 bg-danger'
                            title='Delete'
                            onClick={(e) => {
                                e.preventDefault();
                                deleteItem(order?._id);
                            }}
                            >
                            <i className="bi bi-trash"></i>
                            </a>
                        )}
                        </td>
					</tr>
				)
			})
			: null;

    return (
        <div className="user-orders p-3 border border-2 text-black">
            <h3>Orders</h3>
            <div className="table-responsive">
                {
                    !isLoading ?
                        <table className="table table-default table-bordered text-center">
                            <thead>
                                <tr>
                                    <th scope="col">Order ID</th>
                                    <th scope="col">Items</th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Delivery Status</th>
                                    <th scope="col">Manage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    isLoading ? <Spinner /> :
                                    content
                                }
                            </tbody>
                        </table> :

                        <Spinner />
                }
            </div>

        </div>
    )
}

export const UserAddress = () => {
    const [data, setData] = useState(user);

    return (
        <div className="user-address p-3 border border-2 text-black">
            <h3>Billing Address</h3>
            <div className="opacity-75">
                <h6>{data.region} , {data.country}</h6>
                <h6><span className="fw-bold">Email:</span> {data.email} </h6>
            </div>
        </div>
    )
}

export const UserDetails = () => {

    const [data, setData] = useState(user);
    const [updateUser, result] = useUpdateUserMutation();

    const handleChange = (e: SyntheticEvent) => {

        const target = e.target as HTMLInputElement
        setData({ ...data, [target.name]: target.value });
    }

    const handleSubmit = (e: SyntheticEvent) => {

        e.preventDefault();
        updateUser(data);
    }


    return (

    <div className="container">
         <div className="card border-0 shadow-lg">
            <h3 className="card-header bg-primary text-white">Account Details</h3>
            <div className="card-body">
            <div className="row">
                <div className="col-6">
                <div className="mb-3">
                    <label className="form-label text-primary">First Name</label>
                    <div className="form-control-plaintext">{data.firstName}</div>
                </div>
                </div>
                <div className="col-6">
                <div className="mb-3">
                    <label className="form-label text-primary">Last Name</label>
                    <div className="form-control-plaintext">{data.lastName}</div>
                </div>
                </div>
            </div>
            <div className="mb-3">
                <label className="form-label text-primary">Email</label>
                <div className="form-control-plaintext">{data.email}</div>
            </div>
            <div className="row">
                <div className="col-6">
                <div className="mb-3">
                    <label className="form-label text-primary">Country</label>
                    <div className="form-control-plaintext">{data.country}</div>
                </div>
                </div>
                <div className="col-6">
                <div className="mb-3">
                    <label className="form-label text-primary">Region</label>
                    <div className="form-control-plaintext">{user.region}</div>
                </div>
                </div>
            </div>
            </div>
            <div className="card-footer">
            </div>
        </div>
    </div>
     
        
    )
}

const UserAccount = ({ currentComponent = <UserDashboard /> }: { currentComponent?: React.ReactNode }) => {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const logoutUser = (e: SyntheticEvent) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "Are you sure to delete this order ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Logout it!'
        }).then((r) => {
            if (r.isConfirmed) {
                removeItem(RoutePaths.token);
                removeItem('user');
                dispatch(logoutCurrentUser)
                navigate(RoutePaths.home)
            }
        })
    }

    return (
        <>
            <Header />
            <div className='row justify-content-between gap-3 px-3 px-lg-5 my-5 w-100'>
                <aside className='user-page col-12 col-lg-3 fw-bold border border-1 h-25'>
                    <div><Link to={RoutePaths.userAccount} className={toggleLinkClass(RoutePaths.userAccount)}>Dashboard<i className="bi bi-house float-end"></i></Link></div>
                    <div><Link to={RoutePaths.userOrders} className={toggleLinkClass(RoutePaths.userOrders)}>Orders<i className="bi bi-bookmark-fill float-end"></i></Link></div>
                    <div><Link to={RoutePaths.userAdress} className={toggleLinkClass(RoutePaths.userAdress)}>Address<i className="bi bi-envelope float-end"></i></Link></div>
                    <div><Link to={RoutePaths.userDetails} className={toggleLinkClass(RoutePaths.userDetails)}>Account Details<i className="bi bi-person float-end"></i></Link></div>
                    <div><a href='#' className="d-block p-3 text-black" onClick={logoutUser}>Logout<i className="bi bi-person-slash float-end"></i></a></div>
                </aside>
                <div className="col-12 col-lg-8 mt-3">{currentComponent}</div>
                {/* // !isFetching && !isError ? <div className="w-75 mt-3">{currentComponent}</div> :
                // <Spinner /> */}
            </div>
            <Footer />
        </>
    )
}

export default UserAccount