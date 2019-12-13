import {get, post, postJson} from './request'


const jobApi = {


  queryByEmp: function (success) {

    const params = {};
    get('/api/v1/job/queryByEmp', params, success);
  }


}

export default jobApi;
