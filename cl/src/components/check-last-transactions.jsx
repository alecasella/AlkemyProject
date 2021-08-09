import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import Axios from 'axios'
import moment from 'moment'

import { AuthContext } from '../contexts/auth';

const CATEGORY_OPTIONS = [
    { label: 'Select one', value: '' },
    { label: 'Sales', value: 'sales' },
    { label: 'Purchases', value: 'purchases' },
    { label: 'Receipts', value: 'receipts' },
    { label: 'Payments', value: 'payments' },
    { label: 'All Movements', value: 'all-movements' },

]

const CheckLastTransactions = () => {
    const [transactionList, setTransactionList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [totalAm, setTotalAm] = useState('');
    const [msg, setMsg] = useState('');
    const [msgEmptyList, setMsgEmptyList] = useState('');

    const history = useHistory();
    const { loggedUser, setTransToEdit } = useContext(AuthContext);

    useEffect(() => {
        if (!loggedUser) {
            history.replace('/logout');
        }
        else {
            callMovements();
        }
    }, [])

    const callMovements = async () => {
        const user = {
            id_user: loggedUser.id
        }
        try {
            await Axios.post("http://localhost:3001/transactions/getTransactionsByIdUser", user).then((resp => {
                if (resp.data.trim) {
                    setMsgEmptyList(resp.data);
                }
                else {
                    if (transactionList === []) {
                        setMsgEmptyList(resp.data);
                    }
                    {
                        setTransactionList(resp.data);
                        setMsgEmptyList('');
                    }
                }
            }))

        } catch (e) { console.log(e); }

        totalAmount();
    }

    const foundCategories = async (e) => {
        e.preventDefault();

        if (selectedCategory === 'all-movements') {
            callMovements();
            setMsg('');

        }
        else {
            try {
                const resp = await Axios.post("http://localhost:3001/transactions/foundTransactionsByCategory", { id_user: loggedUser.id, category: selectedCategory }).then(resp => {
                    if (resp.data === 'Empty list') {
                        setMsgEmptyList(resp.data);
                    }
                    else {
                        setTransactionList(resp.data);
                        setMsg('');
                        setMsgEmptyList('');
                    }
                })
            } catch (e) { console.log(e); }
        }

    }

    const totalAmount = async () => {

        let totalDeposit = 0;
        let totalExtractions = 0;
        let resp = 0;

        const user = {
            id_user: loggedUser.id
        }

        try {
            await Axios.post("http://localhost:3001/transactions/getTransactionsByIdUser", user).then((resp => {
                if (resp.data.trim) {
                    msgEmptyList(resp.data)
                }
                else {
                    if (transactionList === []) {
                        setMsgEmptyList('Empty list');
                    }
                    {
                        resp.data.map(e => {
                            if (e.type_movement === 'deposit') {
                                totalDeposit += e.amount;
                            }
                            else totalExtractions += e.amount;
                        })

                    }
                }
            }))
        } catch (e) { console.log(e) };


        resp = totalDeposit - totalExtractions;

        setTotalAm(resp);
    }

    const deleteTransaction = async (id_transaction) => {
        try {
            await Axios.delete("http://localhost:3001/transactions/deleteTransaction/", { data: { id_transaction } }).then((resp => {
                if (transactionList.length === 1) setTransactionList([]);
                setMsg('Transaction Deleted Successfully');
                setMsgEmptyList('');

            }))
        } catch (e) { console.log(e); }
        callMovements();

    }

    const editTransition = (id) => {
        setTransToEdit(id);

        history.push(`/editTransaction`);

    }

    const backToAdd = () => {
        history.push(`/addTransaccions/${loggedUser.id}`);
    }

    return (
        <div className="col d-flex flex-column flex-md-row mt-3 ">

            <div className="container">
                <div className="d-flex ">
                    <b className="flex-wrap"> List of Transactions</b>

                    <div className="container justify-content-end d-flex">
                        <b >Filter By: </b>
                        <select className=" form-control block mt-1" onChange={(e) => setSelectedCategory(e.target.value)} defaultValue={CATEGORY_OPTIONS[5].value} required >
                            {
                                CATEGORY_OPTIONS.map((o, i) => (
                                    o.label !== 'Select one' ?
                                        (
                                            <option key={i} value={o.value}>{o.label}</option>
                                        )
                                        :
                                        (
                                            <span></span>
                                        )
                                ))
                            }
                        </select>
                        <button onClick={foundCategories} className="btn btn-outline-secondary mx-1">Select</button>

                    </div>

                </div>

                <table className=" table" >
                    <thead>
                        <tr >
                            <th scope="col">#</th>
                            <th scope="col">Concept</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Movement</th>
                            <th scope="col">Category</th>
                            <th scope="col">Date</th>
                        </tr>
                    </thead>
                    <tbody >
                        {
                            !msgEmptyList ?
                                (
                                    transactionList.map((e, i) => (

                                        <tr key={i}>
                                            <th scope="row">{i + 1}</th>
                                            <td>{e.concept}</td>
                                            <td>{e.amount}</td>
                                            <td>{e.type_movement}</td>
                                            <td>{e.category}</td>
                                            <td>{moment(e.trans_date).format("YYYY-MM-DD")}</td>
                                            <div className="container d-flex text-align-center justify-content-end">
                                                <button onClick={(id) => (editTransition(e.id_transaction))} className="btn btn-primary btn-block mx-2">Edit</button>
                                                <button onClick={(id) => (deleteTransaction(e.id_transaction))} className="btn btn-danger btn-block">Delete</button>
                                            </div>
                                        </tr>

                                    ))

                                )
                                :
                                (
                                    <tr>
                                        <td className="bg-secondary"></td>
                                        <td className="bg-secondary"></td>
                                        <td className="bg-secondary"></td>
                                        <td className="bg-secondary">{msgEmptyList}</td>
                                        <td className="bg-secondary"></td>
                                        <td className="bg-secondary"></td>
                                    </tr>
                                )

                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" >Total Amount</td>
                            <td></td>
                            <td></td>
                            <td><p>{totalAm}</p></td>
                            <div className="container d-flex text-align-center justify-content-end">
                                <button onClick={backToAdd} className="btn btn-primary btn-block mx-2">Back to Add</button>
                            </div>
                        </tr>
                    </tfoot>
                </table>
                {
                    msg ?
                        (
                            <h5 className="d-flex justify-content-center">{msg}</h5>
                        )
                        :
                        (
                            <span></span>
                        )
                }
            </div>

        </div>

    )
}
export default CheckLastTransactions