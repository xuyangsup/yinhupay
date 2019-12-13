import { MessageBox } from 'element-ui';


const dialog = {

    confirm: function(sure) {

        MessageBox.confirm('二次确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            sure()
        }).catch(() => {})
    },
    message(message, sure) {
        MessageBox.confirm(message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            sure()
        }).catch(() => {})
    }
}


export default dialog
