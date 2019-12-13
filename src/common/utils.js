const utils = {


    /**
     * 深拷贝
     * @param data
     * @returns {any}
     */
    deepCopy: function (data) {
        return JSON.parse(JSON.stringify(data));
    },

    isToday(td) {
        var d = new Date();
        return td.getDate() == d.getDate() && td.getMonth() == d.getMonth() && td.getFullYear() == d.getFullYear();
    }
}

export default utils;
