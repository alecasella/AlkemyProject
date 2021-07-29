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


const Transactions = () => {

    const [amount, setAmount] = useState('');
    const [concept, setConcept] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [category, setCategory] = useState('');
    const [typeOfMovement, setTypeOfMovement] = useState('');
    const [askMovements, setAskMovements] = useState(false);
    const [idTransctionToEdit, setIdTransactionToEdit] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [transactionList, setTransactionList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [totalAm, setTotalAm] = useState('');
    const [msg, setMsg] = useState('');
    const [msgEmptyList, setMsgEmptyList] = useState('');

    const history = useHistory();
    const { loggedUser } = useContext(AuthContext);

    useEffect(() => {
        if (!loggedUser) {
            history.replace('/logout');
        }
    }, [])


    const callMovements = async () => {


        setAskMovements(true);
    

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

        if(amount >= 0 )
        {
            try {
                await Axios.post("http://localhost:3001/transactions/addTransaction", tansaction);
                setAmount('');
                setConcept('');
                setTransactionDate('');
                setCategory(CATEGORY_OPTIONS[0].value);
                setTypeOfMovement(TYPE_OF_MOVEMENTS_OPTIONS[0].value);
                callMovements();
                setTypeOfMovement('');
                setMsg('Transaction Added Successfully')
                setMsgEmptyList('');
    
            } catch (e) { console.log(e); }
        }else setMsg('Amount cant be less than 0 ')
        

    }

    const deleteTransaction = async (id_transaction) => {
        try {
            await Axios.delete("http://localhost:3001/transactions/deleteTransaction/", { data: { id_transaction } }).then((resp => {
                if (transactionList.length === 1) setTransactionList([]);
                setMsg('Transaction Deleted Successfully');
                setAskMovements(false);
                setMsgEmptyList('');

            }))
        } catch (e) { console.log(e); }
        callMovements();

    }

    const catchElemToEdit = async (id_transaction) => {


        try {
            await Axios.post("http://localhost:3001/transactions/getTransactionsById", { id_transaction }).then((resp => {

                setAmount(resp.data[0].amount);
                setConcept(resp.data[0].concept);
                setTransactionDate(moment(resp.data[0].trans_date).format("YYYY-MM-DD"));
                setCategory(resp.data[0].category);
                setTypeOfMovement(resp.data[0].type_movement);
                setIdTransactionToEdit(id_transaction);
                setAskMovements(false);
                setEditMode(true);
                setMsgEmptyList('');

            }));
        } catch (e) { console.log(e) };

    }

    const editTransaction = async (e) => {
        e.preventDefault();

        const transactionEdited = {
            amount: amount,
            concept: concept,
            trans_date: transactionDate,
            category: category,
            type_movement: typeOfMovement,
            id_transaction: idTransctionToEdit
        }

        try {
            await Axios.patch("http://localhost:3001/transactions/editTransactcion", transactionEdited).then((resp => {
                setAmount('');
                setConcept('');
                setTransactionDate('');
                setCategory('');
                setTypeOfMovement('');
                setIdTransactionToEdit('')
                setEditMode(false);
                setMsg('Transaction Edited Successfully')
                setMsgEmptyList('');


            }))
        } catch (e) { console.log(e); }
        callMovements();
    }

    const foundCategories = async (e) => {
        e.preventDefault();


        try {
            const resp = await Axios.post("http://localhost:3001/transactions/foundTransactionsByCategory", { id_user: loggedUser.id, category: selectedCategory }).then(resp => {
                if (resp.data === 'Empty list') {
                    setMsgEmptyList(resp.data);
                }
                else {
                    setTransactionList(resp.data);
                    setMsgEmptyList('');
                }
            })
        } catch (e) { console.log(e); }

    }

    const backToAdd = (e) => {
        e.preventDefault();

        setAmount('');
        setConcept('');
        setTransactionDate('');
        setIdTransactionToEdit('');
        setCategory(CATEGORY_OPTIONS[0].value);
        setTypeOfMovement(TYPE_OF_MOVEMENTS_OPTIONS[0].value);
        setAskMovements(true);

        setEditMode(false);
        setMsgEmptyList('');

    }

    const totalAmount =  async () => {

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
            }))}catch(e){ console.log(e)};


            resp = totalDeposit - totalExtractions;
            
            setTotalAm(resp);

        }

    return (
            <div className="container d-flex justify-content-center mt-5">

                <div className="row">

                    <div className="col d-flex flex-column flex-md-row">

                        <div className="col mx-2 mt-4 mt-md-0">

                            <form onSubmit={editMode ? editTransaction : addTransaction} className="form-group">

                                {
                                    editMode ?
                                        (
                                            <h2 className="text-center">Edit Transaction</h2>

                                        )
                                        :
                                        (
                                            <h2 className="text-center">Add Transaction</h2>
                                        )
                                }

                                <div className="container mt-2">
                                    <label>Amount</label>
                                    <input className="form-control mb-3" required type="number" min = '0'  onChange={(e) => setAmount(e.target.value)} value={amount} />
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
                                        editMode ?
                                            (
                                                <select className=" form-control block mt-1" onChange={(e) => setCategory(e.target.value)} required value={category} >
                                                    {
                                                        CATEGORY_OPTIONS.map((o, i) => (
                                                            <option key={i} value={o.value}>{o.label}</option>
                                                        ))
                                                    }
                                                </select>)
                                            :
                                            (
                                                <select className=" form-control block mt-1" onChange={(e) => setCategory(e.target.value)} required value={category} >
                                                    {
                                                        CATEGORY_OPTIONS.map((o, i) => (
                                                            <option key={i} value={o.value}>{o.label}</option>
                                                        ))
                                                    }
                                                </select>
                                            )
                                    }
                                </div>

                                <div className="container">
                                    <label >Type of Movement</label>
                                    {
                                        editMode ?
                                            (
                                                <h2>{typeOfMovement}</h2>
                                            )
                                            :
                                            (
                                                <select className=" form-control block mt-1" onChange={(e) => setTypeOfMovement(e.target.value)} required value={typeOfMovement} >
                                                    {
                                                        TYPE_OF_MOVEMENTS_OPTIONS.map((o, i) => (
                                                            <option key={i} value={o.value}>{o.label}</option>
                                                        ))
                                                    }
                                                </select>
                                            )
                                    }
                                </div>

                                <input className="form-control btn btn-success btn-block mt-3" type="submit" value={editMode ? ('Edit') : ('Add transaction')} />
                                {
                                    !editMode ?
                                        (
                                            <button onClick={callMovements} className="form-control btn btn-info btn-block mt-3">Check last transactions</button>
                                        )
                                        :
                                        (
                                            <button onClick={backToAdd} className="form-control btn btn-info btn-block mt-3">Back</button>
                                        )
                                }
                            </form>
                            {
                                msg ?
                                (
                                    <h5 className = "d-flex justify-content-center">{msg}</h5>
                                )
                                :
                                (
                                    <span></span>
                                )
                            }
                        </div>
                    </div>
                    <div className="col d-flex flex-column flex-md-row mt-3 ">

                        {
                            askMovements !== false ?
                                (
                                    <div className="container">
                                        <div className="d-flex ">
                                            <b className="flex-wrap"> List of Transactions</b>

                                            <div className="container justify-content-end d-flex">
                                                <b >Filter By: </b>
                                                <select className=" form-control block mt-1" onChange={(e) => setSelectedCategory(e.target.value)} required >
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
                                                                        <button onClick={(id) => (catchElemToEdit(e.id_transaction))} className="btn btn-primary btn-block mx-2">Edit</button>
                                                                        <button onClick={(id) => (deleteTransaction(e.id_transaction))} className="btn btn-danger btn-block">Delete</button>
                                                                    </div>
                                                                </tr>
        
                                                            ))

                                                    )
                                                    :
                                                    (
                                                        <span></span>
                                                    )

                                                }
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colspan = "3" >Total Amount</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td><p>{totalAm}</p></td>

                                                </tr>
                                            </tfoot>
                                        </table>
                                        {
                                            msgEmptyList ?
                                            (
                                                <h5 className = "d-flex justify-content-center">{msgEmptyList}</h5>

                                            )
                                            :
                                            (
                                                <span/>
                                            )
                                        }
                                    </div>
                                )
                                :
                                (
                                    <span></span>
                                )
                        }
                    </div>

                </div >
            </div >
        )
    }

    export default Transactions;
