import { put, call, takeLatest } from 'redux-saga/effects'
import * as rest from '../../rest'
import {
  receiveDatasets,
  requestDatasetsByText,
  requestDatasetsByFields,
  requestDatasetById,
  requestToggleEditable,
  receiveDataset,
  SEARCH_DATASETS_BY_TEXT,
  SEARCH_DATASETS_BY_FIELDS,
  LOAD_DATASET_BY_ID,
  TOGGLE_EDITABLE
} from '../../redux/ducks/datasets.js'

export function* searchDatasetsByText(action) {
  try {
    yield put( requestDatasetsByText() )
    const searchResult = yield call(rest.searchByText, action.payload.terms)
    yield put( receiveDatasets(searchResult) )
  }
  catch(error) {
    yield put( requestDatasetsByText(error) )
  }
}

export function* watchSearchDatasetsByText() {
  yield takeLatest(SEARCH_DATASETS_BY_TEXT, searchDatasetsByText)
}


export function* fetchDatasetById(action) {
  try {
    yield put( requestDatasetById(action.payload.id) )
    const dataset = yield call(rest.fetchDatasetById, action.payload.id)
    yield put( receiveDataset(dataset) )
  }
  catch(error) {
    yield put( requestDatasetById(error) )
  }
}

export function* watchLoadDatasetById() {
  yield takeLatest(LOAD_DATASET_BY_ID, fetchDatasetById)
}

export function* searchDatasetsByFields(action) {
  try {
    yield put( requestDatasetsByFields() )
    const {title, authors, atomicSpecies, slug} = action.payload;
    const searchResult = yield call(rest.searchByFields,
      title, authors, atomicSpecies, slug)
    yield put( receiveDatasets(searchResult) )
  }
  catch(error) {
    yield put( requestDatasetsByFields(error) )
  }
}

export function* watchSearchDatasetsByFields() {
  yield takeLatest(SEARCH_DATASETS_BY_FIELDS, searchDatasetsByFields)
}

function* toggleEditable(action) {
  try {
    const {id, editable} = action.payload;
    let dataSet = yield call(rest.updateDataSet, id, {editable});
    yield put( receiveDataset(dataSet) );
  } catch (error) {
    yield put( requestToggleEditable(error) )
  }
}

export function* watchToggleEditable() {
  yield takeLatest(TOGGLE_EDITABLE, toggleEditable);
}
