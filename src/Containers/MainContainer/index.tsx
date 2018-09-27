import React from 'react'
import Calendar from '../../Components/Calendar'
import './styles.css'

export default class MainContainer extends React.Component {
  render() {
    const ratings = Array.from({ length: 120 }, x => Math.floor(Math.random() * 10))
    const rootDate = new Date()
    const availableDates = [rootDate]
    for (let i = 1; i < Math.floor((Math.random() * 20) + 5); i++)
      availableDates.push(new Date(rootDate.setDate(rootDate.getDate() + Math.floor((Math.random() * 4)))))
    return (
      <section className="main-cnt">
        <Calendar price={289} ratings={ratings} availableDates={availableDates} />
      </section>
    )
  }
}