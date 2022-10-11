import request from '@/utils/request'

export default {
  // 获取医院列表
  getHospital(page, limit, searchObj) {
    return request({
      url: `/admin/hosp/hospital/list/${page}/${limit}`,
      method: 'GET',
      params: searchObj // 参数
    })
  },
  // 根据dictCode查询下级数据
  findByDictCode(dictCode) {
    return request({
      url: `/admin/cmn/dict/findByDictCode/${dictCode}`,
      method: 'GET'
    })
  },
  findChildId(id) {
    return request({
      url: `/admin/cmn/dict/findChildData/${id}`,
      method: 'GET'
    })
  },
  // 更新状态
  updateStatus(id, status) {
    return request({
      url: `/admin/hosp/hospital/updateHospitalStatus/${id}/${status}`,
      method: 'GET'
    })
  },
  // 查看医院详情
  getHospitalDetail(id) {
    return request({
      url: `/admin/hosp/hospital/showHospitalDetail/${id}`,
      method: 'GET'
    })
  },
  // 根据医院编号查询医院所有科室列表
  getDepartmentListByHosCode(hosCode) {
    return request({
      url: `/admin/hosp/department/departmentList/${hosCode}`,
      method: 'GET'
    })
  },
  // 查询预约规则
  getScheduleRule(page, limit, hosCode, depCode) {
    return request({
      url: `/admin/hosp/schedule/getScheduleRule/${page}/${limit}/${hosCode}/${depCode}`,
      method: 'GET'
    })
  },
  // 查询排班详情
  getScheduleDetail(hosCode, depCode, workDate) {
    return request({
      url: `/admin/hosp/schedule/getScheduleDetail/${hosCode}/${depCode}/${workDate}`,
      method: 'GET'
    })
  }
}
