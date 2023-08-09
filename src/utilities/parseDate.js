import moment from 'moment'
import * as Yup from 'yup';

export function parseDateFromFormats (formats, parseStrict) {
  return Yup.date().transform(function(value, originalValue) {
    if (Yup.date().isType(value)) return value;

    value = moment(originalValue, formats, parseStrict);
    return value.isValid() ? value.toDate() : moment();
  });
}

// export function parseNumberFromFormats (formats, parseStrict) {
//   return Yup.number().transform(function(value, originalValue) {
//     if (Yup.number().isType(value)) return value;

//     value = moment(originalValue, formats, parseStrict);
//     return value.isValid() ? value : Nan;
//   });
// }
