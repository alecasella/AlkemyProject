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
]

const TYPE_OF_MOVEMENTS_OPTIONS = [
    { label: 'Select one', value: '' },
    { label: 'Deposit', value: 'deposit' },
    { label: 'Extraction', value: 'extraction' }
]

const EditTransaction = () => {

    const [amount, setAmount] = useState('');
    const [concept, setConcept] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [category, setCategory] = useState('');
    const [typeOfMovement, setTypeOfMovement] = useState('');

    const [msg, setMsg] = useState('');

    const history = useHistory();
    const { loggedUser, idTransToEdit } = useContext(AuthContext);

    useEffect(async () => {
        if (!loggedUser) {
            history.replace('/logout');
        } else {
            try {
                await Axios.post("http://localhost:3001/transactions/getTransactionsById", { id_transaction: idTransToEdit }).then((resp => {

                    setAmount(resp.data[0].amount);
                    setConcept(resp.data[0].concept);
                    setTransactionDate(moment(resp.data[0].trans_date).format("YYYY-MM-DD"));
                    setCategory(resp.data[0].category);
                    setTypeOfMovement(resp.data[0].type_movement);
                }));
            } catch (e) { console.log(e) };
        }
    }, [])



    const backToLastTransactions = () => {
        
        const id = loggedUser.id;

        history.push(`/checkLastTransactions/${id}`);

    }

    const editTransaction = async (e) => {
        e.preventDefault();

        const transactionEdited = {
            id_transaction: idTransToEdit,
            amount: amount,
            concept: concept,
            trans_date: transactionDate,
            category: category,
            type_movement: typeOfMovement,
        }

        try {
            await Axios.patch("http://localhost:3001/transactions/editTransactcion", transactionEdited).then((resp => {

                console.log(resp.data);
                setMsg('Transaction Edited Successfully')

                setTimeout(backToLastTransactions , 1500);
            }))
        } catch (e) { console.log(e); }
    }

    return (
        <div className="container d-flex justify-content-center mt-5">

            <div className="row">

                <div className="col d-flex flex-column flex-md-row">

                    <div className="col mx-2 mt-4 mt-md-0">

                        <form onSubmit={editTransaction} className="form-group">


                            <h2 className="text-center">Edit Transaction</h2>

                            <div className="container mt-2">
                                <label>Amount</label>
                                <input className="form-control mb-3" required type="number" min='0' onChange={(e) => setAmount(e.target.value)} value={amount} />
                            </div>

                            <div className="container mt-2">
                                <label>Concept</label>
                                <input className="form-control mb-3" required type="text" onChange={(e) => setConcept(e.target.value)} value={concept} />
                            </div>

                            <div className="container mt-2">
                                <label>Transaction date</label>
                                <input className="form-control mb-3" required type="date" onChange={(e) => setTransactionDate(e.target.value)} value={transactionDate} />
                            </div>

                            <div className="container ">
                                <label >Category</label>
                                {

                                    <select className=" form-control block mt-1" onChange={(e) => setCategory(e.target.value)} required value={category} >
                                        {
                                            CATEGORY_OPTIONS.map((o, i) => (
                                                <option key={i} value={o.value}>{o.label}</option>
                                            ))
                                        }
                                    </select>
                                }
                            </div>

                            <div className="container">
                                <label >Type of Movement</label>

                                <select className=" form-control block mt-1" onChange={(e) => setTypeOfMovement(e.target.value)} required value={typeOfMovement} >
                                    {
                                        TYPE_OF_MOVEMENTS_OPTIONS.map((o, i) => (
                                            <option key={i} value={o.value}>{o.label}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <input className="form-control btn btn-success btn-block mt-3" type="submit" value='Edit' />
                        </form>
                        <button onClick={backToLastTransactions} className="form-control btn btn-info btn-block mt-3">Back</button>
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
            </div >
        </div >
    )
}
export default EditTransaction;