export class DateUtil {
    /**
     * Get the current timestamp in seconds
     *
     * @returns {number}
     */
    static timestampSec(): number {
        return Math.floor(Date.now() / 1000);
    }
}
