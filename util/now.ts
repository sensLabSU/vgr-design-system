
type TimeUnit = 'milliseconds'|'ms'|'second'|'seconds'|'s'|'minute'|'minutes'|'m'|'hour'|'hours'|'h'|'day'|'days'|'week'|'weeks'|'month'|'months'|'year'|'years';
type PointInTime = 'second'|'minute'|'hour'|'day'|'week'|'month'|'quarter'|'year';
type DayOfWeek = 'monday'|'mon'|'tuesday'|'tue'|'wednesday'|'wed'|'thursday'|'thu'|'friday'|'fri'|'saturday'|'sat'|'sunday'|'sun';

export class DateTime extends Date {
    public add(amount: number, unit: TimeUnit): DateTime {
        switch(unit) {
            case 'milliseconds':
            case 'ms':
                return new DateTime(this.getTime() + amount);
            case 'second':
            case 'seconds':
            case 's':
                return new DateTime(this.getTime() + amount * 1000);
            case 'minute':
            case 'minutes':
            case 'm':
                return new DateTime(this.getTime() + amount * 60_000);
            case 'hour':
            case 'hours':
            case 'h':
                return new DateTime(this.getTime() + amount * 3600_000);
            case 'day':
            case 'days':
                let date = new DateTime(this.getTime());
                date.setDate(date.getDate() + amount);
                return date;
            case 'week':
            case 'weeks':
                return new DateTime(this.getTime() + amount * 86400_000 * 7);
            case 'month':
            case 'months': {
                const b = new DateTime(this);
                b.setMonth(b.getMonth() + amount);
                return b;
            }
            case 'year':
            case 'years': {
                const b = new DateTime(this);
                b.setFullYear(b.getFullYear() + amount);
                return b;
            }
        }
    }

    public subtract(amount: number, unit: TimeUnit): DateTime {
        return this.add(-amount, unit);
    }

    public sub(amount: number, unit: TimeUnit): DateTime {
        return this.subtract(amount, unit);
    }

    public last(pointInTime: DayOfWeek|'week'|'month'|'year'|'quarter'): DateTime {
        switch(pointInTime) {
            case 'mon':
            case 'monday':
                return this.subtract(this.getUTCDay() === 1 ? 7 : (this.getUTCDay() + 6) % 7, 'day');
            case 'tue':
            case 'tuesday':
                return this.subtract(this.getUTCDay() === 2 ? 7 : (this.getUTCDay() + 5) % 7, 'day');
            case 'wed':
            case 'wednesday':
                return this.subtract(this.getUTCDay() === 3 ? 7 : (this.getUTCDay() + 4) % 7, 'day');
            case 'thu':
            case 'thursday':
                return this.subtract(this.getUTCDay() === 4 ? 7 : (this.getUTCDay() + 3) % 7, 'day');
            case 'fri':
            case 'friday':
                return this.subtract(this.getUTCDay() === 5 ? 7 : (this.getUTCDay() + 2) % 7, 'day');
            case 'sat':
            case 'saturday':
                return this.subtract(this.getUTCDay() === 6 ? 7 : (this.getUTCDay() + 1) % 7, 'day');
            case 'sun':
            case 'sunday':
                return this.subtract(this.getUTCDay() === 0 ? 7 : this.getUTCDay(), 'day');
            case 'week':
                return this.subtract(1, 'week');
            case 'month':
                return this.subtract(1, 'month');
            case 'year':
                return this.subtract(1, 'year');
            case 'quarter':
                return this.subtract(3, 'month').startOf('quarter');
        }

        return this;
    }

