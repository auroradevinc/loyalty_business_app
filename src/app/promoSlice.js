// Base Import for Actions & Reducers
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';

const initialState = {

  isPromoExtractingFromDB: false,       // Loading variable for extracting/getting promo info. from db
  hasPromoExtractedFromDB: false,       // True when operation is successful
  hasPromoExtractingFromDBError: false, // True when operation is unsuccessful
  extractingPromoFromDBError: null,     // Store the error of the operation

  isAllPromoExtractingFromDB: false,       // Loading variable for extracting/getting promo info. from db
  hasAllPromoExtractedFromDB: false,       // True when operation is successful
  hasAllPromoExtractingFromDBError: false, // True when operation is unsuccessful
  extractingAllPromoFromDBError: null,     // Store the error of the operation

  isPromoOnScanExtractingFromDB: false,       // Loading variable for extracting/getting promo info. from db
  hasPromoOnScanExtractedFromDB: false,       // True when operation is successful
  hasPromoOnScanExtractingFromDBError: false, // True when operation is unsuccessful
  extractingPromoOnScanFromDBError: null,     // Store the error of the operation

  promo: {},
  promoOnScan: {},
  allPromo: {}
};

// Async Functions
export const getPromoFromDB = createAsyncThunk(
  'getPromoFromDB',
  async (param) => {
    console.log("promoSlice: getPromoFromDB");
    try {
      let id = param.card.id;
      let authHeaders = {
        'Authorization': param.session.jwtToken
      }
      const res = await axios.get(`${process.env.REACT_APP_AWS_API_GATEWAY}/get-customer-promo-info?authorizer=${process.env.REACT_APP_AWS_API_KEY}&card_id=${id}`, {headers: authHeaders});
      
      if(res.data.type === "error") { return { message: "customer promo on scan not extracted from db", type: "error", data: null}; }
      if(res.data.type === "success") { 
        let promos = modifyPromos(res.data.data.promo);
        return { message: "customer promo on scan extracted from db", type: "success", data: promos }; 
      }
    }
    catch (err){
      return { message: err.message, type: "error", data: null };
    }
  }
);

export const getAllPromoFromDB = createAsyncThunk(
  'getAllPromoFromDB',
  async (param) => {
    console.log("promoSlice: getAllPromoFromDB");
    try {
      let limit = param.promo.limit;
      let authHeaders = {
        'Authorization': param.session.jwtToken
      }
      const res = await axios.get(`${process.env.REACT_APP_AWS_API_GATEWAY}/get-all-promo-info?authorizer=${process.env.REACT_APP_AWS_API_KEY}&limit=${limit}`, {headers: authHeaders});
      
      if(res.data.type === "error") { return { message: "promo not extracted from db", type: "error", data: null}; }
      if(res.data.type === "success") { return { message: "promo extracted from db", type: "success", data: res.data.data.promo }; }
    }
    catch (err){
      return { message: err.message, type: "error", data: null };
    }
  }
);

export const getPromoOnScanFromDB = createAsyncThunk(
  'getPromoOnScanFromDB',
  async (param) => {
    console.log("promoSlice: getPromoOnScanFromDB");
    try {
      let card_id = param.card.id;
      let card_cvc = param.card.cvc;
      let bus_id = param.business.id;
      const res = await axios.get(`${process.env.REACT_APP_AWS_API_GATEWAY}/get-customer-promo-info-on-scan?authorizer=${process.env.REACT_APP_AWS_API_KEY}&card_id=${card_id}&card_cvc=${card_cvc}&bus_id=${bus_id}`);

      if(res.data.type === "error") { return { message: "customer promo on scan not extracted from db", type: "error", data: null }; }
      if(res.data.type === "success"){ 
        let promos = modifyPromos(res.data.data.promo);
        return { message: "customer promo on scan extracted from db", type: "success", data: promos }; 
      }
    }
    catch (err){
      return { message: err.message, type: "error", data: null };
    }
  }
);

