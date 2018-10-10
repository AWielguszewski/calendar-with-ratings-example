import { configure, shallow, mount } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

import * as React from 'react'
import Calendar from '.'

const PRICE = 303
const RATINGS = Array.from({ length: 120 }, x => Math.floor(Math.random() * 10))
const ROOT_DATE = new Date()
const AVAILABLE_DATES = [ROOT_DATE]
for (let i = 1; i < Math.floor((Math.random() * 20) + 5); i++)
    AVAILABLE_DATES.push(new Date(ROOT_DATE.setDate(ROOT_DATE.getDate() + Math.floor((Math.random() * 4)))))

describe('Calendar shallow tests', () => {
    it('renders component', () => {
        const wrapper = shallow(<Calendar price={PRICE} ratings={RATINGS} availableDates={AVAILABLE_DATES} />)
        expect(wrapper.exists()).toBe(true)
    })

    it('renders price', () => {
        const wrapper = shallow(<Calendar price={PRICE} ratings={RATINGS} availableDates={AVAILABLE_DATES} />)
        expect(wrapper.find('.calendar-price').exists()).toEqual(true)
    })

    it('renders rating with stars', () => {
        const wrapper = shallow(<Calendar price={PRICE} ratings={RATINGS} availableDates={AVAILABLE_DATES} />)
        expect(wrapper.find('.calendar-ratings').exists()).toEqual(true)
    })

    it('renders buttons', () => {
        const wrapper = shallow(<Calendar price={PRICE} ratings={RATINGS} availableDates={AVAILABLE_DATES} />)
        expect(wrapper.find('.calendar-buttons-cnt').exists()).toEqual(true)
    })

    it('does not render calendar initially', () => {
        const wrapper = shallow(<Calendar price={PRICE} ratings={RATINGS} availableDates={AVAILABLE_DATES} />)
        expect(wrapper.find('.calendar-cal').exists()).toEqual(false)
    })
})

describe('Calendar full render tests', () => {
    it('opens calendar when state is simulated', () => {
        const wrapper = mount(<Calendar price={PRICE} ratings={RATINGS} availableDates={AVAILABLE_DATES} />)
        expect(wrapper.state('calendarOpen')).toEqual(false)
        expect(wrapper.find('.calendar-cal').exists()).toEqual(false)
        wrapper.setState({ calendarOpen: true })
        expect(wrapper.state('calendarOpen')).toEqual(true)
        expect(wrapper.find('.calendar-cal').exists()).toEqual(true)
    })

    it('opens calendar when button click is simulated', () => {
        const wrapper = mount(<Calendar price={PRICE} ratings={RATINGS} availableDates={AVAILABLE_DATES} />)
        expect(wrapper.find('.calendar-cal').exists()).toEqual(false)
        wrapper.find('#inBtn').simulate('click')
        expect(wrapper.state('calendarOpen')).toEqual(true)
        expect(wrapper.find('.calendar-cal').exists()).toEqual(true)
    })

    it('does not open calendar while "in" date is not set and clicking on outBtn', () => {
        const wrapper = mount(<Calendar price={PRICE} ratings={RATINGS} availableDates={AVAILABLE_DATES} />)
        expect(wrapper.find('.calendar-cal').exists()).toEqual(false)
        wrapper.find('#outBtn').simulate('click')
        expect(wrapper.state('calendarOpen')).toEqual(false)
        expect(wrapper.find('.calendar-cal').exists()).toEqual(false)
    })

    it('opens calendar while "in" date is set and clicking on outBtn', () => {
        const wrapper = mount(<Calendar price={PRICE} ratings={RATINGS} availableDates={AVAILABLE_DATES} />)
        expect(wrapper.find('.calendar-cal').exists()).toEqual(false)
        wrapper.setState({ checkIn: new Date() })
        wrapper.find('#outBtn').simulate('click')
        expect(wrapper.state('calendarOpen')).toEqual(true)
        expect(wrapper.find('.calendar-cal').exists()).toEqual(true)
    })

    it('renders current month in calendar', () => {
        const wrapper = mount(<Calendar price={PRICE} ratings={RATINGS} availableDates={AVAILABLE_DATES} />)
        const today = new Date()
        const month = `${today.toLocaleString("en-us", { month: "long" })} ${today.getFullYear()}`
        wrapper.find('#inBtn').simulate('click')
        expect(wrapper.state('calendarOpen')).toEqual(true)
        expect(wrapper.find('.calendar-cal').exists()).toEqual(true)
        expect(wrapper.find('#calendarTitle').text()).toEqual(month)
    })

    it('correctly changes months when arrows are clicked', () => {
        const wrapper = mount(<Calendar price={PRICE} ratings={RATINGS} availableDates={AVAILABLE_DATES} />)
        const today = new Date()
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
        const month = `${today.toLocaleString("en-us", { month: "long" })} ${today.getFullYear()}`
        const nextMonthText = `${nextMonth.toLocaleString("en-us", { month: "long" })} ${nextMonth.getFullYear()}`
        wrapper.find('#inBtn').simulate('click')
        expect(wrapper.state('calendarOpen')).toEqual(true)
        expect(wrapper.find('.calendar-cal').exists()).toEqual(true)
        expect(wrapper.find('#calendarTitle').text()).toEqual(month)
        wrapper.find('#calendarRightArrow').simulate('click')
        expect(wrapper.find('#calendarTitle').text()).toEqual(nextMonthText)
        wrapper.find('#calendarLeftArrow').simulate('click')
        expect(wrapper.find('#calendarTitle').text()).toEqual(month)
    })

    it('can select available date', () => {
        const wrapper = mount(<Calendar price={PRICE} ratings={RATINGS} availableDates={AVAILABLE_DATES} />)
        wrapper.find('#inBtn').simulate('click')
        expect(wrapper.state('calendarOpen')).toEqual(true)
        expect(wrapper.find('.calendar-cal').exists()).toEqual(true)
        wrapper.find('.calendar-cal-day-btn[disabled=false]').first().simulate('click')
        expect(wrapper.state('checkIn')).not.toEqual(null)
    })

    it('cannot select unavailable date', () => {
        const wrapper = mount(<Calendar price={PRICE} ratings={RATINGS} availableDates={AVAILABLE_DATES} />)
        wrapper.find('#inBtn').simulate('click')
        expect(wrapper.state('calendarOpen')).toEqual(true)
        expect(wrapper.find('.calendar-cal').exists()).toEqual(true)
        wrapper.find('.calendar-cal-day-btn[disabled=true]').first().simulate('click')
        expect(wrapper.state('checkIn')).toEqual(null)
    })
})