    public next(pointInTime: DayOfWeek|'week'|'month'|'year'|'quarter'): DateTime {
        switch(pointInTime) {
            case 'mon':
            case 'monday':
                return this.add(this.getUTCDay() === 1 ? 7 : (8 - this.getUTCDay()) % 7, 'day');
            case 'tue':
            case 'tuesday':
                return this.add(this.getUTCDay() === 2 ? 7 : (9 - this.getUTCDay()) % 7, 'day');
            case 'wed':
            case 'wednesday':
                return this.add(this.getUTCDay() === 3 ? 7 : (10 - this.getUTCDay()) % 7, 'day');
            case 'thu':
            case 'thursday':
                return this.add(this.getUTCDay() === 4 ? 7 : (11 - this.getUTCDay()) % 7, 'day');
            case 'fri':
            case 'friday':
                return this.add(this.getUTCDay() === 5 ? 7 : (12 - this.getUTCDay()) % 7, 'day');
            case 'sat':
            case 'saturday':
                return this.add(this.getUTCDay() === 6 ? 7 : (13 - this.getUTCDay()) % 7, 'day');
            case 'sun':
            case 'sunday':
                return this.add(this.getUTCDay() === 7 ? 7 : (7 - this.getUTCDay()) % 7, 'day');
            case 'week':
                return this.add(1, 'week');
            case 'month':
                return this.add(1, 'month');
            case 'year':
                return this.add(1, 'year');
            case 'quarter':
                return this.add(3, 'month').startOf('quarter');
        }

        return this;
    }

    public at(hours: number, minutes?: number, seconds?: number, ms?: number): DateTime {
        const dt = now(this);
        dt.setHours(hours, minutes || 0, seconds || 0, ms || 0);
        return dt;
    }

    public toISODateString(): string {
        return this.sub(this.getTimezoneOffset(), 'minutes').toISOString().substring(0, 10);
    }

    public toISOTimeString(): string {
        return this.sub(this.getTimezoneOffset(), 'minutes').toISOString().substring(11, 19);
    }

    public toISOString(includeMs: boolean = true): string {
        if(includeMs) return super.toISOString();

        return this.toISODateString() + 'T' + this.toISOTimeString() + 'Z';
    }

    public equals(other: DateTime): boolean {
        return other.valueOf() === this.valueOf();
    }

    public startOf(pointInTime: PointInTime) {
        const t = now(this);
        switch(pointInTime) {
            case 'second': t.setMilliseconds(0); break;
            case 'minute': t.setSeconds(0, 0); break;
            case 'hour': t.setMinutes(0, 0, 0); break;
            case 'day': t.setHours(0, 0, 0, 0); break;
            case 'week':
                return this.getUTCDay() === 1 ?
                    this.at(0, 0, 0, 0) :
                    this.last('monday').at(0, 0, 0, 0);
            case 'month':
                t.setDate(1);
                t.setHours(0, 0, 0, 0);
                break;
            case 'quarter':
                t.setMonth(Math.floor(t.getMonth() / 3) * 3);
                t.setDate(1);
                t.setHours(0, 0, 0, 0);
                break;
            case 'year':
                t.setMonth(0, 1);
                t.setHours(0, 0, 0, 0);
                break;
        }
        return t;
    }

    public endOf(pointInTime: PointInTime) {
        const t = now(this);
        switch(pointInTime) {
            case 'second': t.setMilliseconds(999); break;
            case 'minute': t.setSeconds(59, 999); break;
            case 'hour': t.setMinutes(59, 59, 999); break;
            case 'day': t.setHours(23, 59, 59, 999); break;
            case 'week':
                return this.getUTCDay() === 0 ?
                    this.at(23, 59, 59, 999) :
                    this.next('sunday').at(23, 59, 59, 999);
            case 'month':
                t.setDate(new DateTime(this.getFullYear(), this.getMonth() + 1, 0).getDate());
                t.setHours(23, 59, 59, 999);
                break;
            case 'quarter':
                t.setMonth(Math.floor(t.getMonth() / 3) * 3 + 2);
                t.setDate(new DateTime(this.getFullYear(), this.getMonth() + 1, 0).getDate());
                t.setHours(23, 59, 59, 999);
                break;
            case 'year':
                t.setMonth(11, 31);
                t.setHours(23, 59, 59, 999);
                break;
        }
        return t;
    }

    public is(dayOfWeek: DayOfWeek|'first-of-month'|'last-of-month'|'today'): boolean {
        switch(dayOfWeek) {
            case 'mon':
            case 'monday':
                return this.getUTCDay() === 1;
            case 'tue':
            case 'tuesday':
                return this.getUTCDay() === 2;
            case 'wed':
            case 'wednesday':
                return this.getUTCDay() === 3;
            case 'thu':
            case 'thursday':
                return this.getUTCDay() === 4;
            case 'fri':
            case 'friday':
                return this.getUTCDay() === 5;
            case 'sat':
            case 'saturday':
                return this.getUTCDay() === 6;
            case 'sun':
            case 'sunday':
                return this.getUTCDay() === 7;
            case 'first-of-month':
                return this.getDate() === 1;
            case 'last-of-month':
                return this.getDate() === new DateTime(this.getFullYear(), this.getMonth() + 1, 0).getDate();
            case 'today':
                return this.toISODateString() === today().toISODateString();
        }
    }

