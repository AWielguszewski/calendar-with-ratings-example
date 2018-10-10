import * as React from 'react'
import { Props, State, CALENDAR_TYPE } from './types'
import './styles.css'

export default class Calendar extends React.Component<Props, State> {
    state = {
        currentDate: new Date(),
        calendarType: CALENDAR_TYPE.IN,
        calendarOpen: false,
        checkIn: null,
        checkOut: null
    }

    renderPrice = () => {
        const { price } = this.props
        return <p className="calendar-price"><strong>{price} zl</strong> per night</p>
    }

    renderRating = () => {
        const { ratings } = this.props
        const stars = []
        const avg = Math.round(ratings.reduce((p, c, i, a) => p + (c / a.length), 0))
        for (let i = 1; i <= 5; i++)
            stars.push(<span key={i} className={`fa fa-star ${avg >= i && 'checked'}`}></span>)
        return <p className="calendar-ratings">{...stars} {ratings.length}</p>
    }

    renderButtons = () => {
        const { calendarType, calendarOpen, checkIn, checkOut } = this.state
        return <div className="calendar-buttons">
            <p>Dates</p>
            <div className="calendar-buttons-cnt">
                <button id="inBtn" className={calendarOpen && calendarType === CALENDAR_TYPE.IN ? 'selected' : ''} onClick={this.onCheckIn}>
                    <span>Check In</span>
                    {checkIn && <strong>{(checkIn as Date).toLocaleDateString()}</strong>}
                </button>
                <span className="fa fa-long-arrow-right" />
                <button id="outBtn" disabled={!checkIn} className={calendarOpen && calendarType === CALENDAR_TYPE.OUT ? 'selected' : ''} onClick={this.onCheckOut}>
                    <span>Check Out</span>
                    {checkOut && <strong>{(checkOut as Date).toLocaleDateString()}</strong>}
                </button>
            </div>
        </div>
    }

    onCheckIn = () => this.setState(prevState => ({
        calendarOpen: prevState.calendarOpen && prevState.calendarType === CALENDAR_TYPE.OUT ? true : !prevState.calendarOpen,
        calendarType: CALENDAR_TYPE.IN,
        currentDate: prevState.checkIn ? prevState.checkIn : prevState.currentDate
    }))

    onCheckOut = () => this.setState(prevState => ({
        calendarOpen: prevState.calendarOpen && prevState.calendarType === CALENDAR_TYPE.IN ? true : !prevState.calendarOpen,
        calendarType: CALENDAR_TYPE.OUT,
        currentDate: prevState.checkOut ? prevState.checkOut : prevState.currentDate
    }))

    renderCalendar = () => {
        const { currentDate } = this.state
        const thisMonth = new Date(currentDate)
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
        const weeks = []
        let days = []
        for (let i = 1; i <= daysInMonth; i++) {
            thisMonth.setDate(i)
            if (days.length === 0 && thisMonth.getDay() > 0)
                days.push(<td key={i} colSpan={thisMonth.getDay()} />)
            days.push(this.createDay(new Date(thisMonth)))
            if (thisMonth.getDay() === 6 || i === daysInMonth) {
                weeks.push(<tr key={i}>{...days}</tr>)
                days = []
            }
        }
        return <div className="calendar-cal">
            <div className="calendar-cal-header">
                <div id="calendarLeftArrow" className="fa fa-long-arrow-left" onClick={this.subMonth} />
                <p id="calendarTitle" >{currentDate.toLocaleString("en-us", { month: "long" })} {currentDate.getFullYear()}</p>
                <div id="calendarRightArrow" className="fa fa-long-arrow-right" onClick={this.addMonth} />
            </div>
            <table>
                <tbody>
                    <tr>
                        <th>Su</th>
                        <th>Mo</th>
                        <th>Tu</th>
                        <th>We</th>
                        <th>Th</th>
                        <th>Fr</th>
                        <th>Sa</th>
                    </tr>
                    {...weeks}
                </tbody>
            </table>
        </div>
    }

    createDay = (date: Date) => {
        const { calendarType, checkIn, checkOut } = this.state
        const { availableDates } = this.props
        const isAvailable = availableDates.find(item => {
            if (calendarType === CALENDAR_TYPE.OUT) {
                return item.toLocaleDateString() === date.toLocaleDateString() && new Date(item.getFullYear(), item.getMonth(), item.getDate()).valueOf()
                    > new Date((checkIn as Date).getFullYear(), (checkIn as Date).getMonth(), (checkIn as Date).getDate()).valueOf()
            }
            return item.toLocaleDateString() === date.toLocaleDateString()
        })
        let isSelected = false
        if (calendarType === CALENDAR_TYPE.IN && checkIn)
            isSelected = date.toLocaleDateString() === (checkIn as Date).toLocaleDateString()
        if (calendarType === CALENDAR_TYPE.OUT && checkOut)
            isSelected = date.toLocaleDateString() === (checkOut as Date).toLocaleDateString()
        return <td key={date.valueOf()} className={`calendar-cal-day ${isSelected && 'selected'}`} >
            <button className='calendar-cal-day-btn' disabled={!isAvailable} onClick={() => this.onDateSelect(date)}>{date.getDate()}</button>
        </td>
    }

    onDateSelect = (date: Date) => {
        const { calendarType } = this.state
        if (calendarType === CALENDAR_TYPE.IN)
            this.setState({ checkIn: date, calendarOpen: false, checkOut: undefined })
        else
            this.setState({ checkOut: date, calendarOpen: false })
    }

    addMonth = () => this.setState(prevState => ({ currentDate: new Date(prevState.currentDate.getFullYear(), prevState.currentDate.getMonth() + 1, prevState.currentDate.getDate()) }))

    subMonth = () => this.setState(prevState => ({ currentDate: new Date(prevState.currentDate.getFullYear(), prevState.currentDate.getMonth() - 1, prevState.currentDate.getDate()) }))

    render() {
        const { calendarOpen } = this.state
        return <section className='calendar'>
            {this.renderPrice()}
            {this.renderRating()}
            <hr />
            {this.renderButtons()}
            {calendarOpen && this.renderCalendar()}
        </section>
    }
}