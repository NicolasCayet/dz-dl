export class DateUtil {
    /**
     * Get the current timestamp in seconds
     *
     * @returns {number}
     */
    static timestampSec(): number {
        return Math.floor(Date.now() / 1000);
    }

    /**
     * Calculate number of seconds corresponding to a period time formatted in ISO_8601 (used by Youtube)
     * @return {number}
     */
    static iso8601ToSec(duration: string): number {
        let a: string[] = duration.match(/\d+/g);

        if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
            a = ['0', a[0], '0'];
        }
        if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
            a = [a[0], '0', a[1]];
        }
        if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
            a = [a[0], '0', '0'];
        }

        let seconds = 0;
        if (a.length == 3) {
            seconds = seconds + parseInt(a[0]) * 3600;
            seconds = seconds + parseInt(a[1]) * 60;
            seconds = seconds + parseInt(a[2]);
        } else if (a.length == 2) {
            seconds = seconds + parseInt(a[0]) * 60;
            seconds = seconds + parseInt(a[1]);
        } else if (a.length == 1) {
            seconds = seconds + parseInt(a[0]);
        }

        return seconds;
    }
}
