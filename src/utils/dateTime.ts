export class DateOnly {
  public value: string

  constructor(value?: string) {
    if (!value) {
      const today = new Date()
      this.value = today.toISOString().slice(0, 10) // "YYYY-MM-DD"
    } else {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error('Invalid DateOnly format')
      }
      this.value = value
    }
  }
  toString() {
    return this.value
  }
  toJSON() {
    return this.value
  }
  getDateInfo() {
    const date = new Date(this.value)
    const formatter = new Intl.DateTimeFormat('ru-RU', {
      month: 'short',
      weekday: 'short'
    })
    const dayInfo = formatter.format(date).split(' ')
    if (dayInfo[0] === 'март' || dayInfo[0] === 'август') dayInfo[0] = dayInfo[0] + 'а'
    else dayInfo[0] = dayInfo[0].slice(0, -1) + 'я'
    return [date.getDate(), dayInfo[0], dayInfo[1]]
  }
  addDays(days: number): DateOnly {
    const date = new Date(this.value)
    date.setDate(date.getDate() + days)
    const newValue = date.toISOString().slice(0, 10)
    return new DateOnly(newValue)
  }
}

export class TimeOnly {
  constructor(public value: string = '00:00') {
    if (!/^\d{2}:\d{2}$/.test(value)) {
      throw new Error('Invalid TimeOnly format')
    }
  }
  toString() {
    return this.value
  }
  toJSON() {
    return this.value
  }
  getTimeDifference(
    time: TimeOnly,
    days: number,
    timezoneOffset: number
  ): {
    days: number
    hours: number
    minutes: number
  } {
    const [h1, m1] = this.value.split(':').map(Number)
    const [h2, m2] = time.value.split(':').map(Number)

    const totalMinutes1 = h1 * 60 + m1
    let totalMinutes2 = h2 * 60 + m2

    // Добавим дни и смещение по часовому поясу
    totalMinutes2 += days * 24 * 60
    totalMinutes2 += timezoneOffset

    let diff = totalMinutes2 - totalMinutes1

    // Сохраняем знак
    const isNegative = diff < 0
    diff = Math.abs(diff)

    const resultDays = Math.floor(diff / (24 * 60))
    const remainder = diff % (24 * 60)
    const resultHours = Math.floor(remainder / 60)
    const resultMinutes = remainder % 60

    return {
      days: isNegative ? -resultDays : resultDays,
      hours: isNegative ? -resultHours : resultHours,
      minutes: isNegative ? -resultMinutes : resultMinutes
    }
  }
}
