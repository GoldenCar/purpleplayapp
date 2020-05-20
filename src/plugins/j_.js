import j_ from '@jmellicker/j_'

export default ({ Vue }) => {
  Vue.prototype.j_ = j_

  Vue.prototype.countdown = (endDate, cb) => {
        let days, hours, minutes, seconds;

        endDate = new Date(endDate).getTime();

        if (isNaN(endDate)) {
            return;
        }

        setInterval(() => {
            let startDate = new Date();
            startDate = startDate.getTime();

            let timeRemaining = parseInt((endDate - startDate) / 1000);

            if (timeRemaining >= 0) {
                days = parseInt(timeRemaining / 86400);
                timeRemaining = (timeRemaining % 86400);

                hours = parseInt(timeRemaining / 3600);
                timeRemaining = (timeRemaining % 3600);

                minutes = parseInt(timeRemaining / 60);
                timeRemaining = (timeRemaining % 60);

                seconds = parseInt(timeRemaining);
            }
            else {
                return;
            }

            cb({
                days: parseInt(days, 10),
                hours: ("0" + hours).slice(-2),
                minutes: ("0" + minutes).slice(-2),
                seconds: ("0" + seconds).slice(-2)
            })
        }, 1000);
    }
}
