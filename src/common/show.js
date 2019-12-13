import { Message } from 'element-ui';

const show = {

    error: function (message) {
        var options = {};
        if (!message) {
            message = "系统错误"
        }
        options.message = message;
        Message.error(options);
    },

    success: function (message) {
        var options = {};
        options.message = message;
        Message.success(options);
    }
}


export default show
