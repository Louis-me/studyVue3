import ajax from "./ajax";
// export const GetPosts = () => ajax.get('posts/1')
// export const GetsearchData = (params) => ajax.get('/list',{params})
// export const PostPosts = (params) => ajax.post('posts',params)
// 登录请求
export const LoginPost = (params) => ajax.post('/login/',params)
export const LoginOutPost = () => ajax.post('/LoginOut/')

// 测试订单的请求
export const GetOrders = (params) => ajax.get('/Orders/', {params})
export const OrderAddPost = (params) => ajax.post('/OrderAdd/', params)
export const OrderEditPost = (params) => ajax.post('/OrderEdit/', params)
export const OrderDetailGet = (params) => ajax.get('/OrderDetail/', {params})
export const OrderDelPost = (params) => ajax.post('/OrderDel/', params)

// 套件的请求
export const SuitesGet = (params) => ajax.get('/suites/', {params})
export const SuiteAddPost= (params) => ajax.post('/suite_add/', params)
export const SuiteDelPost= (params) => ajax.post('/suite_del/', params)
export const SuiteEditPost= (params) => ajax.post('/suite_edit/', params)
export const SuiteDetailGet= (params) => ajax.get('/suite_detail/', {params})
export const SuiteAllGet= (params) => ajax.get('/get_all_suite/', {params})

// 用例的请求
export const CasesGet = (params) => ajax.get('/cases/', {params})
export const CaseAddPost = (params) => ajax.post('/case_add/', params)
export const CaseEditPost = (params) => ajax.post('/case_edit/', params)
export const CaseDelPost = (params) => ajax.post('/case_del/', params)
export const CaseDetailGet= (params) => ajax.get('/case_detail/', {params})
export const CaseAllGet = (params) => ajax.get("/case_all/", {params})
export const SuiteToCaseGet = (params) => ajax.get("/suite_to_case_list/", {params})
export const SuiteSetCasePost = (params) => ajax.post("/suite_set_case/", params)

// 模糊规则请求
export const FuzzsGet = (params) => ajax.get('/get_fuzz_list/', {params})
export const FuzzAddPost = (params) => ajax.post('/fuzz_add/', params)
export const FuzzEditPost = (params) => ajax.post('/fuzz_edit/', params)
export const FuzzDelPost = (params) => ajax.post('/fuzz_del/', params)
export const FuzzDetailGet = (params) => ajax.get('/fuzz_detail/', {params})

// 实际测试项目的登录接口和测试
export const LoginApiGet = (params) => ajax.get('/get_login_api/', {params})
export const LoginSavePost = (params) => ajax.post('/login_save/', params)
export const LoginTestPost = (params) => ajax.post('/login_test/', params)
export const ApiTestPost = (params) => ajax.post('/api_test/', params)

// 实时任务
export const RealTimesGet = (params) => ajax.get('/get_real_time_task_list/', {params})
export const RealTimeAddPost = (params) => ajax.post('/new_real_time_task/', params)
export const RealTimesDetail = (params) => ajax.get('/real_time_task_detail/', {params})
export const RealTimeDelPost = (params) => ajax.post('/real_time_task_del/', params)

// 定时任务
export const TimingTasksGet = (params) => ajax.get('/get_timing_task_list/', {params})
export const TimingTaskAddPost = (params) => ajax.post('/new_timing_task/', params)
export const TimingTaskDetail = (params) => ajax.get('/real_time_task_detail/', {params})
export const TimingTaskDelPost = (params) => ajax.post('/timing_task_del/', params)

//报告管理
export const ReportsGet = (params) => ajax.get('/reports_list/', {params})
export const ReporDetail = (params) => ajax.get('/reports_detail/', {params})
export const ReportDel = (params) => ajax.post('/report_detail_del/', params)

// 图形展示

export const GrapReportModuleCase = (params) => ajax.get('/reports_module_case/', {params})
export const GraptReportTask = (params) => ajax.get('/report_task/', {params})
export const GraptTop10Show = (params) => ajax.get('/reports_top_10_slow/', {params})
export const GraptTop10ShowExport = () => ajax.get('/reports_top_slow_export/', {responseType: 'blob' }, )

//服务器日志
export const LogsGet = () => ajax.get('/logs/' )
export const LogContontPost = (params) => ajax.post('/log_content/', params)
