import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import 'daterangepicker';
import 'daterangepicker/daterangepicker.css';
import moment from 'moment-timezone';

const DateRangePicker = ({ onDateRangeChange, id = "" }) => {
  const [dateRangeString, setDateRangeString] = useState('Please select a date');
  const pickerRef = useRef(null);
  // Generate a unique ID for each picker instance if not provided
  const pickerId = id || `date-picker-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    // Fix the variable declaration order - today needs to be defined before tomorrow
    const today = moment().tz('Asia/Karachi').startOf('day');
    const tomorrow = moment(today).add(1, 'days');
    const sevenDaysBefore = moment().tz('Asia/Karachi').subtract(6, 'days');
    
    const predefinedRanges = {
      'Last 7 Days': [moment().tz('Asia/Karachi').subtract(6, 'days'), moment().tz('Asia/Karachi')],
      'Today': [today, today],
      'Yesterday': [moment().tz('Asia/Karachi').subtract(1, 'days'), moment().tz('Asia/Karachi').subtract(1, 'days')],
      'Last 30 Days': [moment().tz('Asia/Karachi').subtract(29, 'days'), today],
      'This Month': [moment().tz('Asia/Karachi').startOf('month'), today],
      'Last Month': [moment().tz('Asia/Karachi').subtract(1, 'month').startOf('month'), moment().tz('Asia/Karachi').subtract(1, 'month').endOf('month')],
      'Last 365 Days': [
        moment().tz('Asia/Karachi').subtract(364, 'days'),
        moment().tz('Asia/Karachi')
      ]
    };

    const isMobile = window.innerWidth <= 375;
    const isMobileBigger = window.innerWidth <= 568;

    const daterangepickerOptions = {
      opens: 'left',
      timePicker: false,
      startDate: sevenDaysBefore,
      endDate: today,
      locale: {
        format: 'YYYY-MM-DD',
        timeZone: 'Asia/Karachi'
      },
      isInvalidDate: function (date) {
        return date.isAfter(tomorrow);
      }
    };

    if (!isMobile) {
      daterangepickerOptions.ranges = predefinedRanges;
    }

    // Initialize the daterangepicker on this specific instance
    $(pickerRef.current).daterangepicker(daterangepickerOptions, (start, end) => {
      console.log("Raw Selected Start:", start.format());
      console.log("Raw Selected End:", end.format());

      // Convert to Asia/Karachi timezone
      const startPKT = moment(start).startOf('day');
      const endPKT = moment(end).endOf('day');

      onDateRangeChange(startPKT, endPKT);
      setDateRangeString(startPKT.format('MMM D, YYYY') + ' - ' + endPKT.format('MMM D, YYYY'));
    });

    setDateRangeString(sevenDaysBefore.format('MMM D, YYYY') + ' - ' + today.format('MMM D, YYYY'));

    // Use the current picker element reference when handling events
    $(pickerRef.current).on('show.daterangepicker', (e) => {
      if (!isMobile && isMobileBigger) {
        // Find the dropdown that belongs to THIS picker
        const pickerElement = document.querySelector(`.daterangepicker[data-picker-id="${pickerId}"]`);
        if (pickerElement) {
          pickerElement.classList.add('mobile');
        }
      }
      document.body.classList.add('no-scroll');
    });

    $(pickerRef.current).on('hide.daterangepicker', () => {
      document.body.classList.remove('no-scroll');
      if (!isMobile && isMobileBigger) {
        const pickerElement = document.querySelector(`.daterangepicker[data-picker-id="${pickerId}"]`);
        if (pickerElement) {
          pickerElement.classList.remove('mobile');
        }
      }
    });

    // Add a custom attribute to the daterangepicker dropdown to identify which picker it belongs to
    setTimeout(() => {
      const dropdownElement = document.querySelector(`.daterangepicker:last-child`);
      if (dropdownElement) {
        dropdownElement.setAttribute('data-picker-id', pickerId);
      }
    }, 100);

    return () => {
      const pickerInstance = $(pickerRef.current).data('daterangepicker');
      if (pickerInstance) {
        pickerInstance.remove();
      }
    }
  }, [pickerId]);

  return (
    <div 
      id={pickerId}
      ref={pickerRef} 
      className="date-range-picker"
      data-picker-id={pickerId}
    
    >
      <span className='pr-sm-2 date-text'>{dateRangeString}</span>
      <i className="fa fa-calendar-o ml-1 date-icon" aria-hidden="true"></i>
    </div>
  );
}

export default DateRangePicker;