export const promoSlice = createSlice({

  name: 'promo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // getPromoFromDB
    builder.addCase(getPromoFromDB.pending, (state, action) => {
      console.log("promoSlice: getPromoFromDB Requested");
      console.log('\t Request Pending', action);
      state.isPromoExtractingFromDB = true;
      state.hasPromoExtractedFromDB = false;       
      state.hasPromoExtractingFromDBError = false; 
      state.extractingPromoFromDBError = null;
    });
    builder.addCase(getPromoFromDB.fulfilled, (state, action) => {
      console.log('\t Request Fulfilled', action);
      if(action.payload.type === 'error'){ 
        state.isPromoExtractingFromDB = false;       
        state.hasPromoExtractedFromDB = false;       
        state.hasPromoExtractingFromDBError = true; 
        state.extractingPromoFromDBError = action.payload.message;
      } else {
        state.promo = action.payload.data;

        state.isPromoExtractingFromDB = false;       
        state.hasPromoExtractedFromDB = true;       
        state.hasPromoExtractingFromDBError = false; 
        state.extractingPromoFromDBError = null;
      }
    });
    builder.addCase(getPromoFromDB.rejected, (state, action) => {
      console.log('\t Request Rejected', action);
      state.isPromoExtractingFromDB = false;       
      state.hasPromoExtractedFromDB = false;       
      state.hasPromoExtractingFromDBError = true; 
      state.extractingPromoFromDBError = action.payload.message;
    });

    // getAllPromoFromDB
    builder.addCase(getAllPromoFromDB.pending, (state, action) => {
      console.log("promoSlice: getAllPromoFromDB Requested");
      console.log('\t Request Pending', action);
      state.isAllPromoExtractingFromDB = true;
      state.hasAllPromoExtractedFromDB = false;       
      state.hasAllPromoExtractingFromDBError = false; 
      state.extractingAllPromoFromDBError = null;
    });
    builder.addCase(getAllPromoFromDB.fulfilled, (state, action) => {
      console.log('\t Request Fulfilled', action);
      if(action.payload.type === 'error'){ 
        state.isAllPromoExtractingFromDB = false;       
        state.hasAllPromoExtractedFromDB = false;       
        state.hasAllPromoExtractingFromDBError = true; 
        state.extractingAllPromoFromDBError = action.payload.message;
      } else {
        state.allPromo = action.payload.data;

        state.isAllPromoExtractingFromDB = false;       
        state.hasAllPromoExtractedFromDB = true;       
        state.hasAllPromoExtractingFromDBError = false; 
        state.extractingAllPromoFromDBError = null;
      }
    });
    builder.addCase(getAllPromoFromDB.rejected, (state, action) => {
      console.log('\t Request Rejected', action);
      state.isAllPromoExtractingFromDB = false;       
      state.hasAllPromoExtractedFromDB = false;       
      state.hasAllPromoExtractingFromDBError = true; 
      state.extractingAllPromoFromDBError = action.payload.message;
    });

    // getPromoOnScanFromDB
    builder.addCase(getPromoOnScanFromDB.pending, (state, action) => {
      console.log("promoSlice: getPromoFromDB Requested");
      console.log('\t Request Pending', action);
      state.isExtractingPromoOnScanFromDB = true;
    });
    builder.addCase(getPromoOnScanFromDB.fulfilled, (state, action) => {
      console.log('\t Request Fulfilled', action);
      if(action.payload.type === 'error'){ 
        state.promoOnScan = {};
        state.isExtractingPromoOnScanFromDB = false;       
        state.hasExtractedPromoOnScanFromDB = false;       
        state.hasExtractingPromoOnScanFromDBError = true; 
        state.extractingPromoOnScanFromDBError = action.payload.message;
      } else {
        state.promoOnScan = action.payload.data;

        state.isExtractingPromoOnScanFromDB = false;       
        state.hasExtractedPromoOnScanFromDB = true;       
        state.hasExtractingPromoOnScanFromDBError = false; 
        state.extractingPromoOnScanFromDBError = null;
      }
    });
    builder.addCase(getPromoOnScanFromDB.rejected, (state, action) => {
      console.log('\t Request Rejected', action);
      state.promoOnScan = {};
      state.isExtractingPromoOnScanFromDB = false;       
      state.hasExtractedPromoOnScanFromDB = false;       
      state.hasExtractingPromoOnScanFromDBError = true; 
      state.extractingPromoOnScanFromDBError = action.payload.message;
    });
  }
});

export const promoStore = (state) => state.promo;
export const { } = promoSlice.actions;
export default promoSlice.reducer;


// Helper Functions
function dateOrdinal(d) {
  // To convert 01 to just 1
  let dateNum = parseInt(d);
  let dateString = String(dateNum);
  d = dateString;
  return d+(31==d||21==d||1==d?"st":22==d||2==d?"nd":23==d||3==d?"rd":"th")
};

function modifyPromos(promos) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  Object.entries(promos).forEach((promo) => { // custom_promo & all_promo
    promo[1].forEach((promoInfo, index) => { // promoInfo of each promo in custom_promo and all_promo
      // Covert To CamelCase
      promoInfo.client_name = promoInfo.client_name.toLowerCase().split(' ').map(elem => elem[0].toUpperCase()+ elem.slice(1)).join(' ');
      promoInfo.bus_name = promoInfo.bus_name.toLowerCase().split(' ').map(elem => elem[0].toUpperCase()+ elem.slice(1)).join(' ');
      promoInfo['bus_image'] = './business-logos/' + promoInfo.bus_name.toUpperCase().replaceAll(' ', '_').replaceAll('+', 'PLUS') + '.png';
      promoInfo.promo_image = './business-promos/' + promoInfo.promo_name.replaceAll(/%/g, '_PERCENT').replaceAll(/\$/g, 'DOLLAR_') + '.png';
      promoInfo.promo_name = promoInfo.promo_name.toLowerCase().split('_').map(elem => elem[0].toUpperCase()+ elem.slice(1)).join(' ');
      //promoInfo.promo_name = promoInfo.promo_name.split('_').join(' ');

      let date_from = (promoInfo.date_valid_from) ? promoInfo.date_valid_from.split('-') : null;
      let date_to = (promoInfo.date_valid_to) ? promoInfo.date_valid_to.split('-') : null;
      let date_from_month = (date_from) ? monthNames[date_from[1]-1] : null;
      let date_to_month = (date_to) ? monthNames[date_to[1]-1] : null;
      if(date_from_month === date_to_month){
        promoInfo['date_validity_simplified'] = `${date_from_month}, ${dateOrdinal(date_from[2])} - ${dateOrdinal(date_to[2])}`;
      }
      else if(!date_to_month) {
        promoInfo['date_validity_simplified'] = `${date_from_month}, ${dateOrdinal(date_from[2])}`;
      }
      else {
        promoInfo['date_valid_from_simplified'] = `${date_from_month}, ${dateOrdinal(date_from[2])}`;
        promoInfo['date_valid_to_simplified'] = `${date_to_month}, ${dateOrdinal(date_to[2])}`;
      }
    })
  });
  return promos;
}
