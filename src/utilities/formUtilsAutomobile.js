import React, { useState, useEffect } from 'react';
import { ErrorMessage } from 'formik'
import moment from 'moment'
import DatePicker from "react-datepicker";
import NumberFormat from 'react-number-format';
import { isObject, startCase, toLower, get } from "lodash";
import { Form, Radio, Input, Label, Dropdown, TextArea, Dimmer, Loader, Icon } from 'semantic-ui-react';
import "react-datepicker/dist/react-datepicker.css";
import { checkValidDateFormats, getDateInYYYYMMDD, setYear } from './dateUtils'
import { debounce } from 'lodash'


export function getValueFromEvent(e) {
  const { target } = e;
  let newValues;
  if (target) {
    const value = (target.type === "checkbox") ? target.checked : target.value;
    newValues = { [target.name]: value }
  }
  else if (isObject(e)) { newValues = e; }
  return newValues;
}


export const FormikInputComponent = ({
  validateInput, isLabel, label, isTxn, placeholder, getValOnBlur, focus, callajax,readOnly,addBelowLabel, className, callUseState, listobj, isMandatory, setFieldValueM, boxwidth, getIndex,
  field, // { name, value, onChange, onBlur }
  index,
  form: { touched, errors, values, handleChange, setFieldValue, submitCount }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  let manValue = setFieldValueM && setFieldValueM !== null && setFieldValueM !== undefined ? setFieldValueM : ""
  useEffect(() => {
    if(setFieldValueM && setFieldValueM !== null && setFieldValueM !== undefined && setFieldValueM !== ""){
      setFieldValue(field.name, manValue)
    }else if(setFieldValueM && setFieldValueM === ""){
      setFieldValue(field.name, '')
    }
  }, [manValue])
  return(
    // <Form.Field error={errors[field.name] && touched[field.name]}>
    <Form.Field error={get(errors,field.name) && get(touched,field.name)} validate={validateInput ? debounce(validateInput, 1000) : ""}>
      {errors[field.name] && touched[field.name] && !isTxn ?
        <label>{errors[field.name]}</label> :
        <label>{isLabel ? null : label ? label: startCase(toLower(field.name))}{isMandatory ? <font color="red"> * </font> : null}</label>}
      <Input name={field.name}
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        value={field.value}
        autoFocus={focus ? focus : false}
        readOnly={readOnly ? readOnly : false}
        tabIndex={readOnly === true ? -1 : 0}
        className={className ? className : ""}
        style={{textAlign: "left", width: boxwidth ? boxwidth : '100%'}}
        onBlur={(e) =>{
          if (callajax){ callajax(values, index, setFieldValue, callUseState, listobj, field.value, getIndex) }
          if(getValOnBlur) {getValOnBlur(field.value, values, setFieldValue)}
        }}
      />
       {addBelowLabel ? <label style={{color: 'red'}}>{addBelowLabel}</label> : null}
      {isTxn ? <ErrorMessage name={field.name} render= { msg => <Label size="mini" color='red' basic pointing prompt>{msg}</Label> }/>: null }
    </Form.Field>
  )};

export const FormikDateComponent = ({
  isLabel, label, placeholder, width, focus, userProps, isTxn, zIndex, isMandatory, setFieldValueM,callOnBlur,readOnly,className,setDateOnBlur,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, values, handleChange, setFieldValue, dirty }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  
const [dt, setDt] = useState(field.value ? moment(field.value).toDate() : null)

const manDate = userProps && userProps.setFieldManually !== undefined && userProps.setFieldManually !== "" ? userProps.setFieldManually : ""
let rawEvent = ''
const datePickerRef = React.useRef();
const date = new Date()
const todayDate = moment(date).format("DD-MM-YYYY")
const handleDateChange = (e) => {
  if (rawEvent.type !== 'change'){
      setDt(e)
      const dt = moment(e)
      handleChange(dt.format("YYYY-MM-DD"))
      console.log(dt.format("YYYY-MM-DD"), "=============================dt.format(YYYY-MM-DD)")
      setFieldValue(field.name, dt.format("YYYY-MM-DD"))
  }
}

useEffect(() => {
  if(userProps && userProps.setFieldManually !== undefined && userProps.setFieldManually !== ""){
    setFieldValue(field.name, getDateInYYYYMMDD(userProps.setFieldManually))
    setDt(moment(getDateInYYYYMMDD(userProps.setFieldManually)).toDate()) 
  }
}, [manDate])

let manValue = setFieldValueM && setFieldValueM !== null && setFieldValueM !== undefined ? setFieldValueM : ""
  useEffect(() => {
    if(setFieldValueM && setFieldValueM !== null && setFieldValueM !== undefined && setFieldValueM !== ""){
      setFieldValue(field.name, setFieldValueM)
      setDt(moment(setFieldValueM).toDate()) 
    }else if(setFieldValueM && setFieldValueM === ""){
      setFieldValue(field.name, '')
      setDt('') 
    }
  }, [manValue])

const handleChangeRawEvent = (event) => {
  rawEvent = event
  const dt1 = checkValidDateFormats(event.target.value)
  if(dt1){
    handleChange(dt1)
    setFieldValue(field.name, getDateInYYYYMMDD(dt1))
    setDt(moment(getDateInYYYYMMDD(dt1)).toDate())
  }else{
    handleChange("")
    setFieldValue(field.name, "")
    setDt("")
  }
}

const handleBlurRawEvent = (event) => {
  const dt1 = checkValidDateFormats(event.target.value)
  if(dt1){
    const getValue = setYear(dt1.split("-")[0], dt1.split("-")[1], dt1.split("-")[2])
    handleChange(getValue)
    setFieldValue(field.name, getDateInYYYYMMDD(getValue))
    setDt(moment(getDateInYYYYMMDD(getValue)).toDate())
    if(setDateOnBlur){
      setDateOnBlur(moment(dt).format("YYYY-MM-DD"))
    }
    if(callOnBlur){
      callOnBlur(getValue,values,setFieldValue)
    }
  }else{
    handleChange("")
    setFieldValue(field.name, getDateInYYYYMMDD(todayDate))
    setDt(moment(getDateInYYYYMMDD(todayDate)).toDate())
  }
}
const handleclick = (e) => {
  datePickerRef.current.setFocus()
}
return (
  // <Form.Field error={errors[field.name] && touched[field.name]}>
    <Form.Field style={{width: width ? width : null , zIndex: zIndex ? zIndex : null}} error={get(errors,field.name) && get(touched,field.name)}>
      {errors[field.name] && touched[field.name] && !isTxn ?
        <label>{errors[field.name]}</label> :
      <label>{isLabel ? null : label ? label: startCase(toLower(field.name))}{isMandatory ? <font color="red"> * </font> : null}</label>}
      <div style={{ position: "relative" }}>
      <DatePicker
        name={field.name}
        placeholderText={placeholder}
        dateFormat="dd-MM-yyyy"
        scrollableYearDropdown
        selected={field.value ? dt : null}
        onChange={handleDateChange}
        onChangeRaw={e=> handleChangeRawEvent(e)}
        autoComplete='off'
        autoFocus={focus ? focus : false}
        onBlur={(e) => handleBlurRawEvent(e)}
        ref={datePickerRef}
        readOnly={readOnly ? readOnly : null}
        className={className? className: null}
      />
         <Icon
          className="customDatePickerIcon custom-input-DateIcon"
          name="calendar"
          onClick={(e) => handleclick(e)}
        ></Icon>
      </div>
      {isTxn ? <ErrorMessage name={field.name} render= { msg => <Label size="mini" color='red' basic pointing prompt>{msg}</Label> }/>: null }
    </Form.Field>
)};

export const FormikMonthYearComponent = ({
  isLabel, label, placeholder, width, focus, userProps, isTxn, isMandatory,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, values, handleChange, setFieldValue, dirty }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const handleDateChange = (date) => {
    setDt(date)
    setFieldValue(field.name, moment(date).format("MM/YYYY"))
  }
  // console.log("field.value========="+field.value)
  const [dt, setDt] = useState(field.value ? field.value !== "" ? moment(field.value.split("/")[0]+"/01/"+field.value.split("/")[1]).toDate(): null : null)
  return (
    <Form.Field width={width ? width : null} error={get(errors,field.name) && get(touched,field.name)}>
      {errors[field.name] && touched[field.name] && !isTxn ?
        <label>{errors[field.name]}</label> :
        <label>{isLabel ? null : label ? label: startCase(toLower(field.name))}{isMandatory ? <font color="red"> * </font> : null}</label>}
        <DatePicker
          selected={dt}
          placeholderText={placeholder}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          name={field.name}
          onChange={(date) => handleDateChange(date)}
        />
        {isTxn ? <ErrorMessage name={field.name} render= { msg => <Label size="mini" color='red' basic pointing prompt>{msg}</Label> }/>: null }
      </Form.Field>
)};

export const FormikAmountComponent = ({
  isLabel, label, saveOnBlur, decimal, compute, onValChange, computeTwo, isTxn, path, placeholder, focus, setValue, disabled, setStateValue, boxwidth, id, validationCheck, validationFor, isMandatory,
  field, // { name, value, onChange, onBlur }
  index,
  form: { touched, errors, values, handleSubmit, handleBlur, setFieldValue, submitCount }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) =>  {

  useEffect(() => {
    if(setValue !== undefined && setValue !== "" && setValue !== 0){
      setFieldValue(field.name, setValue)
    }else{
      if(setValue !== undefined && setValue !== ""){
        setFieldValue(field.name, setValue ? setValue : null)
      }
    }
  }, [setValue])

  const setValueChange = (setFieldValue, val, index) => {
    setFieldValue(field.name, (val !== undefined && val !== "" ? val : ""))
    if(setStateValue){
      setStateValue(val !== undefined && val !== "" ? val : 0)
    }
    if(onValChange){
      onValChange(setFieldValue, val, index)
    }
  }

  return(
    // <Form.Field error={errors[field.name] && touched[field.name]}>
    <Form.Field error={get(errors,field.name) && get(touched,field.name)}>
      {errors[field.name] && touched[field.name] && !isTxn ?
        <label>{errors[field.name]}</label> :
        <label>{isLabel ? null : label ? label: startCase(toLower(field.name))}{isMandatory ? <font color="red"> * </font> : null}</label>}
        
      <NumberFormat 
        thousandSeparator={true} 
        thousandsGroupStyle="lakh"
        decimalScale = {(decimal) ? decimal : 2 }
        placeholder={placeholder}
        name={field.name}
        value={field.value}
        onValueChange={(val) => setValueChange(setFieldValue, val.floatValue, index)}
        autoFocus={focus ? focus : false}
        disabled = {disabled ? disabled : false}
        id= {id ? id : null}
        style={{textAlign: "", width: boxwidth ? boxwidth : '100%'}}
        onBlur={(e) =>{
          // e.persist()
          // handleBlur(e)
          if (compute){ compute(values, index, setFieldValue) }
          if (computeTwo){ computeTwo(values, index, setFieldValue) }
          if (saveOnBlur){ saveOnBlur(values, index, setFieldValue) }
          if (validationCheck){ validationCheck(values, index, setFieldValue, validationFor) }
        }}
      />
      {isTxn ? <ErrorMessage name={field.name} render= { msg => <Label size="mini" color='red' basic pointing prompt>{msg}</Label> }/>: null }
    </Form.Field>
  )
}


export const FormikCheckBoxComponent = ({
  userProps, focus,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, values, handleChange, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => (
    // <Form.Field error={errors[field.name] && touched[field.name]}>
    <Form.Field error={get(errors,field.name) && get(touched,field.name)}>
      <Radio
      name={field.name}
      id={userProps.id}
      value={userProps.id}
      checked={userProps.id === field.value}
      onChange={field.onChange}
      autoFocus={focus ? focus : false}
    />
      <label>{userProps.id}</label>
      {/* {errors[field.name] && touched[field.name] ?
        <label>{errors[field.name]}</label> :
        <label>{userProps.isLabel ? null : startCase(toLower(field.name))}</label>} */}
    </Form.Field>
  );  

export const FormikSelectComponent = ({
  userProps, isLabel, label, isTxn, isSelection, focus, width,zIndex, compute, clearable, isMandatory, className, defaultValue,
  index,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, values, handleChange, setFieldValue, submitCount }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {

const onChange = (value) => {
  // console.log("value", value)
  setFieldValue(field.name, value)
  if (userProps.getValue)
    userProps.getValue(value , values, setFieldValue);
    
}

return (
  // <Form.Field error={errors[field.name] && touched[field.name]}>
  <Form.Field error={get(errors,field.name) && get(touched,field.name)} style={{width: width ? width : null, zIndex: zIndex ? zIndex : null}}>
    {errors[field.name ? field.name : ''] && touched[field.name ? field.name : ''] && !isTxn ?
      <label>{errors[field.name]}</label> :
      <label>{isLabel ? null : label ? label: startCase(toLower(field.name))}{isMandatory ? <font color="red"> * </font> : null}</label>}
    <Dropdown
      search
      selection={isSelection ? true : false}
      id={field.id ? field.id : ''}
      name={field.name ? field.name : ''}
      placeholder={userProps.placeholder}
      options={userProps.options}
      value={userProps ? userProps.isLowerCaseEnable ? toLower(field.value) : field.value : field.value}
      onChange={(e, { value }) => onChange(value)}
      autoFocus={focus ? focus : false}
      onBlur={(e) =>{
        // e.persist()
        // handleBlur(e)
        if (compute){ compute(values, index, setFieldValue) }
      }}
      // defaultValue={defaultValue ? defaultValue : field.value}
      className={className ? className : ""}
      clearable
      disabled={userProps ? userProps.isDisable ? userProps.isDisable : null : null}
      />     
    {isTxn ? <ErrorMessage name={field.name} render= { msg => <Label size="mini" color='red' basic pointing prompt>{msg}</Label> }/>: null }
    </Form.Field>
)};  


export const FormikSelectNotClearableComponent = ({
  userProps, isLabel, label, isTxn, isSelection, focus, width, compute, clearable, isMandatory, zIndex, className,
  index,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, values, handleChange, setFieldValue, submitCount }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {

const onChange = (value) => {
  // console.log("value", value)
  setFieldValue(field.name, value)
  if (userProps.getValue)
    userProps.getValue(value);
    
}

return (
  // <Form.Field error={errors[field.name] && touched[field.name]}>
  <Form.Field error={get(errors,field.name) && get(touched,field.name)} style={{width: width ? width : null, zIndex: zIndex ? zIndex : null}}>
    {errors[field.name] && touched[field.name] && !isTxn ?
      <label>{errors[field.name]}</label> :
      <label>{isLabel ? null : label ? label: startCase(toLower(field.name))}{isMandatory ? <font color="red"> * </font> : null}</label>}
    <Dropdown
      search
      selection={isSelection ? true : false}
      id={field.id}
      name={field.name}
      placeholder={userProps.placeholder}
      options={userProps.options}
      value={userProps ? userProps.isLowerCaseEnable ? toLower(field.value) : field.value : field.value}
      onChange={(e, { value }) => onChange(value)}
      autoFocus={focus ? focus : false}
      onBlur={(e) =>{
        // e.persist()
        // handleBlur(e)
        if (compute){ compute(values, index, setFieldValue) }
      }}
      disabled={userProps ? userProps.isDisable ? userProps.isDisable : null : null}
      className={className ? className : ""}
      />     
    {isTxn ? <ErrorMessage name={field.name} render= { msg => <Label size="mini" color='red' basic pointing prompt>{msg}</Label> }/>: null }
    </Form.Field>
)};  

export const FormikAsyncSelectComponent = ({
  userProps, isLabel, label, isTxn, isSelection, placeholder,focus, width,height,setvalue,zIndex,appendLabel,addBelowLabel, appendLabelText, className, isFetching, isMandatory, displayLink, Link, clickFunc, linkColor,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, values, handleChange, setFieldValue, submitCount }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {

  const onChange = (value) => {
    //  console.log('onChange', value);
    setFieldValue(field.name, value)
    if (userProps.getValue)
      userProps.getValue(value,setFieldValue, values);
  }

  const [searchStr, setSearchStr] = useState('');
  const loadOptions = (searchQuery) => {
      // console.log(searchQuery)
      userProps.getInputValue(searchQuery, setFieldValue, values);
      setSearchStr(searchQuery)
  }
  useEffect(() => {
    if (setvalue) {
      setFieldValue(field.name, setvalue)
    }
  }, [setvalue])

  return (

    // <Form.Field error={errors[field.name] && touched[field.name]}>{appendLabel ? className : ""}
    <Form.Field style={{width: width ? width : null, zIndex: zIndex ? zIndex : null, height: height ? height : ""}} className="goRelative" error={get(errors,field.name) && get(touched,field.name)}>
      {/* {console.log("displayLink============", displayLink)}
      {console.log("link============", Link)} */}
      {errors[field.name] && touched[field.name] && !isTxn ?
        <label style={{float: 'left'}}>{errors[field.name]}</label> :
        <label style={{float: 'left'}}>{isLabel ? null : label ? label: startCase(toLower(field.name))}{isMandatory ? <font color="red"> * </font> : null}</label>}
      {(displayLink === true) ? <label style={linkColor === "error" ? {float: 'right', cursor: 'pointer', color: 'red'} : {float: 'right', cursor: 'pointer'}} onClick={() => clickFunc(values)}>{Link}</label> : null}
      <Dropdown
        search
        selection={isSelection ? true : false}
        // selectOnNavigation={true}
        id={field.id}
        name={field.name}
        placeholder={placeholder ? placeholder : ""}
        options={userProps.searchOptions && userProps.searchOptions.length>0 ? userProps.searchOptions : userProps.options}
        value={field.value}
        onSearchChange={(e, { searchQuery }) => loadOptions(searchQuery)}
        onChange={(e, { value }) => onChange(value)}
        clearable
        searchInput={{ autoFocus: focus ? focus : false }}
        noResultsMessage={searchStr.length > 2 ? 'No Data Found' :  'Type 3 character to search Data'}
        className={className ? className : null}
        />
        {addBelowLabel ? <label style={{fontSize:"10px"}}>{addBelowLabel}</label> : null}
      {isTxn ? <ErrorMessage name={field.name} render= { msg => <Label size="mini" color='red' basic pointing prompt>{msg}</Label> }/>: null }
      {appendLabel ? isFetching  ? <Loader active size="mini" className="smallLoader"/> : <Label size="mini" className="noColorLabel">{appendLabelText}</Label> : null}
      </Form.Field>
  )
};  


export const FormikTextAreaComponent = ({
  userProps, isTxn, isLabel, label, className, isMandatory,textAreaCount,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, values, handleChange, handleBlur, setFieldValue, HeaderClick }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {

  const [ count, setCount ] = useState(0)

  const onChange = (syntheticEvent, value) => {
    setFieldValue(field.name, value.value)
    setCount(value.value.length)
    if(value.value !== ""){
      if (userProps.getValue)
        userProps.getValue(value.value);
    }else{
      if (userProps.getValue)
        userProps.getValue('');
    }
  }
  
  useEffect(() => {
    if(userProps && userProps.displayCount !== undefined && userProps.displayCount === true && field.value && field.value.length === 0){
      setCount(0)
    }else{
      if(field.value && field.value.length > 0){
        setCount(field.value.length)
      }else{
        setCount(0)
      }
    }
  }, [field.value])

  const height = userProps ? (userProps.height === undefined ? 3 : (userProps.height === '' ? 3 : userProps.height === 0 ? 3 : userProps.height)): 3;
  const isFloatLeft = userProps && userProps.displayCount !== undefined && userProps.displayCount === true ? 'left' : null
  return (
    <Form.Field error={get(errors,field.name) && get(touched,field.name)}>
      {errors[field.name] && touched[field.name] && !isTxn ?
        <label style={{float: isFloatLeft}}>{errors[field.name]}</label> :
        <label style={{float: isFloatLeft}}>{isLabel ? null : label ? label: startCase(toLower(field.name))}{isMandatory ? <font color="red"> * </font> : null}</label>}
      {userProps ? userProps.displayCount !== undefined && userProps.displayCount === true ?
          <label 
            style={{float: textAreaCount ? "" : 'right',
            marginLeft: textAreaCount ? textAreaCount : "",
            marginTop: textAreaCount ? "-5%" : "",  
            position: textAreaCount ? "absolute" : "",
            whiteSpace:"nowrap"
            }}
            >
          {count} / {userProps.maxLength}</label>
          : null: null}
        <TextArea
          name={field.name}
          style={{ 
              resize: 'none', 
              width: '100%'
          }}
          value={field.value}
          onChange={onChange}
          rows={height}
          className={className ? className : null}
          maxLength={userProps ? userProps.maxLength : null}
          placeholder={userProps ? userProps.getholder : null}>
        </TextArea>
        {isTxn ? <ErrorMessage name={field.name} render= { msg => <Label size="mini" color='red' basic pointing prompt>{msg}</Label> }/>: null }
      </Form.Field>
  )
};

export const FormikDisplayLabelComponent = ({
  validateInput, isLabel, label, isTxn, placeholder, focus, text,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, values, handleChange, submitCount }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => (
    // <Form.Field error={errors[field.name] && touched[field.name]}>
    <Form.Field error={get(errors,field.name) && get(touched,field.name)} validate={validateInput ? debounce(validateInput, 1000) : ""}>
      <label>{isLabel ? null : label ? label: startCase(toLower(field.name))}</label>
      <label className="AutoGenerate">{text}</label>
    </Form.Field>
  );

  export const FormikNumberComponent = ({
    isLabel, label, saveOnBlur, decimal, compute, isTxn, path, placeholder, focus, setValue, disabled, setStateValue, boxwidth, id, isMandatory,
    field, // { name, value, onChange, onBlur }
    index,
    form: { touched, errors, values, handleSubmit, handleBlur, setFieldValue, submitCount }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    ...props
  }) =>  {
  
    useEffect(() => {
      if(setValue !== undefined && setValue !== "" && setValue !== 0){
        setFieldValue(field.name, setValue)
      }else{
        if(setValue !== undefined && setValue !== ""){
          setFieldValue(field.name, setValue ? setValue : null)
        }
      }
    }, [setValue])
  
    const setValueChange = (setFieldValue, val) => {
      setFieldValue(field.name, val)
      if(setStateValue){
        setStateValue(val !== undefined && val !== "" ? val : 0)
      }
    }
  
    return(
      // <Form.Field error={errors[field.name] && touched[field.name]}>
      <Form.Field error={get(errors,field.name) && get(touched,field.name)}>
        {errors[field.name] && touched[field.name] && !isTxn ?
          <label>{errors[field.name]}</label> :
          <label>{isLabel ? null : label ? label: startCase(toLower(field.name))}{isMandatory ? <font color="red"> * </font> : null}</label>}
          
        <NumberFormat 
          thousandSeparator={false}
          decimalScale = {(decimal) ? decimal : 0 }
          placeholder={placeholder}
          name={field.name}
          value={field.value}
          onValueChange={(val) => setValueChange(setFieldValue, val.floatValue)}
          autoFocus={focus ? focus : false}
          disabled = {disabled ? disabled : false}
          id= {id ? id : null}
          style={{textAlign: "right", width: boxwidth ? boxwidth : '100%'}}
          onBlur={(e) =>{
            // e.persist()
            // handleBlur(e)
            if (compute){ compute(values, index, setFieldValue) }
            if (saveOnBlur){ saveOnBlur(values, index, setFieldValue) }
          }}
        />
        {isTxn ? <ErrorMessage name={field.name} render= { msg => <Label size="mini" color='red' basic pointing prompt>{msg}</Label> }/>: null }
      </Form.Field>
    )
  }

  export const FormikNumberReadOnlyComponent = ({
    isLabel, label, saveOnBlur, decimal, compute, isTxn, path, placeholder, focus, setValue, disabled, setStateValue, boxwidth, id, isMandatory,
    field, // { name, value, onChange, onBlur }
    index,
    form: { touched, errors, values, handleSubmit, handleBlur, setFieldValue, submitCount }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    ...props
  }) =>  {
  
    useEffect(() => {
      if(setValue !== undefined && setValue !== "" && setValue !== 0){
        setFieldValue(field.name, setValue)
      }else{
        if(setValue !== undefined && setValue !== ""){
          setFieldValue(field.name, setValue ? setValue : null)
        }
      }
    }, [setValue])
  
    const setValueChange = (setFieldValue, val) => {
      setFieldValue(field.name, val)
      if(setStateValue){
        setStateValue(val !== undefined && val !== "" ? val : 0)
      }
    }
  
    return(
      // <Form.Field error={errors[field.name] && touched[field.name]}>
      <Form.Field error={get(errors,field.name) && get(touched,field.name)}>
        {errors[field.name] && touched[field.name] && !isTxn ?
          <label>{errors[field.name]}</label> :
          <label>{isLabel ? null : label ? label: startCase(toLower(field.name))}{isMandatory ? <font color="red"> * </font> : null}</label>}
        <NumberFormat           
          thousandSeparator={true} 
          thousandsGroupStyle="lakh"
          decimalScale = {(decimal) ? decimal : 2 }
          placeholder={placeholder}
          name={field.name}
          value={field.value}
          onValueChange={(val) => setValueChange(setFieldValue, val.floatValue)}
          autoFocus={focus ? focus : false}
          disabled = {disabled ? disabled : false}
          id= {id ? id : null}
          style={{textAlign: "right", width: boxwidth ? boxwidth : '100%', backgroundColor: '#E8E8E8'}}
          readonly='true'
          tabIndex="-1"
          onBlur={(e) =>{
            // e.persist()
            // handleBlur(e)
            if (compute){ compute(values, index, setFieldValue) }
            if (saveOnBlur){ saveOnBlur(values, index, setFieldValue) }
          }}
        />
        {isTxn ? <ErrorMessage name={field.name} render= { msg => <Label size="mini" color='red' basic pointing prompt>{msg}</Label> }/>: null }
      </Form.Field>
    )
  }

  export const FormikBlankComponent = ({
    field, // { name, value, onChange, onBlur }
    index,
    form: { touched, errors, values, handleSubmit, handleBlur, setFieldValue, submitCount }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    ...props
  }) =>  {
  
    return(
      // <Form.Field error={errors[field.name] && touched[field.name]}>
      <Form.Field error={get(errors,field.name) && get(touched,field.name)}>
        
      </Form.Field>
    )
  }

  export const FormikInputDownLabelComponent = ({
    validateInput, isLabel, label, isTxn, placeholder, focus, callajax, fieldwidth, className, callUseState, listobj, isMandatory, setFieldValueM, boxwidth, getIndex,
    field, // { name, value, onChange, onBlur }
    index,
    form: { touched, errors, values, handleChange, setFieldValue, submitCount }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    ...props
  }) => {
    let manValue = setFieldValueM && setFieldValueM !== null && setFieldValueM !== undefined ? setFieldValueM : ""
    useEffect(() => {
      if(setFieldValueM && setFieldValueM !== null && setFieldValueM !== undefined && setFieldValueM !== ""){
        setFieldValue(field.name, manValue)
      }else if(setFieldValueM && setFieldValueM === ""){
        setFieldValue(field.name, '')
      }
    }, [manValue])
    return(
      // <Form.Field error={errors[field.name] && touched[field.name]}>
      <Form.Field style={{width : fieldwidth ? fieldwidth : ""}} error={get(errors,field.name) && get(touched,field.name)} validate={validateInput ? debounce(validateInput, 1000) : ""}>
        <Input name={field.name}
          type="text"
          placeholder={placeholder}
          onChange={handleChange}
          value={field.value}
          autoFocus={focus ? focus : false}
          style={{textAlign: "left", width: boxwidth ? boxwidth : '100%'}}
          className={className ? className : ""}
          onBlur={(e) =>{
            if (callajax){ callajax(values, index, setFieldValue, callUseState, listobj, field.value, getIndex) }
          }}
        />
        {errors[field.name] && touched[field.name] && !isTxn ?
          <label>{errors[field.name]}</label> :
          <label>{isLabel ? null : label ? label: startCase(toLower(field.name))}{isMandatory ? <font color="red"> * </font> : null}</label>}
        {isTxn ? <ErrorMessage name={field.name} render= { msg => <Label size="mini" color='red' basic pointing prompt>{msg}</Label> }/>: null }
      </Form.Field>
    )};

    export const FormikHiddenInputComponent = ({
      validateInput, isLabel, label, isTxn, placeholder, className, focus, maxlength, callajax, readOnly, callUseState, listobj, isMandatory, setFieldValueM, boxwidth, getIndex,
      field, // { name, value, onChange, onBlur }
      index,
      form: { touched, errors, values, handleChange, setFieldValue, submitCount }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
      ...props
    }) => {
      let manValue = setFieldValueM && setFieldValueM !== null && setFieldValueM !== undefined ? setFieldValueM : ""
      useEffect(() => {
        if (setFieldValueM && setFieldValueM !== null && setFieldValueM !== undefined && setFieldValueM !== "") {
          setFieldValue(field.name, manValue)
        } else if (setFieldValueM && setFieldValueM === "") {
          setFieldValue(field.name, '')
        }
      }, [manValue])
      return (
        // <Form.Field error={errors[field.name] && touched[field.name]}>
        <Form.Field error={get(errors, field.name) && get(touched, field.name)} style={{ display: 'none' }}>
          <Input
            name={field.name}
            type="hidden"
            placeholder={placeholder}
            onChange={handleChange}
            value={field.value || ""}
            readOnly={readOnly ? readOnly : false}
            autoFocus={focus ? focus : false}
            className={className ? className : ""}
            style={{ textAlign: "left", width: '0%', display: 'none' }}
            onBlur={(e) => {
              if (callajax) { callajax(values, index, setFieldValue, callUseState, listobj, field.value, getIndex) }
            }}
            defaultValue={field.value || ""}
            {...props}
            maxLength={maxlength ? maxlength : ""}
    
          />
        </Form.Field>
      )
    };



