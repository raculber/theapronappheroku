import React from "react";
import moment from "moment";
import axios from "axios";
import recipe2 from "../Recipe/recipe2";
import recipe from "../Recipe/recipe";
import { connect } from "react-redux";
import "./Calendar.css";
import RecipesByDay from "./RecipesByDay";
import { Button } from "antd";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import CalendarModal from "./CalendarModal";

class Calendar extends React.Component {
  userId = this.props.userId;

  state = {
    dateObject: moment(),
    allMonths: moment.months(),
    showModal: false,
    showRecipes: false,
    showMonthTable: false,
    selectedDate: "",
    recipes: [],
    showYearTable: false,
    showDateTable: true,
    selectedDay: null,
  };
  firstDayOfMonth = () => {
    let dateObject = this.state.dateObject;
    let firstDay = moment(dateObject).startOf("month").format("d");
    return firstDay;
  };

  daysInMonth = () => {
    return this.state.dateObject.daysInMonth();
  };

  weekdaysShort = moment.weekdaysShort();

  currentDay = () => {
    return this.state.dateObject.format("D");
  };

  month = () => {
    return this.state.dateObject.format("MMMM");
  };

  setMonth = (month) => {
    const monthNo = this.state.allMonths.indexOf(month);
    const dateObject = moment(this.state.dateObject).set("month", monthNo);
    this.setState((prevState) => ({
      dateObject,
      showMonthTable: !prevState.showMonthTable,
      showDateTable: !prevState.showDateTable,
    }));
  };

  buildTable = (data) => (
    <td
      key={data}
      className="calendar-month"
      onClick={() => this.setMonth(data)}
    >
      <span>{data}</span>
    </td>
  );

  showMonth = () => {
    this.setState((prevState) => ({
      showMonthTable: !prevState.showMonthTable,
      showDateTable: !prevState.showDateTable,
    }));
  };

  year = () => this.state.dateObject.format("Y");

  getDates = (start, end) => {
    const dateArray = [];
    let currentDate = moment().year(start);
    const endDate = moment().year(end);
    while (currentDate <= endDate) {
      dateArray.push(moment(currentDate).format("YYYY"));
      currentDate = moment(currentDate).add(1, "year");
    }
    return dateArray;
  };
  setYear = (year) => {
    // alert(year)
    let dateObject = Object.assign({}, this.state.dateObject);
    dateObject = moment(dateObject).set("year", year);
    this.setState({
      dateObject: dateObject,
      showMonthTable: !this.state.showMonthTable,
      showYearTable: !this.state.showYearTable,
    });
  };

