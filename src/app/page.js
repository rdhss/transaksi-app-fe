"use client"
import React, { useEffect, useState } from 'react'
import { Button, Table, Input, Spin, Modal } from 'antd';
import axiosInstance from './api/axiosInstance';
import moment from 'moment';
import { useRouter } from 'next/navigation';

const { Search } = Input;
const Page = () => {
  const [dataTransaksi, setDataTransaksi] = useState([])
  const [loading, setLoading] = useState(true)
  const [listCustomer, setListCustomer] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [idDelete, setIdDelete] = useState(null)
  const router = useRouter()

  const listCustomerAPI = async () => {
    try {
      await axiosInstance({
        url: 'customer',
        method: 'GET'
      })
        .then((res) => {
          let data = res.data
          setLoading(false)
          setListCustomer(data);
        })
        .catch((err) => console.log(err))
    } catch (error) {

    }
  }
  function numberToRupiah(number) {
    let rupiah = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return 'Rp. ' + rupiah;
  }

  const listTransaction = async () => {
    console.log('test');
    try {
      await axiosInstance({
        url: 'sales',
        method: 'GET'
      })
        .then((res) => { setDataTransaksi(res.data); setLoading(false) })
        .catch((err) => console.log(err))
    } catch (error) {

    }
  }

  const deleteTransaction = async () => {
    try {
      await axiosInstance({
        url: `sales/${idDelete}`,
        method: 'DELETE'
      })
        .then((res) => { 
          setIdDelete(null); 
          setIsModalOpen(false) 
          setLoading(true);
          listTransaction()
        })
        .catch((err) => console.log(err))
    } catch (error) {

    }
  }

  const handleOpenModal = (a) => {
    setIsModalOpen(true)
    setIdDelete(a)
  }

  const handleConfirm = () => {
    deleteTransaction()
  }

  const handleCancelConfirm = () => {
    setIdDelete(null)
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'kode',
      key: 'kode',
      render: (a) => <>{dataTransaksi.findIndex(x => x.kode === a) + 1}</>

    },
    {
      title: 'No Transaksi',
      dataIndex: 'kode',
      key: 'kode'
    },
    {
      title: 'Tanggal',
      dataIndex: 'tgl',
      key: 'tgl',
      render: (a) => <>{moment(a).format("DD-MMMM-YYYY")}</>
    },
    {
      title: 'Nama Customer',
      dataIndex: 'cust_id',
      key: 'cust_id',
      render: (a) => <p>{listCustomer?.find(item => item.id == a)?.name}</p>
    },
    {
      title: 'Jumlah Barang',
      key: 'jumlah_barang',
      dataIndex: 'jumlah_barang'
    },
    {
      title: 'Sub Total',
      key: 'subtotal',
      dataIndex: 'subtotal',
      render: (a) => <>{numberToRupiah(a)}</>
    },
    {
      title: 'Diskon',
      key: 'diskon',
      dataIndex: 'diskon',
      render: (a) => <>{numberToRupiah(a)}</>
    },
    {
      title: 'Ongkir',
      key: 'ongkir',
      dataIndex: 'ongkir',
      render: (a) => <>{numberToRupiah(a)}</>
    },
    {
      title: 'Total',
      key: 'total_bayar',
      dataIndex: 'total_bayar',
      render: (a) => <>{numberToRupiah(a)}</>
    },
    {
      title: 'Action',
      key: 'id',
      dataIndex: 'id',
      render: (a) => <div>
        <p onClick={() => router.push(`detail-sales/${a}`)} className='text-blue-500 underline cursor-pointer'>Edit</p>
        <p onClick={() => handleOpenModal(a)} className='text-blue-500 underline cursor-pointer'>Delete</p>
      </div>
    },
  ];


  useEffect(() => {
    listTransaction();
    listCustomerAPI();
  }, [])

  return (
    <div className='px-10'>
      <Modal
        title="Confirm"
        style={{
          top: 20,
        }}
        open={isModalOpen}
        onOk={handleConfirm}
        onCancel={handleCancelConfirm}
      >
        <p>are you sure delete this transaction?</p>
      </Modal>
      <div className='p-5'>
        <h1 className='text-3xl font-bold mb-32'>List Transaksi</h1>
        {loading ?
          <div className='flex justify-center'>
            <Spin size="large" />
          </div>
          :
          <div>
            <div className='flex justify-between mb-5'>
              <Button onClick={() => router.push('/detail-sales')} type="primary">Buat Transaksi baru +</Button>
            </div>
            <Table dataSource={dataTransaksi} columns={columns} loading={loading} />
          </div>
        }
      </div>
    </div>
  )
}

export default Page