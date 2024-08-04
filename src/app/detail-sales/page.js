"use client"
import React, { useEffect, useState } from 'react'
import { Button, Table, Input, Spin, DatePicker, Select, Modal } from 'antd';
import axiosInstance from '../api/axiosInstance';
import moment from 'moment';
import { useRouter } from 'next/navigation';

const { Search } = Input;
const Page = () => {
    const [customer, setCustomer] = useState()
    const [date, setDate] = useState()
    const [barang, setBarang] = useState()
    const [listCustomer, setListCustomer] = useState([])
    const [listBarang, setListBarang] = useState([])
    const [listSales, setListSales] = useState([])
    const [tempSales, setTempSales] = useState([])
    const [diskonSales, setDiskonSales] = useState(0)
    const [ongkirSales, setOngkirSales] = useState(0)
    const [totalBayar, setTotalBayar] = useState(0)
    const [nameValue, setNameValue] = useState('')
    const [barangName, setBarangName] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
    const [salesId, setSalesId] = useState(0)

    const router = useRouter()

    function generateTransactionNumber() {
        const firstPart = Math.floor(Math.random() * 900000) + 100000;
        const secondPart = Math.floor(Math.random() * 9000) + 1000;
        const transactionNumber = `${firstPart}-${secondPart}`;
        return transactionNumber;
    }

    const [kodeTransaksi, setKodeTransaksi] = useState(generateTransactionNumber())



    function numberToRupiah(number) {
        if (number == '0') {
            return 'Rp. ' + number;
        }
        let rupiah = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return 'Rp. ' + rupiah;
    }

    const onChangeDate = (date, dateString) => {
        setDate(dateString);
    };

    const handleSelect = (e, option) => {
        setCustomer({
            id: option.value,
            name: option.children[0],
            telp: option.children[2],
            kode: option.children[4]

        })
        setNameValue(option.children[0]);
    }

    const handleSelectBarang = (e, option) => {
        setBarang({
            id: option.value,
            nama: option.children[0],
            harga: option.children[2],
            kode: option.children[4]

        })
        setBarangName(option.children[0]);
    }

    const listBarangAPI = async () => {
        try {
            await axiosInstance({
                url: 'barang',
                method: 'GET'
            })
                .then((res) => {
                    console.log(res.data);
                    let dummyData = []
                    let data = res.data
                    for (let i = 0; i < data.length; i++) {
                        dummyData.push(<Option value={data[i].id}>{data[i].nama} | {data[i].harga} | {data[i].kode}</Option>)
                    }
                    setListBarang(dummyData);

                })
                .catch((err) => console.log(err))
        } catch (error) {

        }
    }

    const postSalesDetailAPI = async (payload) => {
        try {
            await axiosInstance({
                url: 'sales-detail',
                method: 'POST',
                data: payload
            })
                .then((res) => {
                    console.log(res.data);
                    let dummyData = []
                    let data = res.data
                    for (let i = 0; i < data.length; i++) {
                        dummyData.push(<Option value={data[i].id}>{data[i].nama} | {data[i].harga} | {data[i].kode}</Option>)
                    }
                    setListBarang(dummyData);

                })
                .catch((err) => console.log(err))
        } catch (error) {

        }
    }

    const postSalesAPI = async (payload) => {
        try {
            await axiosInstance({
                url: 'sales',
                method: 'POST',
                data: payload
            })
                .then((res) => {
                    let id
                    id = res.data.id
                    return res.data.id
                })
                .catch((err) => console.log(err))
        } catch (error) {
            console.log(error);
        }
    }

    const listCustomerAPI = async () => {
        try {
            await axiosInstance({
                url: 'customer',
                method: 'GET'
            })
                .then((res) => {
                    let dummyData = []
                    let data = res.data
                    for (let i = 0; i < data.length; i++) {
                        dummyData.push(<Option value={data[i].id}>{data[i].name} | {data[i].telp} | {data[i].kode}</Option>)
                    }
                    setListCustomer(dummyData);
                })
                .catch((err) => console.log(err))
        } catch (error) {

        }
    }

    const columns = [
        {
            title: 'Action',
            key: 'no',
            dataIndex: 'no',
            render: (a) =>
                <div>
                    {a === tempSales?.[0]?.no ?
                        <p
                            onClick={() => {
                                console.log(tempSales);
                                setListSales(listSales.map(obj => tempSales.find(o => o.no == obj.no) || obj));
                                setTempSales([])
                            }}
                            className='text-blue-500 underline cursor-pointer'
                        >
                            save
                        </p>
                        :
                        <div>
                            <p onClick={() => { setTempSales(listSales.filter(obj => obj.no == a)) }} className='text-blue-500 underline cursor-pointer'>Edit</p>
                            <p onClick={() => setListSales(listSales.filter(obj => obj.no != a))} className='text-blue-500 underline cursor-pointer'>Delete</p>
                        </div>
                    }
                </div>

        },
        {
            title: 'No',
            dataIndex: 'no',
            key: 'no',
            render: (a) => <p>{listSales.findIndex(function (item) {
                return item.no == a
            }) + 1}</p>
        },
        {
            title: 'Kode Barang',
            dataIndex: 'kode',
            key: 'kode'
        },
        {
            title: 'Nama Barang',
            dataIndex: 'nama',
            key: 'nama',
        },
        {
            title: 'Qty',
            dataIndex: ['qty', 'no'],
            key: 'qty',
            render: (a, record) => <>
                {
                    record['no'] === tempSales?.[0]?.no ?
                        <Input
                            type='text'
                            defaultValue={tempSales?.[0]?.qty}
                            style={{ width: 50 }}
                            maxLength={2}
                            onChange={(e) => setTempSales([{
                                ...tempSales[0],
                                qty: e.target.value,
                                diskon_rupiah: (tempSales?.[0]?.harga * (tempSales?.[0]?.diskon / 100)),
                                harga_diskon: tempSales?.[0]?.harga - (tempSales?.[0]?.harga * tempSales?.[0]?.diskon / 100),
                                total: (tempSales?.[0]?.harga - (tempSales?.[0]?.harga * tempSales?.[0]?.diskon / 100)) * e.target.value
                            }])}
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                        />
                        :
                        record['qty']
                }
            </>

        },
        {
            title: 'Harga Bandrol',
            key: 'harga',
            dataIndex: 'harga',
            render: (a) => <>{numberToRupiah(a)}</>
        },
        {
            title: 'Diskon (%)',
            key: 'diskon',
            dataIndex: ['diskon', 'no'],
            render: (a, record) => <>
                {record['no'] == tempSales?.[0]?.no ?
                    <Input
                        defaultValue={tempSales?.[0]?.diskon}
                        onChange={(e) => setTempSales([{
                            ...tempSales[0],
                            diskon: e.target.value,
                            diskon_rupiah: (tempSales?.[0]?.harga * e.target.value / 100),
                            harga_diskon: tempSales?.[0]?.harga - (tempSales?.[0]?.harga * e.target.value / 100),
                            total: (tempSales?.[0]?.harga - (tempSales?.[0]?.harga * e.target.value / 100)) * tempSales?.[0]?.qty,
                        }])

                        }
                        type='text'
                        style={{ width: 50 }}
                        maxLength={2}
                    />
                    :
                    <p>{record['diskon']} %</p>
                }
            </>
        },
        {
            title: 'Diskon (Rp)',
            key: 'diskon_rupiah',
            dataIndex: ['harga', 'diskon_rupiah', 'no'],
            render: (a, record) => <>
                {record['no'] === tempSales?.[0]?.no ?
                    // <p>{numberToRupiah(tempSales?.[0]?.harga * tempSales?.[0]?.diskon / 100)}</p>
                    <p>{tempSales?.[0]?.harga * tempSales?.[0]?.diskon / 100}</p>
                    :
                    <p>{record['diskon_rupiah']}</p>
                }
            </>
        },
        {
            title: 'Harga Diskon',
            key: 'harga diskon',
            dataIndex: ['harga'],
            render: (a, record) => <>
                {record['no'] === tempSales?.[0]?.no ?
                    <p>{numberToRupiah(tempSales?.[0]?.harga - (tempSales?.[0]?.harga * tempSales?.[0]?.diskon / 100))}</p>
                    :
                    <p>{numberToRupiah(record["harga_diskon"])}</p>
                }

            </>
        },
        {
            title: 'Total',
            key: 'total_bayar',
            dataIndex: ['harga', 'diskon', 'qty'],
            render: (a, record) => <>
                {record['no'] === tempSales?.[0]?.no ?
                    <p>{numberToRupiah((tempSales?.[0]?.harga - (tempSales?.[0]?.harga * tempSales?.[0]?.diskon / 100)) * tempSales?.[0]?.qty)}</p>
                    :
                    <p>{numberToRupiah(record['total'])}</p>
                }
            </>
        }
    ];

    const showModal = () => {
        setIsModalOpen(true);
    };

    const showModalConfirm = () => {
        setIsModalConfirmOpen(true)
    }

    const handleOk = () => {
        setTempSales([{ no: listSales.length + 1, qty: 1, diskon: 0, diskon_rupiah: 0, harga_diskon: 0, total: barang.harga, ...barang }])
        setListSales(oldItem => [...oldItem, { no: listSales.length + 1, qty: 1, diskon: 0, diskon_rupiah: 0, harga_diskon: 0, total: 0, ...barang }])
        setBarang(null)
        setBarangName('')
        setIsModalOpen(false);
    };

    const handleOkConfirm = async () => {
        setIsModalOpen(false);
        let data = {
            kode: kodeTransaksi,
            tgl: date,
            cust_id: customer.id,
            jumlah_barang: listSales.reduce(function (prev, current) {
                return prev + +current.qty
            }, 0),
            subtotal: listSales.reduce(function (prev, current) {
                return prev + +current.total
            }, 0),
            diskon: diskonSales,
            ongkir: ongkirSales,
            total_bayar: listSales.reduce(function (prev, current) {
                return prev + +current.total
            }, 0) + Number(ongkirSales) - Number(diskonSales)
        }
        try {
            await axiosInstance({
                url: 'sales',
                method: 'POST',
                data: data
            })
                .then((res) => {
                    let idSales
                    idSales = res.data.id
                    listSales.map((item) => {
                        postSalesDetailAPI({
                            sales_id: idSales,
                            barang_id: item.kode,
                            harga_bandrol: item.harga,
                            qty: item.qty,
                            diskon_pct: item.diskon,
                            diskon_nilai: item.diskon_rupiah,
                            harga_diskon: item.harga_diskon,
                            total: item.total
                        })
                    })
                    router.push('/')
                })
                .catch((err) => console.log(err))
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancel = () => {
        setBarang(null)
        setBarangName('')
        setIsModalOpen(false);
    };

    const handleCancelConfirm = () => {
        setIsModalConfirmOpen(false);
    };



    useEffect(() => {
        listCustomerAPI();
        listBarangAPI()
    }, [])

    return (
        <div className='px-10'>
            <div className='p-5'>
                <h1 className='text-3xl font-bold '>Transaksi Baru</h1>
                <div className='mb-32 mt-10 w-96'>
                    <div className=''>
                        <h1 className='bg-blue-400 p-1 font-bold text-white'>Transaksi</h1>
                        <div className='flex justify-between items-center mt-2'>
                            <h2>No</h2>
                            <Input placeholder="" disabled value={kodeTransaksi} style={{ width: 270 }} />
                        </div>
                        <div className='flex justify-between items-center mt-2'>
                            <h2>Tanggal</h2>
                            <DatePicker onChange={onChangeDate} style={{ width: 270 }} />
                        </div>
                    </div>
                    <div className='mt-5'>
                        <h1 className='bg-blue-400 p-1 font-bold text-white'>Customer</h1>
                        <div className='flex justify-between items-center mt-2'>
                            <h2>Kode</h2>
                            <Input disabled style={{ width: 270 }} value={customer?.kode} />
                        </div>
                        <div className='flex justify-between items-center mt-2'>
                            <h2>Nama</h2>
                            <div className='relative'>
                                <Select
                                    onSelect={handleSelect}
                                    value={nameValue ? nameValue : null}
                                    style={{ width: 270 }}
                                    placeholder="Pilih Customer"
                                >
                                    {listCustomer}
                                </Select>
                                {/* <Button className='absolute ml-4' type="primary">Tambah Customer</Button> */}
                            </div>
                        </div>
                        <div className='flex justify-between items-center mt-2'>
                            <h2>Telp</h2>
                            <Input disabled placeholder="" style={{ width: 270 }} value={customer?.telp} />
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
                <div>

                    <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                        <div className='flex justify-between items-center mt-2'>
                            <h2>Kode</h2>
                            <Input disabled style={{ width: 270 }} value={barang?.kode} />
                        </div>
                        <div className='flex justify-between items-center mt-2'>
                            <h2>Nama</h2>
                            <div>
                                <Select
                                    onSelect={handleSelectBarang}
                                    value={barangName ? barangName : null}
                                    style={{ width: 270 }}
                                    placeholder="Pilih Barang"
                                >
                                    {listBarang}
                                </Select>
                            </div>
                        </div>
                        <div className='flex justify-between items-center mt-2'>
                            <h2>Harga</h2>
                            <Input disabled placeholder="" style={{ width: 270 }} value={barang?.harga} />
                        </div>
                    </Modal>


                    <Modal
                        title="Confirm"
                        style={{
                            top: 20,
                        }}
                        open={isModalConfirmOpen}
                        onOk={handleOkConfirm}
                        onCancel={handleCancelConfirm}
                    >
                        <p>are you sure add this transaction?</p>
                    </Modal>

                    <div className='flex justify-between mb-5'>
                        <Button disabled={tempSales?.length > 0} onClick={showModal} type="primary">Tambah Barang +</Button>
                    </div>
                    <Table dataSource={listSales} columns={columns} />
                    <div className='flex justify-end'>
                        <div className='w-96'>
                            <div className='flex justify-between items-center mt-2'>
                                <h2>Sub Total</h2>
                                <Input placeholder="" className='text-right font-bold' pattern="^\w+([.-]\w+)*@\w+([.-]\w+)*(\.\w{2,4})+$" variant='filled' value={numberToRupiah(listSales.reduce(function (prev, current) {
                                    return prev + +current.total
                                }, 0))} style={{ width: 170 }} />
                            </div>
                            <div className='flex justify-between items-center mt-2'>
                                <h2>Diskon</h2>
                                <Input placeholder="" disabled={tempSales.length > 0 || listSales.length == 0} addonBefore="Rp" type='number' defaultValue={0} onChange={(e) => setDiskonSales(e.target.value)} style={{ width: 170 }} />
                            </div>
                            <div className='flex justify-between items-center mt-2'>
                                <h2>Ongkir</h2>
                                <Input placeholder="" disabled={tempSales.length > 0 || listSales.length == 0} addonBefore="Rp" type='number' defaultValue={0} onChange={(e) => { setOngkirSales(e.target.value); setTotalBayar(totalBayar - e.target.value) }} style={{ width: 170 }} />
                            </div>
                            <div className='flex justify-between items-center mt-2'>
                                <h2>Total Bayar</h2>
                                <Input placeholder="" className='text-right font-bold' pattern="^\w+([.-]\w+)*@\w+([.-]\w+)*(\.\w{2,4})+$" variant='filled' defaultValue={0}
                                    value={numberToRupiah((listSales.reduce(function (prev, current) {
                                        return prev + +current.total
                                    }, 0) + Number(ongkirSales)) - diskonSales)} style={{ width: 170 }} />
                            </div>
                        </div>
                    </div>
                    <div className='my-10 flex justify-center'>
                        <div className='flex justify-between w-60'>
                            <Button onClick={() => setIsModalConfirmOpen(true)} disabled={!customer || !date || listSales.length == 0 || tempSales.length > 0} type='primary' className='w-24'>Save</Button>
                            <Button onClick={() => router.push('/')} className='w-24'>Cancel</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page