  onDayClick = (d) => {
    this.setState(
      {
        selectedDay: d,
      },
      () => {
        const year = this.state.dateObject._d.getFullYear();
        let day = d;
        if (day < 10) {
          day = "0" + day;
        }
        const month = this.state.dateObject._d.getMonth() + 1;
        const date = month + "/" + day + "/" + year;
        axios
          .get(
            `${process.env.REACT_APP_API_SERVICE_URL}/api/get-recipes-by-date?userId=${this.userId}&date=${date}`,
            {
              headers: {
                "access-token": localStorage.getItem("token"),
              },
            }
          )
          .then((res) => {
            console.log(res);
            this.setState({
              recipes: res.data.recipes,
              // showModal: true,
              selectedDate: date,
              showRecipes: true,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    );
  };

  onAddClicked = (d) => {
    const year = this.state.dateObject._d.getFullYear();
    let day = d;
    if (day < 10) {
      day = "0" + day;
    }
    const month = this.state.dateObject._d.getMonth() + 1;
    const date = month + "/" + day + "/" + year;
    axios
      .get(
        "https://the-apron-app.herokuapp.com/api/get-saved-recipes?userId=" +
          this.userId,
        {
          headers: {
            "access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        console.log(res);
        this.setState({
          selectedDay: d,
          showModal: true,
          selectedDate: date,
          recipes: res.data.recipes,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  onPrev = () => {
    let curr = "";
    if (this.state.showYearTable) {
      curr = "year";
    } else {
      curr = "month";
    }
    this.setState({
      dateObject: this.state.dateObject.subtract(1, curr),
    });
  };

  onNext = () => {
    let curr = "";
    if (this.state.showYearTable) {
      curr = "year";
    } else {
      curr = "month";
    }
    this.setState({
      dateObject: this.state.dateObject.add(1, curr),
    });
  };

  hideModal = () => {
    this.setState({
      showModal: false,
    });
  };

  MonthList = ({ data }) => {
    const months = data.map(this.buildTable);
    const rows = [];
    let cells = [];

    months.forEach((month, i) => {
      if (i % 3 !== 0 || i === 0) {
        cells.push(month);
      } else {
        rows.push(cells);
        cells = [month];
      }
    });
    rows.push(cells);
    const monthsList = rows.map((row, i) => <tr key={`month-${i}`}>{row}</tr>);

    return (
      <table className="calendar-month">
        <thead>
          <tr>
            <th colSpan="4">Select a Month</th>
          </tr>
        </thead>
        <tbody>{monthsList}</tbody>
      </table>
    );
  };

  render() {
    let weekdayshortname = this.weekdaysShort.map((day) => (
      <th key={day}>{day}</th>
    ));
    let blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i++) {
      blanks.push(<td className="calendar-day empty">{""}</td>);
    }

    let daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(); d++) {
      let currentDay = d == this.currentDay() ? "today" : "";
      let currentMonth = this.month();
      let currentYear = this.year();

      daysInMonth.push(
        <td key={d} className={`calendar-day ${currentDay}`}>
          <span onClick={() => this.onDayClick(d)}>{d}</span>
          <IconButton
            aria-label="Add to calender"
            onClick={() => this.onAddClicked(d)}
          >
            <AddIcon
              sx={{
                cursor: "pointer",
                zIndex: 100,
                top: 0,
                right: 0,
                position: "relative",
              }}
            />
          </IconButton>
        </td>
      );
    }

    const totalSlots = [...blanks, ...daysInMonth];
    let rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row); // if index not equal 7 that means not go to next week
      } else {
        rows.push(cells); // when reach next week we contain all td in last week to rows
        cells = []; // empty container
        cells.push(row); // in current loop we still push current row to new container
      }
      if (i === totalSlots.length - 1) {
        // when end loop we add remain date
        rows.push(cells);
      }
    });

    const monthWeeks = rows.map((week, i) => <tr key={i}>{week}</tr>);

    return (
      <div>
        {this.state.showModal && <CalendarModal recipes={this.state.recipes} />}
        <div className="tail-datetime-calendar">
          {this.state.showModal && (
            <CalendarModal
              onClose={this.hideModal}
              recipes={this.state.recipes}
              date={this.state.selectedDate}
            />
          )}
          <div className="calendar-navi">
            <span
              onClick={this.onPrev}
              className="calendar-button button-prev"
            />
            <span
              data-tail-navi="switch"
              className="calendar-label"
              onClick={this.showMonth}
            >
              {this.month()}
            </span>
            <span className="calendar-label">{this.year()}</span>
            <span
              onClick={this.onNext}
              className="calendar-button button-next"
            />
          </div>
          <div className="calendar-date">
            <div className="calendar-date">
              {this.state.showYearTable && (
                <this.YearTable currYear={this.year()} />
              )}
              {this.state.showMonthTable && (
                <this.MonthList data={this.state.allMonths} />
              )}
            </div>
            {this.state.showDateTable && (
              <table className="calendar-day">
                <thead>
                  <tr>{weekdayshortname}</tr>
                </thead>
                <tbody>{monthWeeks}</tbody>
              </table>
            )}
          </div>
        </div>
        {this.state.showRecipes && (
          <RecipesByDay
            recipes={this.state.recipes}
            date={this.state.selectedDate}
            key={recipe.id}
          />
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userId: state.user.userId,
  };
};

export default connect(mapStateToProps)(Calendar);
