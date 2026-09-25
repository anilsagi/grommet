import React, { useState } from "react";
import {
  Box,
  Button,
  Calendar as GrommetCalendar,
  Heading,
  Layer,
  Text,
} from "grommet";
import { Calendar as CalendarIcon, Close } from "grommet-icons";
import "./DateDemo.css";

const today = new Date();
const todayIso = today.toISOString().slice(0, 10);
const initialDate = "2019-09-02";

const examples = [
  { id: "header", label: "Header", firstDay: 1, heading: true },
  { id: "active", label: "Active date", firstDay: 1, activeDate: true },
  { id: "multiple", label: "Multiple", firstDay: 1, multiple: true },
];

const formatSelection = (selection) => {
  if (Array.isArray(selection)) {
    return selection.length
      ? selection.map((date) => {
          const [year, month, day] = date.slice(0, 10).split("-");
          return year && month && day ? `${day}-${month}-${year}` : date;
        }).join(", ")
      : "No dates selected";
  }
  if (!selection) return "No date selected";
  const [year, month, day] = selection.slice(0, 10).split("-");
  return year && month && day ? `${day}-${month}-${year}` : selection;
};

const DateDemo = ({ renderTrigger }) => {
  const [open, setOpen] = useState(false);
  const [activeExample, setActiveExample] = useState("header");
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [visibleMonth, setVisibleMonth] = useState(initialDate);

  const example = examples.find(({ id }) => id === activeExample) || examples[0];
  const isMultiSelect = example.multiple;

  const selectExample = (nextExample) => {
    console.log(`You have selected the ${nextExample.label} example`);
    setActiveExample(nextExample.id);
    setSelectedDate(nextExample.multiple ? [] : initialDate);
    setVisibleMonth(initialDate);
  };

  const handleSelect = (nextDate) => {
    alert(`You have selected ${formatSelection(nextDate)}`);

    if (example.multiple) {
      const nextDates = selectedDate ? [...selectedDate] : [];
      const index = nextDates.indexOf(nextDate);

      if (index === -1) nextDates.push(nextDate);
      else {
        nextDates.splice(index, 1);
        console.log(`You have deselected ${formatSelection(nextDate)}`);
      }

      setSelectedDate(nextDates);
      return;
    }

    setSelectedDate(nextDate);
  };

  const calendarProps = example.multiple ? { dates: selectedDate } : { date: selectedDate };

  return (
    <>
      {renderTrigger ? renderTrigger(() => setOpen(true)) : (
        <Button
          margin="small"
          primary
          icon={<CalendarIcon />}
          label="Launch date"
          onClick={() => setOpen(true)}
          a11yTitle="Open Grommet date examples"
        />
      )}

      {open && (
        <Layer
          full
          onEsc={() => setOpen(false)}
          onClickOutside={() => setOpen(false)}
          responsive
          aria-label="Grommet date examples"
        >
          <Box className="date-demo" fill background="white">
            <Box className="date-demo__topbar" direction="row" align="center" justify="between">
              <Box direction="row" align="center" gap="small">
                <CalendarIcon color="brand" />
                <Text color="text-strong" weight="bold">Date</Text>
              </Box>
              <Button icon={<Close />} onClick={() => setOpen(false)} a11yTitle="Close date examples" />
            </Box>

            <Box className="date-demo__body" direction="row" flex overflow="hidden">
              <Box className="date-demo__sidebar" width="small" overflow="auto">
                <Text className="date-demo__section-title" size="small" weight="bold">Calendar</Text>
                {examples.map((item) => (
                  <Button
                    key={item.id}
                    className={`date-demo__nav-item ${activeExample === item.id ? "is-active" : ""}`}
                    label={item.label}
                    onClick={() => selectExample(item)}
                    plain
                  />
                ))}
              </Box>

              <Box className="date-demo__content" flex align="center" justify="center" overflow="auto">
                <Box className="date-demo__calendar" gap="medium">
                  <Box className="date-demo__heading" direction="row" align="end" justify="between">
                    <Box gap="large">
                      <Text size="small" color="dark-4">GROMMET CALENDAR</Text>
                      <Heading level={example.heading ? 1 : 2} margin="none">{example.label}</Heading>
                    </Box>
                    <Text size="small" color="dark-4">{isMultiSelect ? "Select dates" : "Select a date"}</Text>
                  </Box>

                  <GrommetCalendar
                    {...calendarProps}
                    activeDate={example.activeDate ? todayIso : undefined}
                    firstDay={example.firstDay}
                    heading={example.heading}
                    multiple={example.multiple}
                    onSelect={handleSelect}
                    reference={visibleMonth}
                    onReference={(nextMonth) => setVisibleMonth(nextMonth)}
                    size="medium"
                  />

                  <Box className="date-demo__selection" direction="row" align="center" justify="between" gap="medium">
                    <Box gap="xxsmall">
                      <Text size="small" color="dark-4">SELECTED</Text>
                      <Text color="text-strong" weight="bold">{formatSelection(selectedDate)}</Text>
                    </Box>
                    <Text size="small" color="dark-4">{example.firstDay === 0 ? "Week starts Sunday" : "Week starts Monday"}</Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Layer>
      )}
    </>
  );
};

export default DateDemo;
