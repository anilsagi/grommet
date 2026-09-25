import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Calendar,
  CheckBox,
  CheckBoxGroup,
  DateInput,
  Form,
  FormField,
  Heading,
  Layer,
  MaskedInput,
  RadioButtonGroup,
  RangeInput,
  Select,
  SelectMultiple,
  Text,
  TextArea,
  TextInput,
} from "grommet";
import { Close, FormPreviousLink, Search as SearchIcon } from "grommet-icons";
import DateTimeInput from "./DateTimeInput";
import "./FormInputsDemo.css";

const interests = ["Product updates", "Design events", "Research notes"];
const statesByCountry = {
  USA: ["California", "New York", "Texas"],
  Canada: ["British Columbia", "Ontario", "Quebec"],
  UK: ["England", "Scotland", "Wales"],
};
const people = [
  {
    name: "Avery Chen",
    role: "Product designer",
    location: "California",
    country: "USA",
    type: "Design",
    availableDates: ["2026-08-24", "2026-08-26"],
  },
  {
    name: "Maya Singh",
    role: "Research lead",
    location: "Ontario",
    country: "Canada",
    type: "Research",
    availableDates: ["2026-08-25", "2026-08-27"],
  },
  {
    name: "Noah Williams",
    role: "Product manager",
    location: "England",
    country: "UK",
    type: "Product",
    availableDates: ["2026-08-24", "2026-08-28"],
  },
  {
    name: "Sofia Garcia",
    role: "Content strategist",
    location: "Texas",
    country: "USA",
    type: "Content",
    availableDates: ["2026-08-26", "2026-08-29"],
  },
];

