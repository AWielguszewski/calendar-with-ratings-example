export interface Props {
    price: number
    ratings: number[]
    availableDates: Date[]
}

export interface State {
    currentDate: Date
    calendarOpen: boolean
    calendarType: CALENDAR_TYPE
    checkIn: Date
    checkOut: Date
}

export enum CALENDAR_TYPE { IN, OUT }