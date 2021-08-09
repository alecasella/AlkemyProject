import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../contexts/auth';

import Axios from 'axios'

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

const Transactions = () => {

    const [amount, setAmount] = useState('');
    const [concept, setConcept] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [category, setCategory] = useState('');
    const [typeOfMovement, setTypeOfMovement] = useState('');
    const [msg, setMsg] = useState('');

    const history = useHistory();
    const { loggedUser } = useContext(AuthContext);

    useEffect(() => {
        if (!loggedUser) {
            history.replace('/logout');
        }
    }, [])


    const addTransaction = async (e) => {
        e.preventDefault();

        const tansaction = {
            amount: amount,
            type_movement: typeOfMovement,
            concept: concept,
            trans_date: transactionDate,
            id_user: loggedUser.id,
            category: category
        }

        if (amount >= 0) {
            try {

                await Axios.post("http://localhost:3001/transactions/addTransaction", tansaction,{
                    headers: {authorization: "Bearer " + loggedUser.tkn},
                });
                setAmount('');
                setConcept('');
                setTransactionDate('');
                setCategory(CATEGORY_OPTIONS[0].value);
                setTypeOfMovement(TYPE_OF_MOVEMENTS_OPTIONS[0].value);
                setTypeOfMovement('');
                setMsg('Transaction Added Successfully')

            } catch (e) { console.log(e); }
        } else setMsg('Amount cant be less than 0 ')
    }

    const checkLastTransition = (e) => {
        e.preventDefault();

        const id = loggedUser.id;

        history.push(`/checkLastTransactions/${id}`);

    }

    return (

        <div className="container d-flex justify-content-center mt-5">

            <div className="row">

                <div className="col d-flex flex-column flex-md-row">

                    <div className="col mx-2 mt-4 mt-md-0">

                        <form onSubmit={addTransaction} className="form-group">


                            <h2 className="text-center">Add Transaction</h2>

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

                            <input className="form-control btn btn-success btn-block mt-3" type="submit" value='Add transaction' />

                            <button onClick={checkLastTransition} className="form-control btn btn-info btn-block mt-3">Check last transactions</button>

                        </form>
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

export default Transactions;