    public getWeek(): number {
        let date = new Date(this.getTime());
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        let week1 = new Date(date.getFullYear(), 0, 4);
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    }

    format(format: string, locale?: string): string {
        const matches = format.match(/(.)\1*/g);
        if(!matches) return '';

        locale ||= (new Intl.NumberFormat()).resolvedOptions().locale;

        let result = '';
        const longMonthFormat = new Intl.DateTimeFormat(locale, {month: 'long'}).format;
        const shortMonthFormat = new Intl.DateTimeFormat(locale, {month: 'short'}).format;
        const longDayFormat = new Intl.DateTimeFormat(locale, {weekday: 'long'}).format;
        const shortDayFormat = new Intl.DateTimeFormat(locale, {weekday: 'short'}).format;

        matches.forEach(m => {
            switch(m) {
                case 'YYYY': result += this.getFullYear(); break;
                case 'YY': result += `${this.getFullYear()}`.slice(-2); break;
                case 'MMMM': result += longMonthFormat(this); break;
                case 'MMM': result += shortMonthFormat(this); break;
                case 'MM': result += `0${this.getMonth()+1}`.slice(-2); break;
                case 'M': result += `${this.getMonth()+1}`; break;
                case 'DD': result += `0${this.getDate()}`.slice(-2); break;
                case 'D': result += `${this.getDate()}`; break;
                case 'dddd': result += longDayFormat(this); break;
                case 'ddd': result += shortDayFormat(this); break;
                case 'dd': result += shortDayFormat(this).substring(0, 2); break;
                case 'd': result += `${this.getDay()}`; break;
                case 'HH': result += `0${this.getHours()}`.slice(-2); break;
                case 'H': result += `${this.getHours()}`; break;
                case 'hh': {
                    let h = this.getHours() % 12;
                    if(h === 0) h = 12;
                    result += `0${h}`.slice(-2);
                    break;
                }
                case 'h': {
                    let h = this.getHours() % 12;
                    if(h === 0) h = 12;
                    result += `${h}`;
                    break;
                }
                case 'mm': result += `0${this.getMinutes()}`.slice(-2); break;
                case 'm': result += `${this.getMinutes()}`; break;
                case 'ss': result += `0${this.getSeconds()}`.slice(-2); break;
                case 's': result += `${this.getSeconds()}`; break;
                case 'SSS': result += `00${this.getMilliseconds()}`.slice(-3); break;
                case 'Z': {
                    const offset = this.getTimezoneOffset();
                    result += (offset <= 0 ? '+' : '-') + `0${Math.floor(Math.abs(offset) / 60)}`.slice(-2) + ':' + `0${Math.abs(offset) % 60}`.slice(-2);
                    break;
                }
                case 'ZZ': {
                    const offset = this.getTimezoneOffset();
                    result += (offset <= 0 ? '+' : '-') + `0${Math.floor(Math.abs(offset) / 60)}`.slice(-2) + `0${Math.abs(offset) % 60}`.slice(-2);
                    break;
                }
                case 'A': result += `${this.getHours() < 12 ? 'AM' : 'PM'}`; break;
                case 'a': result += `${this.getHours() < 12 ? 'am' : 'pm'}`; break;
                default: result += m; break;
            }
        });

        return result;
    }
}

export function now(p?: number | string | Date | DateTime) {
    return p !== undefined ? new DateTime(p) : new DateTime();
}
export function today() {
    return now().at(0, 0, 0, 0);
}
export function tomorrow() {
    return today().add(1, 'days');
}
export function yesterday() {
    return today().add(-1, 'days');
}

(window as any).now = now;
(window as any).today = today;
(window as any).tomorrow = tomorrow;
(window as any).yesterday = yesterday;