const formatDate = (value) => {
  if (!value) return "Not selected";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const formatDateAsDayMonthYear = (value) => {
  if (!value) return "Not selected";
  const [year, month, day] = value.slice(0, 10).split("-");
  return year && month && day ? `${day}-${month}-${year}` : "Not selected";
};

const formatDateTime = (value) => {
  if (!value) return "Not selected";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not selected";
  const pad = (part) => String(part).padStart(2, "0");
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const isReminderBeforeStartDate = (reminder, startDate) => {
  if (!reminder || !startDate) return true;
  return reminder.slice(0, 10) < startDate.slice(0, 10);
};

const formatDates = (values) =>
  values.length ? values.map(formatDate).join(", ") : "No dates selected";

const ACCOUNT_STORAGE_KEY = "forms-inputs-demo-account";
const initialRegistration = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  bio: "",
  country: "USA",
  state: "California",
  role: "Designer",
  interests: [],
  password: "",
  terms: false,
  date: "2026-08-24",
  dateTime: "2026-08-23T09:00:00.000Z",
};

const FormInputsDemo = ({ renderTrigger }) => {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedAccount, setSavedAccount] = useState(null);
  const [registration, setRegistration] = useState(initialRegistration);
  const [query, setQuery] = useState("");
  const [types, setTypes] = useState([]);
  const [filterCountry, setFilterCountry] = useState("All");
  const [dateRange, setDateRange] = useState([]);
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [price, setPrice] = useState(50);
  const [reminderChanged, setReminderChanged] = useState(false);

  useEffect(() => {
    const storedAccount = window.localStorage.getItem(ACCOUNT_STORAGE_KEY);
    if (!storedAccount) return;
    try {
      setSavedAccount(JSON.parse(storedAccount));
    } catch {
      window.localStorage.removeItem(ACCOUNT_STORAGE_KEY);
    }
  }, []);

  const stateOptions = statesByCountry[registration.country];
  const filteredPeople = useMemo(
    () =>
      people.filter((person) => {
        const searchableText =
          `${person.name} ${person.role} ${person.location} ${person.country} ${person.type}`.toLowerCase();
        const matchesQuery = searchableText.includes(
          query.trim().toLowerCase(),
        );
        const matchesType = !types.length || types.includes(person.type);
        const matchesCountry =
          filterCountry === "All" || person.country === filterCountry;
        const matchesDates =
          !dateRange.length ||
          dateRange.some((date) => person.availableDates.includes(date));
        const matchesRange =
          (!rangeStart ||
            person.availableDates.some((date) => date >= rangeStart)) &&
          (!rangeEnd || person.availableDates.some((date) => date <= rangeEnd));
        return (
          matchesQuery &&
          matchesType &&
          matchesCountry &&
          matchesDates &&
          matchesRange
        );
      }),
    [dateRange, filterCountry, query, rangeEnd, rangeStart, types],
  );

  const updateRegistration = (field, value) => {
    setRegistration((current) => ({ ...current, [field]: value }));
    setFormError("");
    setFieldErrors((current) => {
      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
    setSubmitted(false);
  };

  const handleCountryChange = ({ option }) => {
    setRegistration((current) => ({
      ...current,
      country: option,
      state: statesByCountry[option][0],
    }));
  };

  const submitRegistration = () => {
    const errors = {};
    if (!registration.firstName.trim())
      errors.firstName = "First name is required.";
    if (!registration.lastName.trim())
      errors.lastName = "Last name is required.";
    if (!registration.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registration.email))
      errors.email = "Enter a valid email address.";
    if (!registration.password) errors.password = "Password is required.";
    else if (registration.password.length < 8)
      errors.password = "Use at least 8 characters.";
    if (!registration.terms) errors.terms = "Accept the terms to continue.";

    if (Object.keys(errors).length || loading) {
      setFieldErrors(errors);
      setFormError(
        loading
          ? "Account creation is already in progress."
          : "Please correct the highlighted fields.",
      );
      setSubmitted(false);
      return;
    }

    setFormError("");
    setFieldErrors({});
    setLoading(true);
    setSubmitted(false);
    window.setTimeout(() => {
      const { password, ...accountToStore } = registration;
      window.localStorage.setItem(
        ACCOUNT_STORAGE_KEY,
        JSON.stringify(accountToStore),
      );
      setSavedAccount(accountToStore);
      setRegistration({ ...initialRegistration });
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  const handleDateSelection = (nextValue) => {
    const nextDates = Array.isArray(nextValue)
      ? nextValue
      : nextValue
        ? [nextValue]
        : [];
    setDateRange(nextDates.sort());
  };

  const handleReminderChange = (value) => {
    if (!isReminderBeforeStartDate(value, registration.date)) {
      setReminderChanged(false);
      alert("Reminder must be set to a date before the start date.");
      return;
    }

    updateRegistration("dateTime", value);
    setReminderChanged(true);
  };

  const handleRangeChange = (event) => {
    const nextValue = Number(event.target.value);
    setPrice(nextValue);
    alert(`You have selected ${nextValue}`);
  };

  const clearFilters = () => {
    setQuery("");
    setTypes([]);
    setFilterCountry("All");
    setDateRange([]);
    setRangeStart("");
    setRangeEnd("");
    setPrice(50);
  };

  const closeFormDemo = () => {
    clearFilters();
    setOpen(false);
  };

  return (
    <>
      {renderTrigger ? renderTrigger(() => setOpen(true)) : (
        <Button
          primary
          label="Form inputs"
          onClick={() => setOpen(true)}
          a11yTitle="Open form input exercises"
        />
      )}
      {open && (
        <Layer full onEsc={closeFormDemo}>
          <Box className="form-demo" fill background="white" overflow="auto">
            <Box
              className="form-demo__topbar"
              direction="row"
              align="center"
              justify="between"
            >
              <Box direction="row" align="center" gap="small">
                <FormPreviousLink color="brand" />
                <Text weight="bold" color="text-strong">
                  Form inputs
                </Text>
              </Box>
              <Button
                icon={<Close />}
                onClick={closeFormDemo}
                a11yTitle="Close form input exercises"
              />
            </Box>
            <Box className="form-demo__content" gap="large">
              <Box className="form-demo__intro" gap="xsmall">
                <Text size="small" color="brand" weight="bold">
                  GROMMET COMPONENTS
                </Text>
                <Heading level={1} margin="none">
                  Forms &amp; input
                </Heading>
                <Text color="dark-3">
                  A registration flow and a filter workspace, built from real
                  form controls.
                </Text>
              </Box>

              <Box
                className="form-demo__columns"
                direction="row"
                gap="large"
                align="start"
              >
                <Box
                  className="form-demo__registration"
                  flex="grow"
                  gap="medium"
                >
                  <Box gap="xsmall">
                    <Heading level={2} margin="none">
                      Create an account
                    </Heading>
                    <Text size="small" color="dark-3">
                      Required fields are marked in the form.
                    </Text>
                  </Box>
                  <Form
                    noValidate
                    onSubmit={(event) => {
                      event.preventDefault();
                      submitRegistration();
                    }}
                  >
                    <Box gap="small">
                      <Box direction="row" gap="small" responsive>
                        <FormField
                          label="First name"
                          name="firstName"
                          error={fieldErrors.firstName}
                        >
                          <TextInput
                            value={registration.firstName}
                            onChange={(event) =>
                              updateRegistration(
                                "firstName",
                                event.target.value,
                              )
                            }
                          />
                        </FormField>
                        <FormField
                          label="Last name"
                          name="lastName"
                          error={fieldErrors.lastName}
                        >
                          <TextInput
                            value={registration.lastName}
                            onChange={(event) =>
                              updateRegistration("lastName", event.target.value)
                            }
                          />
                        </FormField>
                      </Box>
                      <FormField
                        label="Email"
                        name="email"
                        error={fieldErrors.email}
                      >
                        <TextInput
                          type="email"
                          value={registration.email}
                          onChange={(event) =>
                            updateRegistration("email", event.target.value)
                          }
                        />
                      </FormField>
                      <FormField label="Mobile number">
                        <MaskedInput
                          mask={[
                            { fixed: "+91 " },
                            { length: 5, regexp: /^[0-9]*$/, placeholder: "x" },
                            { fixed: " " },
                            { length: 5, regexp: /^[0-9]*$/, placeholder: "x" },
                          ]}
                          value={registration.phone}
                          onChange={(event) =>
                            updateRegistration("phone", event.target.value)
                          }
                        />
                      </FormField>
                      <FormField label="About you">
                        <TextArea
                          value={registration.bio}
                          onChange={(event) =>
                            updateRegistration("bio", event.target.value)
                          }
                        />
                      </FormField>
                      <Box direction="row" gap="small" responsive>
                        <FormField label="Country">
                          <Select
                            options={Object.keys(statesByCountry)}
                            value={registration.country}
                            onChange={handleCountryChange}
                          />
                        </FormField>
                        <FormField label="State / province">
                          <Select
                            options={stateOptions}
                            value={registration.state}
                            onChange={({ option }) =>
                              updateRegistration("state", option)
                            }
                          />
                        </FormField>
                      </Box>
                      <FormField label="Role">
                        <RadioButtonGroup
                          name="role"
                          options={["Designer", "Developer", "Manager"]}
                          value={registration.role}
                          onChange={({ value }) =>
                            updateRegistration("role", value)
                          }
                        />
                      </FormField>
                      <FormField label="Topics">
                        <SelectMultiple
                          options={interests}
                          value={registration.interests}
                          valueLabel={(selectedValues) =>
                            selectedValues.length
                              ? selectedValues.join(", ")
                              : "Select topics"
                          }
                          onChange={({ value }) =>
                            updateRegistration("interests", value)
                          }
                          closeOnChange
                        />
                      </FormField>
                      <FormField
                        label="Password"
                        name="password"
                        error={fieldErrors.password}
                      >
                        <TextInput
                          type="password"
                          value={registration.password}
                          onChange={(event) =>
                            updateRegistration("password", event.target.value)
                          }
                        />
                      </FormField>
                      <CheckBox
                        label="I agree to the terms and privacy policy"
                        checked={registration.terms}
                        onChange={(event) =>
                          updateRegistration("terms", event.target.checked)
                        }
                      />
                      {fieldErrors.terms && (
                        <Text size="small" color="status-critical">
                          {fieldErrors.terms}
                        </Text>
                      )}
                      {formError && (
                        <Text color="status-critical" role="alert">
                          {formError}
                        </Text>
                      )}
                      {submitted && (
                        <Text color="status-ok" role="status">
                          Account created successfully.
                        </Text>
                      )}
                      {savedAccount && (
                        <Text size="small" color="dark-3">
                          Saved locally for {savedAccount.email}.
                        </Text>
                      )}
                      <Button
                        type="submit"
                        primary
                        busy={loading}
                        label={loading ? "Creating account" : "Create account"}
                      />
                    </Box>
                  </Form>
                  <Box className="form-demo__extra-controls" gap="small">
                    <Text weight="bold">More input types</Text>
                    <Box direction="row" gap="small" responsive>
                      <FormField label="Start date">
                        <DateInput
                          format="mm/dd/yyyy"
                          value={registration.date}
                          onChange={({ value }) =>
                            updateRegistration("date", value)
                          }
                        />
                      </FormField>
                      <FormField label="Reminder">
                        <DateTimeInput
                          value={registration.dateTime}
                          onChange={({ value }) => handleReminderChange(value)}
                          onBlur={() => {
                            if (reminderChanged && registration.dateTime) {
                              alert(
                                `Reminder selected: ${formatDateTime(registration.dateTime)}`,
                              );
                              setReminderChanged(false);
                            }
                          }}
                        />
                      </FormField>
                    </Box>
                    <Text size="small" color="dark-3">
                      Selected reminder: {formatDateTime(registration.dateTime)}
                    </Text>
                    <Calendar
                      date={registration.date}
                      onSelect={(value) => updateRegistration("date", value)}
                    />
                  </Box>
                </Box>

                <Box className="form-demo__filters" flex="grow" gap="medium">
                  <Box
                    direction="row"
                    align="start"
                    justify="between"
                    gap="medium"
                    wrap
                  >
                    <Box gap="xsmall">
                      <Heading level={2} margin="none">
                        Search &amp; filter
                      </Heading>
                      <Text size="small" color="dark-3">
                        Combine dependent, multi-select, date, and range
                        filters.
                      </Text>
                    </Box>
                    <Button
                      label="Clear filters"
                      onClick={clearFilters}
                      plain
                    />
                  </Box>
                  <TextInput
                    icon={<SearchIcon />}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search people by name or role"
                    autoComplete="off"
                  />
                  <Box
                    className="form-demo__results form-demo__results--near-search"
                    gap="small"
                  >
                    <Text size="small" color="dark-3">
                      {filteredPeople.length} matching people
                    </Text>
                    {filteredPeople.map((person) => (
                      <Box
                        key={person.name}
                        className="form-demo__result"
                        pad="small"
                        gap="xxsmall"
                      >
                        <Text weight="bold">{person.name}</Text>
                        <Text size="small" color="dark-3">
                          {person.role} · {person.location}
                        </Text>
                      </Box>
                    ))}
                    {!filteredPeople.length && (
                      <Text color="status-critical">
                        No matches for the current search and filters.
                      </Text>
                    )}
                  </Box>
                  <FormField label="Team">
                    <CheckBoxGroup
                      options={["Design", "Product", "Research", "Content"]}
                      value={types}
                      onChange={({ value }) => setTypes(value)}
                    />
                  </FormField>
                  <FormField label="Location">
                    <Select
                      options={["All", ...Object.keys(statesByCountry)]}
                      value={filterCountry}
                      onChange={({ option }) => setFilterCountry(option)}
                    />
                  </FormField>
                  <FormField label="Available between">
                    <Calendar
                      range
                      dates={dateRange}
                      onSelect={handleDateSelection}
                    />
                    <Text size="small" color="dark-3">
                      Selected: {formatDates(dateRange)}
                    </Text>
                  </FormField>
                  <FormField label={`Budget: $${price}`}>
                    <RangeInput
                      a11yTitle="Select range value"
                      value={price}
                      onChange={handleRangeChange}
                    />
                  </FormField>
                  <FormField label="Date range (day of month)">
                    <Box direction="row" gap="small" responsive>
                      <TextInput
                        type="date"
                        value={rangeStart}
                        onChange={(event) => setRangeStart(event.target.value)}
                        autoComplete="off"
                      />
                      <TextInput
                        type="date"
                        value={rangeEnd}
                        onChange={(event) => setRangeEnd(event.target.value)}
                        autoComplete="off"
                      />
                    </Box>
                    <Text size="small" color="dark-3">
                      From: {formatDateAsDayMonthYear(rangeStart)} · To:{" "}
                      {formatDateAsDayMonthYear(rangeEnd)}
                    </Text>
                  </FormField>
                  <Text size="small" color="dark-3">
                    Filters active:{" "}
                    {[
                      query && `search \"${query}\"`,
                      types.length && `${types.length} team`,
                      filterCountry !== "All" && filterCountry,
                      dateRange.length &&
                        `${dateRange.length} date${dateRange.length === 1 ? "" : "s"}`,
                    ]
                      .filter(Boolean)
                      .join(", ") || "none"}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </Layer>
      )}
    </>
  );
};

export default FormInputsDemo;
