const express = require('express');
const sql = require('../database')
const router = express.Router();
const uniqId = require('uniqid');

const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const { key } = require('../utilities');
