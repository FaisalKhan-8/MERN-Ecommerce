import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteItemFromCartAsync,
  selectItems,
  updateCartAsync,
} from '../features/cart/cartSlice.js';
import { updateUserAsync } from '../features/auth/authSlice.js';
import {
  createOrderAsync,
  selectCurrentOrder,
} from '../features/order/orderSlice.js';
import { selectUserInfo } from '../features/user/userSlice';
import { discountedPrice } from '../app/constants';

function Checkout() {
  const [open, setOpen] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const user = useSelector(selectUserInfo);
  const items = useSelector(selectItems);
  const currentOrder = useSelector(selectCurrentOrder);
  const totalAmount = items.reduce(
    (amount, item) => item.price * item.quantity + amount,
    0
  );
  const totalItems = items.reduce(
    (amount, item) => discountedPrice(item) * item.quantity + amount
  );

  const handleQuantity = (e, item) => {
    dispatch(updateCartAsync({ ...item, quantity: +e.target.value }));
  };

  const handleRemove = (e, id) => {
    dispatch(deleteItemFromCartAsync(id));
  };

  // handle radio button for address
  const handleAddress = (e) => {
    setSelectedAddress(user.addresses[e.target.value]);
  };
  // handle radio button for Payment Method
  const handlePayment = (e) => {
    setPaymentMethod(e.target.value);
  };
  // handle  button for Place the order
  const handleOrder = (e) => {
    const order = {
      items,
      totalAmount,
      totalItems,
      user,
      paymentMethod,
      selectedAddress,
      status: 'pending',
    };
    dispatch(createOrderAsync(order));
    //TODO : redirect to order-success page
    //TODO : clear cart after order
    // TODO :  on server change the stock number of items
  };

  return (
    <>
      {!items.length && <Navigate to='/' replace={true}></Navigate>}
      {currentOrder && (
        <Navigate
          to={`/order-success/${currentOrder.id}`}
          replace={true}></Navigate>
      )}
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5'>
          <div className='lg:col-span-3'>
            <form
              className=' bg-white px-6 py-5 mt-12'
              noValidate
              onSubmit={handleSubmit((data) => {
                console.log(data);
                dispatch(
                  updateUserAsync({
                    ...user,
                    addresses: [...user.addresses, data],
                  })
                );
                reset();
              })}>
              <div className='space-y-12'>
                <div className='border-b border-gray-900/10 pb-12'>
                  <h2 className='text-2xl font-semibold leading-7 text-gray-900'>
                    Personal Information
                  </h2>
                  <p className='mt-1 text-sm leading-6 text-gray-600'>
                    Use a permanent address where you can receive mail.
                  </p>

                  <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                    <div className='sm:col-span-4'>
                      <label
                        htmlFor='name'
                        className='flex text-sm font-medium leading-6 text-gray-900'>
                        Full Name
                      </label>
                      <div className='mt-2'>
                        <input
                          type='text'
                          {...register('name', {
                            required: 'Name is required',
                          })}
                          id='name'
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>

                    <div className='sm:col-span-4 '>
                      <label
                        htmlFor='email'
                        className='text-sm font-medium leading-6 text-gray-900 flex'>
                        Email address
                      </label>
                      <div className='mt-2'>
                        <input
                          id='email'
                          {...register('email', {
                            required: 'Email is required',
                          })}
                          type='email'
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>

                    <div className='sm:col-span-3'>
                      <label
                        htmlFor='phone'
                        className=' flex text-sm font-medium leading-6 text-gray-900'>
                        Phone
                      </label>
                      <div className='mt-2'>
                        <input
                          id='phone'
                          {...register('phone', {
                            required: 'phone is required',
                          })}
                          type='tel'
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>

                    <div className='col-span-full'>
                      <label
                        htmlFor='street-address'
                        className='flex text-sm font-medium leading-6 text-gray-900'>
                        Street address
                      </label>
                      <div className='mt-2'>
                        <input
                          type='text'
                          {...register('street', {
                            required: 'street is required',
                          })}
                          id='street'
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>

                    <div className='sm:col-span-2 sm:col-start-1'>
                      <label
                        htmlFor='city'
                        className='flex text-sm font-medium leading-6 text-gray-900'>
                        City
                      </label>
                      <div className='mt-2'>
                        <input
                          type='text'
                          {...register('city', {
                            required: 'city is required',
                          })}
                          id='city'
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>

                    <div className='sm:col-span-2'>
                      <label
                        htmlFor='state'
                        className='flex text-sm font-medium leading-6 text-gray-900'>
                        State / Province
                      </label>
                      <div className='mt-2'>
                        <input
                          type='text'
                          {...register('state', {
                            required: 'state is required',
                          })}
                          id='state'
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>

                    <div className='sm:col-span-2'>
                      <label
                        htmlFor='pinCode'
                        className='flex text-sm font-medium leading-6 text-gray-900'>
                        ZIP / Postal code
                      </label>
                      <div className='mt-2'>
                        <input
                          type='text'
                          {...register('pinCode', {
                            required: 'pinCode is required',
                          })}
                          id='pinCode'
                          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='mt-6 flex items-center justify-end gap-x-6'>
                  <button
                    type='button'
                    className='text-sm font-semibold leading-6 text-gray-900'>
                    Reset
                  </button>
                  <button
                    type='submit'
                    className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                    Add Address
                  </button>
                </div>

                <div className='border-b border-gray-900/10 pb-12  '>
                  {/* address lists  */}
                  <h2 className='text-base flex font-semibold leading-7 text-gray-900'>
                    Address
                  </h2>
                  <p className='mt-1 flex text-sm leading-6 text-gray-600'>
                    Choose from Existing addresses
                  </p>
                  <ul role='list'>
                    {user.addresses.map((address, index) => (
                      <li
                        key={index}
                        className='flex justify-between gap-x-6 py-5  border-solid border-2 border-gray-200'>
                        <div className='flex min-w-0 gap-x-4 '>
                          <input
                            onChange={handleAddress}
                            name='address'
                            type='radio'
                            value={index}
                            className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
                          />
                          <div className='min-w-0 flex-auto '>
                            <p className='text-sm font-semibold leading-6 text-gray-900'>
                              {address.name}
                            </p>

                            <p className='mt-1 truncate text-xs leading-5 text-gray-500 '>
                              {address.street}
                            </p>
                            <p className='text-sm leading-6 text-gray-900'>
                              {address.pinCode}
                            </p>
                          </div>
                        </div>
                        <div className='hidden shrink-0 sm:flex sm:flex-col sm:items-end px-2'>
                          <p className='text-sm leading-6 text-gray-900'>
                            Phone: {address.phone}
                          </p>
                          <p className='text-sm leading-6 text-gray-900'>
                            {address.state}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {/* // Radio buttons for payment option */}
                  <div className='mt-12  space-y-10 flex'>
                    <fieldset>
                      <legend className='text-sm font-semibold leading-6 text-gray-900'>
                        Payment Method
                      </legend>

                      <div className='mt-6 space-y-6'>
                        <div className='flex items-center gap-x-3'>
                          <input
                            id='cash'
                            name='payments'
                            onChange={handlePayment}
                            value='cash'
                            type='radio'
                            checked={paymentMethod === 'cash'}
                            className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
                          />
                          <label
                            htmlFor='cash'
                            className='block text-sm font-medium leading-6 text-gray-900'>
                            Cash
                          </label>
                        </div>
                        <div className='flex items-center gap-x-3'>
                          <input
                            id='card'
                            name='payments'
                            onChange={handlePayment}
                            value='card'
                            checked={paymentMethod === 'card'}
                            type='radio'
                            className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
                          />
                          <label
                            htmlFor='card'
                            className='block text-sm font-medium leading-6 text-gray-900'>
                            Card Payment
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className='lg:col-span-2'>
            <div className='mx-auto mt-12 bg-white max-w-7xl px-2 sm:px-2 lg:px-4'>
              <div className='border-t border-gray-200 px-0 py-6 sm:px-0'>
                <h2 className='text-4xl mb-4 py-5 font-bold tracking-tight text-gray-900'>
                  Cart
                </h2>
                <div>
                  <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                    <div className='flow-root'>
                      <ul
                        role='list'
                        className='-my-6 divide-y divide-gray-200'>
                        {items.map((item) => (
                          <li key={item.id} className='flex py-6'>
                            <div className='h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200'>
                              <img
                                src={item.thumbnail}
                                alt={item.title}
                                className='h-full w-full object-cover object-center'
                              />
                            </div>

                            <div className='ml-4 flex flex-1 flex-col'>
                              <div>
                                <div className='flex justify-between text-base font-medium text-gray-900'>
                                  <h3>
                                    <a href={item.href}>{item.title}</a>
                                  </h3>
                                  <p className='ml-4'>
                                    ${discountedPrice(item)}
                                  </p>
                                </div>
                                <p className='mt-1 flex  text-sm text-gray-500'>
                                  {item.brand}
                                </p>
                              </div>
                              <div className='flex flex-1 items-end justify-between text-sm'>
                                <div className='text-gray-500 '>
                                  <label
                                    htmlFor='quantity'
                                    className='inline text-sm font-medium leading-6 text-gray-900 mt-2'>
                                    Qty
                                  </label>
                                  <select
                                    onChange={(e) => handleQuantity(e, item)}
                                    value={item.quantity}
                                    className='rounded-lg mt-2 text-sm ml-3'>
                                    <option value='1'>1</option>
                                    <option value='2'>2</option>
                                    <option value='3'>3</option>
                                    <option value='4'>4</option>
                                    <option value='5'>5</option>
                                  </select>
                                </div>

                                <div className='flex'>
                                  <button
                                    onClick={(e) => handleRemove(e, item.id)}
                                    type='button'
                                    className='font-medium text-indigo-600 hover:text-indigo-500'>
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className='border-t border-gray-200 px-2 py-6 sm:px-2 mt-7'>
                    <div className='flex justify-between my-2 text-base font-medium text-gray-900'>
                      <p>Subtotal</p>
                      <p>$ {totalAmount}</p>
                    </div>
                    <div className='flex justify-between my-2 text-base font-medium text-gray-900'>
                      <p>Total Items in Cart</p>
                      <p>{totalItems} items</p>
                    </div>
                    <p className='flex mt-0.5 text-sm text-gray-500'>
                      Shipping and taxes calculated at checkout.
                    </p>
                    <div className='mt-6'>
                      <div
                        onClick={handleOrder}
                        className='flex cursor-pointer items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700'>
                        Order Now
                      </div>
                    </div>
                    <div className='mt-6 flex justify-center text-center text-sm text-gray-500'>
                      <p>
                        or
                        <Link to={'/'}>
                          <button
                            type='button'
                            className='font-medium text-indigo-600 hover:text-indigo-500'>
                            Continue Shopping
                            <span aria-hidden='true'> &rarr;</span>
                          </button>
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
