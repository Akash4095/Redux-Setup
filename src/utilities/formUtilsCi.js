import React, { useState, useEffect } from "react";
import { ErrorMessage } from "formik";
import moment from "moment";
import DatePicker from "react-datepicker";
import NumberFormat from "react-number-format";
import { isObject, startCase, toLower, get } from "lodash";
import {
  Form,
  Radio,
  Input,
  Label,
  Dropdown,
  TextArea,
  Dimmer,
  Loader,
  Icon,
  Checkbox,
} from "semantic-ui-react";
import "react-datepicker/dist/react-datepicker.css";
import { checkValidDateFormats, getDateInYYYYMMDD, setYear } from "./dateUtils";
import { debounce } from "lodash";

export function getValueFromEvent(e) {
  const { target } = e;
  let newValues;
  if (target) {
    const value = target.type === "checkbox" ? target.checked : target.value;
    newValues = { [target.name]: value };
  } else if (isObject(e)) {
    newValues = e;
  }
  return newValues;
}

export const FormikInputComponent = ({
  validateInput,
  isLabel,
  label,
  isTxn,
  placeholder,
  className,
  focus,
  isError,
  maxlength,
  callajax,
  readOnly,
  callUseState,
  listobj,
  isMandatory,
  setFieldValueM,
  boxwidth,
  getIndex,
  onChangeFunc,
  field, // { name, value, onChange, onBlur }
  index,
  form: { touched, errors, values, handleChange, setFieldValue, submitCount }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  let manValue =
    setFieldValueM && setFieldValueM !== null && setFieldValueM !== undefined
      ? setFieldValueM
      : "";
  useEffect(() => {
    if (
      setFieldValueM &&
      setFieldValueM !== null &&
      setFieldValueM !== undefined &&
      setFieldValueM !== ""
    ) {
      setFieldValue(field.name, manValue);
    } else if (setFieldValueM && setFieldValueM === "") {
      setFieldValue(field.name, "");
    }
  }, [manValue]);
  return (
    // <Form.Field error={errors[field.name] && touched[field.name]}>
    <Form.Field error={get(errors, field.name) && get(touched, field.name)}>
      {errors[field.name] && touched[field.name] && !isTxn ? (
        <label>{errors[field.name]}</label>
      ) : (
        <label>
          {isLabel ? null : label ? (
            isError ? (
              <span style={{ color: "red" }}>{label}</span>
            ) : (
              label
            )
          ) : (
            startCase(toLower(field.name))
          )}
          {isMandatory ? <font color="red"> * </font> : null}
        </label>
      )}
      <Input
        name={field.name}
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        value={field.value || ""}
        readOnly={readOnly ? readOnly : false}
        tabIndex={readOnly === true ? -1 : 0}
        autoFocus={focus ? focus : false}
        className={className ? className : ""}
        style={{ textAlign: "left", width: boxwidth ? boxwidth : "100%" }}
        onBlur={(e) => {
          if (callajax) {
            callajax(
              values,
              index,
              setFieldValue,
              callUseState,
              listobj,
              field.value,
              getIndex
            );
          }
          if (onChangeFunc) {
            onChangeFunc(values, field.value, setFieldValue);
          }
        }}
        defaultValue={field.value || ""}
        {...props}
        maxLength={maxlength ? maxlength : ""}
      />
      {isTxn ? (
        <ErrorMessage
          name={field.name}
          render={(msg) => (
            <Label size="mini" color="red" basic pointing prompt>
              {msg}
            </Label>
          )}
        />
      ) : null}
    </Form.Field>
  );
};

export const FormikDateComponent = ({
  isLabel,
  label,
  placeholder,
  width,
  focus,
  callOnBlur,
  userProps,
  isError,
  isTxn,
  addTextBelow,
  isMandatory,
  setFieldValueM,
  className,
  extraCall,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, values, handleChange, setFieldValue, dirty }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const [dt, setDt] = useState(
    field.value ? moment(field.value).toDate() : null
  );
  const manDate =
    userProps &&
      userProps.setFieldManually !== undefined &&
      userProps.setFieldManually !== ""
      ? userProps.setFieldManually
      : "";
  const datePickerRef = React.useRef();
  let rawEvent = "";
  const handleDateChange = (e) => {
    if (rawEvent.type !== "change") {
      setDt(e);
      const dt = moment(e);
      handleChange(dt.format("DD-MM-YYYY"));
      setFieldValue(field.name, dt.format("YYYY-MM-DD"));
      if (extraCall) {
        extraCall(dt.format("YYYY-MM-DD"), values, setFieldValue);
      }
    }
  };

  useEffect(() => {
    if (
      userProps &&
      userProps.setFieldManually !== undefined &&
      userProps.setFieldManually !== ""
    ) {
      setFieldValue(field.name, getDateInYYYYMMDD(userProps.setFieldManually));
      setDt(moment(getDateInYYYYMMDD(userProps.setFieldManually)).toDate());
    }
  }, [manDate]);

  let manValue =
    setFieldValueM && setFieldValueM !== null && setFieldValueM !== undefined
      ? setFieldValueM
      : "";
  useEffect(() => {
    if (
      setFieldValueM &&
      setFieldValueM !== null &&
      setFieldValueM !== undefined &&
      setFieldValueM !== ""
    ) {
      setFieldValue(field.name, setFieldValueM);
      setDt(moment(setFieldValueM).toDate());
    } else if (setFieldValueM && setFieldValueM === "") {
      setFieldValue(field.name, "");
      setDt("");
    }
  }, [manValue]);

  const handleChangeRawEvent = (event) => {
    rawEvent = event;
    const dt1 = checkValidDateFormats(event.target.value);
    if (dt1) {
      handleChange(dt1);
      // setFieldValue(field.name, getDateInYYYYMMDD(dt1))
      setDt(moment(getDateInYYYYMMDD(dt1)).toDate());
    } else {
      handleChange("");
      setFieldValue(field.name, "");
      setDt("");
    }
  };

  const handleBlurRawEvent = (event) => {
    const dt1 = checkValidDateFormats(event.target.value);
    if (dt1) {
      const getValue = setYear(
        dt1.split("-")[0],
        dt1.split("-")[1],
        dt1.split("-")[2]
      );
      handleChange(getValue);
      setFieldValue(field.name, getDateInYYYYMMDD(getValue));
      setDt(moment(getDateInYYYYMMDD(getValue)).toDate());
      let date = getDateInYYYYMMDD(getValue);
      if (callOnBlur) {
        callOnBlur(date, values, setFieldValue);
      }
    } else {
      handleChange("");
      setFieldValue(field.name, "");
      setDt("");
    }
  };
  const handleclick = (e) => {
    datePickerRef.current.setFocus();
  };

  return (
    // <Form.Field error={errors[field.name] && touched[field.name]}>
    <Form.Field
      width={width ? width : null}
      error={get(errors, field.name) && get(touched, field.name)}
    >
      {errors[field.name] && touched[field.name] && !isTxn ? (
        <label>{errors[field.name]}</label>
      ) : (
        <label>
          {isLabel ? null : label ? (
            isError ? (
              <span style={{ color: "red" }}>{label}</span>
            ) : (
              label
            )
          ) : (
            startCase(toLower(field.name))
          )}
          {isMandatory ? <font color="red"> * </font> : null}
        </label>
      )}
      <div style={{ position: "relative" }}>
        <DatePicker
          name={field.name}
          className={className ? className : ""}
          placeholderText={placeholder}
          dateFormat="dd-MM-yyyy"
          scrollableYearDropdown
          selected={field.value ? dt : null}
          onChange={handleDateChange}
          onChangeRaw={(e) => handleChangeRawEvent(e)}
          autoComplete="off"
          autoFocus={focus ? focus : false}
          onBlur={(e) => handleBlurRawEvent(e)}
          ref={datePickerRef}
        />
        <Icon
          className="customDatePickerIcon custom-input-DateIcon"
          name="calendar"
          onClick={(e) => handleclick(e)}
        ></Icon>
      </div>
      {addTextBelow ? (
        <label className="addTextBelow_small">{addTextBelow}</label>
      ) : null}
      {isTxn ? (
        <ErrorMessage
          name={field.name}
          render={(msg) => (
            <Label size="mini" color="red" basic pointing prompt>
              {msg}
            </Label>
          )}
        />
      ) : null}
    </Form.Field>
  );
};

export const FormikDateFromComponent = ({
  isLabel,
  label,
  placeholder,
  width,
  focus,
  userProps,
  isTxn,
  isMandatory,
  setFieldValueM,
  className,
  setValidFrom,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, values, handleChange, setFieldValue, dirty }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const [dt, setDt] = useState(
    field.value ? moment(field.value).toDate() : null
  );
  const manDate =
    userProps &&
      userProps.setFieldManually !== undefined &&
      userProps.setFieldManually !== ""
      ? userProps.setFieldManually
      : "";
  let rawEvent = "";
  const datePickerRef = React.useRef();
  const handleDateChange = (e) => {
    if (rawEvent.type !== "change") {
      setDt(e);
      const dt = moment(e);
      handleChange(dt.format("DD-MM-YYYY"));
      setFieldValue(field.name, dt.format("YYYY-MM-DD"));
      // setValidFrom(dt.format("DD-MM-YYYY"))
    }
  };

  useEffect(() => {
    if (
      userProps &&
      userProps.setFieldManually !== undefined &&
      userProps.setFieldManually !== ""
    ) {
      setFieldValue(field.name, getDateInYYYYMMDD(userProps.setFieldManually));
      setDt(moment(getDateInYYYYMMDD(userProps.setFieldManually)).toDate());
    }
  }, [manDate]);

  let manValue =
    setFieldValueM && setFieldValueM !== null && setFieldValueM !== undefined
      ? setFieldValueM
      : "";
  useEffect(() => {
    if (
      setFieldValueM &&
      setFieldValueM !== null &&
      setFieldValueM !== undefined &&
      setFieldValueM !== ""
    ) {
      setFieldValue(field.name, setFieldValueM);
      setDt(moment(setFieldValueM).toDate());
    } else if (setFieldValueM && setFieldValueM === "") {
      setFieldValue(field.name, "");
      setDt("");
    }
  }, [manValue]);

  const handleChangeRawEvent = (event) => {
    rawEvent = event;
    const dt1 = checkValidDateFormats(event.target.value);
    if (dt1) {
      handleChange(dt1);
      // setFieldValue(field.name, getDateInYYYYMMDD(dt1))
      setDt(moment(getDateInYYYYMMDD(dt1)).toDate());
    } else {
      handleChange("");
      setFieldValue(field.name, "");
      setDt("");
    }
  };

  const handleBlurRawEvent = (event) => {
    const dt1 = checkValidDateFormats(event.target.value);
    if (dt1) {
      const getValue = setYear(
        dt1.split("-")[0],
        dt1.split("-")[1],
        dt1.split("-")[2]
      );
      handleChange(getValue);
      setFieldValue(field.name, getDateInYYYYMMDD(getValue));
      setDt(moment(getDateInYYYYMMDD(getValue)).toDate());
    } else {
      handleChange("");
      setFieldValue(field.name, "");
      setDt("");
    }
  };
  const handleCalendarClose = (e) => {
    setValidFrom(moment(dt).format("YYYY-MM-DD"));
  };
  const handleclick = (e) => {
    datePickerRef.current.setFocus();
  };

  return (
    // <Form.Field error={errors[field.name] && touched[field.name]}>
    <Form.Field
      width={width ? width : null}
      error={get(errors, field.name) && get(touched, field.name)}
    >
      {errors[field.name] && touched[field.name] && !isTxn ? (
        <label>{errors[field.name]}</label>
      ) : (
        <label>
          {isLabel ? null : label ? label : startCase(toLower(field.name))}
          {isMandatory ? <font color="red"> * </font> : null}
        </label>
      )}
      <div style={{ position: "relative" }}>
        <DatePicker
          name={field.name}
          className={className ? className : ""}
          placeholderText={placeholder}
          dateFormat="dd-MM-yyyy"
          scrollableYearDropdown
          selected={field.value ? dt : null}
          onChange={handleDateChange}
          onChangeRaw={(e) => handleChangeRawEvent(e)}
          autoComplete="off"
          autoFocus={focus ? focus : false}
          onCalendarClose={(e) => handleCalendarClose(e)}
          onBlur={(e) => handleBlurRawEvent(e)}
          ref={datePickerRef}
        />
        <Icon
          className="customDatePickerIcon custom-input-DateIcon"
          name="calendar"
          onClick={(e) => handleclick(e)}
        ></Icon>
      </div>
      {isTxn ? (
        <ErrorMessage
          name={field.name}
          render={(msg) => (
            <Label size="mini" color="red" basic pointing prompt>
              {msg}
            </Label>
          )}
        />
      ) : null}
    </Form.Field>
  );
};

export const FormikMonthYearComponent = ({
  isLabel,
  label,
  placeholder,
  width,
  focus,
  userProps,
  isTxn,
  isMandatory,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, values, handleChange, setFieldValue, dirty }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const handleDateChange = (date) => {
    setDt(date);
    setFieldValue(field.name, moment(date).format("MM/YYYY"));
  };
  console.log("field.value=========" + field.value);
  const [dt, setDt] = useState(
    field.value
      ? field.value !== ""
        ? moment(
          field.value.split("/")[0] + "/01/" + field.value.split("/")[1]
        ).toDate()
        : null
      : null
  );
  return (
    <Form.Field
      width={width ? width : null}
      error={get(errors, field.name) && get(touched, field.name)}
    >
      {errors[field.name] && touched[field.name] && !isTxn ? (
        <label>{errors[field.name]}</label>
      ) : (
        <label>
          {isLabel ? null : label ? label : startCase(toLower(field.name))}
          {isMandatory ? <font color="red"> * </font> : null}
        </label>
      )}
      <DatePicker
        selected={dt}
        placeholderText={placeholder}
        dateFormat="MM/yyyy"
        showMonthYearPicker
        name={field.name}
        onChange={(date) => handleDateChange(date)}
      />
      {isTxn ? (
        <ErrorMessage
          name={field.name}
          render={(msg) => (
            <Label size="mini" color="red" basic pointing prompt>
              {msg}
            </Label>
          )}
        />
      ) : null}
    </Form.Field>
  );
};

export const FormikAmountComponent = ({
  isLabel,
  label,
  saveOnBlur,
  decimal,
  compute,
  allowNegative,
  readOnly,
  className,
  background,
  onValChange,
  computeTwo,
  isTxn,
  path,
  placeholder,
  focus,
  setValue,
  disabled,
  setStateValue,
  boxwidth,
  id,
  validationCheck,
  validationFor,
  isMandatory,
  addTextBelow,
  textFrom,
  extraobj,
  extraValue,
  onChangecompute,
  onValChangeFunc,
  field, // { name, value, onChange, onBlur }
  index,
  form: {
    touched,
    errors,
    values,
    handleSubmit,
    handleBlur,
    setFieldValue,
    submitCount,
  }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  useEffect(() => {
    if (setValue !== undefined && setValue !== "" && setValue !== 0) {
      setFieldValue(field.name, setValue);
    } else {
      if (setValue !== undefined && setValue !== "") {
        setFieldValue(field.name, setValue ? setValue : null);
      }
    }
  }, [setValue]);

  const setValueChange = (setFieldValue, val, index) => {
    setFieldValue(field.name, val !== undefined && val !== "" ? val : "");
    if (onValChangeFunc) {
      onValChangeFunc(val, values, index, setFieldValue)
    }
    if (setStateValue) {
      setStateValue(val !== undefined && val !== "" ? val : 0);
    }
    if (onValChange) {
      onValChange(setFieldValue, val, index);
    }
  };

  return (
    // <Form.Field error={errors[field.name] && touched[field.name]}>
    <Form.Field error={get(errors, field.name) && get(touched, field.name)}>
      {errors[field.name] && touched[field.name] && !isTxn ? (
        <label>{errors[field.name]}</label>
      ) : (
        <label>
          {isLabel ? null : label ? label : startCase(toLower(field.name))}
          {isMandatory ? <font color="red"> * </font> : null}
        </label>
      )}

      <NumberFormat
        thousandSeparator={true}
        thousandsGroupStyle="lakh"
        decimalScale={decimal ? decimal : 2}
        placeholder={placeholder}
        name={field.name}
        value={field.value}
        readOnly={readOnly ? readOnly : false}
        tabIndex={readOnly === true ? -1 : 0}
        onValueChange={(val) =>
          setValueChange(setFieldValue, val.floatValue, index)
        }
        autoFocus={focus ? focus : false}
        disabled={disabled ? disabled : false}
        id={id ? id : null}
        allowNegative={allowNegative ? false : true}
        style={{
          textAlign: "right",
          width: boxwidth ? boxwidth : "100%",
          background: background ? "#F5F5F5" : "",
        }}
        onBlur={(e) => {
          // e.persist()
          // handleBlur(e)
          if (compute) {
            compute(
              field.value,
              values,
              index,
              setFieldValue,
              textFrom,
              extraobj ? extraobj : null,
              extraValue ? extraValue : null
            );
          }
          if (computeTwo) {
            computeTwo(values, index, setFieldValue);
          }
          if (saveOnBlur) {
            saveOnBlur(values, index, setFieldValue);
          }
          if (validationCheck) {
            validationCheck(values, index, setFieldValue, validationFor);
          }
        }}
        onChange={() => {
          if (onChangecompute) {
            onChangecompute(
              field.value,
              values,
              index,
              setFieldValue,
              textFrom,
              extraobj ? extraobj : null,
              extraValue ? extraValue : null
            );
          }
        }}
      />
      {addTextBelow ? (
        <label className="addTextBelow_small">{addTextBelow}</label>
      ) : null}
      {isTxn ? (
        <ErrorMessage
          name={field.name}
          render={(msg) => (
            <Label size="mini" color="red" basic pointing prompt>
              {msg}
            </Label>
          )}
        />
      ) : null}
    </Form.Field>
  );
};

export const FormikCheckBoxComponent1 = ({
  userProps,
  focus,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, values, handleChange, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => (
  // <Form.Field error={errors[field.name] && touched[field.name]}>
  <Form.Field error={get(errors, field.name) && get(touched, field.name)}>
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
  userProps,
  isLabel,
  label,
  isTxn,
  isSelection,
  focus,
  isError,
  width,
  compute,
  setFieldValueM,
  clearable,
  isMandatory,
  setvalue,
  setChange,
  index,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, values, handleChange, setFieldValue, submitCount }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  let manValue =
    setFieldValueM && setFieldValueM !== null && setFieldValueM !== undefined
      ? setFieldValueM
      : "";
  useEffect(() => {
    if (
      setFieldValueM &&
      setFieldValueM !== null &&
      setFieldValueM !== undefined &&
      setFieldValueM !== ""
    ) {
      setFieldValue(field.name, manValue);
    } else if (setFieldValueM && setFieldValueM === "") {
      setFieldValue(field.name, "");
    }
  }, [manValue]);

  const onChange = (value) => {
    // console.log("value", value)
    setFieldValue(field.name, value);
    if (setChange) {
      if (setvalue) {
        setChange(value.value);
      }
    }
    if (userProps.getValue) {
      userProps.getValue(value, setFieldValue, values);
    }
  };

  useEffect(() => {
    if (setvalue) {
      setFieldValue(field.name, setvalue);
    }
  }, [setvalue]);

  return (
    // <Form.Field error={errors[field.name] && touched[field.name]}>
    <Form.Field
      error={get(errors, field.name) && get(touched, field.name)}
      style={{ width: width ? width : null }}
    >
      {errors[field.name ? field.name : ""] &&
        touched[field.name ? field.name : ""] &&
        !isTxn ? (
        <label>{errors[field.name]}</label>
      ) : (
        <label>
          {isLabel ? null : label ? (
            isError ? (
              <span style={{ color: "red" }}>{label}</span>
            ) : (
              label
            )
          ) : (
            startCase(toLower(field.name))
          )}
          {isMandatory ? <font color="red"> * </font> : null}
        </label>
      )}
      <Dropdown
        search
        selection={isSelection ? true : false}
        id={field.id ? field.id : ""}
        name={field.name ? field.name : ""}
        placeholder={userProps.placeholder}
        options={userProps.options}
        value={
          userProps
            ? userProps.isLowerCaseEnable
              ? toLower(field.value)
              : field.value
            : field.value
        }
        onChange={(e, { value }) => onChange(value)}
        autoFocus={focus ? focus : false}
        onBlur={(e) => {
          // e.persist()
          // handleBlur(e)
          if (compute) {
            compute(values, index, setFieldValue);
          }
        }}
        clearable
        disabled={
          userProps ? (userProps.isDisable ? userProps.isDisable : null) : null
        }
      />
      {isTxn ? (
        <ErrorMessage
          name={field.name}
          render={(msg) => (
            <Label size="mini" color="red" basic pointing prompt>
              {msg}
            </Label>
          )}
        />
      ) : null}
    </Form.Field>
  );
};

export const FormikSelectNotClearableComponent = ({
  userProps,
  isLabel,
  label,
  isTxn,
  isSelection,
  focus,
  width,
  compute,
  clearable,
  isMandatory,
  index,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, values, handleChange, setFieldValue, submitCount }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const onChange = (value) => {
    // console.log("value", value)
    setFieldValue(field.name, value);
    if (userProps.getValue) userProps.getValue(value);
  };

  return (
    // <Form.Field error={errors[field.name] && touched[field.name]}>
    <Form.Field
      error={get(errors, field.name) && get(touched, field.name)}
      style={{ width: width ? width : null }}
    >
      {errors[field.name] && touched[field.name] && !isTxn ? (
        <label>{errors[field.name]}</label>
      ) : (
        <label>
          {isLabel ? null : label ? label : startCase(toLower(field.name))}
          {isMandatory ? <font color="red"> * </font> : null}
        </label>
      )}
      <Dropdown
        search
        selection={isSelection ? true : false}
        id={field.id}
        name={field.name}
        placeholder={userProps.placeholder}
        options={userProps.options}
        value={
          userProps
            ? userProps.isLowerCaseEnable
              ? toLower(field.value)
              : field.value
            : field.value
        }
        onChange={(e, { value }) => onChange(value)}
        autoFocus={focus ? focus : false}
        onBlur={(e) => {
          // e.persist()
          // handleBlur(e)
          if (compute) {
            compute(values, index, setFieldValue);
          }
        }}
        disabled={
          userProps ? (userProps.isDisable ? userProps.isDisable : null) : null
        }
      />
      {isTxn ? (
        <ErrorMessage
          name={field.name}
          render={(msg) => (
            <Label size="mini" color="red" basic pointing prompt>
              {msg}
            </Label>
          )}
        />
      ) : null}
    </Form.Field>
  );
};

export const FormikAsyncSelectComponent = ({
  userProps,
  isLabel,
  label,
  isTxn,
  isSelection,
  focus,
  width,
  isError,
  onFocusCall,
  onBlurCall,
  placeholder,
  setvalue,
  setChange,
  appendLabel,
  appendLabelText,
  className,
  isFetching,
  isMandatory,
  displayLink,
  Link,
  clickFunc,
  linkColor,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, values, handleChange, setFieldValue, submitCount }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const onChange = (value) => {
    //  console.log('onChange', value);
    setFieldValue(field.name, value);
    if (onBlurCall) {
      onBlurCall(value);
    }
    if (setChange) {
      if (setvalue) {
        setChange(value.value);
      }
    }
    if (userProps.getValue) userProps.getValue(value, setFieldValue, values);
  };

  const [searchStr, setSearchStr] = useState("");
  const loadOptions = (searchQuery) => {
    // console.log(searchQuery)
    userProps.getInputValue(searchQuery, setFieldValue, values.id);
    setSearchStr(searchQuery);
  };

  useEffect(() => {
    if (setvalue) {
      setFieldValue(field.name, setvalue);
    }
  }, [setvalue]);

  return (
    // <Form.Field error={errors[field.name] && touched[field.name]}>{appendLabel ? className : ""}
    <Form.Field
      width={width ? width : null}
      className="goRelative"
      error={get(errors, field.name) && get(touched, field.name)}
    >
      {/* {console.log("displayLink============", displayLink)}
      {console.log("link============", Link)} */}
      {errors[field.name] && touched[field.name] && !isTxn ? (
        <label style={{ float: "left" }}>{errors[field.name]}</label>
      ) : (
        <label>
          {isLabel ? null : label ? (
            isError ? (
              <span style={{ color: "red" }}>{label}</span>
            ) : (
              label
            )
          ) : (
            startCase(toLower(field.name))
          )}
          {isMandatory ? <font color="red"> * </font> : null}
        </label>
      )}
      {displayLink === true ? (
        <label
          style={
            linkColor === "error"
              ? { float: "right", cursor: "pointer", color: "red" }
              : { float: "right", cursor: "pointer" }
          }
          onClick={() => clickFunc(values)}
        >
          {Link}
        </label>
      ) : null}
      <Dropdown
        search
        selection={isSelection ? true : false}
        // selectOnNavigation={true}
        id={field.id}
        name={field.name}
        options={
          userProps.searchOptions && userProps.searchOptions.length > 0
            ? userProps.searchOptions
            : userProps.options
        }
        value={field.value}
        onSearchChange={(e, { searchQuery }) => loadOptions(searchQuery)}
        onChange={(e, { value }) => onChange(value)}
        onBlur={(e, { value }) => onChange(value)}
        onFocus={(e) => {
          if (onFocusCall) {
            onFocusCall(e);
          }
        }}
        placeholder={placeholder ? placeholder : ""}
        clearable
        className={className ? className : ""}
        searchInput={{ autoFocus: focus ? focus : false }}
        noResultsMessage={
          (searchStr.length > 2 || (
            userProps.searchOptions && userProps.searchOptions.length === 0
          ))
            ? "No Data Found"
            : "Type 4 character to search Data"
        }
      />
      {isTxn ? (
        <ErrorMessage
          name={field.name}
          render={(msg) => (
            <Label size="mini" color="red" basic pointing prompt>
              {msg}
            </Label>
          )}
        />
      ) : null}
      {appendLabel ? (
        isFetching ? (
          <Loader active size="mini" className="smallLoader" />
        ) : (
          <Label size="mini" className="noColorLabel">
            {appendLabelText}
          </Label>
        )
      ) : null}
    </Form.Field>
  );
};

export const FormikTextAreaComponent = ({
  userProps,
  isTxn,
  isLabel,
  label,
  className,
  background,
  readOnly,
  isMandatory,
  setvalue,
  setChange,
  setFieldValueM,
  field, // { name, value, onChange, onBlur }
  form: {
    touched,
    errors,
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    HeaderClick,
  }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const [count, setCount] = useState(0);
  // console.log(field.value)
  const onChange = (syntheticEvent, value) => {
    setFieldValue(field.name, value.value);
    setCount(value.value.length);
    if (setChange) {
      if (setvalue) {
        setChange(value.value);
      }
    }
    if (value.value !== "") {
      if (userProps.getValue) userProps.getValue(value.value);
    } else {
      if (userProps.getValue) userProps.getValue("");
    }
  };

  useEffect(() => {
    if (setvalue) {
      setFieldValue(field.name, setvalue);
      if (
        userProps &&
        userProps.displayCount !== undefined &&
        userProps.displayCount === true &&
        setvalue &&
        setvalue.length === 0
      ) {
        setCount(0);
      } else {
        if (setvalue && setvalue.length > 0) {
          setCount(setvalue.length);
        } else {
          setCount(0);
        }
      }
    }
  }, [setvalue]);

  useEffect(() => {
    if (
      userProps &&
      userProps.displayCount !== undefined &&
      userProps.displayCount === true &&
      field.value &&
      field.value.length === 0
    ) {
      setCount(0);
    } else {
      if (field.value && field.value.length > 0) {
        setCount(field.value.length);
      } else {
        setCount(0);
      }
    }
  }, [field.value]);

  let manValue =
    setFieldValueM && setFieldValueM !== null && setFieldValueM !== undefined
      ? setFieldValueM
      : "";
  useEffect(() => {
    if (
      setFieldValueM &&
      setFieldValueM !== null &&
      setFieldValueM !== undefined &&
      setFieldValueM !== ""
    ) {
      setFieldValue(field.name, manValue);
    } else if (setFieldValueM && setFieldValueM === "") {
      setFieldValue(field.name, "");
    }
  }, [manValue]);

  const height = userProps
    ? userProps.height === undefined
      ? 3
      : userProps.height === ""
        ? 3
        : userProps.height === 0
          ? 3
          : userProps.height
    : 3;
  const isFloatLeft =
    userProps &&
      userProps.displayCount !== undefined &&
      userProps.displayCount === true
      ? "left"
      : null;
  return (
    <Form.Field error={get(errors, field.name) && get(touched, field.name)}>
      {errors[field.name] && touched[field.name] && !isTxn ? (
        <label style={{ float: isFloatLeft }}>{errors[field.name]}</label>
      ) : (
        <label style={{ float: isFloatLeft }}>
          {isLabel ? null : label ? label : startCase(toLower(field.name))}
          {isMandatory ? <font color="red"> * </font> : null}
        </label>
      )}
      {userProps ? (
        userProps.displayCount !== undefined &&
          userProps.displayCount === true ? (
          <label style={{ float: "right" }}>
            {count} / {userProps.maxLength}
          </label>
        ) : null
      ) : null}
      <TextArea
        name={field.name}
        style={{
          resize: "none",
          width: "100%",
          background: background ? "#F5F5F5" : "",
        }}
        value={field.value}
        onChange={onChange}
        rows={height}
        readOnly={readOnly ? readOnly : false}
        tabIndex={readOnly === true ? -1 : 0}
        className={className ? className : null}
        maxLength={userProps ? userProps.maxLength : null}
        placeholder={userProps ? userProps.getholder : null}
      ></TextArea>
      {isTxn ? (
        <ErrorMessage
          name={field.name}
          render={(msg) => (
            <Label size="mini" color="red" basic pointing prompt>
              {msg}
            </Label>
          )}
        />
      ) : null}
    </Form.Field>
  );
};

export const FormikDisplayLabelComponent = ({
  validateInput,
  isLabel,
  label,
  isTxn,
  placeholder,
  focus,
  text,
  addTextBelow,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, values, handleChange, submitCount }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => (
  // <Form.Field error={errors[field.name] && touched[field.name]}>
  <Form.Field error={get(errors, field.name) && get(touched, field.name)}>
    <label className="headerDisplay">
      {isLabel ? null : label ? label : startCase(toLower(field.name))}
    </label>
    <label className="AutoGenerate">{text}</label>
    {addTextBelow ? (
      <label className="addTextBelow_small">{addTextBelow}</label>
    ) : null}
  </Form.Field>
);

export const FormikDisplayLabelRowComponent = ({
  validateInput,
  isLabel,
  label,
  isTxn,
  placeholder,
  focus,
  text,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, values, handleChange, submitCount }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => (
  // <Form.Field error={errors[field.name] && touched[field.name]}>
  <Form.Field error={get(errors, field.name) && get(touched, field.name)}>
    <label className="AutoGenerate">{text}</label>
  </Form.Field>
);

export const FormikNumberComponent = ({
  isLabel,
  label,
  saveOnBlur,
  decimal,
  compute,
  isTxn,
  path,
  placeholder,
  focus,
  setValue,
  disabled,
  setStateValue,
  boxwidth,
  id,
  isMandatory,
  field, // { name, value, onChange, onBlur }
  index,
  form: {
    touched,
    errors,
    values,
    handleSubmit,
    handleBlur,
    setFieldValue,
    submitCount,
  }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  useEffect(() => {
    if (setValue !== undefined && setValue !== "" && setValue !== 0) {
      setFieldValue(field.name, setValue);
    } else {
      if (setValue !== undefined && setValue !== "") {
        setFieldValue(field.name, setValue ? setValue : null);
      }
    }
  }, [setValue]);

  const setValueChange = (setFieldValue, val) => {
    setFieldValue(field.name, val);
    if (setStateValue) {
      setStateValue(val !== undefined && val !== "" ? val : 0);
    }
  };

  return (
    // <Form.Field error={errors[field.name] && touched[field.name]}>
    <Form.Field error={get(errors, field.name) && get(touched, field.name)}>
      {errors[field.name] && touched[field.name] && !isTxn ? (
        <label>{errors[field.name]}</label>
      ) : (
        <label>
          {isLabel ? null : label ? label : startCase(toLower(field.name))}
          {isMandatory ? <font color="red"> * </font> : null}
        </label>
      )}

      <NumberFormat
        thousandSeparator={false}
        decimalScale={decimal ? decimal : 0}
        placeholder={placeholder}
        name={field.name}
        value={field.value}
        onValueChange={(val) => setValueChange(setFieldValue, val.floatValue)}
        autoFocus={focus ? focus : false}
        disabled={disabled ? disabled : false}
        id={id ? id : null}
        style={{ textAlign: "right", width: boxwidth ? boxwidth : "100%" }}
        onBlur={(e) => {
          // e.persist()
          // handleBlur(e)
          if (compute) {
            compute(values, index, setFieldValue);
          }
          if (saveOnBlur) {
            saveOnBlur(values, index, setFieldValue);
          }
        }}
      />
      {isTxn ? (
        <ErrorMessage
          name={field.name}
          render={(msg) => (
            <Label size="mini" color="red" basic pointing prompt>
              {msg}
            </Label>
          )}
        />
      ) : null}
    </Form.Field>
  );
};

export const FormikNumberReadOnlyComponent = ({
  isLabel,
  label,
  saveOnBlur,
  decimal,
  compute,
  isTxn,
  path,
  placeholder,
  focus,
  setValue,
  disabled,
  setStateValue,
  boxwidth,
  id,
  isMandatory,
  field, // { name, value, onChange, onBlur }
  index,
  form: {
    touched,
    errors,
    values,
    handleSubmit,
    handleBlur,
    setFieldValue,
    submitCount,
  }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  useEffect(() => {
    if (setValue !== undefined && setValue !== "" && setValue !== 0) {
      setFieldValue(field.name, setValue);
    } else {
      if (setValue !== undefined && setValue !== "") {
        setFieldValue(field.name, setValue ? setValue : null);
      }
    }
  }, [setValue]);

  const setValueChange = (setFieldValue, val) => {
    setFieldValue(field.name, val);
    if (setStateValue) {
      setStateValue(val !== undefined && val !== "" ? val : 0);
    }
  };

  return (
    // <Form.Field error={errors[field.name] && touched[field.name]}>
    <Form.Field error={get(errors, field.name) && get(touched, field.name)}>
      {errors[field.name] && touched[field.name] && !isTxn ? (
        <label>{errors[field.name]}</label>
      ) : (
        <label>
          {isLabel ? null : label ? label : startCase(toLower(field.name))}
          {isMandatory ? <font color="red"> * </font> : null}
        </label>
      )}
      <NumberFormat
        thousandSeparator={true}
        thousandsGroupStyle="lakh"
        decimalScale={decimal ? decimal : 2}
        placeholder={placeholder}
        name={field.name}
        value={field.value}
        onValueChange={(val) => setValueChange(setFieldValue, val.floatValue)}
        autoFocus={focus ? focus : false}
        disabled={disabled ? disabled : false}
        id={id ? id : null}
        style={{
          textAlign: "right",
          width: boxwidth ? boxwidth : "100%",
          backgroundColor: "#E8E8E8",
        }}
        readonly="true"
        tabIndex="-1"
        onBlur={(e) => {
          // e.persist()
          // handleBlur(e)
          if (compute) {
            compute(values, index, setFieldValue);
          }
          if (saveOnBlur) {
            saveOnBlur(values, index, setFieldValue);
          }
        }}
      />
      {isTxn ? (
        <ErrorMessage
          name={field.name}
          render={(msg) => (
            <Label size="mini" color="red" basic pointing prompt>
              {msg}
            </Label>
          )}
        />
      ) : null}
    </Form.Field>
  );
};

export const FormikBlankComponent = ({
  field, // { name, value, onChange, onBlur }
  index,
  form: {
    touched,
    errors,
    values,
    handleSubmit,
    handleBlur,
    setFieldValue,
    submitCount,
  }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  return (
    // <Form.Field error={errors[field.name] && touched[field.name]}>
    <Form.Field
      error={get(errors, field.name) && get(touched, field.name)}
    ></Form.Field>
  );
};

export const FormikHiddenInputComponent = ({
  validateInput,
  isLabel,
  label,
  isTxn,
  placeholder,
  className,
  focus,
  maxlength,
  callajax,
  readOnly,
  callUseState,
  listobj,
  isMandatory,
  setFieldValueM,
  boxwidth,
  getIndex,
  field, // { name, value, onChange, onBlur }
  index,
  form: { touched, errors, values, handleChange, setFieldValue, submitCount }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  let manValue =
    setFieldValueM && setFieldValueM !== null && setFieldValueM !== undefined
      ? setFieldValueM
      : "";
  useEffect(() => {
    if (
      setFieldValueM &&
      setFieldValueM !== null &&
      setFieldValueM !== undefined &&
      setFieldValueM !== ""
    ) {
      setFieldValue(field.name, manValue);
    } else if (setFieldValueM && setFieldValueM === "") {
      setFieldValue(field.name, "");
    }
  }, [manValue]);
  return (
    // <Form.Field error={errors[field.name] && touched[field.name]}>
    <Form.Field
      error={get(errors, field.name) && get(touched, field.name)}
      style={{ display: "none" }}
    >
      <Input
        name={field.name}
        type="hidden"
        placeholder={placeholder}
        onChange={handleChange}
        value={field.value || ""}
        readOnly={readOnly ? readOnly : false}
        autoFocus={focus ? focus : false}
        className={className ? className : ""}
        style={{ textAlign: "left", width: "0%", display: "none" }}
        onBlur={(e) => {
          if (callajax) {
            callajax(
              values,
              index,
              setFieldValue,
              callUseState,
              listobj,
              field.value,
              getIndex
            );
          }
        }}
        defaultValue={field.value || ""}
        {...props}
        maxLength={maxlength ? maxlength : ""}
      />
    </Form.Field>
  );
};
export const FormikVNumCodeComponent = ({
  validateInput,
  placeholder,
  width,
  isLabel,
  label,
  isTxn,
  focus,
  userProps,
  classField,
  maxlength,
  prefix,
  suffix,
  onBlurFunc,
  isEditVnum,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, values, handleChange, submitCount, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const manField =
    userProps &&
      userProps.setFieldManually !== undefined &&
      userProps.setFieldManually !== ""
      ? userProps.setFieldManually
      : "";
  const [getCode, setCode] = useState(
    userProps &&
      userProps.setFieldManually !== undefined &&
      userProps.setFieldManually !== ""
      ? userProps.setFieldManually
      : ""
  );
  useEffect(() => {
    if (
      userProps &&
      userProps.setFieldManually !== undefined &&
      userProps.setFieldManually !== ""
    ) {
      setCode(userProps.setFieldManually);
      setFieldValue(
        field.name,
        prefix + "" + userProps.setFieldManually + "" + suffix
      );
    }
  }, [manField]);

  const handleChangeEvent = (valueget) => {
    setCode(valueget);
  };
  const onBlurEvent = (maxlengths) => {
    if (onBlurFunc) {
      onBlurFunc(getCode, maxlengths);
      setFieldValue(field.name, prefix + "" + getCode + "" + suffix);
    }
  };
  console.log(isEditVnum, "=====================isEditVnum");
  return (
    // <Form.Field error={errors[field.name] && touched[field.name]}>
    <Form.Field
      className={classField ? classField : ""}
      width={width ? width : null}
      error={get(errors, field.name) && get(touched, field.name)}
    >
      {errors[field.name] && touched[field.name] && !isTxn ? (
        <label>{errors[field.name]}</label>
      ) : (
        <label>
          {isLabel ? null : label ? label : startCase(toLower(field.name))}
        </label>
      )}
      <Input
        name="prefix"
        type="text"
        value={prefix}
        readOnly="true"
        tabIndex="-1"
        className="getRightAlign prefixBOX"
        style={{ width: "28%", float: "left" }}
      />
      <Input
        name="code"
        type="text"
        decimal={0}
        onBlur={(e, val) => onBlurEvent(maxlength)}
        onChange={(e, { value }) => handleChangeEvent(value)}
        value={getCode}
        placeholder={placeholder}
        autoFocus={focus ? focus : false}
        maxLength={maxlength ? maxlength : 100}
        className="getRightAlign numberBox"
        style={{ width: "36%", float: "left" }}
        readOnly={isEditVnum === "yes" ? false : true}
      />
      <Input
        name="suffix"
        type="text"
        value={suffix}
        readOnly="true"
        tabIndex="-1"
        style={{ width: "28%", float: "left" }}
        className="getLeftAlign"
      />
      <Input type="hidden" value={field.value} name={field.name} />
      {isTxn ? (
        <ErrorMessage
          name={field.name}
          render={(msg) => (
            <Label size="mini" color="red" basic pointing prompt>
              {msg}
            </Label>
          )}
        />
      ) : null}
    </Form.Field>
  );
};

export const FormikCheckBoxComponent = ({
  userProps,
  label,
  toggle,
  className,
  checked,
  checkBoxClicked,
  defaultChecked,
  setToggle,
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, values, handleChange, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  // console.log(field,'================filed')

  const onClicked = (checked) => {
    console.log(checked, "========checked");
    if (checkBoxClicked) {
      checkBoxClicked(checked, setFieldValue, values);
    }
    if (checked === true) {
      setFieldValue(field.name, "y");
      if (setToggle) {
        setToggle("yes")
      }
    } else {
      setFieldValue(field.name, "n");
      if (setToggle) {
        setToggle("no")
      }
    }
  };

  return (
    <Form.Field error={get(errors, field.name) && get(touched, field.name)}>
      <Checkbox
        toggle={toggle ? toggle : ""}
        name={field.name}
        label={label ? label : ""}
        className={className ? className : ""}
        defaultChecked={defaultChecked ? defaultChecked : false}
        onClick={(e, { checked }) => onClicked(checked)}
      />
      {/* <label>{label? label :""}</label> */}
    </Form.Field>
  );
};
